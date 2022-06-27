module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/email',
     handler: 'email.index',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
