import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UserModel } from '../Model/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly apiUrl: string;
    constructor(private http: HttpClient) {
      this.apiUrl = environment.baseUrl;
    }

  getUsersByCompany(companyId: number = 0): Observable<UserModel[]> {
    let params = new HttpParams();
    if (companyId) {
      params = params.set('companyId', companyId.toString());
    }
    return this.http.get<UserModel[]>(`${this.apiUrl}api/user`, { params });
  }

  addUser(user: UserModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}api/user`, user);
  }

  updateUser(user: UserModel): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}api/user/${user.userId}`, user);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}api/user/${userId}`);
  }
}
