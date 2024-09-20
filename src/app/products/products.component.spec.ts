import { ProductsComponent } from './products.component';
import { ProductService } from '../product.service';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let productService: ProductService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  const mockProducts = [
    {
      id: 1,
      meta: { barcode: '123456', createdAt: '', updatedAt: '', qrCode: '' },
      title: 'Product 1',
      images: ['image1.png'],
      rating: 4.5,
      price: 10.99,
      tags: ['tag1', 'tag2']
    },
    {
      id: 2,
      meta: { barcode: '654321', createdAt: '', updatedAt: '', qrCode: '' },
      title: 'Product 2',
      images: ['image2.png'],
      rating: 4.0,
      price: 15.99,
      tags: ['tag3', 'tag4']
    }
  ];

  const newProduct = {
    id: 3,
    meta: { barcode: '789', createdAt: '', updatedAt: '', qrCode: 'qr3' },
    title: 'Product 3',
    images: ['image3.png'],
    rating: 4,
    price: 300,
    tags: ['tag5']
  };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    productService = new ProductService(httpClientSpy); // Provide the spy as HttpClient
    component = new ProductsComponent(productService); // Create the component with the mocked service
  });

  it('should load products on init', () => {
    // Arrange: Mock the HttpClient to return an observable of paginated response
    const paginatedResponse = {
      content: mockProducts,
      totalElements: mockProducts.length,
      totalPages: 1,
      size: mockProducts.length,
      number: 0,
    };

    httpClientSpy.get.and.returnValue(of(paginatedResponse));

    // Act: Call ngOnInit to trigger the data loading
    component.ngOnInit();

    // Assert: Verify if products have been loaded correctly
    expect(component.products.length).toBe(2);
    expect(component.products).toEqual(mockProducts);
  });

  it('should add a new product', () => {
    // Arrange: Mock the addProduct method to return an observable of the new product
    httpClientSpy.post.and.returnValue(of(newProduct));

    // Act: Add a new product
    component.newProduct = { ...newProduct };
    component.addProduct();

    // Assert: Verify if the new product was added correctly
    expect(component.products.length).toBe(1);
    expect(component.products[0]).toEqual(newProduct);
  });

  it('should delete a product', () => {
    // Arrange: Initialize with mock products
    component.products = [...mockProducts];

    // Mock the deleteProduct method
    httpClientSpy.delete.and.returnValue(of({}));

    // Act: Delete the first product
    component.deleteProduct(1);

    // Assert: Verify if the product was removed correctly
    expect(component.products.length).toBe(1); // Should now have only one product
    expect(component.products[0].id).toBe(2); // The second product remains
  });

  it('should edit an existing product', () => {
    // Arrange: Initialize component.products with mock products
    component.products = [...mockProducts];

    // Mock the updateProduct method to return the updated product
    const updatedProduct = { ...mockProducts[0], title: 'Updated Product 1' };
    httpClientSpy.put.and.returnValue(of(updatedProduct));

    // Act: Edit the first product
    component.editProduct(mockProducts[0]);
    component.newProduct.title = 'Updated Product 1';
    component.addProduct(); // This triggers update

    // Assert: Verify if the product was updated correctly
    expect(component.products.length).toBe(2); // Should still have two products
    expect(component.products[0].title).toBe('Updated Product 1'); // Check the updated title
  });
});
