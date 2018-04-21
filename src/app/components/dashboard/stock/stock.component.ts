import {Component, Input, OnInit} from '@angular/core';
import {DashboardService} from '../../../services/dashboard.service';
import {Product} from "../../../models/product";

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
})
export class StockComponent implements OnInit {

  _products: Product[] = [];

  productsInitialized: boolean = false;

  constructor(private dashboardService: DashboardService ) { }

  ngOnInit() {
  }

  get products() {
    return this._products;
  }

  @Input()
  set products(products: Product[]) {
    if(!this.productsInitialized && products.length > 0) {
      this._products = products;
      this.productsInitialized = true;
      setTimeout(() => this.dashboardService
        .runCarousel('stock-slider'));
    }
  }

}
