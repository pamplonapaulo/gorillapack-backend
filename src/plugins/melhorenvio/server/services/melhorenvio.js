'use strict';

module.exports = ({ strapi }) => ({
  getContentTypes() {
    console.log(strapi)
    return strapi.contentTypes;
  },
  async getMelhorEnvioCredentials() {
    const entries = await strapi.entityService.findMany('api::melhor-envio.melhor-envio', {
      populate: '*',
    });
    console.log(entries.client_secret)
    return entries.client_secret;
  },
});
