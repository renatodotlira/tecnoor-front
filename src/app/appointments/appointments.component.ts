import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular'; // Certifique-se de importar corretamente
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import brLocale from '@fullcalendar/core/locales/pt-br';
import { AppointmentService } from './appointments.service';
import { EmployeeService } from '../employee/employee.service';
import { Modal } from 'bootstrap';
import { Router } from '@angular/router';
import { Employee } from '../employee/employee';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {
  @ViewChild('rescheduleModal', { static: true }) rescheduleModal!: ElementRef;
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent; // ViewChild para acessar o calendário diretamente
  events: any[] = [];
  eventsMonth: any[] = [];
  constructor(
    private appointmentService: AppointmentService,
    private employeeService: EmployeeService,
    private router: Router
  ) { }
  calendarOptions: CalendarOptions = {};
  isLoaded: boolean = false;
  showModal: boolean = false;
  successMessage: string = '';
  showAlert: boolean = false;
  public appointmentDetail!: AppointmentDetail;
  rescheduleError: string | null = null;
  newDate: string = '';
  newTime: string = '';

  dateTimeStart!: Date;
  dateTimeEnd!: Date;
  bookTimeStart: string = '';
  bookTimeEnd: string = '';
  employeeId!: number;

  modalInstance: any;
  resources: any;
  showMonth: boolean = false;
  selectedDay!: string;
  previousDay!: string;
  nextDay!: string;
  typeAlert: string = 'success';

  async ngOnInit() {
    const navigationState = this.router.getCurrentNavigation()?.extras?.state;

    if (navigationState && navigationState['day']) {
      this.selectedDay = navigationState['day'];
    } else {
      const state = history.state;
      if (state && state.day) {
        this.selectedDay = state.day;
      }
    }

    if (!this.selectedDay) {
      this.selectedDay = "";
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      this.selectedDay = currentDate.toISOString().split('T')[0];
    }

    this.appointmentDetail = new AppointmentDetail();
    const employees = await this.getEmployees();
    this.resources = employees;
    this.getAppointments();
  }

  appointmentCancel(id: number | string) {
    this.appointmentService.deleteAppointment(id).subscribe(
      () => {
        console.log(`Agendamento com ID ${id} cancelado com sucesso.`);
        this.successMessage = 'Agendamento cancelado com sucesso!';
        this.showAlert = true;
        this.getAppointments();
        this.hideAlertAfterDelay();
      },
      (error) => {
        console.error('Erro ao cancelar o agendamento:', error);
      }
    );
  }

  openRescheduleModal() {
    const currentDateTime = new Date(this.appointmentDetail.start);
    this.newDate = currentDateTime.toISOString().split('T')[0];
    this.newTime = currentDateTime.toTimeString().split(' ')[0].slice(0, 5);
  }

  rescheduleAppointment() {
    const newDate = (document.getElementById('newDate') as HTMLInputElement).value;
    const newTime = (document.getElementById('newTime') as HTMLInputElement).value;

    if (newDate && newTime) {
      const newDateTime = `${newDate}T${newTime}`;
      this.appointmentService.rescheduleAppointment(this.appointmentDetail.id, this.appointmentDetail.employeeId.toString(), newDateTime).subscribe(
        () => {
          this.getAppointments();
          this.successMessage = 'Reagendado com sucesso!';
          this.showAlert = true;
          this.getAppointments();
          this.hideAlertAfterDelay();
          hideModal("rescheduleModal");
          this.rescheduleError = null;
          this.typeAlert = 'success';
        },
        (error) => {
          console.error('Erro ao reagendar:', error);
          if (error.status === 400 && error.error?.code === '01') {
            this.rescheduleError = error.error.message;  // Exibe a mensagem de erro vinda do backend
          } else {
            // Tratar erros inesperados
            this.rescheduleError = 'Ocorreu um erro ao tentar reagendar. Tente novamente mais tarde.';
          }
        }
      );
    } else {
      alert('Por favor, selecione a nova data e hora.');
    }
  }

  hideAlertAfterDelay() {
    setTimeout(() => {
      this.showAlert = false;
    }, 4000);
  }

  getAppointments() {
    this.events = [];
    const { previousDay, nextDay } = getPreviousAndNextDay(this.selectedDay);
    this.previousDay = previousDay;
    this.nextDay = nextDay;
    console.log("ontem: " + previousDay);
    console.log("hoje: " + this.selectedDay);
    console.log("amanhã: " + nextDay);

    this.appointmentService.getAppointmentsByDate(this.selectedDay).subscribe(
      data => {
        this.isLoaded = true;
        console.log(data);
        console.log(this.events);
        this.events = [];
        data.forEach(app => {
          this.events.push({
            title: app.employee.name,
            resourceId: app.employee.id,
            backgroundColor: app.user ? '#2da85b': '#969696',
            borderColor: app.user ? '#2da85b': '#969696',
            extendedProps: {
              id: app.id,
              client: app.user ? app.user.name : "",
              day: formatDateTimeToDay(app.start),
              time: app.time_display,
              timeEnd: app.time_end_display,
              service: app.services[0] ? app.services[0].name : "",
              ammount: app.services[0] ? app.services[0].price : "",
              duration: app.services[0] ? formatTimeDuration(app.services[0].duration) : "",
              employee: app.employee.name,
              employeeId: app.employee.id,
              start: app.start
            },
            end: app.end,
            start: app.start
          })
        });

        this.calendarOptions = {
          initialView: 'resourceTimeGridDay',
          plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, resourceTimeGridPlugin, timeGridPlugin],
          locale: brLocale,
          initialDate: this.selectedDay,
          schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
          headerToolbar: {
            left: 'customLeft customRight',
            center: 'title',
            right: 'customMonthButton'
          },
          customButtons: {
            customMonthButton: {
              text: 'Mês',
              click: () => {
                this.router.navigate(['/month']);
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
          allDaySlot: false,
          height: 800,
          slotMinTime: '08:00:00',
          slotMaxTime: '19:00:00',
          views: {
            resourceTimeGridDay: {
              buttonText: 'Hoje',
              eventResourceEditable: true,
              slotDuration: '00:15'
            }
          },
          slotLabelFormat: { // Configura para exibir horas com minutos
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // Define formato de 24 horas (pode ser removido para 12 horas)
          },
          businessHours: [
            {
              daysOfWeek: [1, 2, 3, 4, 5],
              startTime: '08:00',
              endTime: '19:00'
            },
            {
              daysOfWeek: [6], // Sturday
              startTime: '10:00',
              endTime: '16:00'
            }
          ],
          editable: true, // Permite arrastar e redimensionar eventos
          eventStartEditable: true, // Permite mover o evento para um horário diferente
          eventDurationEditable: true, // Permite alterar a duração do evento
          eventResizableFromStart: true,
          eventDrop: this.handleEventDrop.bind(this),
          eventResize: this.handleEventResize.bind(this),
          dateClick: this.handleDateClick.bind(this),
          eventClick: (info) => {
            const props = info.event.extendedProps;
            this.showModal = true;
            this.appointmentDetail.id = props['id']
            this.appointmentDetail.client = props['client'];
            this.appointmentDetail.day = props['day'];
            this.appointmentDetail.hour = props['time'];
            this.appointmentDetail.service = props['service'];
            this.appointmentDetail.ammount = formatToReal(props['ammount']);
            this.appointmentDetail.duration = props['duration'];
            this.appointmentDetail.employee = props['employee'];
            this.appointmentDetail.start = props['start'];
            this.appointmentDetail.employeeId = props['employeeId'];
            showModal("appointmentDetail");
          },
          resources: this.resources,
          events: this.events
        };
      },
      error => {
        console.error('Erro ao buscar agendamentos', error);
      }
    );
  }

  async getEmployees() {
    const businessId = 1;
    const data: Employee[] = await firstValueFrom(this.employeeService.getEmployeesByBusiness(businessId));
    return data.map(employee => ({
      ...employee,
      "title": employee.name
    }));

  }

  handleEventDrop(info: any) {
    const employeeId = info.event._def.resourceIds[0];
    const event = info.event.extendedProps;
    this.appointmentService.rescheduleAppointment(event.id, employeeId, info.event.start).subscribe(
      () => {
        this.getAppointments();
        this.successMessage = 'Reagendado com sucesso!';
        this.showAlert = true;
        this.getAppointments();
        this.hideAlertAfterDelay();
        this.rescheduleError = null;
        this.typeAlert = 'success'
      },
      (error) => {
        if (error.status === 400 && error.error?.code === '01') {
          this.rescheduleError = error.error.message;  // Exibe a mensagem de erro vinda do backend
        } else {
          // Tratar erros inesperados
          this.rescheduleError = 'Ocorreu um erro ao tentar reagendar. Tente novamente mais tarde.';
        }
        this.getAppointments();
        this.successMessage = 'Falha ao reagendar!';
        this.showAlert = true;
        this.getAppointments();
        this.hideAlertAfterDelay();
        this.typeAlert = 'danger'
      }
    );
  }

  // Manipula quando o evento é redimensionado
  handleEventResize(info: any) {
    console.log(`Evento redimensionado para ${info.event.start} até ${info.event.end}`);
    // Aqui você pode chamar seu backend para salvar as mudanças no banco de dados
  }
  handlePrev() {
    this.selectedDay = this.previousDay;
    this.updatePreviousAndNextDays();
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate(this.selectedDay);
    this.getAppointments();
  }

  handleNext() {
    this.selectedDay = this.nextDay;
    this.updatePreviousAndNextDays();
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate(this.selectedDay);
    this.getAppointments();
  }

  updatePreviousAndNextDays() {
    const { previousDay, nextDay } = getPreviousAndNextDay(this.selectedDay);
    this.previousDay = previousDay;
    this.nextDay = nextDay;
  }

  handleDateClick(arg: any) {
    this.employeeId = arg.resource.id;
    this.dateTimeStart = new Date(arg.dateStr);
    this.dateTimeEnd = new Date(arg.dateStr);
    this.bookTimeStart = this.dateTimeStart.toTimeString().split(' ')[0].slice(0, 5);
    this.dateTimeEnd.setMinutes(this.dateTimeEnd.getMinutes() + 15);
    this.bookTimeEnd = this.dateTimeEnd.toTimeString().split(' ')[0].slice(0, 5);
    showModal("bookModal");
  }


  bookAppointment() {
    const dateStartFormated = `${formatDate(this.dateTimeStart)}T${this.bookTimeStart}`;
    const dateEndFormated = `${formatDate(this.dateTimeEnd)}T${this.bookTimeEnd}`;
    console.log(dateStartFormated);
    console.log(dateEndFormated);
    //const newDateTime = `${newDate}T${newTime}`;
    this.appointmentService.bookAppointment(this.employeeId.toString(), dateStartFormated, dateEndFormated).subscribe(
      () => {
        this.getAppointments();
        this.successMessage = 'Horário reservado com sucesso!';
        this.showAlert = true;
        this.getAppointments();
        this.hideAlertAfterDelay();
        hideModal("bookModal");
        this.rescheduleError = null;
        this.typeAlert = 'success';
      },
      (error) => {
        console.error('Erro ao reagendar:', error);
        if (error.status === 400 && error.error?.code === '01') {
          this.rescheduleError = error.error.message;  // Exibe a mensagem de erro vinda do backend
        } else {
          // Tratar erros inesperados
          this.rescheduleError = 'Ocorreu um erro ao tentar reagendar. Tente novamente mais tarde.';
        }
      }
    );
  }


}

function hideModal(modalId: string) {
  const element = document.getElementById(modalId);
  if (element) {
    const modal = Modal.getInstance(element);
    if (modal) {
      modal.hide();
    }
  }
}

function showModal(modalId: string) {
  const element = document.getElementById(modalId);
  if (element) {
    const modal = new Modal(element);
    modal.show();
  }
}

function getPreviousAndNextDay(dateString: string): { previousDay: string, nextDay: string } {
  const inputDate = new Date(dateString);

  if (isNaN(inputDate.getTime())) {
    throw new Error('Data inválida.');
  }

  const previousDate = new Date(inputDate);
  previousDate.setDate(inputDate.getDate() - 1);

  const nextDate = new Date(inputDate);
  nextDate.setDate(inputDate.getDate() + 1);

  const previousDay = previousDate.toISOString().split('T')[0];
  const nextDay = nextDate.toISOString().split('T')[0];

  return { previousDay, nextDay };
}

function formatTimeDuration(minutes: any | null) {
  if (!minutes) return "";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  let result = '';
  if (hours > 0) result += `${hours} hora${hours > 1 ? 's' : ''}`;
  if (remainingMinutes > 0) {
    if (hours > 0) result += ' e ';
    result += `${remainingMinutes} minuto${remainingMinutes > 1 ? 's' : ''}`;
  }
  return result || '0 minutos';
};

function formatToReal(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDateTimeToDay(dateInput: Date | string) {
  if (!dateInput) return null;
  const date = (typeof dateInput === 'string') ? new Date(dateInput) : dateInput;

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  date.setUTCHours(date.getUTCHours() - 3);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  const daysOfWeek: string[] = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  const dayOfWeek: string = daysOfWeek[date.getUTCDay()];
  const formattedDate = `${day}/${month}/${year} ${dayOfWeek}`;

  return formattedDate;
};

function formatDate(dateTime: Date) {

  const year = dateTime.getFullYear();
  const month = String(dateTime.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
  const day = String(dateTime.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

class AppointmentDetail {
  id!: number;
  client!: string;
  day!: string;
  hour!: string;
  service!: string;
  ammount!: string;
  duration!: string;
  employee!: string;
  start!: string;
  employeeId!: number;
}

