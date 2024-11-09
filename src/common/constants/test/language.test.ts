import {
  DE,
  DEFAULT_LANGUAGE,
  EN,
  ES,
  FR,
  IT,
  JP,
  KO,
  PT,
  RU,
  ZH
} from '../language'

describe('Language Constants', () => {
  it('Los idiomas deberían estar definidos correctamente', () => {
    expect(DE).toBe('de')
    expect(EN).toBe('en')
    expect(ES).toBe('es')
    expect(FR).toBe('fr')
    expect(IT).toBe('it')
    expect(JP).toBe('jp')
    expect(KO).toBe('ko')
    expect(PT).toBe('pt')
    expect(RU).toBe('ru')
    expect(ZH).toBe('zh')
  })

  it('DEFAULT_LANGUAGE debería estar definido como EN', () => {
    expect(DEFAULT_LANGUAGE).toBe(EN)
  })
})
