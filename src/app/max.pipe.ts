import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'max'
})
export class MaxPipe implements PipeTransform {
  transform(value: number, maxValue: number): number {
    console.log(value, maxValue)
    console.log(Math.min(value, maxValue))
    return Math.min(value, maxValue);
  }
}
