// src/app/appointment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Appointment } from './appointment';
import { AppointmentsByDay } from './appointment-month.model';

@Injectable({
    providedIn: 'root'
})
export class AppointmentMonthService {

    private apiUrl = APPOINTMENT_URL;

    constructor(private http: HttpClient) { }

    getAppointments(): Observable<Appointment[]> {
        return this.http.get<any>(this.apiUrl);
    }

    deleteAppointment(id: number | string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    rescheduleAppointment(id: number | string, newDateTime: string): Observable<any> {
        const url = `${this.apiUrl}/${id}/reschedule`;
        return this.http.put(url, { newDateTime });
    }

    getAppointmentsByMonth(): Observable<AppointmentsByDay[]> {
        console.log("api url: " + this.apiUrl);
        const url = `${this.apiUrl}/month`;
        return this.http.get<AppointmentsByDay[]>(url);
      }

}
