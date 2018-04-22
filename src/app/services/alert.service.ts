import { Injectable } from '@angular/core';
import {Subject} from "rxjs/Subject";
import {NavigationStart, Router} from "@angular/router";
import {Observable} from "rxjs/Observable";

@Injectable()
export class AlertService {

  private subject = new Subject<Alert>();
  private keepAfterRouteChange = false;

  constructor(private router: Router) {
    // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterRouteChange) {
          // only keep for a single route change
          this.keepAfterRouteChange = false;
        } else {
          // clear alert messages
          this.clear();
        }
      }
    });
  }

  getAlert(): Observable<Alert> {
    return this.subject.asObservable();
  }

  success(message: string, keepAfterRouteChange = false, stickToTop = false) {
    this.alert(AlertType.Success, message, keepAfterRouteChange, stickToTop);
  }

  error(message: string, keepAfterRouteChange = false, stickToTop = false) {
    this.alert(AlertType.Error, message, keepAfterRouteChange, stickToTop);
  }

  info(message: string, keepAfterRouteChange = false, stickToTop = false) {
    this.alert(AlertType.Info, message, keepAfterRouteChange, stickToTop);
  }

  warn(message: string, keepAfterRouteChange = false, stickToTop = false) {
    this.alert(AlertType.Warning, message, keepAfterRouteChange, stickToTop);
  }

  alert(type: AlertType, message: string, keepAfterRouteChange = false, stickToTop = false) {
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next(<Alert>{ type, message , stickToTop});
  }

  clear() {
    // clear alerts
    this.subject.next();
  }

}

export class Alert {
  type: AlertType;
  message: string;
  stickToTop: false;
}

export enum AlertType {
  Success = 'success',
  Error = 'danger',
  Info = 'info',
  Warning = 'warning'
}
