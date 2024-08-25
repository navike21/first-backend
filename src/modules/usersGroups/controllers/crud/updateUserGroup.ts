import { getInfoHeaders, IRequest, TRequest, TResponse } from '../../../../common'

export const updateUserGroup = async (
  { body, headers, params }: TRequest,
  response: TResponse
) => {
  const { lang } = getInfoHeaders(headers)
  const { idUserGroup } = params
  const { data } = body as IRequest
}
