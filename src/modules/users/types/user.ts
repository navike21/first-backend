export interface IUser {
  documentId: string
  email: string
  fatherLastName: string
  image: string
  motherLastName: string
  name: string
  password: string
  phone: string
  dateOfBirth: Date | string
  role?: string[]
}
