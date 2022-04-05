module.exports = [
  // {
  //   method: 'GET',
  //   path: '/content-types',
  //   handler: 'melhorenvio.findContentTypes',
  //   config: {
  //     auth: false,
  //     policies: [],
  //   },
  // },
  // {
  //   method: 'GET',
  //   path: '/melhorenvioCredentials',
  //   handler: 'melhorenvio.findMelhorEnvioCredentials',
  //   config: {
  //     auth: false,
  //     policies: [],
  //   },
  // },
  {
    method: 'GET',
    path: '/credentials',
    handler: 'melhorenvio.findCredentials',
    config: {
      auth: false,
      policies: [],
    },
  },
];

