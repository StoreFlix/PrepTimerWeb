import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/module/preptimer/services/category.service';
import { Category } from 'src/app/module/preptimer/Model/category.model';
import Swal from 'sweetalert2';
declare var bootstrap: any;
@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})

export class CategoryListComponent implements OnInit {
  categories = [];
  defaultCategories = [];
  customCategories = [];
  stores = [];

  categoryModel: any = {};
  isEditMode = false;
  modalRef: any;

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
    this.loadStores();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(res => {
      this.categories = res;
      this.defaultCategories = this.categories.filter(a=>a.isDefault);
      this.customCategories = this.categories.filter(a=>!a.isDefault);
    
    });
  }

  loadStores() {
    //this.storeService.getStores().subscribe(res => this.stores = res);
  }

  openAddCategory() {
    this.isEditMode = false;
    this.categoryModel = { name: '', storeIds: [] };
    this.showModal();
  }

  openEditCategory(cat: any) {
    this.isEditMode = true;
    this.categoryModel = { ...cat, storeIds: cat.storeIds || [] };
    this.showModal();
  }

  showModal() {
    const modalEl = document.getElementById('categoryModal');
    this.modalRef = new bootstrap.Modal(modalEl);
    this.modalRef.show();
  }

  saveCategory() {
    const saveObservable = this.isEditMode
      ? this.categoryService.updateCategory(this.categoryModel)
      : this.categoryService.addCategory(this.categoryModel);

    saveObservable.subscribe(() => {
      this.loadCategories();
      this.modalRef.hide();
    });
  }

  deleteCategory(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(id).subscribe(() => {
          this.loadCategories();
          Swal.fire(
            'Deleted!',
            'Category has been deleted.',
            'success'
          );
        });
      }
    });
    }
}

