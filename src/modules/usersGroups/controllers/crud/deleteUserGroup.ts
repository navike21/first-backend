import { getInfoHeaders, IRequest, TRequest, TResponse } from '../../../../common'

export const deleteUserGroup = async (
  { body, headers }: TRequest,
  response: TResponse
) => {
  const { lang } = getInfoHeaders(headers)
  const { data } = body as IRequest
}
