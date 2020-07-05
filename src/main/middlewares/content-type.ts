import { Request, Response, NextFunction } from 'express'

export default (_: Request, res: Response, next: NextFunction): void => {
  res.type('json')
  next()
}
