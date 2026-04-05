import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../service/product.service';
import { ToastService } from '../../service/toast.service';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-addproduct',
  imports: [ReactiveFormsModule, NgForOf, NgIf],
  templateUrl: './addproduct.component.html',
  styleUrl: './addproduct.component.css',
})
export class AddproductComponent implements OnInit {
  selectedFile!: File;
  imageurl = '';
  products: any[] = [];
  editId = '';

  constructor(
    private productService: ProductService,
    private toastService: ToastService
  ) {}

  product = new FormGroup({
    pname: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    pdesc: new FormControl('', Validators.required),
  });

  // ✅ when file selected
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // ✅ upload to cloudinary
  uploadImage() {
    const data = new FormData();

    data.append('file', this.selectedFile);
    data.append('upload_preset', 'eox6aglb');

    return fetch('https://api.cloudinary.com/v1_1/do6jfda9k/image/upload', {
      method: 'POST',
      body: data,
    }).then((res) => res.json());
  }

  // ✅ SAVE PRODUCT (UPDATED)
  async saveProduct() {

  let imageUrlToSave = this.imageurl;

  // ✅ upload image ONLY if new image selected
  if (this.selectedFile) {

    const result = await this.uploadImage();
    imageUrlToSave = result.secure_url;
  }

  // combine form data + image
  const productData = {
    ...this.product.value,
    image: imageUrlToSave,
  };

  // ✅ UPDATE mode
  if (this.editId) {

    await this.productService.updateProduct(this.editId, productData);
    this.toastService.success('Product Updated');

    this.editId = '';

  } else {

    // ✅ ADD mode
    await this.productService.addProduct(productData);
    this.toastService.success('Product Added');

  }

  this.product.reset();

}


  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: any) => {
      this.products = data;

      console.log(this.products);
    });
  }

  deleteProduct(id: string) {
    this.productService.delProducts(id);
  }

  editProduct(product:any){

  this.editId = product.id;

  this.imageurl = product.image;

  this.product.patchValue({
    pname: product.pname,
    price: product.price,
    pdesc: product.pdesc
  });

}

}
