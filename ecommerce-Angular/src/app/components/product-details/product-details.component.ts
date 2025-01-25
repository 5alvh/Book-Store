import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: false,
  
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {


  product!:Product;
  constructor(private route: ActivatedRoute, private productService: ProductService, private cartService: CartService){

  }

  ngOnInit(): void {
    /*const theId:number = +this.route.snapshot.paramMap.get('id')!;
    this.product = this.productService*/
    this.route.paramMap.subscribe(()=>{
      this.handleProductDetails();
    })
    
  }
  handleProductDetails(){

    //get the id from the route (+ to convert it to the type: number)

    const theId:number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProduct(theId).subscribe(
      data=>{
        this.product = data;
      }
    )
  }

  addToCart() {
    console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`)
    const theCartItem = new CartItem(this.product);
    
    this.cartService.addCart(theCartItem);
  }
  
}
