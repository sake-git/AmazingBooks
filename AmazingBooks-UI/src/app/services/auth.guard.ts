import { CanActivateFn, Router } from '@angular/router';
import { UserApiService } from './user-api.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  let userApi = inject(UserApiService);
  let router = inject(Router);

  let user = userApi.GetUserIdFromLocal();
  if (user) {
    return true;
  }
  router.navigateByUrl('login');
  return false;
};
