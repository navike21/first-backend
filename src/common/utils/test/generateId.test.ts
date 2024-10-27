import { generateId } from '../generateId'
import { v7 as uuid } from 'uuid'

jest.mock('uuid', () => ({
  v7: jest.fn()
}))

describe('generateId', () => {
  it('should generate a unique id', () => {
    const mockUuid = '123e4567-e89b-12d3-a456-426614174000'
    ;(uuid as jest.Mock).mockReturnValue(mockUuid)

    const id = generateId()

    expect(id).toBe(mockUuid)
    expect(uuid).toHaveBeenCalledTimes(1)
  })
})
