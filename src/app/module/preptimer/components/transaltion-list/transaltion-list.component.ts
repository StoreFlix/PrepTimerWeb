import { Component, OnInit } from '@angular/core';
import { Translation } from '../../Model/translation';
import { PreptimerService } from '../../services/preptimer.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaltion-list',
  templateUrl: './transaltion-list.component.html',
  styleUrl: './transaltion-list.component.scss'
})
export class TransaltionListComponent implements OnInit  {
  searchText: string = '';
  translations:Translation[] = [];
  
  constructor(private ptsvc:PreptimerService,private router:Router) { }

  ngOnInit(): void {
    this.ptsvc.getTranslationList().subscribe((res)=>{
      this.translations =res;
      console.log(res);
    })

  }
  filteredTranslations() {
    return this.translations.filter(item =>
      item.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      item.locale.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  loadTranslations(){
     this.ptsvc.getTranslationList().subscribe((res)=>{
      this.translations =res;
      console.log(res);
    })
  }

  onEdit(id: number) {
  this.router.navigate([`/preptimer/translation/edit`, id]);
}

  onDelete(id: number) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This translation will be permanently deleted!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#1a3668',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      this.ptsvc.deleteTranslationById(id).subscribe({
        next: (res) => {
          Swal.fire({
            title: 'Deleted!',
            text: 'Translation has been deleted.',
            icon: 'success',
            confirmButtonColor: '#1a3668'
          });
          this.loadTranslations(); // refresh list
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            title: 'Error',
            text: 'Something went wrong while deleting.',
            icon: 'error',
            confirmButtonColor: '#1a3668'
          });
        }
      });
    }
  });
}

}
