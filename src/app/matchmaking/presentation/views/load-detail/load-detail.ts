import {ChangeDetectionStrategy, Component, computed, inject, input, signal} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDivider} from '@angular/material/divider';
import {TranslatePipe} from '@ngx-translate/core';
import {MatchmakingStore} from '../../../application/matchmaking.store';
import {RouteMatchingService} from '../../../domain/services/route-matching.service';
import {CounterOfferPanel} from '../../components/counter-offer-panel/counter-offer-panel';
import {ProfileStore} from '../../../../iam/application/profile.store';
import {ReputationStore} from '../../../../reputation/application/reputation.store';
import {StatusTag} from '../../../../shared/presentation/components/status-tag/status-tag';
import {EmptyState} from '../../../../shared/presentation/components/empty-state/empty-state';
import {FeedbackService} from '../../../../shared/presentation/services/feedback.service';
import {LocaleService} from '../../../../shared/presentation/services/locale.service';
import {InitialsPipe} from '../../../../shared/presentation/pipes/initials.pipe';
import {TrazzaDatePipe} from '../../../../shared/presentation/pipes/trazza-date.pipe';
import {TrazzaNumberPipe} from '../../../../shared/presentation/pipes/trazza-number.pipe';

@Component({
  selector: 'app-load-detail',
  imports: [MatButton, MatIcon, MatDivider, TranslatePipe, CounterOfferPanel, StatusTag, EmptyState, InitialsPipe, TrazzaDatePipe, TrazzaNumberPipe],
  templateUrl: './load-detail.html',
  styleUrl: './load-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadDetail {
  readonly routeId = input.required<string>();
  readonly requestId = input.required<string>();

  private readonly store = inject(MatchmakingStore);
  private readonly profileStore = inject(ProfileStore);
  private readonly reputationStore = inject(ReputationStore);
  private readonly feedback = inject(FeedbackService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  protected readonly locale = inject(LocaleService);

  protected readonly returnRoute = computed(() => this.store.returnRoutes().find(route => route.id === Number(this.routeId())) ?? null);

  protected readonly request = computed(() => this.store.freightRequests().find(request => request.id === Number(this.requestId())) ?? null);

  protected readonly detour = computed(() => {
    const route = this.returnRoute();
    const request = this.request();
    return route && request ? RouteMatchingService.calculateDetour(route, request) : null;
  });

  protected readonly merchant = computed(() => {
    const request = this.request();
    return request ? this.profileStore.merchantProfileOf(request.merchantId) ?? null : null;
  });

  protected readonly reputation = computed(() => this.reputationStore.summaryFor(this.request()?.merchantId ?? null));

  protected readonly proposal = computed(() => this.store.matchProposals().find(item =>
    item.freightRequestId === this.request()?.id
    && item.returnRouteId === this.returnRoute()?.id
    && item.status.value !== 'rejected') ?? null);

  protected readonly awaitingMe = computed(() => this.proposal()?.isAwaiting('carrier') ?? false);

  protected readonly canPropose = computed(() => !this.proposal() && !!this.request()?.status.isOpen && !!this.returnRoute()?.status.isActive);

  protected readonly processing = signal(false);

  protected goBack(): void {
    this.location.back();
  }

  protected decline(): void {
    this.router.navigate(['/matchmaking/load-suggestions'], { queryParams: { routeId: this.returnRoute()?.id } }).then();
  }

  protected acceptPublishedRate(): void {
    const amount = this.request()?.offeredRate?.amount;
    if (amount) this.proposeRate(amount);
  }

  protected proposeRate(amount: number): void {
    this.run(this.store.sendProposal({ routeId: Number(this.routeId()), requestId: Number(this.requestId()), amount }), 'offer.sent');
  }

  protected acceptOffer(): void {
    const proposal = this.proposal();
    if (proposal) this.run(this.store.acceptProposal(proposal.id), 'offer.accepted');
  }

  protected counterOffer(amount: number): void {
    const proposal = this.proposal();
    if (proposal) this.run(this.store.counterProposal(proposal.id, amount), 'offer.countered');
  }

  protected rejectOffer(): void {
    const proposal = this.proposal();
    if (proposal) this.run(this.store.rejectProposal(proposal.id), 'offer.rejected');
  }

  private run(action: Observable<unknown>, successKey: string): void {
    this.processing.set(true);
    action.subscribe({
      next: () => {
        this.processing.set(false);
        this.feedback.showSuccess(successKey);
      },
      error: error => {
        this.processing.set(false);
        this.feedback.showError(error);
      }
    });
  }
}
