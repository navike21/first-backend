import { getInfoHeaders, IRequest, TRequest, TResponse } from '../../../../common'

export const updateDemo = async (
  { body, headers, params }: TRequest,
  response: TResponse
) => {
  const { lang } = getInfoHeaders(headers)
  const { idDemo } = params
  const { data } = body as IRequest
}
