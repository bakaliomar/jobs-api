import { RolesBuilder } from 'nest-access-control';

export const RBAC_POLICY: RolesBuilder = new RolesBuilder();

export enum AppRoles {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

RBAC_POLICY.grant(AppRoles.USER)
  .readOwn('candidateurs')
  .createOwn('candidateurs')
  .updateOwn('candidateur')
  .grant(AppRoles.MANAGER)
  .extend(AppRoles.USER)
  .create(['concours', 'specialities'])
  .update(['concours', 'specialities', 'candidateurs'])
  .read(['concours', 'specialities', 'candidateurs', 'users'])
  .delete(['concours', 'specialities'])
  .deny(AppRoles.MANAGER)
  .createOwn('candidateurs')
  .grant(AppRoles.ADMIN)
  .extend(AppRoles.MANAGER)
  .create('candidateurs')
  .update('users')
  .delete(['users', 'candidateurs']);
