import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: false,
  
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  constructor(private router: Router){

  }

  doSearch(value: string){
    console.log("value: "+value)
    this.router.navigateByUrl("/search/"+value)
  }
}
