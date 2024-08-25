import { getInfoHeaders, IRequest, TRequest, TResponse } from '../../../../common'

export const createUserGroup = async (
  { body, headers }: TRequest,
  response: TResponse
) => {
  const { lang } = getInfoHeaders(headers)
  const { data } = body as IRequest
}
