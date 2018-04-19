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

  onAddNewProduct() {
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
    console.log(this.photo);
    let imageData:FormData = new FormData();
    imageData.append('imageFile', this.photo);

    this.productService.addProduct(newProductObj)
      .subscribe(result => {
          console.log(result);
          this.productService.addPhotoToProduct(result.id, imageData)
            .subscribe(result => {
              console.log(result);
            }
          );
        }
      );

    console.log(formObject, this.photo);
  }

  onFileChange(event) {
    this.photo = event.target.files[0];
  }
}
