import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../../../models/product";
import {InfoTab} from "./product-info-tab/product-info-tab.component";

@Component({
  selector: 'app-product-info-block',
  templateUrl: './product-info-block.component.html',
  styleUrls: ['./product-info-block.component.css']
})
export class ProductInfoComponent implements OnInit {

  @Input() product: Product;

  infoTabs: InfoTab[] = [];

  constructor() { }

  ngOnInit() {
    this.prepareInfoTabs();
  }

  private prepareInfoTabs(): void {
    this.pushIfDefined('Детали',
      this.product.description.details);
    this.pushIfDefined('Активные ингридиенты',
      this.product.description.activeIngredients);
    this.pushIfDefined('Свойства',
      this.product.description.properties);
    this.pushIfDefined('Применение',
      this.product.description.directions)
  }

  private pushIfDefined(name: string, content: string): void {
    if(content != null) {
      this.infoTabs.push({name, content});
    }
  }
}
