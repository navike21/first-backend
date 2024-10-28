import { IMessages, IValidationSchema } from '../../../common'

interface IMessagesUserAuth extends IMessages {
  validation: IValidationSchema
}

export type TUserAuthMessage = {
  confirmPassword?: IMessagesUserAuth
  password: IMessagesUserAuth
}
