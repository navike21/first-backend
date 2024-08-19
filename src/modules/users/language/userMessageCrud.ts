import { DE, EN, ES, FR, IT, JP, KO, PT } from '../../../common'
import {
  userCrudDe,
  userCrudEn,
  userCrudEs,
  userCrudFr,
  userCrudIt,
  userCrudJp,
  userCrudKo,
  userCrudPt
} from './userCrud'

export const userMessageCrud = {
  [DE]: userCrudDe,
  [EN]: userCrudEn,
  [ES]: userCrudEs,
  [FR]: userCrudFr,
  [IT]: userCrudIt,
  [JP]: userCrudJp,
  [KO]: userCrudKo,
  [PT]: userCrudPt
}
