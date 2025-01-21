import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthResponse } from './authResponse';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  loggedIn$ = this.loggedIn.asObservable();

  private apiUrl = USER_URL;

  constructor(private router: Router, private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: '*/*',
    });

    const body = {
      userName: email,
      password: password,
    };

    return this.http.post<AuthResponse>(this.apiUrl + "/login", body, { headers }).pipe(
      tap((response) => {
        console.log("Sucesso no login!");
        localStorage.setItem('token', response.token);
        this.loggedIn.next(true);
      }));
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

}
