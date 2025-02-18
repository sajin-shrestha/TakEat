// Success Response Class with Pagination Support
class ResponseWithPagination<T> {
  statusCode: number
  message: string
  total: number
  prev: number | null
  next: number | null
  data: T | null

  constructor(
    statusCode: number,
    message: string,
    total: number,
    prev: number | null,
    next: number | null,
    data: T | null = null
  ) {
    this.statusCode = statusCode
    this.message = message
    this.total = total
    this.prev = prev
    this.next = next
    this.data = data
  }

  /**
   *
   * @param statusCode - HTTP status code for the response (e.g., 200).
   * @param message - Message describing the response (e.g., 'Fetched data successfully').
   * @param total - Total number of items available for pagination (e.g., 100).
   * @param prev - The URL or string for the previous page. Pass `null` if there is no previous page.
   * @param next - The URL or string for the next page. Pass `null` if there is no next page.
   * @param data - The data being returned in the response (e.g., an array of users).
   *
   * @returns A new `ResponseWithPagination` instance with the given values.
   */
  static success<T>(
    statusCode: number,
    message: string,
    total: number,
    prev: number | null,
    next: number | null,
    data: T | null = null
  ): ResponseWithPagination<T> {
    return new ResponseWithPagination<T>(
      statusCode,
      message,
      total,
      prev,
      next,
      data
    )
  }
}

// Success Response without Pagination (for those which doesnot have pagination)
class SimpleResponse<T> {
  statusCode: number
  message: string
  data: T | null

  constructor(statusCode: number, message: string, data: T | null = null) {
    this.statusCode = statusCode
    this.message = message
    this.data = data
  }

  static success<T>(
    statusCode: number,
    message: string,
    data: T | null = null
  ): SimpleResponse<T> {
    return new SimpleResponse<T>(statusCode, message, data)
  }
}

// Error Response Class
class ErrorApiResponse {
  statusCode: number
  message: string
  errorStack: string | null

  constructor(
    statusCode: number,
    message: string,
    errorStack: string | null = null
  ) {
    this.statusCode = statusCode
    this.message = message
    this.errorStack = errorStack
  }

  /**
   *
   * @param statusCode - HTTP status code for the error (e.g., 400 for bad request).
   * @param message - Error message (e.g., 'Validation failed').
   * @param errorStack - Optional error stack that can be included in the response.
   *
   * @returns A new `ErrorApiResponse` instance with the given values.
   */
  static error(
    statusCode: number,
    message: string,
    errorStack: string | null = null
  ): ErrorApiResponse {
    return new ErrorApiResponse(statusCode, message, errorStack)
  }
}

export { ResponseWithPagination, SimpleResponse, ErrorApiResponse }
