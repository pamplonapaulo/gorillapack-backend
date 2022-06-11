'use strict';

/**
 *  cancellation controller
 */

var jwt = require('jsonwebtoken')

module.exports = {
  cancel: async (ctx) => {

    const token = ctx.request.headers.authorization.split(' ')[1]
    const userID = jwt.decode(token).id
    const { type } = ctx.request.body

    const validateUser = async (userID, type) => {
      try {
        const user = await strapi.query('plugin::users-permissions.user').findOne({
          where: {
            id: userID,
            blocked: false,
            confirmed: true
          }
        });

        if (type === 'cancelUser') return cancelUser(userID)
        if (type === 'cancelOrder') return getOrderID(userID)
      } catch(err) {
        console.log('erro find user')
        ctx.throw(err.status, err.message)
      }
    }

    const getOrderID = async (userID) => {
      try {
        const activeOrder = await strapi.query('api::order.order').findOne({
          where: {
            user: userID,
            deactivated: false,
            isConfirmed: true
          },
        })
        console.log('active order')
        console.log(activeOrder)
        return cancelOrder(activeOrder.id)
      } catch(err) {
        console.log('erro find order')
        ctx.throw(err.status, err.message)
      }
    }

    const cancelOrder = async (orderID) => {
      try {
        const cancelled = await strapi.entityService.update('api::order.order', orderID, {
          data: {
            deactivated: true,
            deactivationAuthor: 'customer',
            isConfirmed: false
          },
        });
        console.log('cancelled order')
        console.log(cancelled)
        return cancelled
      } catch(err) {
        console.log('erro cancel order')
        ctx.throw(err.status, err.message)
      }
    }

    const cancelUser = async (userID) => {
      try {
        const cancelled = await strapi.query('plugin::users-permissions.user').update({
          where: { id: userID },
          data: {
            blocked: true,
            confirmed: false
          },
        });

        console.log('cancelled user')
        console.log(cancelled)
        return cancelled
      } catch(err) {
        console.log('erro cancel order')
        ctx.throw(err.status, err.message)
      }
    }

    return validateUser(userID, type)
  },
};
