import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertkg',
  standalone: true
})
export class ConvertkgPipe implements PipeTransform {
  transform(value: number | null): string {
    if (value == null) {
      return '';
    }
    const grams = value * 1000;
    return `${grams}g`;
  }
}