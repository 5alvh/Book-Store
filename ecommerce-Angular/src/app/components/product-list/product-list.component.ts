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
  previousCategoryId: number = 1;
  currentCategoryId: number = 1;

  //new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements:number = 0;

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
     //
     // check if we have a different category than previous
     // note: angular will reuse a component if its is currently being viewed
     //
     
     //if we have a different category id than previous
     //then set thePageNumber back to 1

     if(this.previousCategoryId != this.currentCategoryId){
        this.thePageNumber = 1;
     }

     this.previousCategoryId = this.currentCategoryId;
     console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`)
     this.productService.getProductListPaginate(this.thePageNumber-1,
                                                this.thePageSize,
                                                this.currentCategoryId)
                                                .subscribe(
                                                  data=>{
                                                    this.products = data._embedded.products;
                                                    this.thePageNumber= data.page.number+1;
                                                    this.thePageSize = data.page.size;
                                                    this.theTotalElements = data.page.totalElements;
                                                  }
                                                ) 
  }



}
