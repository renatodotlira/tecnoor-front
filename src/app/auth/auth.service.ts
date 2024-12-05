import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthResponse } from './authResponse';
import { environment } from '../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.authApiUrl;

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: '*/*',
    });

    const body = {
      email: email,
      password: password,
    };

    return this.http.post<AuthResponse>(this.apiUrl, body, { headers }).pipe(
      tap((response) => {
        console.log("Sucesso no login!");
        localStorage.setItem('token', response.token);
      }));
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

}
