import { userAuthMessages } from '../userAuthMessages'
import { DE, EN, ES, FR, IT, JP, KO, PT, RU, ZH } from '../../../../common'
import {
  authMessagesDe,
  authMessagesEn,
  authMessagesEs,
  authMessagesFr,
  authMessagesIt,
  authMessagesJp,
  authMessagesKo,
  authMessagesPt,
  authMessagesRu,
  authMessagesZh
} from '../authMessages'

describe('userAuthMessages', () => {
  it('should have correct messages for DE', () => {
    expect(userAuthMessages[DE]).toBe(authMessagesDe)
  })

  it('should have correct messages for EN', () => {
    expect(userAuthMessages[EN]).toBe(authMessagesEn)
  })

  it('should have correct messages for ES', () => {
    expect(userAuthMessages[ES]).toBe(authMessagesEs)
  })

  it('should have correct messages for FR', () => {
    expect(userAuthMessages[FR]).toBe(authMessagesFr)
  })

  it('should have correct messages for IT', () => {
    expect(userAuthMessages[IT]).toBe(authMessagesIt)
  })

  it('should have correct messages for JP', () => {
    expect(userAuthMessages[JP]).toBe(authMessagesJp)
  })

  it('should have correct messages for KO', () => {
    expect(userAuthMessages[KO]).toBe(authMessagesKo)
  })

  it('should have correct messages for PT', () => {
    expect(userAuthMessages[PT]).toBe(authMessagesPt)
  })

  it('should have correct messages for RU', () => {
    expect(userAuthMessages[RU]).toBe(authMessagesRu)
  })

  it('should have correct messages for ZH', () => {
    expect(userAuthMessages[ZH]).toBe(authMessagesZh)
  })
})
