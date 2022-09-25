import { HttpStatusCode, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { Product, ProductDto } from '../interfaces/product.interface';
import { generateProduct, generateProducts } from '../interfaces/product.mock';

import { ProductService } from './product.service';
import { TokenService } from './token.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ProductService,
        {
          provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
        }
      ]
    });
    service = TestBed.inject(ProductService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Test for getAllProductsSimpl e method', () => {
    it('should return a product list', (doneFn) => {
      // Arrange
      const mockData: Product[] = [
        {
          id: '123',
          title: 'car',
          price: 3000,
          images: [],
          description: 'A car',
          category: {
            id: 1,
            name: 'Vehicles'
          }
        }
      ]
      // Act
      service.getAllProductsSimple().subscribe({
        next: (data: Product[]) => {
          // Assert
          expect(data).toEqual(mockData);
          doneFn();
        }
      });

      // http config
      const url: string = `${environment.API_URL}products`;
      const req: TestRequest = httpController.expectOne(url);
      req.flush(mockData);
    });
    it('should return a product list with faker js', (doneFn) => {
      // Arrange
      const mockData: Product[] = generateProducts(11);
      // Act
      service.getAllProductsSimple().subscribe({
        next: (data: Product[]) => {
          // Assert
          expect(data).toEqual(mockData);
          doneFn();
        }
      });

      // http config
      const url: string = `${environment.API_URL}products`;
      const req: TestRequest = httpController.expectOne(url);
      req.flush(mockData);
    });
  });
  describe('Test for getAllProducts method', () => {
    it('should return a product list', (doneFn) => {
      // Arrange
      const mockData: Product[] = generateProducts(10);
      // Act
      service.getAllProducts().subscribe({
        next: (data: Product[]) => {
          // Assert
          expect(data.length).toEqual(mockData.length);
          doneFn();
        }
      });

      // http config
      const req: TestRequest = httpController.expectOne(req => req.params.has('limit') && req.params.has('offset'));
      req.flush(mockData);
    });
    it('should return a product list with taxes', (doneFn) => {
      // Arrange
      const mockData: Product[] = [
        {
          ...generateProduct(),
          price: 100 // 100 * .019 = 19
        },
        {
          ...generateProduct(),
          price: 200 // 200 * .019 = 38
        }
      ]

      // Act
      service.getAllProducts().subscribe({
        next: (data: Product[]) => {
          // Assert
          expect(data.length).toEqual(mockData.length);
          expect(data[0].taxes).toEqual(19);
          expect(data[1].taxes).toEqual(38);
          doneFn();
        }
      });
      // http config
      const req: TestRequest = httpController.expectOne(req => req.params.has('limit') && req.params.has('offset'));
      req.flush(mockData);
    });
    it('should not return a negative price', (doneFn) => {
      // Arrange
      const mockData: Product[] = [
        {
          ...generateProduct(),
          price: -40 // 100 * .019 = 19
        },
        {
          ...generateProduct(),
          price: -19 // 200 * .019 = 38
        }
      ]

      // Act
      service.getAllProducts().subscribe({
        next: (data: Product[]) => {
          // Assert
          expect(data.length).toEqual(mockData.length);
          expect(data[0].taxes).toEqual(0);
          expect(data[1].taxes).toEqual(0);
          doneFn();
        }
      });
      // http config
      const req: TestRequest = httpController.expectOne(req => req.params.has('limit') && req.params.has('offset'));
      req.flush(mockData);
    });
    it('should have limit param more than 0', (doneFn) => {
      // Arrange
      const mockData: Product[] = [
        {
          ...generateProduct(),
          price: 100 // 100 * .019 = 19
        },
        {
          ...generateProduct(),
          price: 200 // 200 * .019 = 38
        }
      ]

      // Act
      service.getAllProducts(-1, 5).subscribe({
        next: (data: Product[]) => {
          // Assert
          expect(data.length).toEqual(mockData.length);
          expect(data[0].taxes).toEqual(19);
          expect(data[1].taxes).toEqual(38);
          doneFn();
        }
      });
      // http config
      const req: TestRequest = httpController.expectOne(req => req.params.has('limit') && req.params.has('offset'));
      expect(req.request.params.get('limit')).toBeGreaterThan(0)
      req.flush(mockData);
    });
  });
  describe('Test for create product', () => {
    it('should return a new product', (doneFn) => {
      // Arrange
      const {category, ...others} = generateProduct();
      const dto: ProductDto = {
        ...others,
        categoryId: category.id
      }
      // Act
      service.create({...dto}).subscribe({
        next: (data: Product) => {
          // Assert
          expect(data).toEqual({category, ...others});
          doneFn();
        }
      })

      const url: string = `${environment.API_URL}products`;
      const req: TestRequest = httpController.expectOne(url);
      req.flush({category, ...others});
      // Checks if the sended data to the method is equal to the sended data to the server
      expect(req.request.body).toEqual(dto)
      expect(req.request.method).toEqual('POST');
    })
  });
  describe('Test for update product', () => {
    it('should return a updated product', (doneFn) => {
      // Arrange
      const {category, ...others} = generateProduct();
      others.price = 200.000;
      const productId: string = 'wdwfsefdrgdrgdg';
      const dto: ProductDto = {
        ...others,
        categoryId: category.id
      }
      // Act
      service.update(productId, {...dto}).subscribe({
        next: (data: Product) => {
          // Assert
          expect(data).toEqual({category, ...others});
          doneFn();
        }
      })

      const url: string = `${environment.API_URL}products/${productId}`;
      const req: TestRequest = httpController.expectOne(url);
      const data = {category, ...others};
      data.price = 200.000;
      req.flush(data);
      // Checks if the sended data to the method is equal to the sended data to the server
      expect(req.request.body).toEqual(dto)
      expect(req.request.method).toEqual('PUT');
      httpController.verify();
    })
  });
  describe('Test for delete product', () => {
    it('should delete a product', (doneFn) => {
      // Arrange
      const productId: string = 'wdwfsefdrgdrgdg';
      // Act
      service.delete(productId).subscribe({
        next: (data: any) => {
          // Assert
          expect(data).toEqual({ ok: true});
          doneFn();
        }
      })

      const url: string = `${environment.API_URL}products/${productId}`;
      const req: TestRequest = httpController.expectOne(url);
      req.flush({ok: true});
      expect(req.request.method).toEqual('DELETE');
      httpController.verify();
    })
  });
  describe('Test for get one product', () => {
    it('should return a product', (doneFn) => {
      // Arrange
      const product: Product = generateProduct();
      const id: number = 1;
      // Act
      service.getSingleProduct(id).subscribe({
        next: (data: Product) => {
          // Assert
          expect(data).toEqual(product);
          doneFn();
        }
      })

      const url: string = `${environment.API_URL}products/${id}`;
      const req: TestRequest = httpController.expectOne(url);
      req.flush(product);
      expect(req.request.method).toEqual('GET');
    });
    it('should return an error', (doneFn) => {
      // Arrange
      const id: number = 1;
      const error = 'Ups error in the server';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: error
      };
      // Act
      service.getSingleProduct(id).subscribe({
        next: (data: Product) => {
          // Assert
          doneFn();
        },
        error: (err) => {
          expect(err).toBeInstanceOf(Error);
          doneFn();
        }
      });

      const url: string = `${environment.API_URL}products/${id}`;
      const req: TestRequest = httpController.expectOne(url);
      req.flush(new Error(error), mockError);
      expect(req.request.method).toEqual('GET');
    });
  });
  describe('Interceptor', () => {
    it('should return a token in the req', (doneFn) => {
      // Arrange
      const product: Product = generateProduct();
      const id: number = 1;

      spyOn(tokenService, 'getToken').and.returnValue('token123');

      // Act
      service.getSingleProduct(id).subscribe({
        next: (data: Product) => {
          // Assert
          expect(data).toEqual(product);
          doneFn();
        }
      })

      const url: string = `${environment.API_URL}products/${id}`;
      const req: TestRequest = httpController.expectOne(url);
      req.flush(product);
      expect(req.request.headers.get('Authorization')).toBeTruthy();
      expect(req.request.headers.get('Authorization')).toEqual('Bearer token123');
    });
  })
});
