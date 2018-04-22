import { Component, OnInit } from '@angular/core';
import {Alert, AlertService} from "../../../services/alert.service";

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.css']
})
export class AlertMessageComponent implements OnInit {

  alerts: Alert[] = [];
  stickToTop = false;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.getAlert().subscribe((alert: Alert) => {
      if (!alert) {
        // clear alerts when an empty alert is received
        this.alerts = [];
      } else {
        // add alert to array
        this.stickToTop = alert.stickToTop || false;
        this.alerts.push(alert);
        if(this.alerts.length > 3) this.alerts.pop();
        setTimeout(() => this.removeAlert(alert), 5000);
      }
    });
  }

  removeAlert(alert: Alert) {
    this.alerts = this.alerts.filter(x => x !== alert);
  }
}
