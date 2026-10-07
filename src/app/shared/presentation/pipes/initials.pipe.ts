import {Pipe, PipeTransform} from '@angular/core';
import {initialsOf} from '../formatters';

@Pipe({ name: 'initials' })
export class InitialsPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return initialsOf(value);
  }
}
