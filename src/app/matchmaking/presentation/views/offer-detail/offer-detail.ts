import {ChangeDetectionStrategy, Component, computed, inject, input, signal} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {MatTableModule} from '@angular/material/table';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {MatchmakingStore} from '../../../application/matchmaking.store';
import {MatchProposal} from '../../../domain/model/match-proposal.entity';
import {CounterOfferPanel} from '../../components/counter-offer-panel/counter-offer-panel';
import {ProfileStore} from '../../../../iam/application/profile.store';
import {ReputationStore, ReputationSummary} from '../../../../reputation/application/reputation.store';
import {StatusTag} from '../../../../shared/presentation/components/status-tag/status-tag';
import {EmptyState} from '../../../../shared/presentation/components/empty-state/empty-state';
import {FeedbackService} from '../../../../shared/presentation/services/feedback.service';
import {LocaleService} from '../../../../shared/presentation/services/locale.service';
import {TrazzaDatePipe} from '../../../../shared/presentation/pipes/trazza-date.pipe';
import {TrazzaNumberPipe} from '../../../../shared/presentation/pipes/trazza-number.pipe';

interface OfferRow {
  proposal: MatchProposal;
  carrierName: string;
  reputation: ReputationSummary;
  vehicle: string;
}

@Component({
  selector: 'app-offer-detail',
  imports: [MatTableModule, MatButton, MatIcon, TranslatePipe, CounterOfferPanel, StatusTag, EmptyState, TrazzaDatePipe, TrazzaNumberPipe],
  templateUrl: './offer-detail.html',
  styleUrl: './offer-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferDetail {
  readonly requestId = input.required<string>();

  private readonly store = inject(MatchmakingStore);
  private readonly profileStore = inject(ProfileStore);
  private readonly reputationStore = inject(ReputationStore);
  private readonly feedback = inject(FeedbackService);
  private readonly router = inject(Router);
  protected readonly locale = inject(LocaleService);

  protected readonly displayedColumns = ['carrier', 'rating', 'vehicle', 'detour', 'rate', 'status', 'actions'];

  protected readonly request = computed(() => this.store.freightRequests().find(request => request.id === Number(this.requestId())) ?? null);

  protected readonly rows = computed<OfferRow[]>(() => this.store.matchProposals()
    .filter(proposal => proposal.freightRequestId === Number(this.requestId()))
    .map(proposal => ({
      proposal,
      carrierName: this.profileStore.displayNameOf(proposal.carrierId),
      reputation: this.reputationStore.summaryFor(proposal.carrierId),
      vehicle: this.store.returnRoutes().find(route => route.id === proposal.returnRouteId)?.vehicleLabel ?? ''
    })));

  protected readonly matchedRow = computed(() => this.rows().find(row => row.proposal.status.value === 'matched') ?? null);

  protected readonly counterTarget = signal<OfferRow | null>(null);

  protected readonly confirmedShipmentId = signal<number | null>(null);

  protected readonly processing = signal(false);

  protected backToOffers(): void {
    this.router.navigate(['/matchmaking/offers']).then();
  }

  protected goToTracking(): void {
    const shipmentId = this.confirmedShipmentId();
    this.router.navigate(['/execution/shipment-tracking'], { queryParams: shipmentId ? { shipmentId } : {} }).then();
  }

  protected accept(row: OfferRow): void {
    this.run(this.store.acceptProposal(row.proposal.id), 'offer.accepted');
  }

  protected reject(row: OfferRow): void {
    this.run(this.store.rejectProposal(row.proposal.id), 'offer.rejected');
  }

  protected counter(amount: number): void {
    const target = this.counterTarget();
    if (target) this.run(this.store.counterProposal(target.proposal.id, amount), 'offer.countered');
  }

  protected confirmMatch(row: OfferRow): void {
    this.processing.set(true);
    this.store.confirmMatch(row.proposal.id).subscribe({
      next: shipment => {
        this.processing.set(false);
        this.confirmedShipmentId.set(shipment.id);
        this.feedback.showSuccess('offer.match-confirmed');
      },
      error: error => {
        this.processing.set(false);
        this.feedback.showError(error);
      }
    });
  }

  private run(action: Observable<unknown>, successKey: string): void {
    this.processing.set(true);
    action.subscribe({
      next: () => {
        this.processing.set(false);
        this.counterTarget.set(null);
        this.feedback.showSuccess(successKey);
      },
      error: error => {
        this.processing.set(false);
        this.feedback.showError(error);
      }
    });
  }
}
