import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemService } from '../../services/item.service';
import { PreptimerService } from '../../services/preptimer.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-condiment',
  templateUrl: './add-condiment.component.html',
  styleUrl: './add-condiment.component.scss'
})
export class AddCondimentComponent implements OnInit {
  itemForm!: FormGroup;
  isEditMode = false;
  isDefault = false;
  itemId: number | null = null;
  
  categories: any[] = [];
  translations: any[] = [];   // e.g. [{code:'en', name:'English'}, {code:'fr', name:'French'}]
  selectedCategories: number[] = [];

  iconPreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder,private itemService: ItemService, private timerService:PreptimerService,
     private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(){

     this.itemId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.itemId;

     this.itemService.getCategories().subscribe(cats => {
      this.categories = cats;
    });

    // load translations then build form
    this.timerService.getTranslationList().subscribe(trans => {
      this.translations = trans;
      this.buildForm();

       if (this.isEditMode && this.itemId) {
        this.loadItem(this.itemId);
      }
    });
  }

 

  private buildForm(): void {

    const translationsGroup: any = {};
    this.translations.forEach(lang => {
      translationsGroup[lang.locale] = ['']; // no Validators.required → we check manually
    });

    this.itemForm = this.fb.group({
      itemId: [0], 
      icon: [null, this.isEditMode ? [] : Validators.required],
      duration: [null, [Validators.required, Validators.min(1)]],
       translations: this.fb.group(translationsGroup)
    });

    // dynamically add translation controls
    
  }

   private loadItem(id: number): void {
    this.itemService.getItemDetailsById(id).subscribe(item => {
      if (!item) return;

      // Shared items (owned by Antunes) are read-only for other companies
      if (item.isDefault || !item.canEdit) {
        this.isDefault = true;
        this.itemForm.disable();
      }

      this.itemForm.patchValue({
        itemId: item.itemId,
        duration: item.duration
      });

      // Set translations
      if (item.translations) {
        const translationsGroup: any = {};
        item.translations.forEach((t: any) => {
          translationsGroup[t.locale] = t.itemName;
        });
        this.itemForm.get('translations')?.patchValue(translationsGroup);
      }

      // Categories
      if (item.categories) {
        this.selectedCategories = item.categories;;
      }

      // Icon preview
      if (item.iconUrl) {
        this.iconPreview = item.iconUrl;
      }
    });
  }

  


  onIconFileChange(event: any) {
  const file = event.target.files[0];
  if (file) {
     this.itemForm.patchValue({ icon: file });

      const reader = new FileReader();
      reader.onload = () => (this.iconPreview = reader.result);
      reader.readAsDataURL(file);
  }
}
saveItem() {
  debugger
   if (!this.itemForm) return;

    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

  const translationsGroup = this.itemForm.get('translations')?.value;
  const filledTranslations = Object.keys(translationsGroup)
    .filter(locale => translationsGroup[locale]?.trim() !== '')
    .map(locale => ({
      locale,
      itemName: translationsGroup[locale].trim()
    }));

  if (filledTranslations.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Translation',
      text: 'Please enter at least one translation before saving.'
    });
    return;
  }


    const formData = new FormData();

    // icon
    if (this.itemForm.get('icon')?.value) {
      formData.append('icon', this.itemForm.get('icon')?.value);
    }

    // duration
    formData.append('duration', this.itemForm.get('duration')?.value);

    // categories
   // formData.append('categories', JSON.stringify(this.selectedCategories));

  this.selectedCategories.forEach(catId => {
    formData.append("categories", catId.toString());
  });

    // translations
    // formData.append('translations', JSON.stringify(filledTranslations));

  filledTranslations.forEach((t, i) => {
    formData.append(`Translations[${i}].Locale`, t.locale);
    formData.append(`Translations[${i}].ItemName`, t.itemName);
  });

    

  if (this.isEditMode) {
    this.itemService.updateItem(this.itemId, formData).subscribe(() => {
      Swal.fire({
          icon: 'success',
          title: 'Item updated successfully!',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/preptimer/condiments']);
        });

    });
  } else {
    this.itemService.addItem(formData).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Item added successfully!',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        this.router.navigate(['/preptimer/condiments']);
      });
    });
  }
  
}


loadCategories() {
  this.itemService.getCategories().subscribe(data => this.categories = data);
}
 onCategoryToggle(categoryId: number, event: any): void {
    if (event.target.checked) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    }
  }

  onEdit(id: number) {
  this.router.navigate([`/preptimer/condiments/edit`, id]);
}

}
