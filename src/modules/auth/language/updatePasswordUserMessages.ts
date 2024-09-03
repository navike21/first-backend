import { DE, EN, ES, FR, IT, JP, KO, PT } from '../../../common'
import {
  updatePasswordMessagesEs,
  updatePasswordMessagesDe,
  updatePasswordMessagesEn,
  updatePasswordMessagesFr,
  updatePasswordMessagesIt,
  updatePasswordMessagesJp,
  updatePasswordMessagesKo,
  updatePasswordMessagesPt
} from './updatePasswordMessages'

export const updatePasswordUserMessages = {
  [DE]: updatePasswordMessagesDe,
  [EN]: updatePasswordMessagesEn,
  [ES]: updatePasswordMessagesEs,
  [FR]: updatePasswordMessagesFr,
  [IT]: updatePasswordMessagesIt,
  [JP]: updatePasswordMessagesJp,
  [KO]: updatePasswordMessagesKo,
  [PT]: updatePasswordMessagesPt
}
