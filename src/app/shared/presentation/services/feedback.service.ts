import {inject, Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LocaleService} from './locale.service';

@Injectable({providedIn: 'root'})
export class FeedbackService {
  static readonly ERROR_DURATION_MS = 4500;
  static readonly SUCCESS_DURATION_MS = 3000;

  private readonly snackBar = inject(MatSnackBar);
  private readonly locale = inject(LocaleService);

  describeError(error: unknown): string {
    const key = error instanceof Error ? error.message : '';
    if (this.locale.has(key)) return this.locale.instant(key);
    return this.locale.instant('errors.unexpected');
  }

  showError(error: unknown): void {
    this.snackBar.open(this.describeError(error), this.locale.instant('actions.close'), {
      duration: FeedbackService.ERROR_DURATION_MS,
      panelClass: 'trazza-snackbar-error',
      politeness: 'assertive'
    });
  }

  showSuccess(key: string, params: Record<string, string | number> = {}): void {
    this.snackBar.open(this.locale.instant(key, params), this.locale.instant('actions.close'), {
      duration: FeedbackService.SUCCESS_DURATION_MS,
      panelClass: 'trazza-snackbar-success',
      politeness: 'polite'
    });
  }
}
