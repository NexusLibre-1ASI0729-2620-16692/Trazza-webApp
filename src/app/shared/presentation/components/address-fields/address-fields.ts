import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {TranslatePipe} from '@ngx-translate/core';
import {DISTRICT_NAMES} from '../../../domain/model/lima-districts';

@Component({
  selector: 'app-address-fields',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInput, MatSelectModule, TranslatePipe],
  templateUrl: './address-fields.html',
  styleUrl: './address-fields.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressFields {
  readonly group = input.required<FormGroup>();
  readonly fieldId = input.required<string>();
  readonly labelKey = input.required<string>();
  protected readonly districts = DISTRICT_NAMES;
}
