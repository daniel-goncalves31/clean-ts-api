import { MongoDbHelper } from '../infra/db/mongodb/helpers/mongodb-helper'
import { env } from './config/env'

MongoDbHelper.instance
  .connect(env.MONGO_URL)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(env.PORT, () =>
      console.log(`Server running at http://localhost:${env.PORT}`)
    )
  })
  .catch(console.error)
