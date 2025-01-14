// src/app/appointment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Appointment } from './appointment';

@Injectable({
    providedIn: 'root'
})
export class AppointmentService {

    private apiUrl = APPOINTMENT_URL;

    constructor(private http: HttpClient) { }

    getAppointments(): Observable<Appointment[]> {
        return this.http.get<any>(this.apiUrl);
    }

    getAppointmentsByDate(date: string): Observable<Appointment[]> {
        return this.http.get<Appointment[]>(`${this.apiUrl}/date`, { params: { date } });
      }

    deleteAppointment(id: number | string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    rescheduleAppointment(id: number | string, employeeId: string, newDateTime: string): Observable<any> {
        const url = `${this.apiUrl}/${id}/reschedule`;
        return this.http.put(url, { newDateTime, employeeId });
    }

    bookAppointment(employeeId: string, dateTimeStart: string, dateTimeEnd: string): Observable<any> {
        const url = `${this.apiUrl}/book`;
        return this.http.post(url, { employeeId, dateTimeStart, dateTimeEnd });
    }

}
