import {inject, Injectable} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

@Injectable({providedIn: 'root'})
export class LocaleService {
  static readonly STORAGE_KEY = 'trazza.language';
  static readonly DEFAULT_LANGUAGE = 'en';
  static readonly SUPPORTED_LANGUAGES: readonly string[] = Object.freeze(['en', 'es']);

  static preferredLanguage(): string {
    const stored = localStorage.getItem(LocaleService.STORAGE_KEY);
    return stored && LocaleService.SUPPORTED_LANGUAGES.includes(stored) ? stored : LocaleService.DEFAULT_LANGUAGE;
  }

  private readonly translate = inject(TranslateService);

  readonly language = toSignal(
    this.translate.onLangChange.pipe(map(event => event.lang)),
    { initialValue: this.translate.getCurrentLang() ?? LocaleService.DEFAULT_LANGUAGE }
  );

  get languages(): readonly string[] {
    return this.translate.getLangs();
  }

  use(language: string): void {
    this.translate.use(language);
    localStorage.setItem(LocaleService.STORAGE_KEY, language);
    document.documentElement.lang = language;
  }

  instant(key: string, params: Record<string, string | number> = {}): string {
    return this.translate.instant(key, params);
  }

  has(key: string): boolean {
    return !!key && this.translate.instant(key) !== key;
  }
}
