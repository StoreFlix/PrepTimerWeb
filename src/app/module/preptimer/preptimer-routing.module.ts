import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransaltionListComponent } from './components/transaltion-list/transaltion-list.component';
import { AddTranslationComponent } from './components/add-translation/add-translation.component';
import { CondimentListComponent } from './components/condiment-list/condiment-list.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { AddCondimentComponent } from './components/add-condiment/add-condiment.component';

const routes: Routes = [
  {path:'translations',component:TransaltionListComponent},
  {path:'translation/add',component:AddTranslationComponent},
  {path:'translation/edit/:id',component:AddTranslationComponent},
  {path:'condiments',component:CondimentListComponent},
  {path:'condiments/add',component:AddCondimentComponent},
  {path:'condiments/edit/:id',component:AddCondimentComponent},

  {path:'categories',component:CategoryListComponent},
  {path:'users',component:UserListComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreptimerRoutingModule { }
