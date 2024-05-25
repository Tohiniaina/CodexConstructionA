import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  private updateSource = new Subject<void>();
  update$ = this.updateSource.asObservable();

  notifyUpdate() {
    this.updateSource.next();
  }
}
