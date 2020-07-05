import 'dotenv/config'

export const env = {
  MONGO_URL:
    process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  PORT: process.env.PORT || 3333
}
