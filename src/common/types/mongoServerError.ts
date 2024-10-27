export type TMongoServerError = {
  errorResponse: TErrorResponse
  index: number
  code: number
  keyPattern: Record<string, number>
}

export type TErrorResponse = {
  index: number
  code: number
  errmsg: string
  keyPattern: Record<string, number>
  keyValue: Record<string, string>
}
