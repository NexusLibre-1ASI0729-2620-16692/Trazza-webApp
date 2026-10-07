import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';

export interface OfferAmountDialogData {
  titleKey: string;
  messageKey: string;
  params?: Record<string, string | number>;
  initialAmount: number | null;
}

@Component({
  selector: 'app-offer-amount-dialog',
  imports: [MatDialogModule, MatFormFieldModule, MatInput, MatButton, MatIcon, TranslatePipe],
  templateUrl: './offer-amount-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferAmountDialog {
  protected readonly data = inject<OfferAmountDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<OfferAmountDialog, number>>(MatDialogRef);

  protected readonly amount = signal<number | null>(this.data.initialAmount);

  protected updateAmount(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.amount.set(value === '' ? null : Number(value));
  }

  protected confirm(): void {
    const amount = this.amount();
    if (amount && amount > 0) this.dialogRef.close(amount);
  }
}
