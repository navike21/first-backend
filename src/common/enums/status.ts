/**
 * @description Enum representing the different statuses an operation can have.
 */
export enum EOperationStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING'
}

/**
 * @description Enum representing the different statuses a user can have.
 */
export enum EUserStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  AWAY = 'AWAY',
  BUSY = 'BUSY',
  INVISIBLE = 'INVISIBLE',
  BLOCKED = 'BLOCKED'
}

/**
 * @description Enum representing the different statuses a collection can have.
 */
export enum ECollectionState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED'
}
