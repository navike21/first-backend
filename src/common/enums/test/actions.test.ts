import { EActions } from '../actions'

describe('EActions Enum', () => {
  it('should have a CREATE action', () => {
    expect(EActions.CREATE).toBe('CREATE')
  })

  it('should have a READ action', () => {
    expect(EActions.READ).toBe('READ')
  })

  it('should have an UPDATE action', () => {
    expect(EActions.UPDATE).toBe('UPDATE')
  })

  it('should have a DELETE action', () => {
    expect(EActions.DELETE).toBe('DELETE')
  })

  it('should have a RESTORE action', () => {
    expect(EActions.RESTORE).toBe('RESTORE')
  })

  it('should have a DELETE_PERMANENTLY action', () => {
    expect(EActions.DELETE_PERMANENTLY).toBe('DELETE_PERMANENTLY')
  })

  it('CREATE action should not be empty', () => {
    expect(EActions.CREATE).not.toBe('')
  })

  it('READ action should not be empty', () => {
    expect(EActions.READ).not.toBe('')
  })

  it('UPDATE action should not be empty', () => {
    expect(EActions.UPDATE).not.toBe('')
  })

  it('DELETE action should not be empty', () => {
    expect(EActions.DELETE).not.toBe('')
  })

  it('RESTORE action should not be empty', () => {
    expect(EActions.RESTORE).not.toBe('')
  })

  it('DELETE_PERMANENTLY action should not be empty', () => {
    expect(EActions.DELETE_PERMANENTLY).not.toBe('')
  })
})
