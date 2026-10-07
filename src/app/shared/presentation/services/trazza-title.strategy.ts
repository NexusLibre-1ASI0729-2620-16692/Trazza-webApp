import {effect, inject, Injectable, signal} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {RouterStateSnapshot, TitleStrategy} from '@angular/router';
import {LocaleService} from './locale.service';

@Injectable({providedIn: 'root'})
export class TrazzaTitleStrategy extends TitleStrategy {
  static readonly BRAND = 'Trazza';

  private readonly title = inject(Title);
  private readonly locale = inject(LocaleService);
  private readonly titleKeySignal = signal<string>('');

  readonly titleKey = this.titleKeySignal.asReadonly();

  constructor() {
    super();
    effect(() => {
      this.locale.language();
      const key = this.titleKeySignal();
      this.title.setTitle(key ? `${TrazzaTitleStrategy.BRAND} - ${this.locale.instant(key)}` : TrazzaTitleStrategy.BRAND);
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.titleKeySignal.set(this.buildTitle(snapshot) ?? '');
  }
}
