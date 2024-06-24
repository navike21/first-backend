import { APP, E_COMMERCE, EMAIL, UX_UI, WEB } from 'src/constants';

export type TTechnology =
  | typeof WEB
  | typeof APP
  | typeof UX_UI
  | typeof EMAIL
  | typeof E_COMMERCE;
