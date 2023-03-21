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
  .read('jobs')
  .updateOwn('candidateur')
  .grant(AppRoles.MANAGER)
  .extend(AppRoles.USER)
  .update(['jobs', 'specialties', 'concours', 'candidateurs'])
  .read(['jobs', 'specialties', 'concours', 'candidateurs', 'users'])
  .delete(['jobs', 'specialities', 'concours'])
  .deny(AppRoles.MANAGER)
  .createOwn('candidateurs')
  .grant(AppRoles.ADMIN)
  .extend(AppRoles.MANAGER)
  .create('candidateurs')
  .update('users')
  .delete(['users', 'candidateurs']);
