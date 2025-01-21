import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent } from './appointments/appointments.component';
import { EmployeeComponent } from './employee/employee.component';
import { AppointmentsMonthComponent } from './appointments-month/appointments-month.component';
import { LoginComponent } from './auth/login.component';
import { InvoiceComponent } from './invoice/invoice.component'
import { AuthGuard } from './auth/auth.guard';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'month', component: AppointmentsMonthComponent, canActivate: [ AuthGuard ]},
  { path: 'login', component: LoginComponent, canActivate: [ AuthGuard ] },
  { path: 'login/:action', component: LoginComponent, canActivate: [ AuthGuard ] },
  { path: 'employee', component: EmployeeComponent, canActivate: [ AuthGuard ]},
  { path: 'invoice', component: InvoiceComponent, canActivate: [ AuthGuard ]},
  { path: 'register', component: RegisterComponent, canActivate: [ AuthGuard ]},
  { path: 'register/:action', component: RegisterComponent, canActivate: [ AuthGuard ]},
  { path: '', component: AppointmentsComponent, canActivate: [ AuthGuard ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}