'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
   register({ strapi }) {
    const { toEntityResponseCollection } = strapi.plugin("graphql").service("format").returnTypes;
    const extensionService = strapi.plugin("graphql").service("extension");

    extensionService.use(({ nexus }) => ({
      types: [
        nexus.extendType({
          type: "UsersPermissionsMe",
          definition(t) {
            t.string("addressComplement");
            t.string("addressNumber");
            t.string("phone");
            t.string("postCode");
            t.field("order", {
              type: "OrderRelationResponseCollection",

              resolve: async (root, args, ctx) => {
                const order = await strapi.query('api::order.order').findOne({
                  where: { user: root.id }
                });

                console.log(order)

                // return toEntityResponseCollection([{ id: order.id }], {
                //   args,
                //   resourceUID: "api::user.me",
                // });

                return toEntityResponseCollection([{ id: order.id }], {
                  args,
                  resourceUID: "api::user.me",
                });

              },
            });
          },
        }),
      ],
    }));
  },
  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
