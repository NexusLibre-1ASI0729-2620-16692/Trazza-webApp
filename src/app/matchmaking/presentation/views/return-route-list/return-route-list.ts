import {ChangeDetectionStrategy, Component, computed, inject, viewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatDialog} from '@angular/material/dialog';
import {TranslatePipe} from '@ngx-translate/core';
import {MatchmakingStore} from '../../../application/matchmaking.store';
import {ReturnRoute} from '../../../domain/model/return-route.entity';
import {StatusTag} from '../../../../shared/presentation/components/status-tag/status-tag';
import {ConfirmDialog, ConfirmDialogData} from '../../../../shared/presentation/components/confirm-dialog/confirm-dialog';
import {FeedbackService} from '../../../../shared/presentation/services/feedback.service';
import {LocaleService} from '../../../../shared/presentation/services/locale.service';
import {TrazzaDatePipe} from '../../../../shared/presentation/pipes/trazza-date.pipe';
import {TrazzaNumberPipe} from '../../../../shared/presentation/pipes/trazza-number.pipe';

interface ReturnRouteRow {
  route: ReturnRoute;
  suggestions: number | null;
}

@Component({
  selector: 'app-return-route-list',
  imports: [MatTableModule, MatPaginator, MatButton, MatIconButton, MatIcon, MatTooltip, MatProgressBar, TranslatePipe, StatusTag, TrazzaDatePipe, TrazzaNumberPipe],
  templateUrl: './return-route-list.html',
  styleUrl: './return-route-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReturnRouteList {
  protected readonly store = inject(MatchmakingStore);
  protected readonly locale = inject(LocaleService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly feedback = inject(FeedbackService);

  protected readonly displayedColumns = ['route', 'date', 'capacity', 'suggestions', 'status', 'actions'];

  private readonly paginator = viewChild(MatPaginator);

  protected readonly dataSource = computed(() => {
    const rows: ReturnRouteRow[] = this.store.myReturnRoutes().map(route => ({
      route,
      suggestions: route.status.isActive ? this.store.getLoadSuggestions(route.id).length : null
    }));
    const source = new MatTableDataSource(rows);
    const paginator = this.paginator();
    if (paginator) source.paginator = paginator;
    return source;
  });

  protected navigateToNew(): void {
    this.router.navigate(['/matchmaking/return-routes/new']).then();
  }

  protected viewSuggestions(route: ReturnRoute): void {
    this.router.navigate(['/matchmaking/load-suggestions'], { queryParams: { routeId: route.id } }).then();
  }

  protected confirmClose(route: ReturnRoute): void {
    const data: ConfirmDialogData = {
      titleKey: 'return-route.close',
      messageKey: 'return-route.confirm-close',
      params: { route: route.label },
      confirmKey: 'return-route.close',
      danger: true
    };
    this.dialog.open(ConfirmDialog, { data }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.store.closeReturnRoute(route.id).subscribe({
        next: () => this.feedback.showSuccess('return-route.closed'),
        error: error => this.feedback.showError(error)
      });
    });
  }
}
