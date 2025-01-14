import { Component, OnInit, Renderer2 } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import brLocale from '@fullcalendar/core/locales/pt-br';
import { AppointmentMonthService } from './appointments-month.service';
import { Router } from '@angular/router';
import interactionPlugin from '@fullcalendar/interaction'; // Import necessário para interações

@Component({
  selector: 'app-appointments-month',
  templateUrl: './appointments-month.component.html',
  styleUrl: './appointments-month.component.css'
})
export class AppointmentsMonthComponent implements OnInit {
  events: any[] = [];
  month!: number;
  constructor(private appointmentMonthService: AppointmentMonthService, private renderer: Renderer2, private router: Router) { }
  calendarOptions: CalendarOptions = {};
  isLoaded: boolean = false;

  ngOnInit() {
    console.log("init..");
    this.month = new Date().getMonth();
    this.getAppointments();
  }

  getAppointments() {
    this.events = [];
    this.appointmentMonthService.getAppointmentsByMonth(this.month).subscribe(
      data => {
        this.isLoaded = true;
        data.forEach(app => {
          app.appointmentsDay.forEach(data => {
            this.events.push({
              title: data.employeeName,
              extendedProps: {
                count: data.numberOfAppointments,
              },
              start: app.day
            })
          })
        });

        this.calendarOptions = {
          initialView: 'dayGridMonth',
          plugins: [dayGridPlugin, interactionPlugin],
          locale: brLocale,
          schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
          headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'customTodayButton'
          },
          customButtons: {
            customTodayButton: {
              text: 'Hoje',
              click: () => {
                this.router.navigate(['/']);
              }
            },
            customLeft: {
              text: ' < ',
              click: this.handlePrev.bind(this)  
            },
            customRight: {
              text: ' > ',
              click: this.handleNext.bind(this)
            }
          },
          events: this.events,
          dateClick: (info) => {
            const selectedDate = info.dateStr;
            this.router.navigate(['/'], {
              state: { day: selectedDate }
            });
          }
        };
      },
      error => {
        console.error('Erro ao buscar agendamentos', error);
      }
    );
  }

  handlePrev() {
    /*this.selectedDay = this.previousDay;
    this.updatePreviousAndNextDays();
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate(this.selectedDay);
    this.getAppointments();*/
  }

  handleNext() {
    /*this.selectedDay = this.nextDay;
    this.updatePreviousAndNextDays();
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate(this.selectedDay);
    this.getAppointments();*/
  }
  
}