import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Layout} from './shared/presentation/components/layout/layout';
import {LocaleService} from './shared/presentation/services/locale.service';

@Component({
  selector: 'app-root',
  imports: [Layout],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private readonly translate = inject(TranslateService);

  constructor() {
    const language = LocaleService.preferredLanguage();
    this.translate.addLangs([...LocaleService.SUPPORTED_LANGUAGES]);
    this.translate.use(language);
    document.documentElement.lang = language;
  }
}
