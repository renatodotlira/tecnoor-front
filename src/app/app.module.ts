import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { AppointmentsMonthComponent } from './appointments-month/appointments-month.component';
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { LoginComponent } from './auth/login.component';
import { MenuComponent } from "./menu/menu.component";
import { EmployeeComponent } from './employee/employee.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    AppointmentsComponent,
    EmployeeComponent,
    AppointmentsMonthComponent,
    AlertMessageComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FullCalendarModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MenuComponent
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
