'use strict';

const axios = require('axios')

const { getDeliveryFee } = require('../../delivery/controllers/delivery')

/**
 *  order-intent controller
 */

module.exports = {
  create: async (ctx) => {
        const { users_permissions_user, period, snack, pack, postCode } = ctx.request.body

        let data = {
          users_permissions_user,
          Title: 'custom',
          pack,
          snack,
          period,
          deliveries: {},
          address: {},
          expectedPayments: {
            valueInCentavos: null,
            MonthsMultiplier: null
          },
        }

        let orderMath = {
          snacksTotal: 0,
          subscription: {
            multiplier: null,
            percentualDiscount: 0,
            absoluteDiscount: 0
          },
        }

        const returnOrderId = (id) => {
          console.log(' ')
          console.log(' 14 ')
          console.log(' ')

          return id
        }

        const saveOrderIntent = async () => {
          console.log(' ')
          console.log(' 13 ')
          console.log(' ')

          try {
            const order = await strapi.service('api::order.order').create({data})
            return returnOrderId(order.id)
          } catch(err) {
            console.log(err)
            return err
          }
        }

        const renameSnackProp = (snks) => {
          console.log(' ')
          console.log(' 12 ')
          console.log(' ')

          const products = []
          snks.map((s) => {
            products.push({
              Quantity: s.Quantity,
              product: s.id
            })
          })
          data.snack = products
          return saveOrderIntent(data)
        }

        const formatDate = (year, month, day) => {
          console.log(' ')
          console.log(' 11 ')
          console.log(' ')

          if (month > 11) {
            month = month - 12
            year = year + 1
          }
          const dateStr = year + '-' + month + '-' + day
          return new Date(dateStr).toISOString()
        }

        const handleCalendar = async () => {

          console.log(' ')
          console.log(' 10 ')
          console.log(' ')

          const today = new Date().getDate()
          let month = new Date().getMonth()
          let year = new Date().getFullYear()
          let dayOfMonth
          const expectedDispatchDays = []
          const expectedArrivalDays = []

          const { Day1, Day2, SafetyTimeSpan } = await strapi.service('api::dispatch-day.dispatch-day').find()

          let dispatches = [ Number(Day1), Number(Day2) ]

          console.log('Dias do mês em que o Gorilla posta as ordens:')
          console.log(dispatches)
          console.log(' ')

          console.log('Hoje é dia:')
          console.log(today)
          console.log(' ')

          console.log('Tempo necessário entre a confirmação do pagamento e a postagem:')
          console.log(SafetyTimeSpan + ' dias')
          console.log(' ')

          for (let i=dispatches.length-1; i>=0; i--) {

            if (today + SafetyTimeSpan < dispatches[i]) {
              console.log('Ordem será enviada ainda este mês.')
              dayOfMonth = (dispatches[i] + 1)
            }
          }

          if (!dayOfMonth) {
            console.log('Ordem NÃO será enviada este mês. Somente no próximo mês.')
            year = month === 11 ? year+1 : year
            month = month === 11 ? 0 : month+1
            dayOfMonth = (dispatches[0] + 1)
          }

          console.log('Definido que os dias de envio serão sempre: dia ', dayOfMonth + ' de cada mês.')
          console.log(' ')

          for (let i=1; i<=orderMath.subscription.Multiplier; i++) {
            console.log('Total de meses contratados na assinatura: ', orderMath.subscription.Multiplier)
            console.log(' ')

            expectedDispatchDays.push({
              isDispatched: false,
              date: formatDate(year, (month + i), dayOfMonth)
            })

            let arrival = new Date(year, month + i, dayOfMonth + data.deliveries.expectedTravelingDays);

            // Check if arrival would be on Sunday, then fix it to Monday'
            if (arrival.getDay() === 0) {
              console.log('arrival on Sunday: so 1 extra day on delivery')
              arrival = new Date(year, month + i, dayOfMonth + data.deliveries.expectedTravelingDays + 1);
            }

            // Check if arrival would be on Saturday, then fix it to Monday
            if (arrival.getDay() === 6) {
              console.log('arrival on Saturday: so 2 extra days on delivery')
              arrival = new Date(year, month + i, dayOfMonth + data.deliveries.expectedTravelingDays + 2);
            }

            const dateStr = arrival.getFullYear() + '-' + arrival.getMonth() + '-' + arrival.getDate()
            console.log(' dateStr ', dateStr)
            console.log(' ')

            expectedArrivalDays.push({
              hasArrived: false,
              date: new Date(dateStr).toISOString()
            })
          }
          console.log('Dias de postagem: ', expectedDispatchDays)
          console.log('Dias de recebimento: ', expectedArrivalDays)

          data.deliveries.expectedArrivalDays = expectedArrivalDays
          data.deliveries.expectedDispatchDays = expectedDispatchDays

          if(data.snack.length > 0) {
            return renameSnackProp(data.snack)
          } else {
            return saveOrderIntent()
          }
        }

        const convertToCents = (num) => parseInt(num.toFixed(2).toString().replace(/(\d{1,})(\.)(\d{1,2})/g, '$1' + '$3'))

        const getExpectedPayments = () => {
          console.log(' ')
          console.log(' 9 ')
          console.log(' ')

          data.expectedPayments.valueInCentavos = convertToCents((orderMath.snacksTotal - orderMath.subscription.absoluteDiscount) + data.deliveries.fee)
          data.deliveries.fee = data.deliveries.fee.toString()
          return handleCalendar()
        }

        const getSubscriptionDiscount = async () => {
          console.log(' ')
          console.log(' 8 ')
          console.log(' ')

          const subscription = await strapi.query('api::period.period').findOne({
            where: { id: period }
          });
          data.expectedPayments.MonthsMultiplier = subscription.Multiplier
          orderMath.subscription.Multiplier = subscription.Multiplier
          orderMath.subscription.percentualDiscount = subscription.Discount
          orderMath.subscription.absoluteDiscount = subscription.Discount * orderMath.snacksTotal
          return getExpectedPayments()
        }

        const getUserName = async () => {
          console.log(' ')
          console.log(' 7 ')
          console.log(' ')

          const userName = await strapi.query('plugin::users-permissions.user').findOne({
            where: { id: users_permissions_user }
          });
          data.address.nome = userName.username
          return getSubscriptionDiscount()
        }

        const calculateDelivery = async (snacks) => {
          console.log(' ')
          console.log(' 6 ')
          console.log(' ')

          const deliveryData = await getDeliveryFee({
            request: {
              body: {
                dropOffPostCode: postCode,
                pack: snacks
              }
            }
          })
          data.deliveries = { ...deliveryData.quotation }
          data.address = { ...deliveryData.address }
          return getUserName()
        }

        const getSubtotalFromSnacks = async (snacks, packDiscount = 0) => {
          console.log(' ')
          console.log(' 5 ')
          console.log(' ')

          await Promise.all(
            snacks.map(async (snack) => {
              const item = await strapi.query('api::product.product').findOne({
                where: { id: snack.id },
              });
              orderMath.snacksTotal += (snack.Quantity * item.BaseValue)
            })
          )

          orderMath.snacksTotal = orderMath.snacksTotal - (packDiscount * orderMath.snacksTotal)
          return calculateDelivery(snacks)
        }

        const storeSnacksTemp = (arr) => {
          console.log(' ')
          console.log(' 4 ')
          console.log(' ')

          data.snack = arr
        }

        const regroupSnacksProps = (arr) => {
          console.log(' ')
          console.log(' 3 ')
          console.log(' ')

          const snks = []
          arr.map((s) => {
            snks.push({
              "id": Number(s.product.data.id),
              "Quantity": s.Quantity
            })
          })
          storeSnacksTemp(snks)
          return snks
        }

        const getSnacksFromPack = async () => {
          console.log(' ')
          console.log(' 2 ')
          console.log(' ')

          // This env variable is not considering Prod Env yet
          const data = await axios.post(process.env.GRAPHQL_HOST, {
            query: `query packs {
              pack(id: ${pack}) {
                data {
                  id
                  attributes {
                    Name
                    ExtraDiscount
                    Item {
                      Quantity
                      product {
                        data {
                          id
                        }
                      }
                    }
                  }
                }
              }
            }`
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          return getSubtotalFromSnacks(
            regroupSnacksProps(data.data.data.pack.data.attributes.Item),
            data.data.data.pack.data.attributes.ExtraDiscount
          )
        }

        const handlePackType = (snacks, pack) => {
          console.log(' ')
          console.log(' 1 ')
          console.log(' ')
          if (!pack && !snacks || pack && snacks) return 'erro no conteúdo da ordem'
          if (!snacks && pack) return getSnacksFromPack(pack)
          if (!pack && snacks) return getSubtotalFromSnacks(snacks)
        }

        return handlePackType(snack, pack)
    },
};
