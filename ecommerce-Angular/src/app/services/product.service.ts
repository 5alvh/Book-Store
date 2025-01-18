import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseProductUrl = "http://localhost:8080/api/products";
  private baseProductCategoryUrl = "http://localhost:8080/api/product-category";

  
  constructor(private httpClient: HttpClient) { }

  getProductList(categoryId: number): Observable<Product[]>{
    
    const searchUrl = this.baseProductUrl+"/search/findByCategoryId?id="+categoryId;
    
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response._embedded.products)
    )
  } 

  getProductCategories() : Observable<ProductCategory[]>{
    return this.httpClient.get<GetResponseProductCategory>(this.baseProductCategoryUrl).pipe(
      map(response => response._embedded.productCategory)
    )
  }
}

interface GetResponseProduct {
   _embedded: {
        products: Product[];
    };
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
   };
}
