import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReactiveFormsBaseClass} from '../shared/classes/reactive-forms.base.class';
import {ProductService} from "../../services/product.service";
import {CategoryService} from "../../services/category.service";
import {ProductsTableComponent} from "./products-table/products-table.component";

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
  productId: number | null;
  displayedMainPhoto: any;
  displayedAdditionalPhotos: Array<any> = [];
  additionalPhotos: any = [];
  deletedPhoto: any = [];
  infoMessage: string | null;

  @ViewChild(ProductsTableComponent) productsTable: ProductsTableComponent;

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

  onSave() {
    $('#infoBoxModal').modal('show');
    if (!this.productForm.valid || !this.photo) {
      this.infoMessage = 'Product data is invalid, please check it.';
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
    this.activeType == 'create' ? this.onAddNewProduct(newProductObj)
      : this.editProduct(newProductObj);

  }

  onAddNewProduct(productData) {
    let imageData: FormData = new FormData();
    let otherImageData: FormData = new FormData();
    imageData.append('imageFile', this.photo);
    this.additionalPhotos.forEach((elem) => {
      otherImageData.append('imageFile', elem);
    });

    this.productService.addProduct(productData)
      .subscribe(result => {
        if(result){
          let newProductId = result.id;
          if (newProductId) {
            this.productService.addPhotoToProduct(newProductId, imageData)
              .subscribe(result => {
                  this.productService.addAdditionalPhotosToProduct(newProductId, otherImageData)
                    .subscribe(result => {
                        this.infoMessage = 'Product was created';
                        $('#addProduct').modal('hide');
                        this.clearForm();
                        this.productsTable.getProducts(() => {
                          this.productsTable.loadProductsTable();
                        })
                      }
                    );
                }
              );
          } else {
            this.infoMessage = 'Something was wrong! Try again!';
          }
        }
        }
      );
  }

  onFileChange(event) {
    this.photo = event.target.files[0];
    event.target.value = [];
    const fr = new FileReader();
    fr.onload = () => {
      this.displayedMainPhoto = fr.result;
    };
    fr.readAsDataURL(this.photo);
  }

  getproductId(id: number) {
    $('#messageBoxModal').modal('show');
    this.productId = id;
  }

  getProductData(data: object) {
    this.productId = data['id'];
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
    this.photo = this.displayedMainPhoto = data['mainImage'];
    this.displayedAdditionalPhotos = data['otherImages'] ? data['otherImages'] : [];
    $('#addProduct').modal('show');
  }

  editProduct(data) {
    data['id'] = this.productId;
    this.productService.updateProduct(data).subscribe(result => {
      if(typeof this.photo == 'object'){
        this.uploadImg(() => {
          this.updateImgs(() => {
            this.editSuccess();
          });

        });
      } else {
        this.updateImgs(() => {
          this.editSuccess();
        });
      }
    });
  }

  uploadImg(callback){
    let imageData: FormData = new FormData();
    imageData.append('imageFile', this.photo);
    this.productService.addPhotoToProduct(this.productId, imageData)
      .subscribe(result => {
        callback();
      });
  }

  updateImgs(callback){
    let appendData = (callback) => {
      let imageData: FormData = new FormData();
      this.deletedPhoto.forEach((elem) => {
        if(elem.indexOf('http') != -1){
          imageData.append('deletedImages', elem);
        }
      });
      this.additionalPhotos.forEach((elem) => {
        imageData.append('imageFile', elem);
      });
      callback(imageData);
    };

    appendData((data) => {
      this.productService.addAdditionalPhotosToProduct(this.productId, data)
        .subscribe(result => {
          callback();
        });
    });
  }

  editSuccess(){
    this.infoMessage = 'Product was updated';
    this.productsTable.getProducts(() => {
      this.productsTable.loadProductsTable();
    });
    this.clearForm();
    $('#addProduct').modal('hide');
    this.productId = null;
  }

  deleteProduct() {
    $('#infoBoxModal').modal('show');
    if (this.productId) {
      this.productService.deleteProduct(this.productId)
        .subscribe(result => {
          this.infoMessage = 'Product was deleted';
          this.productsTable.getProducts(() => {
            this.productsTable.loadProductsTable();
          });
          this.productId = null;
        });
    }
  }

  clearForm() {
    this.photo = null;
    this.displayedMainPhoto = null;
    this.productForm.reset();
    this.productId = null;
    this.displayedAdditionalPhotos = [];
    this.additionalPhotos = [];
    this.deletedPhoto = [];
  }

  public onUpdateFiles(result) {
    const tgt = result.target || window.event.srcElement,
      files = tgt['files'];
    const filesArr = Array.prototype.slice.call(files);
    if (FileReader && files && files.length) {
      filesArr.forEach((i) => {
        const fr = new FileReader();
        fr.onload = () => {
          this.additionalPhotos.push(i);
          this.displayedAdditionalPhotos.push(fr.result);
        };
        fr.readAsDataURL(i);
      });
    }
    result.target.value = [];
  }

  deleteProductPhoto(event){
    this.deletedPhoto.push(event.target.src);
    let find = false;
      this.additionalPhotos.forEach((elem, i) => {
        const fr = new FileReader();
        fr.onload = () => {
          if(fr.result == event.target.src && !find) {
            this.additionalPhotos.splice(i, 1);
            find = true;
          }
        };
        fr.readAsDataURL(elem);
      });

    this.displayedAdditionalPhotos.splice(this.displayedAdditionalPhotos.indexOf(event.target.src), 1);
  }

  closeModal(){
    this.infoMessage = null;
    $('#infoBoxModal').modal('hide');
  }
}
