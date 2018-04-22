import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {catchError, map} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {of} from "rxjs/observable/of";

@Injectable()
export class AuthenticationService {

  private securityUrl = environment.apiBaseUrl + '/security';  // URL to web api

  constructor(private http: HttpClient) { }

  checkToken(token: string): Observable<boolean> {
    return this.http.post(this.securityUrl + '/check-token', token)
      .pipe(
        map(_ => true),
        catchError(_ => of(false))
      );
  }
}
