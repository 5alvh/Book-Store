import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

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

  previousKeyword: string="";

  constructor(private productService: ProductService,
     private cartService: CartService,
     private route: ActivatedRoute){
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber= 1;
    this.listProducts();
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

    //if we have a different keyword than previous
    //then set thePageNumber to 1

    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`)
    
    //now search for the products using keywords
    this.productService.searchProductPaginate(this.thePageNumber-1,
                                              this.thePageSize,
                                              theKeyword).subscribe(
                                                this.processResult()
                                              );
    
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
                                                  this.processResult()
                                                ) 
  }

  processResult(){
    return (data: any)=>{
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number +1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  addToCart(product: Product) {
    console.log(`Adding to cart: ${product.name}, ${product.unitPrice}`)
  
    const theCartItem = new CartItem(product);

    this.cartService.addToCart(theCartItem);
  }
}
