import { RequestSchema } from '../request.schema'
import { TLanguage } from '../../types'
import { requestMessageSchema } from '../../languages'

describe('RequestSchema', () => {
  const languages: TLanguage[] = ['en', 'es', 'fr'] // Example languages

  languages.forEach(lang => {
    it(`should validate a correct request schema for language ${lang}`, () => {
      const schema = RequestSchema(lang)
      const result = schema.validate({
        data: {},
        meta: { page: 1, limit: 10 },
        filters: {},
        sort: {}
      })
      expect(result.error).toBeUndefined()
    })

    it(`should invalidate a request schema with missing data for language ${lang}`, () => {
      const schema = RequestSchema(lang)
      const result = schema.validate({
        meta: { page: 1, limit: 10 },
        filters: {},
        sort: {}
      })
      expect(result.error).toBeDefined()
      expect(result.error?.details[0].message).toBe(
        requestMessageSchema[lang].data.isRequired
      )
    })

    it(`should invalidate a request schema with incorrect data type for language ${lang}`, () => {
      const schema = RequestSchema(lang)
      const result = schema.validate({
        data: 'not an object',
        meta: { page: 1, limit: 10 },
        filters: {},
        sort: {}
      })
      expect(result.error).toBeDefined()
      expect(result.error?.details[0].message).toBe(
        requestMessageSchema[lang].data.isObject
      )
    })

    it(`should validate a request schema with optional fields missing for language ${lang}`, () => {
      const schema = RequestSchema(lang)
      const result = schema.validate({
        data: {}
      })
      expect(result.error).toBeUndefined()
    })

    it(`should invalidate a request schema with non-integer page in meta for language ${lang}`, () => {
      const schema = RequestSchema(lang)
      const result = schema.validate({
        data: {},
        meta: { page: 'not a number' }
      })
      expect(result.error).toBeDefined()
    })

    it(`should invalidate a request schema with negative limit in meta for language ${lang}`, () => {
      const schema = RequestSchema(lang)
      const result = schema.validate({
        data: {},
        meta: { limit: -1 }
      })
      expect(result.error).toBeDefined()
    })
  })

  it('should use the default language if no language is provided', () => {
    const schema = RequestSchema()
    const result = schema.validate({
      data: {},
      meta: { page: 1, limit: 10 },
      filters: {},
      sort: {}
    })
    expect(result.error).toBeUndefined()
  })
})
