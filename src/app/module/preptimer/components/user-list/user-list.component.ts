import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../Model/user.model';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  searchText: string = '';
  users: UserModel[] = [];
  selectedUser: UserModel = this.getEmptyUser();
  isEditMode: boolean = false;
  modalRef: any;

  constructor(private userservice: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userservice.getUsersByCompany().subscribe((res) => {
      this.users = res || [];
    });
  }

  filteredUsers() {
    const q = (this.searchText || '').toLowerCase();
    return this.users.filter(item =>
      (item.firstName || '').toLowerCase().includes(q) ||
      (item.lastName  || '').toLowerCase().includes(q) ||
      (item.email     || '').toLowerCase().includes(q)
    );
  }

  openAddUser() {
    this.isEditMode = false;
    this.selectedUser = this.getEmptyUser();
    this.showModal();
  }

  openEditUser(user: UserModel) {
    this.isEditMode = true;
    this.selectedUser = { ...user, password: '', phoneNumber: '' };
    this.showModal();
  }

  showModal() {
    const modalEl = document.getElementById('userModal');
    this.modalRef = new bootstrap.Modal(modalEl);
    this.modalRef.show();
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  saveUser() {
    const save$ = this.isEditMode
      ? this.userservice.updateUser(this.selectedUser)
      : this.userservice.addUser(this.selectedUser);

    save$.subscribe({
      next: (res: any) => {
        Swal.fire({
          title: this.isEditMode ? 'User updated successfully!' : 'User added successfully!',
          icon: 'success',
          text: res && res.message ? res.message : ''
        });
        this.closeModal();
        this.loadUsers();
      },
      error: (err) => {
        Swal.fire({
          title: 'Error saving user',
          text: err?.error?.message || err?.message || '',
          icon: 'error'
        });
      }
    });
  }

  deleteUser(userId: number) {
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
        this.userservice.deleteUser(userId).subscribe({
          next: () => {
            this.loadUsers();
            Swal.fire('Deleted!', 'User has been deleted.', 'success');
          },
          error: (err) => {
            Swal.fire({
              title: 'Error deleting user',
              text: err?.error?.message || '',
              icon: 'error'
            });
          }
        });
      }
    });
  }

  private getEmptyUser(): UserModel {
    return {
      userId: 0,
      companyId: 0,
      loginName: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      phoneNumber: ''
    };
  }
}
