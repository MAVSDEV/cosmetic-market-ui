import {AfterContentInit, AfterViewInit, Component, OnInit} from '@angular/core';
import {Product} from "../../models/product";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  bestsellerProducts: Product[] = [];
  stockProducts: Product[] = [];
  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts()
      .subscribe(products => {
        this.bestsellerProducts = products.slice(1, 6);
        this.stockProducts = products.slice(1, 6);
      });
  }
}
