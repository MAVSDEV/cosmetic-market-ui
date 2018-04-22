import { Injectable } from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {of} from "rxjs/observable/of";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public auth: AuthenticationService,
              public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const token = route.queryParamMap.get('token');

    return this.auth.checkToken(token).map(valid => {
      if (!valid) this.router.navigate(['/']);
      return valid;
    }).catch(() => {
      this.router.navigate(['/']);
      return of(false);
    });
  }
}
