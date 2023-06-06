import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
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
  pageEvent!: PageEvent;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.initData();
  }

  _getUsers(page: number, size: number) {
    this.userService
      .findAll(page, size)
      .pipe(
        map(
          (paginationData: PaginationData) =>
            (this.dataSource = paginationData),
        ),
      )
      .subscribe();
  }

  initData() {
    this._getUsers(1, 10);
  }

  onPaginateChange(event: PageEvent) {
    console.log(event);
    let page = event.pageIndex;
    const size = event.pageSize;

    page = page + 1;
    this._getUsers(page, size);
  }
}
