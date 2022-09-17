import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product.interface';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  public products: Product[];

  public pagination = {
    limit: 10,
    offset: 0
  }

  constructor(private _productService: ProductService) {
    this.products = [];
  }

  ngOnInit(): void {
    this._fetchProducts();
  }

  private _fetchProducts(): void {
    this._productService.getAllProductsSimple().subscribe({
      next: (products) => {
        this.products = products;
      }
    })
  }

  public paginationManager(page: number): void {
    this.pagination.offset += page;
    this._fetchProducts();
  }
}
