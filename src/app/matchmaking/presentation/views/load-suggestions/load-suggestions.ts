import {ChangeDetectionStrategy, Component, computed, inject, input, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {LoadSuggestion, MatchmakingStore, SuggestionSort} from '../../../application/matchmaking.store';
import {CargoType} from '../../../domain/model/cargo-type.value-object';
import {ReturnRoute} from '../../../domain/model/return-route.entity';
import {LoadSuggestionCard} from '../../components/load-suggestion-card/load-suggestion-card';
import {ProfileStore} from '../../../../iam/application/profile.store';
import {ReputationStore} from '../../../../reputation/application/reputation.store';
import {EmptyState} from '../../../../shared/presentation/components/empty-state/empty-state';
import {LocaleService} from '../../../../shared/presentation/services/locale.service';
import {TrazzaDatePipe} from '../../../../shared/presentation/pipes/trazza-date.pipe';
import {TrazzaNumberPipe} from '../../../../shared/presentation/pipes/trazza-number.pipe';

@Component({
  selector: 'app-load-suggestions',
  imports: [MatFormFieldModule, MatSelectModule, MatButton, MatIcon, TranslatePipe, LoadSuggestionCard, EmptyState, TrazzaDatePipe, TrazzaNumberPipe],
  templateUrl: './load-suggestions.html',
  styleUrl: './load-suggestions.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadSuggestions {
  readonly routeId = input<string>();

  protected readonly store = inject(MatchmakingStore);
  protected readonly profileStore = inject(ProfileStore);
  protected readonly reputationStore = inject(ReputationStore);
  protected readonly locale = inject(LocaleService);
  private readonly router = inject(Router);

  protected readonly cargoTypes = CargoType.VALUES;
  protected readonly detourOptions = ReturnRoute.DETOUR_OPTIONS;
  protected readonly sortOptions: { value: SuggestionSort; label: string }[] = [
    { value: 'detour', label: 'filters.lowest-detour' },
    { value: 'rate', label: 'filters.highest-rate' },
    { value: 'weight', label: 'filters.heaviest' }
  ];

  protected readonly cargoType = signal<string | null>(null);
  protected readonly maxDetourKm = signal<number | null>(null);
  protected readonly sortBy = signal<SuggestionSort>('detour');

  protected readonly selectedRouteId = computed(() => Number(this.routeId()) || this.store.myActiveReturnRoutes()[0]?.id || 0);

  protected readonly selectedRoute = computed(() => this.store.returnRoutes().find(route => route.id === this.selectedRouteId()) ?? null);

  protected readonly suggestions = computed(() => this.selectedRouteId()
    ? this.store.getLoadSuggestions(this.selectedRouteId(), { cargoType: this.cargoType(), maxDetourKm: this.maxDetourKm(), sortBy: this.sortBy() })
    : []);

  protected selectRoute(routeId: number): void {
    this.router.navigate([], { queryParams: { routeId }, replaceUrl: true }).then();
  }

  protected viewDetail(suggestion: LoadSuggestion): void {
    this.router.navigate(['/matchmaking/load-suggestions', this.selectedRouteId(), 'loads', suggestion.request.id]).then();
  }

  protected publishRoute(): void {
    this.router.navigate(['/matchmaking/return-routes/new']).then();
  }
}
