import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer.service';
import { Router } from '@angular/router';
import { Customer } from '../customer.model';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  customers: Customer[] = [];
  isAddFrom = false;
  editCustomerData!: Customer;
  searchText: string = '';
  searchControl = new FormControl();
  statusControl = new FormControl();
  filteredCustomers: Customer[] = [];
  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(searchText => {
        this.searchText = searchText;
      });
    this.getCustomers();    // get customer data from the json server
    this.filterData();      // search customer details
  }

  isAdd() {
    this.isAddFrom = true;
  }

  isFromclose() {
    this.isAddFrom = false;
  }

  // make function for get data from the server
  getCustomers(): void {
    this.customerService.getCustomers()
      .subscribe(customers => {
        this.customers = customers;
        this.filteredCustomers = customers;
      });
  }

  // delete customer detail
  deleteCustomer(id: number): void {
    this.customerService.deleteCustomer(id)
      .subscribe(() => {
        this.customers = this.customers.filter(c => c.id !== id);
        this.getCustomers();
      });
  }

  // edit customer detail
  public editCustomer(id: number) {
    this.isAddFrom = true;
    this.customerService.getCustomerById(id).subscribe((res: any) => {
      this.editCustomerData = res
    })
  }

  // search customer details
  public filterData() {
    this.statusControl.valueChanges.subscribe((value) => {
      if (value) {
        this.filteredCustomers = this.customers.filter(
          (customer) => customer.status === value
        );
      }
      else {
        this.filteredCustomers = this.customers;
      }
    });
  }

}
