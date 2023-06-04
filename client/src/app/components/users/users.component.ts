import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { PaginationData } from '../../../../../src/types/types.exporter';
import { UserService } from '../../services/user-service/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  dataSource: PaginationData | null = null;
  displayedColumns: string[] = ['id', 'name', 'username', 'email', 'role'];
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.userService
      .findAll(1, 10)
      .pipe(
        tap((data) => console.log(data)),
        map(
          (paginationData: PaginationData) =>
            (this.dataSource = paginationData),
        ),
      )
      .subscribe();
  }
}
