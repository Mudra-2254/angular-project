import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NgForOf, NgIf, DatePipe } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [NgForOf, NgIf, DatePipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  loading = true;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      this.loading = false;
    });
  }
}
