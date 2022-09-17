import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product, ProductDto } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private _api: string = environment.API_URL;

  constructor(private _http: HttpClient) { }


  public getProductsByCategory(
    categoryId: string,
    limit:number = 10,
    offset: number = 0
  ): Observable<Product[]> {
    const params: HttpParams = new HttpParams()
      .set('limit',limit)
      .set('offset',offset);
    return this._http.get<Product[]>(`${environment.API_URL}categories/${categoryId}/products`,{
      params
    });
  }

  public getAllProductsSimple(): Observable<Product[]> {
    return this._http.get<Product[]>(this._api+'products')
  }

  public getAllProducts(limit:number = 10, offset: number = 0): Observable<Product[]> {
    const params: HttpParams = new HttpParams()
      .set('limit',(limit <= 0) ? 1 : limit)
      .set('offset',offset)
    return this._http.get<Product[]>(this._api+'products', {
      params
    }).pipe(
      retry(3),
      map(products => products.map(product => {
        return {
          ...product,
          taxes: ((product.price < 0) ? 0 : product.price * 0.19)
        }
      }))
    )
  }

  public getSingleProduct(id: number | string): Observable<Product> {
    return this._http.get<Product>(`${this._api}products/${id}`)
      .pipe(
        catchError( (error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.InternalServerError ) {
            return throwError(() => new Error('Ups error in the server'));
          }
          return throwError(() => new Error('Ups spomething goes wrong'));
        } )
      );
  }

  public create(dto: ProductDto): Observable<Product> {
    return this._http.post<Product>(`${this._api}products`, dto);
  }

  public update(id: string,dto: ProductDto): Observable<Product> {
    return this._http.put<Product>(`${this._api}products/${id}`, dto);
  }

  public delete(id: string): Observable<any> {
    return this._http.delete<any>(`${this._api}products/${id}`);
  }

}
