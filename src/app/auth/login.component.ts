import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;
  typeAlert: string = 'success';
  successMessage: string = 'Conta criada com sucesso! Para acessar sua conta, efetue o login.';
  showAlert: boolean = false;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    const entries = performance.getEntriesByType('navigation');
    const navigationEntry = entries[0] as PerformanceNavigationTiming;
    if (navigationEntry?.type === 'reload') {
    } else {
      this.route.paramMap.subscribe(params => {
        console.log("dentro dos params");
        if( params.get('action') === "newUser") {
          this.showAlert = true;
          this.hideAlertAfterDelay();
        }
      });
    }
  }

  hideAlertAfterDelay() {
    setTimeout(() => {
      this.showAlert = false;
    }, 4000);
  }

  togglePassword() {
    const password = document.querySelector('#password');
    this.showPassword = !this.showPassword;
    if (password) {
      const type = password
        .getAttribute('type') === 'password' ?
        'text' : 'password';
      password.setAttribute('type', type);
    }
    console.log("click");
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error on login', err);
        }
      });

    }
  }
}
