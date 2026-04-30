import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateCategory } from 'src/app/module/preptimer/Model/category.model';
import { CategoryService } from 'src/app/module/preptimer/services/category.service';
@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class CategoryFormComponent {
  @Input() category: any;
  @Output() close = new EventEmitter<void>();

  categoryName: string = '';
  selectedStores: number[] = [1]; // Store selection logic pending

  constructor(private service: CategoryService) {}

  ngOnInit() {
    if (this.category) {
      this.categoryName = this.category.categoryName;
    }
  }

  save() {
    const data: CreateCategory = {
      categoryName: this.categoryName,
       storeIds: this.selectedStores
    };
    this.service.addCategory(data).subscribe(() => this.close.emit());
  }

  cancel() {
    this.close.emit();
  }
}
