export type TErrorMongoose = {
  index: number
  code: number
  errmsg: string
  keyValue: {
    [key: string]: string
  }
  keyPattern: {
    [key: string]: string
  }
}

export type TPayloadErrorMongoose = {
  errorResponse: TErrorMongoose
}
