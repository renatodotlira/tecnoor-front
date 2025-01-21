import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

  constructor(private authService: AuthService) { }

  isLoggedIn!: boolean;

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.loggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

}
