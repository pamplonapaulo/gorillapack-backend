'use strict';

/**
 * `parser` middleware.
 */

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In parser middleware.');

    await next();
  };
};
