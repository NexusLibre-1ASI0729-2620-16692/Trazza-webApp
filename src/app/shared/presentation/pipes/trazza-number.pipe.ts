import {Pipe, PipeTransform} from '@angular/core';
import {formatNumber} from '../formatters';

@Pipe({ name: 'trazzaNumber' })
export class TrazzaNumberPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return formatNumber(value);
  }
}
