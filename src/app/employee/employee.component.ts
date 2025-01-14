import { Component } from '@angular/core';
import { Employee } from '../employee/employee';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {

  employees: Employee[] = [];
  employeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      secondName: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      available: [false]
    });
  }

  async getEmployees() {
    this.employees = [];
    //const response = await this.productService.getProducts(this.filterName, this.filterCategory, this.page, this.size);
    //response.subscribe(response => {
    //  this.products = response.content;
    //  this.totalPages = response.totalPages;
    //});
  }

}
