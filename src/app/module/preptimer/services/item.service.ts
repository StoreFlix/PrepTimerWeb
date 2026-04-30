import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category, CreateCategory } from '../Model/category.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ItemService {

  private readonly apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = environment.baseUrl;  
  }


  getItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}api/item`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}api/category`);
  }

//   getStores(): Observable<any[]> {
//     return this.http.get<any[]>('https://your-api-url.com/api/stores'); // Update accordingly
//   }

    addItem(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}api/item`, formData);
  }

  updateItem(itemId: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}api/item/${itemId}`, formData);
  }


  deleteItem(itemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}api/item/${itemId}`);
  }

   getItemDetailsById(id:number){
      let url = `${this.apiUrl}api/item/GetItemDetailsById/${id}`;
      return this.http.get<any>(url);
    }
 
}
