import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImpressedTextPage } from './impressed-text.page';

const routes: Routes = [
  {
    path: '',
    component: ImpressedTextPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImpressedTextPageRoutingModule {}
