import { Component, Input, OnInit } from '@angular/core';
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

  searchMode: boolean = false;
  products: Product[] = [];
  currentCategoryId: number = 1;
  constructor(private productService: ProductService, private route: ActivatedRoute){
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts(): void {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
    

  }

  handleSearchProducts(){
    const theKeyword: string= this.route.snapshot.paramMap.get('keyword')!;

    //now search for the products using keywords
    this.productService.searchProducts(theKeyword).subscribe(
      data=>{
        this.products= data;
      }
    )
  }
  handleListProducts(){
     //check if "id" parameter is available
     const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    
     if(hasCategoryId){
       //get the "id" param string. convert string to a number using the "+"
       this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
     }else{
       //not category available ... default id is 1
       this.currentCategoryId = 1;
     }
 
     this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )  
  }



}
