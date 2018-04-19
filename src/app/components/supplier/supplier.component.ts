import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReactiveFormsBaseClass} from '../shared/classes/reactive-forms.base.class';
import {ProductService} from "../../services/product.service";
import {CategoryService} from "../../services/category.service";

declare var $: any;

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent extends ReactiveFormsBaseClass implements OnInit {

  productForm: FormGroup;
  photo: any;
  categories: Array<object>;
  activeType: string | null;
  productIdForDelete: number | null;

  constructor(private fb: FormBuilder, private productService: ProductService,
              private categoryService: CategoryService) {
    super({
      name: '',
      category: '',
      price: '',
      description: '',
      details: '',
      activeIngredients: '',
      directions: '',
      properties: '',
      volume: '',
      brand: ''
    }, {
      name: {
        required: 'Name is required.'
      },
      category: {
        required: 'Category is required.'
      },
      price: {
        required: 'Price is required.'
      },
      description: {
        required: 'Description is required.'
      },
      details: {
        required: 'Details is required.'
      },
      activeIngredients: {
        required: 'Active Ingredients is required.'
      },
      directions: {
        required: 'Directions is required.'
      },
      properties: {
        required: 'Properties is required.'
      },
      volume: {
        required: 'Volume is required.'
      },
      brand: {
        required: 'Brand is required.'
      },
    });
  }

  ngOnInit() {
    this.createProductForm();
    this.getCategories();
  }

  private createProductForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      price: ['', [Validators.required]],
      description: ['', [Validators.required]],
      details: ['', [Validators.required]],
      activeIngredients: ['', [Validators.required]],
      directions: ['', [Validators.required]],
      properties: ['', [Validators.required]],
      volume: ['', [Validators.required]],
      brand: ['', [Validators.required]]
    });

    this.productForm.valueChanges.subscribe(data => this.onValueChanged(this.productForm, data));
    this.onValueChanged(this.productForm);
  }

  getCategories() {
    this.categoryService.getCategories()
      .subscribe(categories => {
          this.categories = categories;
        }
      );
  }

  onSave(){
    if (!this.productForm.valid || !this.photo) {
      alert('Login data is invalid, please check it.');
      return;
    }
    const formObject = this.productForm.value;
    const newProductObj = {
      name: formObject.name,
      briefDescription: formObject.description,
      price: formObject.price,
      brand: formObject.brand,
      volume: formObject.volume,
      description: {
        details: formObject.details,
        activeIngredients: formObject.activeIngredients,
        properties: formObject.properties,
        directions: formObject.directions
      },
      productCategory: {
        name: formObject.category
      }
    };
    this.activeType == 'create' ? this.onAddNewProduct(newProductObj) : this.editProduct(newProductObj);

  }

  onAddNewProduct(productData) {
    let imageData:FormData = new FormData();
    imageData.append('imageFile', this.photo);

    this.productService.addProduct(productData)
      .subscribe(result => {
          console.log(result);
          this.productService.addPhotoToProduct(result.id, imageData)
            .subscribe(result => {
                console.log(result);
              }
            );
        }
      );
  }

  onFileChange(event) {
    this.photo = event.target.files[0];
  }

  getProductIdForDelete(id: number){
    $('#messageBoxModal').modal('show');
    this.productIdForDelete = id;
  }

  getProductData(data: object){
    this.activeType = 'edit';
    this.productForm.patchValue({
      name: data['name'],
      description: data['briefDescription'],
      price: data['price'],
      brand: data['brand'],
      volume: data['volume'],
      details: data['description']['details'],
      activeIngredients: data['description']['activeIngredients'],
      properties: data['description']['properties'],
      directions: data['description']['directions'],
      category: data['productCategory']['name']
    });
    $('#addProduct').modal('show');
  }

  editProduct(data){
    console.log(data);
  }

  deleteProduct(){
    console.log(this.productIdForDelete);
    if(this.productIdForDelete){
      this.productService.deleteProduct(this.productIdForDelete)
        .subscribe(result => {
          this.productIdForDelete = null;
          });
    }

  }
}
