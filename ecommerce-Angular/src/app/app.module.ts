import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';

const routes: Routes=[
  {path:'category/:id',component:ProductListComponent},
  {path:'category',component:ProductListComponent},
  {path:'products',component:ProductListComponent},
  {path:'',redirectTo:'/products', pathMatch:'full'},
  {path:'**',redirectTo:'/products', pathMatch:'full'}
]
@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent
      ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
