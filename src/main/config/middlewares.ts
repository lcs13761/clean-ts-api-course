import { Express, json } from 'express'
import { cors, contentType } from '../middlewares/index'

export default (app: Express): void => {
  app.use(json())
  app.use(cors)
  app.use(contentType)
}
