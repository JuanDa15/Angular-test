import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PicoPreviewsComponent } from './components/pico-previews/pico-previews.component';
import { ProductsComponent } from './components/products/products.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        pathMatch: 'full',
        component: HomeComponent
      },
      {
        path: 'products',
        pathMatch: 'full',
        component: ProductsComponent
      },
      {
        path: 'pico-previews',
        pathMatch: 'full',
        component: PicoPreviewsComponent
      },
      {
        path: '**',
        redirectTo: '/home'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
