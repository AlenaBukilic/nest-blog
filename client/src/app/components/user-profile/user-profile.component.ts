import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { User } from 'src/app/models/users.model';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {

    private sub: Subscription = new Subscription();
    userId: string = '';
    user: User | null = null;

    constructor(private route: ActivatedRoute, private userService: UserService) {
    }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe((params) => {
            this.userId = params['id'];
            this.userService.findOne(this.userId).pipe(
                map((user) => this.user = user)
            ).subscribe();
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
