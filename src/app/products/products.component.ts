import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../product.service';
import { Product, PaginatedResponse } from './product.models';
import { FormsModule } from '@angular/forms'; // Keep FormsModule for template-driven forms
import { getDefaultProduct } from '../utils/utils';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule], // Correct imports
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [ProductService]
})

export class ProductsComponent {
  products: Product[] = [];
  newProduct!: Product;
  isEditing: boolean = false;
  editingProductId: number | null = null;

  // Pagination variables
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  searchQuery: string = ''; 


  constructor(private productService: ProductService) {
    this.resetNewProduct();
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts(this.currentPage, this.pageSize, this.searchQuery).subscribe((data: PaginatedResponse<Product>) => {
      this.products = data.content;
      this.totalElements = data.totalElements;
      this.totalPages = data.totalPages;
    });
  }

  resetNewProduct(): void {
    this.newProduct = getDefaultProduct();
  }

  addProduct(): void {
    // Convert comma-separated strings to arrays for images and tags
    this.newProduct.images = this.newProduct.imagesString?.split(',') || [];
    this.newProduct.tags = this.newProduct.tagsString?.split(',') || [];
  
    if (!this.isEditing) {
      this.productService.addProduct(this.newProduct).subscribe(product => {
        this.products.push(product);
        this.resetNewProduct();
      });
    } else {
      this.productService.updateProduct(this.editingProductId!, this.newProduct).subscribe(updatedProduct => {
        const index = this.products.findIndex(p => p.id === this.editingProductId);
        this.products[index] = updatedProduct;
        this.resetNewProduct();
        this.isEditing = false;
      });
    }
  }

  editProduct(product: Product): void {
    this.isEditing = true;
    this.editingProductId = product.id;
    
    this.newProduct = {
      ...product,
      imagesString: product.images ? product.images.join(', ') : '',
      tagsString: product.tags ? product.tags.join(', ') : '',
    };
  }
  

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(() => {
      this.products = this.products.filter(product => product.id !== id);
    });
  }

  searchProducts(): void {
    this.currentPage = 0; // Reset to the first page on new search
    this.loadProducts();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  // Handle next and previous page navigation
  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadProducts();
    }
  }
}