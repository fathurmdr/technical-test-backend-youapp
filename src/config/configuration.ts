export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  secret: process.env.SECRET ?? '',
  expiresIn: process.env.EXPIRES_IN ?? '',
  mongoUri: process.env.MONGO_URI ?? '',
});
