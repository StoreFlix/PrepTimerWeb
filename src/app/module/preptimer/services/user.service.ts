import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category, CreateCategory } from '../Model/category.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UserModel } from '../Model/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly apiUrl: string;
    constructor(private http: HttpClient) {
      this.apiUrl = environment.baseUrl;  
    }// Change this to your actual API

  getUsersByCompany(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.apiUrl}api/user`);
  }

  addUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.apiUrl}api/user`, user);
  }

  updateUser(user: UserModel): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}api/user/${user.userId}`, user);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}api/user/${userId}`);
  }
}