import { Component, inject } from '@angular/core';
import { ProfileCardComponent } from '../../common-ui/profile-card/profile-card.component';
import { ProfileService } from '../../data/services/profile.service';
import { Profile } from '../../data/interfaces/profile.interface';

@Component({
  selector: 'app-userlist',
  imports: [ProfileCardComponent],
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.scss',
})
export class UserlistComponent {
  profileService: ProfileService = inject(ProfileService);
  profiles: Profile[] = [];

  constructor() {
    this.profileService.getTestaccounts().subscribe((data) => {
      this.profiles = data;
    });
  }
}
