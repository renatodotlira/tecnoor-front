import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from './register.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword: boolean = false;
  registering: boolean = true;
  waitingConfirmation: boolean = false;
  confirmed: boolean = false;
  email: string = "";

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private registerService: RegisterService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if( params.get('action') === "confirmIdentity") {
        this.route.queryParamMap.subscribe(params => {
          this.registering = false;
          this.confirmed = true;
          if (params.get('email')) {
            console.log(params.get('email'));
            console.log(params.get('token'));
          }
          
        });
      }
    });
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
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;

      this.registerService.registerUserAccount(email, password).subscribe({
        next: () => {
          this.registering = false;
          this.waitingConfirmation = true;
          this.email = email;
        },
        error: (err: any) => {
          console.error('Error on login', err);
        }
      });
    }
  }
/*
  onSubmit() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;

      this.registerService.registerUserAccount(email, password).subscribe({
        next: () => {
          this.router.navigate(['/login', 'newUser']);
        },
        error: (err: any) => {
          console.error('Error on login', err);
        }
      });
    }
  }
  */
}
