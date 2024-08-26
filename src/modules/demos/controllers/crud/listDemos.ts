import { getInfoHeaders, IRequest, TRequest, TResponse } from '../../../../common'

export const listDemos = async (
  { body, headers }: TRequest,
  response: TResponse
) => {
  const { lang } = getInfoHeaders(headers)
  const {
    meta: { page = 1, limit = 10 } = {},
    filters = {},
    sort = {}
  } = body as IRequest

  const skip = (page - 1) * limit
}
