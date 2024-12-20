import { encryptData, decryptData } from '../encryptAndDecryptData'

describe('encryptAndDecryptData with random IV', () => {
  const testData = 'Hello, World!'

  it('should encrypt data correctly', () => {
    const encryptedData = encryptData(testData)
    expect(encryptedData).not.toBe(testData)
    expect(encryptedData).toContain(':')
  })

  it('should decrypt data correctly', () => {
    const encryptedData = encryptData(testData)
    const decryptedData = decryptData(encryptedData)
    expect(decryptedData).toBe(testData)
  })

  it('should produce different encrypted values for the same input', () => {
    const encryptedData1 = encryptData(testData)
    const encryptedData2 = encryptData(testData)
    expect(encryptedData1).not.toBe(encryptedData2)
  })

  it('should throw an error if decryption fails', () => {
    const invalidData = 'invalid:data'
    expect(() => decryptData(invalidData)).toThrow()
  })
})
