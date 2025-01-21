import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = USER_URL;
  loginForm: FormGroup;

  constructor(private router: Router, private http: HttpClient, private fb: FormBuilder,) { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  registerUserAccount(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: '*/*',
    });

    const body = {
      userName: email,
      password: password,
    };

    return this.http.post<void>(this.apiUrl + "/register", body, { headers }).pipe(
      tap((response) => {
        console.log("Sucesso ao registrar!");
      }));
  }
}
