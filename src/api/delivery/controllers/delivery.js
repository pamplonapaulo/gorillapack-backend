'use strict';

const axios = require('axios');

/**
 *  delivery-fee controller
 */

module.exports = {
  getDeliveryFee: async (ctx) => {
      const { dropOffPostCode, pack } = ctx.request.body
      let address
      let products = []
      let orderPrice = 0
      let refreshTokenErrorCounter = 0
      let noFee = false
      let gorillaLog = false

      const unableToAccomplish = async (err) => {
        refreshTokenErrorCounter++
        console.log('Error trying to refresh new token with Melhor Envio. Counting: ',  refreshTokenErrorCounter)
        console.log(err)
        console.log('Trying again...')
        console.log('Getting credentials to reqquest refresh token...')
        const credentials = await strapi.service('api::melhor-envio.melhor-envio').find()
        console.log('Credentials: ')
        console.log(credentials)
        console.log('Refreshing a new token...')
        return refreshToken(credentials)
      }

      const saveNewToken = async (updatedToken, credentials) => {
        await strapi.query('api::melhor-envio.melhor-envio').update({
          where: { id: 1 },
          data: {
            access_token: updatedToken.access_token,
            refresh_token: updatedToken.refresh_token
          },
        })
        refreshTokenErrorCounter = 0
        return getMelhorEnvioCredentials()
      }

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
          return saveNewToken(newToken.data, credentials)
        } catch (error) {
          return unableToAccomplish(error.message)
        }
      }

      const sendResponse = (arr) => {
        if (arr.length === 0) {
          return 'Selecione uma quantidade MENOR de produtos.'
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

      const getMelhorEnvioPrices = async (credentials, noFee) => {

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
              postal_code: '20756190',
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
          console.log('refreshing Token...')
          return refreshToken(credentials)
        }
      }

      const getMelhorEnvioCredentials = async () => {
        const credentials = await strapi.service('api::melhor-envio.melhor-envio').find()
        return getMelhorEnvioPrices(credentials)
      }

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
              products.push(product)
            }
          })
        )

        if(freeDeliveryValue <= orderPrice && promotionZone) {
          noFee = promotionZone
        }
        return getMelhorEnvioCredentials()
      }

      const setPromotionZone = (uf) => {
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
        return validatePack(value.MinimumTicket, setPromotionZone(uf))
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
