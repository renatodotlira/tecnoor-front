export interface AppointmentDay {
    employeeId: number;
    employeeName: string;
    numberOfAppointments: number;
  }
  
  export interface AppointmentsByDay {
    day: string;
    appointmentsDay: AppointmentDay[];
  }
  