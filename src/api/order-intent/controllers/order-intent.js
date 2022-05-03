'use strict';

const axios = require('axios')

const { getDeliveryFee } = require('../../delivery/controllers/delivery')

/**
 *  order-intent controller
 */

module.exports = {
  create: async (ctx) => {

      console.log('process.env.GRAPHQL_HOST')
      console.log(process.env.GRAPHQL_HOST)

      const { users_permissions_user, period, snack, pack, postCode } = ctx.request.body

      let data = {
        users_permissions_user,
        Title: 'Custom',
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

      const saveOrderIntent = async () => {
        try {
          const order = await strapi.service('api::order.order').create({data})
          return order.id
        } catch(err) {
          console.log(err)
          return err
        }
      }

      const renameSnackProp = (snks) => {
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

      const handleCalendar = async () => {
        const today = new Date().getDate()
        let month = new Date().getMonth()
        let year = new Date().getFullYear()
        let dayOfMonth
        const expectedDispatchDays = []
        const expectedArrivalDays = []

        const { Day1, Day2, SafetyTimeSpan } = await strapi.service('api::dispatch-day.dispatch-day').find()

        let dispatches = [ Number(Day1), Number(Day2) ]

        // reverse loop: overrides the result with the beginning of the month when possible
        for (let i=dispatches.length-1; i>=0; i--) {
          // Check if first dispatch can happen in the current month
          if (today + SafetyTimeSpan < dispatches[i]) {
            dayOfMonth = dispatches[i]
          }
        }

        // condition is true when dispatch can't happen in the current month
        if (!dayOfMonth) {
          year = month === 11 ? year+1 : year
          month = month === 11 ? 0 : month+1
          dayOfMonth = dispatches[0]
        }

        for (let i=1; i<=orderMath.subscription.Multiplier; i++) {

          expectedDispatchDays.push({
            isDispatched: false,
            date: new Date(year + '-' + (month+1) + '-' + dayOfMonth).toISOString().substring(0, 10)
          })

          let arrival = new Date(year, month, dayOfMonth + data.deliveries.expectedTravelingDays)

          // Check if arrival would be on Sunday, then fix it to Monday'
          if (arrival.getDay() === 0) {
            arrival = new Date(year, month, dayOfMonth + data.deliveries.expectedTravelingDays + 1);
          }

          // Check if arrival would be on Saturday, then fix it to Monday
          if (arrival.getDay() === 6) {
            arrival = new Date(year, month, dayOfMonth + data.deliveries.expectedTravelingDays + 2);
          }

          const dateStr = arrival.getFullYear() + '-' + (arrival.getMonth()+1) + '-' + arrival.getDate()

          expectedArrivalDays.push({
            hasArrived: false,
            date: new Date(dateStr).toISOString().substring(0, 10)
          })

          year = month === 11 ? year+1 : year
          month = month === 11 ? 0 : month+1
        }

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
        data.expectedPayments.valueInCentavos = convertToCents((orderMath.snacksTotal - orderMath.subscription.absoluteDiscount) + data.deliveries.fee)
        data.deliveries.fee = data.deliveries.fee.toString()
        return handleCalendar()
      }

      const getSubscriptionDiscount = async () => {
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
        const userName = await strapi.query('plugin::users-permissions.user').findOne({
          where: { id: users_permissions_user }
        });
        data.address.nome = userName.username
        return getSubscriptionDiscount()
      }

      const calculateDelivery = async (snacks) => {
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
        data.snack = arr
      }

      const regroupSnacksProps = (arr) => {
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
        // This env variable is not considering Prod Env yet
        const packData = await axios.post(process.env.GRAPHQL_HOST, {
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

        data.Title = packData.data.data.pack.data.attributes.Name

        return getSubtotalFromSnacks(
          regroupSnacksProps(packData.data.data.pack.data.attributes.Item),
          packData.data.data.pack.data.attributes.ExtraDiscount
        )
      }

      const handlePackType = (snacks, pack) => {
        if (!snacks && pack) return getSnacksFromPack(pack)
        if (!pack && snacks) return getSubtotalFromSnacks(snacks)
      }

      return handlePackType(snack, pack)
    },
};
