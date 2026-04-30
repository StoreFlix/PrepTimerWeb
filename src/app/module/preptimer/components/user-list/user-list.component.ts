import { Component } from '@angular/core';
import { User } from 'src/app/core/model/menu.model';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../Model/user.model';
declare var bootstrap: any;
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})

export class UserListComponent {
  searchText: string = '';
  users:UserModel[] = [];
  selectedUser: UserModel = this.getEmptyUser();
  modalRef: any;
  constructor(private userservice:UserService) { }

  ngOnInit(): void {
    this.userservice.getUsersByCompany().subscribe((res)=>{
      this.users =res;
      console.log(res);
    })

  }
  filteredTranslations() {
    return this.users.filter(item =>
      item.firstName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      item.lastName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(this.searchText.toLowerCase()) ||
      item.phoneNumber.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  loadUsers() {
    this.userservice.getUsersByCompany().subscribe((res)=>{
      this.users =res;
      console.log(res);
    })
  }

  openModal(){
    const modal: any = document.getElementById('userModal');
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
  }

  saveUser() {
    if (this.selectedUser.userId) {
      this.userservice.updateUser(this.selectedUser).subscribe(() => {
        this.loadUsers();
      });
    } else {
      this.userservice.addUser(this.selectedUser).subscribe(() => {
        this.loadUsers();
        
      });
    }
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
  closeModal(){
    this.modalRef.hide();
  }
}

