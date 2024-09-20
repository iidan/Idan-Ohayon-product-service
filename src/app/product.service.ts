import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'; 
import { Product, PaginatedResponse } from './products/product.models';

@Injectable({providedIn: 'root'})

export class ProductService {
  private apiUrl = environment.apiUrl; // Use environment config for the API URL

  constructor(private http: HttpClient) { }

  getProducts(page: number, size: number, search: string = ''): Observable<PaginatedResponse<Product>> {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    return this.http.get<PaginatedResponse<Product>>(`${this.apiUrl}/all-products?page=${page}&size=${size}${searchParam}`);
  }
  

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/add-product`, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  searchProducts(search: string, page: number, size: number): Observable<PaginatedResponse<Product>> {
    return this.http.get<PaginatedResponse<Product>>(
      `${this.apiUrl}/all-products?search=${search}&page=${page}&size=${size}`
    );
  }
}