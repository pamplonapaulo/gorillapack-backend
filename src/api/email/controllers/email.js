'use strict';

/**
 * A set of functions called "actions" for `email`
 */

module.exports = {
  index: async (ctx, next) => {
    try {
      await strapi.plugins['email'].services.email.send({
        to: 'adm.gorillapack@gmail.com',
        from: 'adm.gorillapack@gmail.com',
        replyTo: 'adm.gorillapack@gmail.com',
        subject: 'Testing SendGrid and Strapi',
        text: 'Sending Email'
      })
      ctx.send('Email sent')
    } catch (err) {
      console.log(err)
      ctx.body = err;
    }
  }
};
