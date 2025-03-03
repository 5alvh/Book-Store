import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MyFormService } from '../../services/my-form.service';

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
  constructor(private formBuilder: FormBuilder, private myFormService: MyFormService) { }
  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),

      shippingAdress: this.formBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        zipCode:['']
      }),
      billingAdress: this.formBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        zipCode:['']
      }),
      creditCard: this.formBuilder.group({
        cardType:[''],
        nameOnCard:[''],
        cardNumber:[''],
        securityCode:[''],
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
  }

  onSubmit() {
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The Email Adress is "+this.checkoutFormGroup.get('customer')?.value.email);
  }
  
  copyShippingAdressToBillingAdress(event: Event) {

    if ((event.target as HTMLInputElement)?.checked) {
      this.checkoutFormGroup.controls['billingAdress'].setValue(this.checkoutFormGroup.controls['shippingAdress'].value);
    } else {
      this.checkoutFormGroup.controls['billingAdress'].reset();
    }
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
}
