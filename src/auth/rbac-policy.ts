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
  .read('concours')
  .updateOwn('candidateur')
  .grant(AppRoles.MANAGER)
  .extend(AppRoles.USER)
  .update(['concours', 'specialties', 'grade', 'candidateurs'])
  .read(['concours', 'specialties', 'grades', 'candidateurs', 'users'])
  .delete(['concours', 'specialities', 'grade'])
  .deny(AppRoles.MANAGER)
  .createOwn('candidateurs')
  .grant(AppRoles.ADMIN)
  .extend(AppRoles.MANAGER)
  .create('candidateurs')
  .update('users')
  .delete(['users', 'candidateurs']);
