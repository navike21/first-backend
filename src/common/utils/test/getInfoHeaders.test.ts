import { EN } from '../../constants'
import { getInfoHeaders } from '../getInfoHeaders'
import { IncomingHttpHeaders } from 'http'

describe('getInfoHeaders', () => {
  it('should return the correct lang, authorization, and filesContent', () => {
    const mockHeaders: IncomingHttpHeaders = {
      'accept-language': 'es',
      authorization: 'Bearer mocktoken',
      'accept-files': 'true'
    }

    const result = getInfoHeaders(mockHeaders)

    expect(result.lang).toBe('es')
    expect(result.authorization).toBe('Bearer mocktoken')
    expect(result.filesContent).toBe(true)
  })

  it('should default lang to EN when accept-language is not provided', () => {
    const mockHeaders: IncomingHttpHeaders = {
      authorization: 'Bearer mocktoken',
      'accept-files': 'true'
    }

    const result = getInfoHeaders(mockHeaders)

    expect(result.lang).toBe(EN)
  })

  it('should return empty string for authorization when not provided', () => {
    const mockHeaders: IncomingHttpHeaders = {
      'accept-language': 'es',
      'accept-files': 'true'
    }

    const result = getInfoHeaders(mockHeaders)

    expect(result.authorization).toBe('')
  })

  it('should default filesContent to false when accept-files is not provided', () => {
    const mockHeaders: IncomingHttpHeaders = {
      'accept-language': 'es',
      authorization: 'Bearer mocktoken'
    }

    const result = getInfoHeaders(mockHeaders)

    expect(result.filesContent).toBe(false)
  })

  it('should correctly parse filesContent as boolean from string', () => {
    const mockHeaders: IncomingHttpHeaders = {
      'accept-language': 'es',
      authorization: 'Bearer mocktoken',
      'accept-files': 'false'
    }

    const result = getInfoHeaders(mockHeaders)

    expect(result.filesContent).toBe(false)
  })
})
