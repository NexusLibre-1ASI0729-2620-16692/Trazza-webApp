import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatChip} from '@angular/material/chips';
import {TranslatePipe} from '@ngx-translate/core';
import {LoadSuggestion} from '../../../application/matchmaking.store';
import {ReputationSummary} from '../../../../reputation/application/reputation.store';
import {StatusTag} from '../../../../shared/presentation/components/status-tag/status-tag';
import {InitialsPipe} from '../../../../shared/presentation/pipes/initials.pipe';
import {TrazzaNumberPipe} from '../../../../shared/presentation/pipes/trazza-number.pipe';

@Component({
  selector: 'app-load-suggestion-card',
  imports: [MatButton, MatIcon, MatChip, TranslatePipe, StatusTag, InitialsPipe, TrazzaNumberPipe],
  templateUrl: './load-suggestion-card.html',
  styleUrl: './load-suggestion-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadSuggestionCard {
  readonly suggestion = input.required<LoadSuggestion>();
  readonly merchantName = input<string>('');
  readonly reputation = input<ReputationSummary>({ average: 0, count: 0, distribution: [] });
  readonly verified = input<boolean>(false);
  readonly view = output<LoadSuggestion>();
}
