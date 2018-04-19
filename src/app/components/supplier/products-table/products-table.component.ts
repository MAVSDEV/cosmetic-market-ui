import {Component, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';
import {ProductService} from "../../../services/product.service";
declare var $: any;

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.css']
})
export class ProductsTableComponent implements OnInit {
  listOfProducts: Array<any> = [];
  private tableWidget: any;
  private productsTable: any;
  public selectedId: any;

  @Output() editData: EventEmitter<object> = new EventEmitter<object>();
  @Output() deleteId: EventEmitter<number> = new EventEmitter<number>();

  constructor(private el: ElementRef, private productService: ProductService) {}

  ngOnInit() {
    this.getProducts(() => {
      this.loadProductsTable();
    })
  }

  public loadProductsTable(): void {
    if (this.tableWidget) {
      this.tableWidget.destroy();
    }
    const tableOptions: any = {
      data: this.listOfProducts,
      responsive: true,
      lengthMenu: [3, 5, 10],
      select: true,
      paging: true,
      columns: [
        {title: 'Photo',
          data: 'mainImage',
          'bSortable': false,
          'mRender': function (data) {
            return '<img style="height: 80px; width: auto;" src="' + data + '" />';
          }},
        {title: 'Name', data: 'name'},
        {title: 'Description', data: 'briefDescription'},
        {title: 'Category', data: 'productCategory.name'},
        {title: 'Price', data: 'price'}
      ]
    };
    this.productsTable = $(this.el.nativeElement.querySelector('table'));
    this.tableWidget = this.productsTable.DataTable(tableOptions);
    this.tableWidget.on('select', (e, dt, type, indexes) => {
      this.selectedId = indexes;
    });
    this.tableWidget.on('deselect', (e, dt, type, indexes) => {
      this.selectedId = null;
    });
  }

  getProducts(callback): void {
    this.productService.getProducts()
      .subscribe(products => {
        this.listOfProducts = products;
          callback();
        }
      );
  }

  onDelete(id){
    this.deleteId.emit(this.listOfProducts[id].id);
  }

  onEdit(id){
    this.editData.emit(this.listOfProducts[id]);
  }

}
