import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-empty-state',
  imports: [MatIcon, TranslatePipe],
  template: `
    <div class="trazza-panel trazza-empty" role="status">
      <mat-icon aria-hidden="true">{{ icon() }}</mat-icon>
      <p class="semibold mb-1">{{ titleKey() | translate }}</p>
      @if (messageKey()) {
        <p class="m-0">{{ messageKey() | translate }}</p>
      }
      <div class="mt-3"><ng-content/></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyState {
  readonly icon = input<string>('inbox');
  readonly titleKey = input.required<string>();
  readonly messageKey = input<string>('');
}
