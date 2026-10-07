import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {Severity, statusSeverity} from '../../formatters';

@Component({
  selector: 'app-status-tag',
  imports: [TranslatePipe],
  template: `<span [class]="'trazza-tag tag-' + severity()">{{ (labelKey() || 'statuses.' + status()) | translate: labelParams() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusTag {
  readonly status = input<string>('');
  readonly labelKey = input<string>('');
  readonly labelParams = input<Record<string, string | number>>({});
  readonly tone = input<Severity | null>(null);
  protected readonly severity = computed(() => this.tone() ?? statusSeverity(this.status()));
}
