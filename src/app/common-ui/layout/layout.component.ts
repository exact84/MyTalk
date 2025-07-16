import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ProfileService } from '../../data/services/profile.service';
import { AuthService } from '../../auth/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarComponent, AsyncPipe],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  profileService: ProfileService = inject(ProfileService);
  authService = inject(AuthService);
  username$ = this.authService.getUsername$();

  ngOnInit() {
    // при инициализации компонента
    console.log('ngOnInit:');
    this.profileService.getMe().subscribe((data) => {
      console.log(data);
      this.authService.setUsername(data.username);
    });
  }
}
