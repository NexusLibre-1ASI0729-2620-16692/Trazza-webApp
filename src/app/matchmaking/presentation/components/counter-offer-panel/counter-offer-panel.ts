import {ChangeDetectionStrategy, Component, input, linkedSignal, output} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-counter-offer-panel',
  imports: [MatFormFieldModule, MatInput, MatButton, MatIcon, TranslatePipe],
  templateUrl: './counter-offer-panel.html',
  styleUrl: './counter-offer-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterOfferPanel {
  readonly titleKey = input<string>('');
  readonly titleParams = input<Record<string, string | number>>({});
  readonly hintKey = input<string>('');
  readonly hintParams = input<Record<string, string | number>>({});
  readonly fieldId = input<string>('counter-amount');
  readonly initialAmount = input<number | null>(null);
  readonly loading = input<boolean>(false);
  readonly submitted = output<number>();

  protected readonly amount = linkedSignal(() => this.initialAmount());

  protected updateAmount(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.amount.set(value === '' ? null : Number(value));
  }

  protected submit(): void {
    const amount = this.amount();
    if (amount && amount > 0) this.submitted.emit(amount);
  }
}
