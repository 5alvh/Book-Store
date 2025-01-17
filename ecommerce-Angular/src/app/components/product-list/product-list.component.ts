import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list-table.component.html',
  //templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit{

  products: Product[] = [];

  constructor(private productService: ProductService){
  }

  ngOnInit(): void {
    this.listProducts();
    console.log(this.products[0].imageUrl)
  }

  listProducts(): void {
    this.productService.getProductList().subscribe(
      data => {
        this.products = data;
        console.log(this.products)
      },
      error => {
        console.error('Error fetching product data', error);
      }
    );
  }



}
