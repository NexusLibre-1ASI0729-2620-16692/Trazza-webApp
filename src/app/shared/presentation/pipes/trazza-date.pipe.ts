import {Pipe, PipeTransform} from '@angular/core';
import {formatDate} from '../formatters';

@Pipe({ name: 'trazzaDate' })
export class TrazzaDatePipe implements PipeTransform {
  transform(value: string | null | undefined, language?: string | null): string {
    return formatDate(value, language);
  }
}
