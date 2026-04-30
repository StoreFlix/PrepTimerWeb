import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormGroupDirective } from '@angular/forms';
import { PreptimerService } from '../../services/preptimer.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-translation',
  templateUrl: './add-translation.component.html',
  styleUrl: './add-translation.component.scss'
})
export class AddTranslationComponent  implements OnInit  {
  translationForm: FormGroup;
  selectedFile: File | null = null;
  editMode = false;
  translationId: number | null = null;
  currentFilePath: string | null = null;
  showFileInput= false;
  constructor(private fb: FormBuilder,private _ptsvc:PreptimerService,private router: Router, private route: ActivatedRoute,) {
   
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  ngOnInit() {
    // Check if there's an 'id' in the route (edit mode)

    this.translationForm = this.fb.group({
      id: [0], 
      name: ['', [Validators.required, Validators.maxLength(100)]],
      locale: ['', [Validators.required, Validators.pattern('^[a-z]{2}$')]], // Example: en, fr, de
      filePath:[null],
      langFile: [null]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.translationId = +id;
        this.loadTranslation(this.translationId);
      }
    });
  }

  loadTranslation(id: number) {
    this._ptsvc.getTranslationById(id).subscribe(data => {
      debugger
      if(data && data.length )
      this.translationForm.patchValue({
        id: data[0].id,
        name: data[0].name,
        locale: data[0].locale,
        filePath:data[0].filePath
      });
      this.currentFilePath = data[0].filePath; 
    });
  }

  onReplaceClick() {
  this.showFileInput= true;
  this.selectedFile = null;
}

  onSubmit() {
    if (this.translationForm.valid) {
      const formData = new FormData();
      formData.append('Id', this.translationForm.get('id')?.value);
      formData.append('name', this.translationForm.get('name')?.value);
      formData.append('locale', this.translationForm.get('locale')?.value);
      if (this.selectedFile) {
        formData.append('langFile', this.selectedFile);
      }
      else if (this.editMode) {
        // If edit mode and no new file chosen, still send existing file path
        formData.append('filePath', this.currentFilePath || '');
      }

    this._ptsvc.uploadTranslation(formData).subscribe({
      next: (response) => {
        Swal.fire({
          title: this.editMode
            ? 'Translation updated successfully!'
            : 'Translation added successfully!',
          icon: 'success',
          willClose: () => {
            this.router.navigate(['preptimer/translations']);
          }
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'Error uploading translation.',
          icon: 'error'
        });
      }
    });
    }
  }

}
