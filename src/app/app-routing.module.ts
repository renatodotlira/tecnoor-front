import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent } from './appointments/appointments.component';
import { EmployeeComponent } from './employee/employee.component';
import { AppointmentsMonthComponent } from './appointments-month/appointments-month.component';
import { LoginComponent } from './auth/login.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: 'month', component: AppointmentsMonthComponent },
  { path: 'login', component: LoginComponent },
  { path: 'employee', component: EmployeeComponent },
  { path: '', component: AppointmentsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}