// src/app/appointment.ts

import { Employee } from "./employee";
import Service from "./service";
import { User } from "./user";

export class Appointment {
    id: number;
    employee: Employee;
    user: User;
    time_display: string;
    time_end_display: string;
    start: Date;
    end: Date;
    services: Service[];
    resourceId: string;

    constructor(
        id: number,
        employee: Employee,
        user: User,
        time_display: string,
        time_end_display: string,
        start: Date,
        end: Date,
        services: Service[],
        resourceId: string
    ) {
        this.id = id;
        this.employee = employee;
        this.user = user;
        this.time_display = time_display;
        this.time_end_display = time_end_display;
        this.start = start;
        this.end = end;
        this.services = services;
        this.resourceId = resourceId;
    }
}