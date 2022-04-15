'use strict';

module.exports = {
  async findCredentials(ctx) {
    ctx.body = await strapi.db.query('api::melhor-envio.melhor-envio').findMany({
      populate: { category: true }
    })
  },
  async replaceCredentials(ctx) {
    const regex = /(\?|\&)([^=]+)\=([^&]+)/g
    const params = [...ctx.request.url.matchAll(regex)]
    const access_token = params[0][3]
    const refresh_token = params[1][3]

    await strapi.db.query('api::melhor-envio.melhor-envio').update({
      where: { id: 1 },
      data: {
        access_token,
        refresh_token
      },
    })
    return ctx.send({status: 200});
  }
};
