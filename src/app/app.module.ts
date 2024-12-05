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

@NgModule({
  declarations: [
    AppComponent,
    AppointmentsComponent,
    AppointmentsMonthComponent,
    AlertMessageComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FullCalendarModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
