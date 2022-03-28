module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '9dfa1249e44df92510a6fdbf94663887'),
  },
});
