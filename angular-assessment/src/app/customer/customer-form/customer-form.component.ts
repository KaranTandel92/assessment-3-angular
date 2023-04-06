import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {

  get editCustomerData(): any {
    return this._editCustomerData;
  }
  @Input() set editCustomerData(value: any) {
    // debugger
    if (value) {
      this._editCustomerData = value;
      this.isEdit = true;
      this.patchValue(this._editCustomerData)
    }
  }
  @Output() isFromclose: EventEmitter<any> = new EventEmitter();
  @Output() isgetAll: EventEmitter<any> = new EventEmitter();
  customerForm!: FormGroup;
  isLoading: boolean = false;
  isSubmitted: boolean = false;
  _editCustomerData!: any;
  isEdit = false;
  constructor(private fb: FormBuilder, private customerService: CustomerService) { }

  ngOnInit(): void {
    this.createForm();
  }

  // create form for form-validation
  createForm() {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      description: ['', Validators.required],
      status: ['', Validators.required],
      rate: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      balance: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]]
    });
  }

  get detailsEdit() { return this.customerForm.controls; }

  onSubmit() {
    this.isSubmitted = true;
    if (this.customerForm.invalid) {
      return;
    }
    this.isLoading = true;
    // debugger
    if (this.isEdit) {
      this.customerService.updateCustomer(this._editCustomerData.id, this.customerForm.value).subscribe((res: any) => {
        this.isFromclose.emit(false);
        this.isgetAll.emit(true);
        this.isSubmitted = false;
        this.customerForm.reset();
      })
    }
    else {
      this.customerService.addCustomer(this.customerForm.value).subscribe((customer: any) => {
        this.isFromclose.emit(false);
        this.isgetAll.emit(true);
        this.isLoading = false;
        this.isSubmitted = false;
        this.customerForm.reset();
      }, (error) => {
        console.log(error);
        this.isLoading = false;
      });
    }
  }

  closeForm() {
    this.customerForm.reset();
    this.isSubmitted = false;
    this.isEdit = false;
    this.isFromclose.emit(false)
  }

  patchValue(value: any) {
    this.customerForm.patchValue({
      name: value.name,
      description: value.description,
      status: value.status,
      rate: value.rate,
      balance: value.balance
    });
  }

}
