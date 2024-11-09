import { generateId } from '../generateId'
import { v7 as uuid } from 'uuid'

jest.mock('uuid')

describe('generateId function', () => {
  it('should generate a valid UUID', () => {
    const mockUuid = 'mocked-uuid'
    ;(uuid as jest.Mock).mockReturnValue(mockUuid)

    const id = generateId()
    expect(id).toBe(mockUuid)
    expect(uuid).toHaveBeenCalled()
  })
})
