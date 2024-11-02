import { IncomingHttpHeaders } from 'http'
import { TLanguage } from '../types'
import { EN } from '../constants'

type TInfoHeaders = {
  lang: TLanguage
  authorization: string
  filesContent: boolean
}

export const getInfoHeaders = (headers: IncomingHttpHeaders): TInfoHeaders => {
  const lang = (headers['accept-language'] as TLanguage) ?? EN
  const authorization = headers.authorization ?? ''
  const filesContent = (headers['accept-files'] as string) ?? ''

  return {
    lang,
    authorization,
    filesContent: filesContent === 'true'
  }
}
