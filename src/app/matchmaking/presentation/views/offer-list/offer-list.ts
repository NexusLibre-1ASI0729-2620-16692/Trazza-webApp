import {ChangeDetectionStrategy, Component, computed, inject, signal, viewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatDialog} from '@angular/material/dialog';
import {TranslatePipe} from '@ngx-translate/core';
import {MatchmakingStore} from '../../../application/matchmaking.store';
import {MatchProposal} from '../../../domain/model/match-proposal.entity';
import {FreightRequest} from '../../../domain/model/freight-request.entity';
import {OfferAmountDialog, OfferAmountDialogData} from '../../components/offer-amount-dialog/offer-amount-dialog';
import {IamStore} from '../../../../iam/application/iam.store';
import {ProfileStore} from '../../../../iam/application/profile.store';
import {StatusTag} from '../../../../shared/presentation/components/status-tag/status-tag';
import {EmptyState} from '../../../../shared/presentation/components/empty-state/empty-state';
import {FeedbackService} from '../../../../shared/presentation/services/feedback.service';
import {LocaleService} from '../../../../shared/presentation/services/locale.service';
import {TrazzaDatePipe} from '../../../../shared/presentation/pipes/trazza-date.pipe';
import {TrazzaNumberPipe} from '../../../../shared/presentation/pipes/trazza-number.pipe';

interface CarrierOfferRow {
  proposal: MatchProposal;
  request: FreightRequest;
  merchantName: string;
}

interface MerchantRequestRow {
  request: FreightRequest;
  total: number;
  awaiting: number;
}

@Component({
  selector: 'app-offer-list',
  imports: [MatTableModule, MatPaginator, MatButton, MatIcon, MatProgressBar, TranslatePipe, StatusTag, EmptyState, TrazzaDatePipe, TrazzaNumberPipe],
  templateUrl: './offer-list.html',
  styleUrl: './offer-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferList {
  protected readonly store = inject(MatchmakingStore);
  protected readonly iamStore = inject(IamStore);
  private readonly profileStore = inject(ProfileStore);
  protected readonly locale = inject(LocaleService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly feedback = inject(FeedbackService);

  protected readonly displayedColumns = ['load', 'date', 'rate', 'status', 'actions'];

  protected readonly processing = signal(false);

  private readonly paginator = viewChild(MatPaginator);

  protected readonly carrierOffers = computed(() => {
    const rows: CarrierOfferRow[] = [];
    this.store.myProposals().forEach(proposal => {
      const request = this.store.freightRequests().find(item => item.id === proposal.freightRequestId);
      if (request) rows.push({ proposal, request, merchantName: this.profileStore.displayNameOf(proposal.merchantId) });
    });
    const source = new MatTableDataSource(rows);
    const paginator = this.paginator();
    if (paginator) source.paginator = paginator;
    return source;
  });

  protected readonly merchantRequests = computed<MerchantRequestRow[]>(() => this.store.myFreightRequests()
    .map(request => {
      const proposals = this.store.proposalsForRequest(request.id);
      return {
        request,
        total: proposals.length,
        awaiting: proposals.filter(proposal => proposal.isAwaiting('merchant') || proposal.status.isAccepted).length
      };
    })
    .filter(item => item.total > 0));

  protected accept(proposal: MatchProposal): void {
    this.run(this.store.acceptProposal(proposal.id), 'offer.accepted');
  }

  protected reject(proposal: MatchProposal): void {
    this.run(this.store.rejectProposal(proposal.id), 'offer.rejected');
  }

  protected openCounter(proposal: MatchProposal): void {
    const data: OfferAmountDialogData = {
      titleKey: 'offer.counter',
      messageKey: 'offer.counter-hint',
      params: { rate: proposal.currentRate.formatted },
      initialAmount: proposal.currentRate.amount
    };
    this.dialog.open(OfferAmountDialog, { data, width: '26rem' }).afterClosed().subscribe((amount?: number) => {
      if (amount) this.run(this.store.counterProposal(proposal.id, amount), 'offer.countered');
    });
  }

  protected goToTrip(): void {
    this.router.navigate(['/execution/active-trip']).then();
  }

  protected review(request: FreightRequest): void {
    this.router.navigate(['/matchmaking/offers', request.id]).then();
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
