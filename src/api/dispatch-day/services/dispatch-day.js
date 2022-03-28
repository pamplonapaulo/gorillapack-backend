'use strict';

/**
 * dispatch-day service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::dispatch-day.dispatch-day');
