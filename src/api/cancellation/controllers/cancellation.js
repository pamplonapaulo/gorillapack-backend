'use strict';

/**
 *  cancellation controller
 */

 var jwt = require('jsonwebtoken')

module.exports = {
  cancel: async (ctx) => {

    const token = ctx.request.headers.authorization.split(" ")[1]
    const userId = jwt.decode(token).id

    console.log(userId)
    const { type } = ctx.request.body

    console.log(type)
    console.log(ctx.request.body)

    const deleteOrder = async () => {
      try {
        const entry = await strapi.entityService.delete('api::order.order', entityId)
        return entry
        //return order.id
      } catch(err) {
        ctx.throw(err.status, err.message)
      }
    }

    const deleteCustomer = async () => {
      try {
        const entry = await strapi.service('api::users-permissions.user').delete(entityId, params)
        return entry
      } catch(err) {
        ctx.throw(err.status, err.message)
      }
    }

    // if (type === 'deleteUser') return deleteCustomer()
    // if (type === 'deleteOrder') return deleteOrder()
    // if (type === 'test') {
    //   //console.log('type: ', type)

    //   return 100
    // }

    return 200
  },
};
