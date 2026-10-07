import {ChangeDetectionStrategy, Component, inject, input, output} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatChip} from '@angular/material/chips';
import {TranslatePipe} from '@ngx-translate/core';
import {CarrierSuggestion} from '../../../application/matchmaking.store';
import {ReputationSummary} from '../../../../reputation/application/reputation.store';
import {StatusTag} from '../../../../shared/presentation/components/status-tag/status-tag';
import {LocaleService} from '../../../../shared/presentation/services/locale.service';
import {InitialsPipe} from '../../../../shared/presentation/pipes/initials.pipe';
import {TrazzaNumberPipe} from '../../../../shared/presentation/pipes/trazza-number.pipe';
import {TrazzaDatePipe} from '../../../../shared/presentation/pipes/trazza-date.pipe';

@Component({
  selector: 'app-carrier-card',
  imports: [MatButton, MatIcon, MatChip, TranslatePipe, StatusTag, InitialsPipe, TrazzaNumberPipe, TrazzaDatePipe],
  templateUrl: './carrier-card.html',
  styleUrl: './carrier-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarrierCard {
  readonly match = input.required<CarrierSuggestion>();
  readonly carrierName = input<string>('');
  readonly reputation = input<ReputationSummary>({ average: 0, count: 0, distribution: [] });
  readonly verified = input<boolean>(false);
  readonly sendOffer = output<CarrierSuggestion>();

  protected readonly locale = inject(LocaleService);
}
