import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {TranslatePipe} from '@ngx-translate/core';
import {LocaleService} from '../../services/locale.service';

@Component({
  selector: 'app-language-switcher',
  imports: [MatButtonToggleModule, TranslatePipe],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSwitcher {
  protected readonly locale = inject(LocaleService);

  protected useLanguage(language: string): void {
    this.locale.use(language);
  }
}
