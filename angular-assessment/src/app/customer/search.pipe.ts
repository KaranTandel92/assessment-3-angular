import { Pipe, PipeTransform } from '@angular/core';
import { Customer } from './customer.model';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(customers: Customer[], searchText: string): Customer[] {
    if (!customers || !searchText) {
      return customers;
    }

    searchText = searchText.toLowerCase();

    return customers.filter(customer => {
      return customer.name.toLowerCase().includes(searchText);
    });
  }

}

