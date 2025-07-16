import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { UserlistComponent } from './pages/userlist/userlist.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LayoutComponent } from './common-ui/layout/layout.component';
import { canActivateAuth } from './auth/access.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: UserlistComponent },
      { path: 'profile', component: ProfileComponent },
    ],
    canActivate: [canActivateAuth],
  },
  { path: 'login', component: LoginComponent },
];
