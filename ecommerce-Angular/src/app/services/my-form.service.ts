import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyFormService {

  constructor() { }

  getCreditCardMonths(startMonth: number) : Observable<number[]> {
    let data: number[] = [];

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];


    const strartYear: number = new Date().getFullYear();
    const endYear: number = strartYear + 10;

    for (let theYear = strartYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);
  }
}
