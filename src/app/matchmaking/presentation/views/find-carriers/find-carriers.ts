import {ChangeDetectionStrategy, Component, computed, inject, input, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {TranslatePipe} from '@ngx-translate/core';
import {CarrierSuggestion, MatchmakingStore} from '../../../application/matchmaking.store';
import {CarrierCard} from '../../components/carrier-card/carrier-card';
import {OfferAmountDialog, OfferAmountDialogData} from '../../components/offer-amount-dialog/offer-amount-dialog';
import {ProfileStore} from '../../../../iam/application/profile.store';
import {ReputationStore} from '../../../../reputation/application/reputation.store';
import {EmptyState} from '../../../../shared/presentation/components/empty-state/empty-state';
import {FeedbackService} from '../../../../shared/presentation/services/feedback.service';
import {LocaleService} from '../../../../shared/presentation/services/locale.service';
import {TrazzaDatePipe} from '../../../../shared/presentation/pipes/trazza-date.pipe';
import {TrazzaNumberPipe} from '../../../../shared/presentation/pipes/trazza-number.pipe';

@Component({
  selector: 'app-find-carriers',
  imports: [MatFormFieldModule, MatSelectModule, MatButton, MatIcon, TranslatePipe, CarrierCard, EmptyState, TrazzaDatePipe, TrazzaNumberPipe],
  templateUrl: './find-carriers.html',
  styleUrl: './find-carriers.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FindCarriers {
  readonly requestId = input<string>();

  protected readonly store = inject(MatchmakingStore);
  protected readonly profileStore = inject(ProfileStore);
  protected readonly reputationStore = inject(ReputationStore);
  protected readonly locale = inject(LocaleService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly feedback = inject(FeedbackService);

  protected readonly ratingOptions = [
    { value: 0, label: 'filters.any-rating' },
    { value: 4, label: '≥ 4 ★' },
    { value: 4.5, label: '≥ 4.5 ★' }
  ];

  protected readonly minRating = signal(0);

  protected readonly openRequests = computed(() => this.store.myFreightRequests().filter(request => request.status.isOpen));

  protected readonly selectedRequestId = computed(() => Number(this.requestId()) || this.openRequests()[0]?.id || 0);

  protected readonly selectedRequest = computed(() => this.store.freightRequests().find(request => request.id === this.selectedRequestId()) ?? null);

  protected readonly matches = computed(() => {
    const requestId = this.selectedRequestId();
    if (!requestId) return [];
    this.store.matchProposals();
    const minRating = this.minRating();
    return this.store.findCarriersFor(requestId).filter(match =>
      minRating === 0 || this.reputationStore.summaryFor(match.route.carrierId).average >= minRating);
  });

  protected selectRequest(requestId: number): void {
    this.router.navigate([], { queryParams: { requestId }, replaceUrl: true }).then();
  }

  protected newRequest(): void {
    this.router.navigate(['/matchmaking/freight-requests/new']).then();
  }

  protected openOfferDialog(match: CarrierSuggestion): void {
    const data: OfferAmountDialogData = {
      titleKey: 'find-carriers.send-offer',
      messageKey: 'find-carriers.offer-to',
      params: { carrier: this.profileStore.displayNameOf(match.route.carrierId) },
      initialAmount: this.selectedRequest()?.offeredRate?.amount ?? null
    };
    this.dialog.open(OfferAmountDialog, { data, width: '26rem' }).afterClosed().subscribe((amount?: number) => {
      if (!amount) return;
      this.store.sendProposal({ routeId: match.route.id, requestId: this.selectedRequestId(), amount }).subscribe({
        next: () => this.feedback.showSuccess('offer.sent'),
        error: error => this.feedback.showError(error)
      });
    });
  }
}
