import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  allowedRoutes: string[] = ['login', 'register', 'login/:action', 'register/:action'];

  canActivate(route: ActivatedRouteSnapshot): boolean {
    var currentRoute = route.routeConfig?.path;
    if (!currentRoute) {
      currentRoute = "";
    }
    if (this.authService.isLoggedIn()) {
      console.log("logado");
      if (this.allowedRoutes.includes(currentRoute)) {
        this.router.navigate(['']);
        return false;
      }
      return true;
    } else {
      console.log("não logado");
      if (!this.allowedRoutes.includes(currentRoute)) {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }
  }
}