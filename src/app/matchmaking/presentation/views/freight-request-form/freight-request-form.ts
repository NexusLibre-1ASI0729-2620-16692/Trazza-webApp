import {ChangeDetectionStrategy, Component, computed, effect, inject, input, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {MatchmakingStore} from '../../../application/matchmaking.store';
import {CargoType} from '../../../domain/model/cargo-type.value-object';
import {Cargo} from '../../../domain/model/cargo.value-object';
import {RouteMatchingService, TripEstimation} from '../../../domain/services/route-matching.service';
import {BillingStore} from '../../../../billing/application/billing.store';
import {Address} from '../../../../shared/domain/model/address.value-object';
import {AddressFields} from '../../../../shared/presentation/components/address-fields/address-fields';
import {BaseForm} from '../../../../shared/presentation/components/base-form/base-form';
import {FeedbackService} from '../../../../shared/presentation/services/feedback.service';
import {LocaleService} from '../../../../shared/presentation/services/locale.service';
import {fromIsoDate, halfHourSlots, toIsoDate} from '../../../../shared/presentation/formatters';
import {TrazzaDatePipe} from '../../../../shared/presentation/pipes/trazza-date.pipe';
import {TrazzaNumberPipe} from '../../../../shared/presentation/pipes/trazza-number.pipe';

@Component({
  selector: 'app-freight-request-form',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInput, MatSelectModule, MatDatepickerModule, MatButton, MatIcon, TranslatePipe, AddressFields, TrazzaDatePipe, TrazzaNumberPipe],
  templateUrl: './freight-request-form.html',
  styleUrl: './freight-request-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FreightRequestForm extends BaseForm {
  readonly id = input<string>();

  private readonly store = inject(MatchmakingStore);
  private readonly billingStore = inject(BillingStore);
  private readonly router = inject(Router);
  private readonly feedback = inject(FeedbackService);
  private readonly fb = inject(FormBuilder);
  protected readonly locale = inject(LocaleService);

  protected readonly today = new Date(new Date().setHours(0, 0, 0, 0));
  protected readonly timeSlots = halfHourSlots();
  protected readonly cargoTypes = CargoType.VALUES;
  protected readonly maxDescriptionLength = Cargo.MAX_DESCRIPTION_LENGTH;

  protected readonly form = this.fb.nonNullable.group({
    pickup: this.fb.nonNullable.group({ street: ['', Validators.required], district: ['', Validators.required] }),
    delivery: this.fb.nonNullable.group({ street: ['', Validators.required], district: ['', Validators.required] }),
    pickupDate: [new Date(this.today.getTime() + 864e5) as Date | null, Validators.required],
    start: ['10:00', Validators.required],
    end: ['12:00', Validators.required],
    cargoType: ['general', Validators.required],
    weightKg: [null as number | null, [Validators.required, Validators.min(1)]],
    volumeM3: [null as number | null, Validators.min(0)],
    description: ['', Validators.maxLength(Cargo.MAX_DESCRIPTION_LENGTH)],
    offeredRate: [null as number | null, Validators.min(0)]
  });

  protected readonly formValue = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  protected readonly limitReached = computed(() => !this.billingStore.canPublish(this.store.publicationsThisMonth()));

  protected readonly estimation = computed<TripEstimation | null>(() => {
    const value = this.formValue();
    try {
      return RouteMatchingService.estimateTrip(
        new Address({ street: value.pickup?.street ?? '', district: value.pickup?.district ?? '' }),
        new Address({ street: value.delivery?.street ?? '', district: value.delivery?.district ?? '' }));
    } catch {
      return null;
    }
  });

  protected readonly pickupDateIso = computed(() => {
    const date = this.formValue().pickupDate;
    return date ? toIsoDate(date) : null;
  });

  protected readonly saving = signal(false);

  protected readonly errorMessage = signal('');

  constructor() {
    super();
    effect(() => {
      const requestId = Number(this.id());
      const request = requestId ? this.store.freightRequests().find(item => item.id === requestId) : undefined;
      if (!request) return;
      this.form.setValue({
        pickup: { street: request.pickup.street, district: request.pickup.district },
        delivery: { street: request.delivery.street, district: request.delivery.district },
        pickupDate: fromIsoDate(request.pickupDate),
        start: request.pickupWindow.start,
        end: request.pickupWindow.end,
        cargoType: request.cargo.type.value,
        weightKg: request.cargo.weightKg,
        volumeM3: request.cargo.volumeM3,
        description: request.cargo.description,
        offeredRate: request.offeredRate?.amount ?? null
      });
    });
  }

  protected get isEdit(): boolean {
    return !!this.id();
  }

  protected save(publish: boolean): void {
    this.errorMessage.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage.set(this.feedback.describeError(new Error('validation.form-incomplete')));
      return;
    }
    const value = this.form.getRawValue();
    this.saving.set(true);
    this.store.saveFreightRequest({
      pickup: value.pickup,
      delivery: value.delivery,
      pickupDate: value.pickupDate ? toIsoDate(value.pickupDate) : '',
      pickupWindow: { start: value.start, end: value.end },
      cargoType: value.cargoType,
      weightKg: value.weightKg ?? 0,
      volumeM3: value.volumeM3 ?? 0,
      description: value.description,
      offeredRate: value.offeredRate
    }, publish, this.isEdit ? Number(this.id()) : null).subscribe({
      next: request => {
        this.saving.set(false);
        this.feedback.showSuccess(publish ? 'freight-request.published' : 'freight-request.draft-saved');
        if (publish) this.router.navigate(['/matchmaking/find-carriers'], { queryParams: { requestId: request.id } }).then();
        else this.router.navigate(['/matchmaking/freight-requests']).then();
      },
      error: error => {
        this.saving.set(false);
        this.errorMessage.set(this.feedback.describeError(error));
      }
    });
  }

  protected cancel(): void {
    this.router.navigate(['/matchmaking/freight-requests']).then();
  }
}
