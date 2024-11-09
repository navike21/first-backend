import {
  IMeta,
  IRequest,
  IValidationSchema,
  TRequestSchemaMessage
} from '../../types'

const mockValidationSchema: IValidationSchema = {
  isObject: 'Mock: must be an object',
  isRequired: 'Mock: is required'
}

describe('Request Schema Types', () => {
  it('IMeta should have optional fields: page, limit, total, and totalPages', () => {
    const meta: IMeta = {
      page: 1,
      limit: 10,
      total: 100,
      totalPages: 10
    }
    expect(meta).toHaveProperty('page', 1)
    expect(meta).toHaveProperty('limit', 10)
    expect(meta).toHaveProperty('total', 100)
    expect(meta).toHaveProperty('totalPages', 10)
  })

  it('IRequest should have required field data and other optional fields', () => {
    const request: IRequest = {
      data: {},
      meta: { page: 1, limit: 10 },
      filters: {},
      sort: {},
      files: [{}]
    }
    expect(request).toHaveProperty('data')
    expect(request).toHaveProperty('meta')
    expect(request).toHaveProperty('filters')
    expect(request).toHaveProperty('sort')
    expect(request).toHaveProperty('files')
  })

  it('TRequestSchemaMessage should contain the keys of IRequest and assign them an IValidationSchema', () => {
    const schemaMessage: TRequestSchemaMessage = {
      data: mockValidationSchema,
      meta: mockValidationSchema,
      filters: mockValidationSchema,
      sort: mockValidationSchema,
      files: mockValidationSchema
    }

    Object.keys(schemaMessage).forEach(key => {
      expect(schemaMessage[key as keyof TRequestSchemaMessage]).toEqual(
        mockValidationSchema
      )
    })
  })
})
