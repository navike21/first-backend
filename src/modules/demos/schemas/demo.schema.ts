import joi from 'joi'
import { EN, TLanguage } from '../../../common'

export const DemoSchema = (lang: TLanguage = EN) => {
  return joi.object({})
}
