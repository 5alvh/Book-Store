import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit{

  products: Product[] = [];
  currentCategoryId: number = 1;
  constructor(private productService: ProductService, private route: ActivatedRoute){
  }

  ngOnInit(): void {

    
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    }  
    )

  }

  listProducts(): void {

    //check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    
    if(hasCategoryId){
      //get the "id" param string. convert string to a number using the "+"
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }else{
      //not category available ... default id is 1
    }

    this.productService.getProductList(this.currentCategoryId).subscribe(
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
