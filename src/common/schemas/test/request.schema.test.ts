import Joi from 'joi'
import { RequestSchema } from '../request.schema'
import { DEFAULT_LANGUAGE } from '../../constants'
import { IRequest } from '../../types'

describe('RequestSchema', () => {
  let schema: Joi.ObjectSchema

  const validRequest: IRequest = {
    data: {},
    meta: {
      page: 1,
      limit: 10
    },
    filters: {},
    sort: {}
  }

  beforeEach(() => {
    schema = RequestSchema(DEFAULT_LANGUAGE)
  })

  const runTest = (requestBody: object, shouldPass: boolean) => {
    const { error } = schema.validate(requestBody)
    if (shouldPass) {
      expect(error).toBeUndefined()
    } else {
      expect(error).toBeDefined()
    }
  }

  it('should validate a correct request', () => {
    runTest(validRequest, true)
  })

  it('should not validate a request without data', () => {
    const invalidRequest = {
      ...validRequest,
      data: undefined
    }
    runTest(invalidRequest, false)
  })

  it('should not validate a request with an invalid data', () => {
    const invalidRequest = {
      ...validRequest,
      data: 'foo'
    }
    runTest(invalidRequest, false)
  })

  it('should not validate a request with an invalid meta', () => {
    const invalidRequest = {
      ...validRequest,
      meta: { page: 1, limit: -10 }
    }
    runTest(invalidRequest, false)
  })

  it('should not validate a request with an invalid filters', () => {
    const invalidRequest = {
      ...validRequest,
      filters: 'foo'
    }
    runTest(invalidRequest, false)
  })

  it('should not validate a request with an invalid sort', () => {
    const invalidRequest = {
      ...validRequest,
      sort: 'foo'
    }
    runTest(invalidRequest, false)
  })

  it('should not validate a request with an invalid meta page', () => {
    const invalidRequest = {
      ...validRequest,
      meta: { page: 0, limit: 10 }
    }
    runTest(invalidRequest, false)
  })
})
