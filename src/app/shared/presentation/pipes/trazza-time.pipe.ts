import {Pipe, PipeTransform} from '@angular/core';
import {formatTime} from '../formatters';

@Pipe({ name: 'trazzaTime' })
export class TrazzaTimePipe implements PipeTransform {
  transform(value: string | null | undefined, language?: string | null): string {
    return formatTime(value, language);
  }
}
