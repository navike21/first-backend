import { EThemeBrowser } from '../themeBrowser'

describe('EThemeBrowser Enum', () => {
  it('should have a DARK value', () => {
    expect(EThemeBrowser.DARK).toBe('DARK')
  })

  it('should have a LIGHT value', () => {
    expect(EThemeBrowser.LIGHT).toBe('LIGHT')
  })

  it('should have an AUTO value', () => {
    expect(EThemeBrowser.AUTO).toBe('AUTO')
  })

  it('should have exactly three values', () => {
    const enumValues = Object.values(EThemeBrowser)
    expect(enumValues).toHaveLength(3)
    expect(enumValues).toContain('DARK')
    expect(enumValues).toContain('LIGHT')
    expect(enumValues).toContain('AUTO')
  })

  it('should not have any other values', () => {
    const enumValues = Object.values(EThemeBrowser)
    expect(enumValues).toEqual(['DARK', 'LIGHT', 'AUTO'])
  })
})
