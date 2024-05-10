import { Injectable, signal, Signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loading = signal(false);

  get loading(): Signal<boolean> {
    return this._loading;
  }

  show(): void {
    this._loading.set(true);
  }

  hide(): void {
    this._loading.set(false);
  }
}
