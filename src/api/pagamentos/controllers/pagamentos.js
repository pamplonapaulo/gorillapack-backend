'use strict';

/**
 * A set of functions called "actions" for `pagamentos`
 */

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
  // const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET
  const unparsed = require('koa-body/unparsed.js')

module.exports = {
  event: async (ctx) => {
    const endpointSecret = 'whsec_f27d6d223c8ffaa89aef735ed391840be8d6bad436187a39a5b7db4af8cc0506';

    let event = ctx.request.body[unparsed];
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = ctx.request.header['stripe-signature'];

      try {
        event = await stripe.webhooks.constructEvent(
          ctx.request.body[unparsed],
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        ctx.throw(400, err.message)
      }
    }
    console.log('event.type:', event.type)

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      case 'payment_intent.created':
        console.log(`Payment Intent was created!`);
        break;
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    //response.send();
    return 'acknowledge receipt'
  }
};
