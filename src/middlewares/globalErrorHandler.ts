import { HttpError } from 'http-errors'
import { NextFunction, Request, Response } from 'express'
import { config } from '../config/config'
import { ErrorApiResponse } from '../utils/ApiResponse'
import { HttpStatusCodes } from '../constants'

// Error-handling middleware
const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || HttpStatusCodes.INTERNAL_SERVER_ERROR

  const errorResponse = ErrorApiResponse.error(
    statusCode,
    err.message,
    config.env === 'development' ? err.stack : null
  )

  res.status(statusCode).json(errorResponse)
}

export default globalErrorHandler
