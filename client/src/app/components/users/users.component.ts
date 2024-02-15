import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
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
  filterValue!: string;
  page = 1;
  size = 10;

  constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.initData();
  }

  _getUsers(page: number, size: number, username: string | undefined) {
    this.userService
      .findAll(page, size, username)
      .pipe(
        map(
          (paginationData: PaginationData) =>
            (this.dataSource = paginationData),
        ),
      )
      .subscribe();
  }

  initData() {
    this._getUsers(this.page, this.size, this.filterValue);
  }

  onPaginateChange(event: PageEvent) {
    this.page = event.pageIndex;
    this.size = event.pageSize;

    this.page = this.page + 1;

    this._getUsers(this.page, this.size, this.filterValue);
  }

  findByName(filterValue: string) {
    this.filterValue = filterValue;

    this._getUsers(this.page, this.size, this.filterValue);
  }

  navigateToUserProfile(id: string) {
    this.router.navigate(['./', id], { relativeTo: this.activatedRoute});
  }
}
