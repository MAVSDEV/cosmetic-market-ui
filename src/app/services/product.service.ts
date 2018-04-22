import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Product } from '../models/product';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';
import {httpOptions} from "./http.options";
import {BaseService} from "./base.service";
import {environment} from "../../environments/environment";
import 'rxjs/add/operator/catch';
import {isDefined} from "../utils/utils";

@Injectable()
export class ProductService extends BaseService {

  private productsUrl = environment.apiBaseUrl + '/product/aloe';  // URL to web api
  private productsSaveUrl = environment.apiBaseUrl + '/product/aloe/save';

  constructor(private http: HttpClient) {
    super();
  }

  getProducts(params?: FilterParams): Observable<Product[]> {
    const httpParams: HttpParams = params && params.toHttpParams();
    return this.http.get<Product[]>(this.productsUrl + '/search', {params: httpParams})
      .pipe(
        tap(products => this.log(`fetched products`)),
        catchError(this.handleError('getProducts', []))
      );
  }

  getProduct(id: number): Observable<Product> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.get<Product>(url).pipe(
      tap(_ => this.log(`fetched product id=${_.id}`)),
      catchError(this.handleError<Product>(`getProduct id=${id}`))
    );
  }

  /** POST: add a new product to the server */
  addProduct (product: any): Observable<any> {
    return this.http.post<Product>(this.productsSaveUrl, product, httpOptions).pipe(
      tap((product: Product) => this.log(`added product w/ id=${product.id}`)),
      catchError(this.handleError<Product>('addProduct'))
    );
  }

  /** PUT: update the product on the server */
  updateProduct (product: any): Observable<any> {
    return this.http.put(this.productsUrl + '/update', product, httpOptions).pipe(
      tap(_ => this.log(`updated product id=${product.id}`)),
      catchError(this.handleError<any>('updateProduct'))
    );
  }

  /** DELETE: delete the product from the server */
  deleteProduct (id: number): Observable<any> {
    const url = `${this.productsUrl}/delete/${id}`;
    return this.http.delete<Product>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted product id=${id}`)),
      catchError(this.handleError<Product>('deleteProduct'))
    );
  }

  /** PUT: add image to the product on the server */
  addPhotoToProduct (id: number, file: any): Observable<any> {
    const url = `${this.productsUrl}/${id}/image`;

    let httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'false');
    httpHeaders.append('processData', 'false');
    let headers = { headers: httpHeaders };

    return this.http.put(url, file, headers).pipe(
      tap(_ => this.log(`added image to product!`)),
      catchError(this.handleError<any>('addedPhotoProduct'))
    );
  }

  /** PUT: add additional image to the product on the server */
  addAdditionalPhotosToProduct (id: number, file: any): Observable<any> {
    const url = `${this.productsUrl}/${id}/otherImages`;

    let httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'false');
    httpHeaders.append('processData', 'false');
    let headers = { headers: httpHeaders };

    return this.http.put(url, file, headers).pipe(
      tap(_ => this.log(`added otherImages to product!`)),
      catchError(this.handleError<any>('addAdditionalPhotosToProduct'))
    );
  }

  /** GET products whose name contains search term */
  autocompleteName(term: string): Observable<Product[]> {
    if (!term.trim()) {
      // if not search term, return empty product array.
      return of([]);
    }
    return this.http.get<(Product)[]>(`${this.productsUrl}/all`)
      .map(products => products.filter(product => product.name.toLowerCase()
        .includes(term.toLowerCase())))
      .do(_ => this.log(`found products matching "${term}"`))
      .catch(this.handleError<Product[]>('autocompleteName', []))
  }
}


export class FilterParams {

  constructor(public page: number,
              public pageSize: number,
              public categoryIds: number[] = [],
              public searchTerm: string,
              public sortField: string,
              public sortOrder: string
  ) {}

  public toHttpParams(): HttpParams {
    let params = new HttpParams();

    if(isDefined(this.searchTerm) && this.searchTerm.length > 0) {
      params = params.set("term", this.searchTerm);
    }
    if(isDefined(this.page)) {
      params = params.set("page", String(this.page));
    }
    if(isDefined(this.pageSize)) {
      params = params.set("pageSize", String(this.pageSize));
    }
    if(isDefined(this.categoryIds) && this.categoryIds.length > 0) {
      params = params.set("filter", `category[${this.categoryIds[0]}]`);
    }
    if(isDefined(this.sortField) && isDefined(this.sortOrder)) {
      params = params.set("sort", `${this.sortField}[${this.sortOrder}]`);
    }
    return params;
  }
}
