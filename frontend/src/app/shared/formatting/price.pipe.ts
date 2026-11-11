import { Pipe, PipeTransform } from '@angular/core';

const formatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 });

export function formatPrice(amount: number): string {
  return `${formatter.format(amount)} DH`;
}

@Pipe({ name: 'price' })
export class PricePipe implements PipeTransform {
  transform(amount: number): string {
    return formatPrice(amount);
  }
}
