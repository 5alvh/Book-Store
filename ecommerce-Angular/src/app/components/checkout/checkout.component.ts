import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MyFormService } from '../../services/my-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { CustomValidators } from '../../validators/custom-validators';

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

  constructor(private formBuilder: FormBuilder, private myFormService: MyFormService) { }
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
  }

  onSubmit() {
    console.log("Handling the submit button");

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The Email Adress is "+this.checkoutFormGroup.get('customer')?.value.email);
    
    console.log("The shipping address country is "+this.checkoutFormGroup.get('shippingAdress')?.value.country.name);
    console.log("The shipping address state is "+this.checkoutFormGroup.get('shippingAdress')?.value.state.name);
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
