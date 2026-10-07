import {AbstractControl, FormGroup} from '@angular/forms';

export class BaseForm {
  protected isInvalidControl = (form: FormGroup, controlName: string): boolean => {
    const control = form.get(controlName);
    return !!control && control.invalid && control.touched;
  };

  protected errorKeyForControl = (form: FormGroup, controlName: string): string => {
    const control: AbstractControl | null = form.get(controlName);
    const errors = control?.errors;
    if (!errors) return '';
    if (errors['required']) return 'validation.field-required';
    if (errors['email']) return 'validation.email-invalid';
    if (errors['min'] || errors['max']) return 'validation.number-out-of-range';
    if (errors['minlength']) return 'validation.field-too-short';
    if (errors['maxlength']) return 'validation.description-too-long';
    return 'validation.field-invalid';
  };
}
