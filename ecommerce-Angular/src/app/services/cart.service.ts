import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  cartItems: CartItem[]=[];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();
  constructor() { }

  addCart(theCartItem: CartItem){
    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;

    if(this.cartItems.length>0){
    // find the item in the cart based on item id
    /*for(let item of this.cartItems){
      if(item.id == theCartItem.id){
        existingCartItem = item;
      }
    }*/
    existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id)
    // check if we found it
    alreadyExistsInCart = (existingCartItem != undefined)
    }

    if(alreadyExistsInCart){
      // increment the quantity
      existingCartItem!.quantity++;
    }else{
      // just add the item to the array+
      this.cartItems.push(theCartItem);
    }

    //compute cart total price and total quantity
    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    //send new data to subscribers
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue)

    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name:${tempCartItem.name}, unitPrice=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log("----------------------------")
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if(cartItem.quantity===0){
      this.remove(cartItem)
    }else{
      this.computeCartTotals()
    }
  }
  remove(cartItem: CartItem) {
    // get index of item in the array
    const index = this.cartItems.findIndex(theCartItem=> theCartItem.id === cartItem.id);

    // if found, remove the item from the array at the given index
    if(index > -1){
      this.cartItems.splice(index,1)
      this.computeCartTotals();
    }
  }
}
