import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MyFormService } from '../../services/my-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { CustomValidators } from '../../validators/custom-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';

@Component({
  selector: 'app-checkout',
  standalone: false,
  
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[]=[];
  shippingAdressStates: State[] = [];
  billingAdressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
    private myFormService: MyFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router) { }
  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',[Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace]),
        lastName: new FormControl('',[Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace]),
        email: new FormControl('',[Validators.required, Validators.email])
      }),

      shippingAdress: this.formBuilder.group({
        street:new FormControl('',[Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace]),
        city:new FormControl('',[Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace]),
        state:new FormControl('',[Validators.required]),
        country:new FormControl('',[Validators.required]),
        zipCode:new FormControl('',[Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace])
      }),
      billingAdress: this.formBuilder.group({
        street:new FormControl('',[Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace]),
        city:new FormControl('',[Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace]),
        state:new FormControl('',[Validators.required]),
        country:new FormControl('',[Validators.required]),
        zipCode:new FormControl('',[Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType:new FormControl('',[Validators.required]),
        nameOnCard:new FormControl('',[Validators.required, Validators.minLength(2),CustomValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('',[Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode:new FormControl('',[Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth:[''],
        expirationYear:['']
      })
    })  
    const startMonth: number = new Date().getMonth()+1;
    this.myFormService.getCreditCardMonths(startMonth).subscribe(
      data =>{
        console.log("Retrieved credit card months: "+JSON.stringify(data));
        this.creditCardMonths = data
    })

    this.myFormService.getCreditCardYears().subscribe(
      data => this.creditCardYears = data
    )

    //populate countries
    this.myFormService.getCountries().subscribe(
      
      data =>{
        console.log("Retrieved countries: "+JSON.stringify(data)),
        this.countries = data
      } 
    )

    this.reviewCartDetails();

  }
  

  onSubmit() {
    console.log("Handling the submit button");

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //get cart items
    const cartItems = this.cartService.cartItems;

    //create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    /*let orderItems: OrderItem[] = [];
    for(let i=0; i<cartItems.length; i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }*/

    //set up purchase
    let purchase = new Purchase();

    //populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAdress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state))
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country))
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAdress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state))
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country))
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    //populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response =>{
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
          this.resetCart();
        },
        error: err =>{
          alert(`There was an error: ${err.message}`)
        } 
      }
    );
  }
  resetCart() {
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //reset the form
    this.checkoutFormGroup.reset();

    //navigate back to products page
    this.router.navigateByUrl("/products")
  }
  
  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}
  get email(){return this.checkoutFormGroup.get('customer.email')}
  
  get shippingAdressStreet(){return this.checkoutFormGroup.get('shippingAdress.street')}
  get shippingAdressCity(){return this.checkoutFormGroup.get('shippingAdress.city')}
  get shippingAdressState(){return this.checkoutFormGroup.get('shippingAdress.state')}
  get shippingAdressCountry(){return this.checkoutFormGroup.get('shippingAdress.country')}
  get shippingAdressZipCode(){return this.checkoutFormGroup.get('shippingAdress.zipCode')}

  get billingAdressStreet(){return this.checkoutFormGroup.get('billingAdress.street')}
  get billingAdressCity(){return this.checkoutFormGroup.get('billingAdress.city')}
  get billingAdressState(){return this.checkoutFormGroup.get('billingAdress.state')}
  get billingAdressCountry(){return this.checkoutFormGroup.get('billingAdress.country')}
  get billingAdressZipCode(){return this.checkoutFormGroup.get('billingAdress.zipCode')}
  
  get creditCardType(){return this.checkoutFormGroup.get('creditCard.cardType')}
  get creditCardNameOnCard(){return this.checkoutFormGroup.get('creditCard.nameOnCard')}
  get creditCardNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber')}
  get creditCarSecurityCode(){return this.checkoutFormGroup.get('creditCard.securityCode')}

  copyShippingAdressToBillingAdress(event: Event) {

    if ((event.target as HTMLInputElement)?.checked) {
      this.checkoutFormGroup.controls['billingAdress'].setValue(this.checkoutFormGroup.controls['shippingAdress'].value);
      this.billingAdressStates = this.shippingAdressStates;
    } else {
      this.checkoutFormGroup.controls['billingAdress'].reset();
      this.billingAdressStates = [];
    }
  }
  reviewCartDetails() {
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    )

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number=1;
    if(currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }

    this.myFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    )
  }
  handleStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;
    
    console.log(`${formGroupName} country code: ${countryCode}, name: ${countryName}` )
    
    this.myFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAdress') {
          this.shippingAdressStates = data;
        } else {
          this.billingAdressStates = data;
        }

        //select the first state as default
        formGroup?.get('state')?.setValue(data[0])
      }
    )
  }
}
