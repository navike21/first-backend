import { EOperationStatus, EUserStatus, ECollectionState } from '../status'

describe('EOperationStatus Enum', () => {
  it('should have a SUCCESS status', () => {
    expect(EOperationStatus.SUCCESS).toBe('SUCCESS')
  })

  it('should have an ERROR status', () => {
    expect(EOperationStatus.ERROR).toBe('ERROR')
  })

  it('should have a WARNING status', () => {
    expect(EOperationStatus.WARNING).toBe('WARNING')
  })
})

describe('EUserStatus Enum', () => {
  it('should have an ONLINE status', () => {
    expect(EUserStatus.ONLINE).toBe('ONLINE')
  })

  it('should have an OFFLINE status', () => {
    expect(EUserStatus.OFFLINE).toBe('OFFLINE')
  })

  it('should have an AWAY status', () => {
    expect(EUserStatus.AWAY).toBe('AWAY')
  })

  it('should have a BUSY status', () => {
    expect(EUserStatus.BUSY).toBe('BUSY')
  })

  it('should have an INVISIBLE status', () => {
    expect(EUserStatus.INVISIBLE).toBe('INVISIBLE')
  })

  it('should have a BLOCKED status', () => {
    expect(EUserStatus.BLOCKED).toBe('BLOCKED')
  })
})

describe('ECollectionState Enum', () => {
  it('should have an ACTIVE state', () => {
    expect(ECollectionState.ACTIVE).toBe('ACTIVE')
  })

  it('should have a DELETED state', () => {
    expect(ECollectionState.DELETED).toBe('DELETED')
  })

  it('should have a BLOCKED state', () => {
    expect(ECollectionState.BLOCKED).toBe('BLOCKED')
  })
})
