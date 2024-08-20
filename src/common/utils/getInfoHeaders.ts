import { IncomingHttpHeaders } from 'http'
import { TLanguage } from '../types'
import { EN } from '../constants'

export const getInfoHeaders = (headers: IncomingHttpHeaders) => {
  const lang = (headers['accept-language'] as TLanguage) ?? EN

  return {
    lang
  }
}
