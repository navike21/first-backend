import { getInfoHeaders } from '../getInfoHeaders'
import { EN } from '../../constants'
import { TLanguage } from '../../types'

describe('getInfoHeaders', () => {
  it('should return the language from headers if present', () => {
    const headers = {
      'accept-language': 'es' as TLanguage
    }

    const result = getInfoHeaders(headers)
    expect(result.lang).toBe('es')
  })

  it('should return the default language if accept-language header is not present', () => {
    const headers = {}

    const result = getInfoHeaders(headers)
    expect(result.lang).toBe(EN)
  })

  it('should return the default language if accept-language header is undefined', () => {
    const headers = {
      'accept-language': undefined
    }

    const result = getInfoHeaders(headers)
    expect(result.lang).toBe(EN)
  })
})
