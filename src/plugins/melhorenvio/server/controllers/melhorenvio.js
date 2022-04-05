'use strict';

module.exports = {
  // findContentTypes(ctx) {
  //   ctx.body = strapi.plugin('melhorenvio').service('melhorenvio').getContentTypes();
  // },
  // findMelhorEnvioCredentials(ctx) {
  //   ctx.body = strapi.plugin('melhorenvio').service('melhorenvio').getMelhorEnvioCredentials();
  // },
  // async findCredentials(ctx) {
  //   ctx.body = await strapi.db.query('api::melhor-envio.melhor-envio').findOne({
  //     select: ['client_id'],
  //     populate: { category: true }
  //   })
  // },
  async findCredentials(ctx) {
    ctx.body = await strapi.db.query('api::melhor-envio.melhor-envio').findMany({
      populate: { category: true }
    })
  }
};
