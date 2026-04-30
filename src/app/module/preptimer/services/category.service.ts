import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category, CreateCategory } from '../Model/category.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {

  private readonly apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = environment.baseUrl;  
  }


  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}api/category`);
  }

  addCategory(category: any): Observable<any> {
    return this.http.post(`${this.apiUrl}api/category`, category);
  }

  updateCategory(category: any): Observable<any> {
    return this.http.put(`${this.apiUrl}api/category/${category.categoryId}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}api/category/${id}`);
  }

 
}
