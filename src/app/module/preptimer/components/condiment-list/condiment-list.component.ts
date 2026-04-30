import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemService } from '../../services/item.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
export interface Item {
  icon: string;
  title: string;
  category: string;
  time: string;
  isCustom: boolean;
}
declare var bootstrap: any;
@Component({
  selector: 'app-condiment-list',
templateUrl: './condiment-list.component.html',
  styleUrl: './condiment-list.component.scss'
})



export class CondimentListComponent  {
  isEditMode = false;
  loading: boolean = true;
  modalRef: any;
  translations = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  // can dynamically fetch from DB in future
];
 

items: any[] = [];
defaultItems: any[] = [];
customItems: any[] = [];
categories: any[] = [];
itemModel: any = {
  itemId: 0,
  itemName: '',
  iconFile: null,
  iconPreview: null,
  categoryId: null,
  categoryIds: [] as number[],
   translations: {
    en: '',
    zh: '',
    fr: ''
  },
  durationHours: null,
  durationMinutes: null,
  storeIds: []
};


constructor(private itemService: ItemService, private router:Router) {}

ngOnInit(): void {
  this.loadItems();
  this.loadCategories();
}

loadItems() {
  this.loading = true;
  this.itemService.getItems().subscribe(data => {
    this.items = data
    this.defaultItems = data.filter(x => x.isDefault);
    this.customItems = data.filter(x => !x.isDefault);
    this.loading = false;
  }
  );
}

loadCategories() {
  this.itemService.getCategories().subscribe(data => this.categories = data);
}

openAddDialog(): void {
    const title = prompt("Enter item title:");
    const category = prompt("Enter category:");
    const time = prompt("Enter time (e.g., 3:00 PM):");
    if (title && category && time) {
        this.customItems.push({ icon: 'fas fa-user', title, category, time, isCustom: true });
    }
}

editItem(item: any): void {

  this.isEditMode = true; 
  this.itemModel.itemName  = item.itemName;
  this.itemModel.itemId  = item.itemId;
  this.itemModel.iconPreview  = item.icon;
  this.itemModel.categoryId  = item.categoryId;
  const timeParts = item.duration.split(':');
  this.itemModel.durationHours = Number(timeParts[0]);
  this.itemModel.durationMinutes = Number(timeParts[1]);
   // Optional: use this to toggle Save/Add logic
  this.openModal();
}

deleteItem(id: any): void {
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
            this.itemService.deleteItem(id).subscribe(() => {
              this.loadItems();
              Swal.fire(
                'Deleted!',
                'Item has been deleted.',
                'success'
              );
            });
          }
        });
}

saveItem() {
  const formData = new FormData();
  formData.append('itemName', this.itemModel.itemName);
  if (this.itemModel.iconFile) {
    formData.append('logo', this.itemModel.iconFile);
  }
  formData.append('categoryId', this.itemModel.categoryId);
  formData.append('itemId', this.itemModel.itemId);
  formData.append('duration', `${this.itemModel.durationHours}:${this.itemModel.durationMinutes}`);
  if (this.isEditMode) {
    this.itemService.updateItem(this.itemModel.itemId, formData).subscribe(() => {
      this.loadItems();
      this.closeModal();
    });
  } else {
    this.itemService.addItem(formData).subscribe(() => {
      this.loadItems();
      this.closeModal();
    });
  }
  
}

openAddModal() {
  this.isEditMode = false;


  this.resetForm();
  this.openModal();
 
}

openModal(){
  const modal: any = document.getElementById('itemModal');
  const bootstrapModal = new bootstrap.Modal(modal);
  bootstrapModal.show();
}


onIconFileChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.itemModel.iconFile = file;
    const reader = new FileReader();
    reader.onload = e => this.itemModel.iconPreview = reader.result;
    reader.readAsDataURL(file);
  }
}

openAddCategory() {
  this.isEditMode = false;
  
  this.showModal();
}

resetForm() {
  this.itemModel = {
    id: 0,
    name: '',
    iconFile: null,
    iconPreview: null,
    categoryId: null,
    durationHours: null,
    durationMinutes: null,
    storeIds: []
  };
}

showModal() {
  const modalEl = document.getElementById('itemModal');
  this.modalRef = new bootstrap.Modal(modalEl);
  this.modalRef.show();
}
closeModal(){
  this.modalRef.hide();
}

formatDurationOld(duration: string): string {
  const [hours, minutes, seconds] = duration.split(':').map(Number);
  const hrPart = hours > 0 ? `${hours} hr` : '';
  const minPart = minutes > 0 ? `${minutes} min` : '';
  return [hrPart, minPart].filter(Boolean).join(' ');
}

formatDuration(duration: string | number): string {
  const totalMinutes = Number(duration);

  if (isNaN(totalMinutes) || totalMinutes < 0) {
    return '';
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
}
onCategoryToggle(categoryId: number, event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  if (checked) {
    this.itemModel.categoryIds.push(categoryId);
  } else {
    this.itemModel.categoryIds = this.itemModel.categoryIds.filter(id => id !== categoryId);
  }
}
isAllSelected(): boolean {
  return this.categories?.length > 0 &&
         this.itemModel.categoryIds.length === this.categories.length;
}

toggleSelectAll(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  if (checked) {
    this.itemModel.categoryIds = this.categories.map(c => c.categoryId);
  } else {
    this.itemModel.categoryIds = [];
  }
}

 onEdit(id: number) {
  this.router.navigate([`/preptimer/condiments/edit`, id]);
}

}
