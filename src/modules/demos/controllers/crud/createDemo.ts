import { getInfoHeaders, IRequest, TRequest, TResponse } from '../../../../common'

export const createDemo = async (
  { body, headers }: TRequest,
  response: TResponse
) => {
  const { lang } = getInfoHeaders(headers)
  const { data } = body as IRequest
}
