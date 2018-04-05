import {Component, ElementRef, OnInit} from '@angular/core';
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

  constructor(private el: ElementRef) {
    this.listOfProducts = [{name: 'Name1', description: 'Description1', category: 'category1', price: 'price1'},
      {name: 'Name2', description: 'Description1', category: 'category1', price: 'price1'},
      {name: 'Name3', description: 'Description1', category: 'category1', price: 'price1'},
      {name: 'Name4', description: 'Description1', category: 'category1', price: 'price1'},
      {name: 'Name5', description: 'Description1', category: 'category1', price: 'price1'},
      {name: 'Name6', description: 'Description1', category: 'category1', price: 'price1'}]
  }

  ngOnInit() {
    this.loadProductsTable();
  }

  public loadProductsTable(): void {
    if (this.tableWidget) {
      this.tableWidget.destroy();
    }
    const tableOptions: any = {
      data: this.listOfProducts,
      responsive: true,
      lengthMenu: [5, 10, 15],
      select: true,
      paging: true,
      columns: [
        {title: 'Photo', data: 'name'},
        {title: 'Name', data: 'name'},
        {title: 'Description', data: 'description'},
        {title: 'Category', data: 'category'},
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

  onDelete(id){
    console.log('Deleted: ' + this.listOfProducts[id].name);
  }

  onEdit(id){
    console.log('Updated: ' + this.listOfProducts[id].name);
  }

}
