import { IncomingHttpHeaders } from 'http'
import { TLanguage } from '../types'
import { EN } from '../constants'

type TInfoHeaders = {
  lang: TLanguage
}

export const getInfoHeaders = (headers: IncomingHttpHeaders): TInfoHeaders => {
  const lang = (headers['accept-language'] as TLanguage) ?? EN

  return {
    lang
  }
}
