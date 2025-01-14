import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.css']
})
export class AlertMessageComponent implements OnInit  {
  @Input() message: string = 'Mensagem padrão de sucesso'; // Mensagem padrão
  @Input() type: string = 'success';
  danger: boolean = false;
  success: boolean = true;

  ngOnInit() {
    if (this.type === 'success') {
      this.danger = false;
      this.success = true;
    } else if (this.type === 'danger') {
      this.danger = true;
      this.success = false;
    }
  }
}
