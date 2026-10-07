import {ChangeDetectionStrategy, Component, computed, inject, viewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {MatBadge} from '@angular/material/badge';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatDialog} from '@angular/material/dialog';
import {TranslatePipe} from '@ngx-translate/core';
import {MatchmakingStore} from '../../../application/matchmaking.store';
import {FreightRequest} from '../../../domain/model/freight-request.entity';
import {StatusTag} from '../../../../shared/presentation/components/status-tag/status-tag';
import {ConfirmDialog, ConfirmDialogData} from '../../../../shared/presentation/components/confirm-dialog/confirm-dialog';
import {FeedbackService} from '../../../../shared/presentation/services/feedback.service';
import {LocaleService} from '../../../../shared/presentation/services/locale.service';
import {TrazzaDatePipe} from '../../../../shared/presentation/pipes/trazza-date.pipe';
import {TrazzaNumberPipe} from '../../../../shared/presentation/pipes/trazza-number.pipe';

interface FreightRequestRow {
  request: FreightRequest;
  offers: number;
  openOffers: number;
}

@Component({
  selector: 'app-freight-request-list',
  imports: [MatTableModule, MatPaginator, MatButton, MatIconButton, MatIcon, MatTooltip, MatBadge, MatProgressBar, TranslatePipe, StatusTag, TrazzaDatePipe, TrazzaNumberPipe],
  templateUrl: './freight-request-list.html',
  styleUrl: './freight-request-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FreightRequestList {
  protected readonly store = inject(MatchmakingStore);
  protected readonly locale = inject(LocaleService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly feedback = inject(FeedbackService);

  protected readonly displayedColumns = ['code', 'route', 'pickup', 'rate', 'offers', 'status', 'actions'];

  private readonly paginator = viewChild(MatPaginator);

  protected readonly dataSource = computed(() => {
    const rows: FreightRequestRow[] = this.store.myFreightRequests().map(request => {
      const proposals = this.store.proposalsForRequest(request.id);
      return { request, offers: proposals.length, openOffers: proposals.filter(proposal => proposal.status.isOpen).length };
    });
    const source = new MatTableDataSource(rows);
    const paginator = this.paginator();
    if (paginator) source.paginator = paginator;
    return source;
  });

  protected navigate(commands: (string | number)[], queryParams: Record<string, number> = {}): void {
    this.router.navigate(commands, { queryParams }).then();
  }

  protected publish(request: FreightRequest): void {
    this.store.publishFreightRequest(request.id).subscribe({
      next: () => this.feedback.showSuccess('freight-request.published'),
      error: error => this.feedback.showError(error)
    });
  }

  protected confirmCancel(request: FreightRequest): void {
    const data: ConfirmDialogData = {
      titleKey: 'freight-request.cancel',
      messageKey: 'freight-request.confirm-cancel',
      params: { code: request.code },
      confirmKey: 'freight-request.cancel',
      danger: true
    };
    this.dialog.open(ConfirmDialog, { data }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.store.cancelFreightRequest(request.id).subscribe({
        next: () => this.feedback.showSuccess('freight-request.cancelled'),
        error: error => this.feedback.showError(error)
      });
    });
  }
}
