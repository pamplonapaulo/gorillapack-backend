module.exports = [
  {
    method: 'GET',
    path: '/credentials',
    handler: 'melhorenvio.findCredentials',
    config: {
      auth: false,
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/credentials',
    handler: 'melhorenvio.replaceCredentials',
    config: {
      auth: false,
      policies: [],
    },
  },
];
