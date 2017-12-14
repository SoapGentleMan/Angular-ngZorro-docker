import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './page/layout/layout.component';

const appRoutes: Routes = [
  {
    path: '', redirectTo: '/doon/sql-lab', pathMatch: 'full'
  },
  {
    path: '**', redirectTo: '/ww'
  },
  {
    path: 'ww',
    component: LayoutComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
