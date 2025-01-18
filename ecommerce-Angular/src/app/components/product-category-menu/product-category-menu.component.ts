import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductCategory } from '../../common/product-category';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-category-menu',
  standalone: false,
  
  templateUrl: './product-category-menu.component.html',
  styleUrl: './product-category-menu.component.scss'
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories: ProductCategory[]=[];

  constructor(private productService: ProductService){

  }
  ngOnInit(): void {
    this.listProductCategories();
  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        console.log('Product Categoris= '+JSON.stringify(data)),
        this.productCategories= data;
      }
    )
  }


}
