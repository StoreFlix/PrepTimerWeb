import { Injectable } from '@angular/core';
import { PreptimerHttpService } from './preptimer-http.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PreptimerService {

constructor(private _ptsvc:PreptimerHttpService,private router: Router) 
{ 
    
  }

  getTranslationList(){
    return this._ptsvc.getTranslationList()
  }

  uploadTranslation(formData:FormData){
    return this._ptsvc.uploadTranslation(formData);
  }

   getTranslationById(id:number){
    return this._ptsvc.getTranslationById(id);
    }

    deleteTranslationById(id:number){
         return this._ptsvc.deleteTranslationById(id);
    }

    getItemDetailsById(id:number){
    return this._ptsvc.getItemDetailsById(id);
    }
}
