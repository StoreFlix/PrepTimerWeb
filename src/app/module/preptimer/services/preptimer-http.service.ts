import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Translation } from '../Model/translation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreptimerHttpService {

   private readonly _baseUrl: string;

    constructor(private http:HttpClient) { 
      this._baseUrl = environment.baseUrl;  
    }

    getTranslationList(){
      let url = `${this._baseUrl}api/PrepTimer/GetLanguages`;
      return this.http.post<Translation[]>(url,{});
    }

    uploadTranslation(formData: FormData): Observable<any> {
      let url = `${this._baseUrl}api/PrepTimer/AddUpdateCondimentLanguage`;
      return this.http.post<any>(url, formData);
    }

    getTranslationById(id:number){
      let url = `${this._baseUrl}api/PrepTimer/GetLanguageById?LangId=${id}`;
      return this.http.post<Translation[]>(url,{});
    }

     getItemDetailsById(id:number){
      let url = `${this._baseUrl}api/PrepTimer/getItemDetailsById?itemId=${id}`;
      return this.http.get<any>(url);
    }


     deleteTranslationById(id:number){
      let url = `${this._baseUrl}api/PrepTimer/DeleteLanguageById?LangId=${id}`;
      return this.http.post<Translation[]>(url,{});
    }
  
}
