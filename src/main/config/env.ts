export default {
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  mongoUrl: process.env.Mongo_URL as string || 'mongodb://127.0.0.1:27017/clean-node-api' as string,
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  port: process.env.PORT || 5050
}
