import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {IamStore} from '../../../../iam/application/iam.store';
import {ProfileStore} from '../../../../iam/application/profile.store';
import {MatchmakingStore} from '../../../../matchmaking/application/matchmaking.store';
import {ExecutionStore} from '../../../../execution/application/execution.store';
import {ReputationStore} from '../../../../reputation/application/reputation.store';
import {LocaleService} from '../../services/locale.service';
import {StatusTag} from '../../components/status-tag/status-tag';
import {TrazzaDatePipe} from '../../pipes/trazza-date.pipe';
import {TrazzaNumberPipe} from '../../pipes/trazza-number.pipe';
import {currentMonthIso} from '../../../domain/model/calendar';
import {formatDate} from '../../formatters';

interface Kpi {
  label: string;
  value: string | number;
  hint: string;
  hintParams: Record<string, string | number>;
}

@Component({
  selector: 'app-dashboard',
  imports: [MatButton, MatIcon, TranslatePipe, StatusTag, TrazzaDatePipe, TrazzaNumberPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard {
  static readonly MORNING_LIMIT = 12;
  static readonly AFTERNOON_LIMIT = 19;
  static readonly SUGGESTIONS_SHOWN = 3;
  static readonly REQUESTS_SHOWN = 4;

  protected readonly iamStore = inject(IamStore);
  protected readonly profileStore = inject(ProfileStore);
  protected readonly matchmakingStore = inject(MatchmakingStore);
  protected readonly executionStore = inject(ExecutionStore);
  protected readonly reputationStore = inject(ReputationStore);
  protected readonly locale = inject(LocaleService);
  private readonly router = inject(Router);

  protected readonly isCarrier = this.iamStore.isCarrier;

  protected readonly firstName = computed(() => this.iamStore.currentUser()?.firstName ?? '');

  protected readonly greetingKey = computed(() => {
    const hour = new Date().getHours();
    if (hour < Dashboard.MORNING_LIMIT) return 'dashboard.good-morning';
    if (hour < Dashboard.AFTERNOON_LIMIT) return 'dashboard.good-afternoon';
    return 'dashboard.good-evening';
  });

  protected readonly reputation = this.reputationStore.mySummary;

  protected readonly activeShipment = computed(() => this.executionStore.myActiveShipments()[0] ?? null);

  protected readonly nextRoute = computed(() =>
    [...this.matchmakingStore.myActiveReturnRoutes()].sort((a, b) => a.departureDate.localeCompare(b.departureDate))[0] ?? null);

  protected readonly openRequests = computed(() => this.matchmakingStore.myFreightRequests().filter(request => request.status.isOpen));

  protected readonly recentRequests = computed(() => this.matchmakingStore.myFreightRequests().slice(0, Dashboard.REQUESTS_SHOWN));

  protected readonly topSuggestions = computed(() => this.matchmakingStore.myActiveReturnRoutes()
    .flatMap(route => this.matchmakingStore.getLoadSuggestions(route.id).map(item => ({ ...item, routeId: route.id })))
    .filter(item => !item.proposal)
    .slice(0, Dashboard.SUGGESTIONS_SHOWN));

  protected readonly shipmentsThisMonth = computed(() => {
    const month = currentMonthIso();
    return this.executionStore.myShipments().filter(item => (item.createdAt ?? '').slice(0, 7) === month).length;
  });

  protected readonly kpis = computed<Kpi[]>(() => {
    const reputation = this.reputation();
    const ratingKpi: Kpi = {
      label: 'dashboard.your-rating',
      value: reputation.count ? `${reputation.average} ★` : '—',
      hint: 'reputation.based-on',
      hintParams: { count: reputation.count }
    };
    if (this.isCarrier()) {
      const next = this.nextRoute();
      return [
        {
          label: 'dashboard.active-routes',
          value: this.matchmakingStore.myActiveReturnRoutes().length,
          hint: next ? 'dashboard.next' : '',
          hintParams: next ? { date: formatDate(next.departureDate, this.locale.language()), time: next.timeWindow.start } : {}
        },
        { label: 'dashboard.pending-offers', value: this.matchmakingStore.proposalsAwaitingMe().length, hint: 'dashboard.waiting-for-you', hintParams: {} },
        { label: 'dashboard.trips-month', value: this.shipmentsThisMonth(), hint: 'dashboard.this-month', hintParams: {} },
        ratingKpi
      ];
    }
    const eta = this.activeShipment()?.etaMinutes ?? null;
    return [
      { label: 'dashboard.in-transit', value: this.executionStore.myActiveShipments().length, hint: eta !== null ? 'dashboard.eta' : '', hintParams: { minutes: eta ?? 0 } },
      { label: 'dashboard.open-requests', value: this.openRequests().length, hint: 'dashboard.waiting-carriers', hintParams: {} },
      { label: 'dashboard.offers-to-review', value: this.matchmakingStore.proposalsAwaitingMe().length, hint: 'dashboard.waiting-for-you', hintParams: {} },
      ratingKpi
    ];
  });

  protected navigate(commands: (string | number)[], queryParams: Record<string, number> = {}): void {
    this.router.navigate(commands, { queryParams }).then();
  }
}
