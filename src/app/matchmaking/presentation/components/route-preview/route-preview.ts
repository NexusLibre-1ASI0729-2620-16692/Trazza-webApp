import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-route-preview',
  imports: [MatIcon, TranslatePipe],
  templateUrl: './route-preview.html',
  styleUrl: './route-preview.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoutePreview {
  readonly from = input<string | null>(null);
  readonly to = input<string | null>(null);
  readonly distanceKm = input<number | null>(null);
  readonly durationMinutes = input<number | null>(null);
  readonly hintKey = input<string>('');
  readonly hintParams = input<Record<string, string | number>>({});
}
