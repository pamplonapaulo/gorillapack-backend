'use strict';

const axios = require('axios');

/**
 *  delivery-fee controller
 */

module.exports = {
  getDeliveryFee: async (ctx) => {
      const { dropOffPostCode, pack } = ctx.request.body
      const gorillaPostCode = '20756190'
      let address
      let orderPrice = 0
      let noFee = false
      let gorillaLog = false
      let data = {
        from: {
          postal_code: gorillaPostCode,
        },
        to: {
          postal_code: dropOffPostCode,
        },
        products: [],
      }

      const getCredentials = async (fields) => {
        const credentials = await strapi.db.query('api::melhor-envio.melhor-envio').findOne({
          select: fields,
          populate: { category: true },
        });
        return credentials
      }

      const sendResponse = (arr) => {
        if (arr.length === 0) {
          return { error: 'Selecione menos produtos.' }
        } else {
          const data = {
            quotation: {
              fee: noFee ? 0 : Number(arr[0].custom_price),
              expectedTravelingDays: gorillaLog ? 0 : arr[0].delivery_time,
              company: gorillaLog ? 'Gorilla Pack' : arr[0].company.name,
              packingDetails: gorillaLog ? undefined : arr[0].packages
            },
            address : {
              ...address
            }
          }
          return data
        }
      }

      const removeBlankQuotations = (arr) => {
        let blanks = 0
        for (let i = 0; i < arr.length; i++) {
          if (!!arr[i].error) {
            blanks++
          }
        }
        arr.splice(0, blanks);
        return sendResponse(arr)
      }

      const sortByLowestPrice = async (quotations) => {
        const newArr = await quotations.sort(function (a, b) {
          return a.custom_price - b.custom_price
        })
        return removeBlankQuotations(newArr)
      }

      const saveNewToken = async (updatedToken) => {
        await strapi.query('api::melhor-envio.melhor-envio').update({
          where: { id: 1 },
          data: {
            access_token: updatedToken.access_token,
            refresh_token: updatedToken.refresh_token
          },
        })

        // Saved above, then start again bellow:
        return requestMelhorEnvio(
          undefined,
          'https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate',
          sortByLowestPrice,
          JSON.stringify(data.products),
        )
      }

      const requestMelhorEnvio = async (grant_type, url, callBack, dataObj) => {
        const options = {
          url,
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Aplicação (email para contato técnico)',
          },
          data: {
            grant_type,
            ...dataObj
          }
        };
        if (grant_type === undefined) {
          console.log('// credenciais aprovadas. cotar frete')
          options.headers.Authorization = 'Bearer ' + getCredentials(['access_token'])
        }
        console.log('grant_type: ', grant_type)
        if (grant_type === 'refresh_token') {
          console.log('// access token expirado. usar refresh token')
          options.data.refresh_token = getCredentials(['refresh_token']),
          options.data.client_id = getCredentials(['client_id']),
          options.data.client_secret = getCredentials(['client_secret'])
        }

        // if (grant_type === 'authorization_code') {
        //   console.log('// todos os tokens expirados. usars CODE')
        //   options.data.code = getCredentials(['code'])
        //   options.data.client_id = getCredentials(['client_id']),
        //   options.data.client_secret = getCredentials(['client_secret'])
        //   options.data.redirect_uri = 'https://gorilla.vercel.app'
        // }

        try {
          const res = await axios(options)
          console.log(res.data)
          return callBack(res.data)
        } catch (error) {
          console.log('Handling the error: ')
          //console.log(error.response)
          console.log(error.response.data)
          return handleErrors(error.response.data)
        }
      }

      const handleErrors = (msg) => {
        console.log(' ')
        console.log(' ')
        console.log(msg)
        console.log(msg)
        console.log(msg)
        console.log(msg)
        console.log(msg)
        console.log(' ')
        console.log(' ')
        console.log(' ')

        if (msg.message === 'Unauthenticated.') {
          console.log('// solicitar TOKEN REFRESH')
          return requestMelhorEnvio(
            'refresh_token',
            'https://sandbox.melhorenvio.com.br/oauth/token',
            saveNewToken
          )
        }

        if (msg === 'Token has been revoked' || msg === 'Error.') {
          console.log('// solicitar novo TOKEN')
          return requestMelhorEnvio(
            'authorization_code',
            'https://sandbox.melhorenvio.com.br/oauth/token',
            saveNewToken
          )
        }

        if (msg === 'Client authentication failed.') {
          console.log('// also solicitar TOKEN REFRESH')
          return requestMelhorEnvio(
            'refresh_token',
            'https://sandbox.melhorenvio.com.br/oauth/token',
            saveNewToken
          )
        }

        if (msg === 'Authorization code has expired.') {
          console.log('// FUDEU: Agora só acessando a URL manualmente')
          return 'FUDEU: Agora só acessando a URL manualmente'
          // URL: 'https://sandbox.melhorenvio.com.br/oauth/authorize?client_id=2385&redirect_uri=https://gorilla.vercel.app&response_type=code&scope=shipping-calculate'
          // save new CODE at Strapi
          // get new TOKEN at MelhorEnvio
          // save new TOKEN at Strapi
          // start again:
          // return getMelhorEnvioPrices(getCredentials(['access_token']))
        }
      }

      /*
      const refreshToken = async (credentials) => {
        const options = {
          url: 'https://sandbox.melhorenvio.com.br/oauth/token',
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Aplicação (email para contato técnico)'
          },
          data: {
            'grant_type': 'refresh_token',
            'refresh_token': `${credentials.refresh_token}`,
            'client_id': `${credentials.client_id}`,
            'client_secret': `${credentials.client_secret}`
          }
        };

        try {
          const newToken = await axios(options)
          console.log('ATTENTION THERE IS A NEW TOKEN: ')
          console.log(newToken.data)
          return saveNewToken(newToken.data)
        } catch (error) {
          console.log(error.response.data.error_description)
          return 'fim'
          return hxandleErrors(error.response.data.error_description)
        }
      }
      */

      /*
      const getMelhorEnvioPrices = async (credentials) => {
        const options = {
          url: 'https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate',
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials.access_token}`,
            'User-Agent': 'Aplicação (email para contato técnico)'
          },
          data: JSON.stringify({
            from: {
              postal_code: gorillaPostCode,
            },
            to: {
              postal_code: dropOffPostCode,
            },
            products: products,
          })
        };

        try {
          const result = await axios(options)
          return sortByLowestPrice(result.data)
        } catch (error) {
          return hxandleErrors(error.response.data.message)
        }
      }
      */

      const validatePack = async (freeDeliveryValue, promotionZone) => {
        await Promise.all(
          pack.map(async (snack) => {
            const validatedSnack = await strapi.query('api::product.product').findOne({
              where: { id: snack.id },
            });

            if(validatedSnack) {
              const product = {
                id: validatedSnack.id,
                baseValue: validatedSnack.BaseValue,
                width: validatedSnack.Width,
                height: validatedSnack.Height,
                length: validatedSnack.Length,
                weight: validatedSnack.Weight / 100,
                insurance_value: 0,
                quantity: snack.quantity,
                name: validatedSnack.Name
              }
              orderPrice += product.baseValue * parseInt(product.quantity)
              data.products.push(product)
            }
          })
        )

        if(freeDeliveryValue <= orderPrice && promotionZone) {
          noFee = promotionZone
        }
        return requestMelhorEnvio(
          undefined,
          'https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate',
          sortByLowestPrice,
          JSON.stringify(data.products),
        )
      }

      const getPromotionZone = (uf) => {
        if (
          uf === 'RJ' ||
          uf === 'MG' ||
          uf === 'SP' ||
          uf === 'ES'
        ) {
          return true
        } else {
          return false
        }
      }

      const getGratuityByOrderPrice = async (uf) => {
        const value = await strapi.service('api::free-delivery.free-delivery').find()
        return validatePack(value.MinimumTicket, getPromotionZone(uf))
      }

      const getGratuityByCity = (data) => {
        if(data.localidade === "Rio de Janeiro" || data.localidade === "Niterói"){
          noFee = true
          gorillaLog = true
          return sendResponse(['Skipping Melhor Envio quotation'])
        } else {
          if (dropOffPostCode.length === 8) {
            return getGratuityByOrderPrice(data.uf)
          }
        }
      }

      const getAddress = async () => {
        let data
        try {
          const response = await axios.get(`https://viacep.com.br/ws/${dropOffPostCode}/json/`)
          data = response.data
        } catch (error) {
          data = error.message
        }
        address = {
          cep: data.cep,
          logradouro: data.logradouro,
          bairro: data.bairro,
          municipio: data.localidade,
          uf: data.uf,
        }
        return getGratuityByCity(data)
      }

      return getAddress()
  },
}
