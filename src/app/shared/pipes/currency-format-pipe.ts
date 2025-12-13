import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rupee', // Usage: {{ price | rupee }}
  standalone: true
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number): string {
    if (isNaN(value)) return '₹0.00';
    return '₹' + value.toFixed(2);
  }
}