// src/app/appointment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from './employee';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {

    private apiUrl = EMPLOYEE_URL;

    constructor(private http: HttpClient) { }

    getEmployeesByBusiness(id: number | string): Observable<Employee[]> {
        return this.http.get<Employee[]>(`${this.apiUrl}/business/${id}`);
      }
}
