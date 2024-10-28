import { DE, EN, ES, FR, IT, JP, KO, PT, RU, ZH } from '../constants'
import {
  requestMessageSchemaDe,
  requestMessageSchemaEn,
  requestMessageSchemaEs,
  requestMessageSchemaFr,
  requestMessageSchemaIt,
  requestMessageSchemaJp,
  requestMessageSchemaKo,
  requestMessageSchemaPt,
  requestMessageSchemaRu,
  requestMessageSchemaZh
} from './requestMessageSchema'

export const requestMessageSchema = {
  [DE]: requestMessageSchemaDe,
  [EN]: requestMessageSchemaEn,
  [ES]: requestMessageSchemaEs,
  [FR]: requestMessageSchemaFr,
  [IT]: requestMessageSchemaIt,
  [JP]: requestMessageSchemaJp,
  [KO]: requestMessageSchemaKo,
  [PT]: requestMessageSchemaPt,
  [RU]: requestMessageSchemaRu,
  [ZH]: requestMessageSchemaZh
}
