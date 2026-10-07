import {ChangeDetectionStrategy, Component, computed, inject, output} from '@angular/core';
import {TitleStrategy} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatBadge} from '@angular/material/badge';
import {MatButton} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageSwitcher} from '../language-switcher/language-switcher';
import {IamStore} from '../../../../iam/application/iam.store';
import {NotificationStore} from '../../../application/notification.store';
import {LocaleService} from '../../services/locale.service';
import {TrazzaTitleStrategy} from '../../services/trazza-title.strategy';
import {InitialsPipe} from '../../pipes/initials.pipe';
import {TrazzaTimePipe} from '../../pipes/trazza-time.pipe';

@Component({
  selector: 'app-top-bar',
  imports: [MatToolbarModule, MatIconButton, MatButton, MatIcon, MatMenuModule, MatBadge, TranslatePipe, LanguageSwitcher, InitialsPipe, TrazzaTimePipe],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopBar {
  readonly toggleMenu = output<void>();

  protected readonly iamStore = inject(IamStore);
  protected readonly notificationStore = inject(NotificationStore);
  protected readonly locale = inject(LocaleService);
  private readonly titleStrategy = inject(TitleStrategy) as TrazzaTitleStrategy;

  protected readonly titleKey = computed(() => this.titleStrategy.titleKey());
  protected readonly userName = computed(() => this.iamStore.currentUser()?.fullName ?? '');
  protected readonly roleKey = computed(() => this.iamStore.isCarrier() ? 'roles.carrier' : 'roles.merchant');
}
