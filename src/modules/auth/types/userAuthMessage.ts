import { IMessages, IValidationSchema } from '../../../common'

interface IMessagesUserAuth extends IMessages {
  validation: IValidationSchema
}

interface ISession {
  token: IValidationSchema
  validation: IMessages
}

interface ILoginMessages extends IMessages {
  email: IValidationSchema
  password: IValidationSchema
}

export type TUserAuthMessage = {
  confirmPassword?: IMessagesUserAuth
  password: IMessagesUserAuth
  login: ILoginMessages
  session: ISession
}
