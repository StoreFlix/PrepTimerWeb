import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PreptimerRoutingModule } from './preptimer-routing.module';
import { TransaltionListComponent } from './components/transaltion-list/transaltion-list.component';
import { AddTranslationComponent } from './components/add-translation/add-translation.component';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { CondimentListComponent } from './components/condiment-list/condiment-list.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryFormComponent } from './components/add-category/add-category.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { AddCondimentComponent } from './components/add-condiment/add-condiment.component';
import { ViewCondimentComponent } from './components/view-condiment/view-condiment.component';


@NgModule({
  declarations: [TransaltionListComponent,AddTranslationComponent,CondimentListComponent,CategoryListComponent,CategoryFormComponent,UserListComponent,AddCondimentComponent,ViewCondimentComponent],
  imports: [
    CommonModule,
    RouterModule,
    PreptimerRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PreptimerModule { }
