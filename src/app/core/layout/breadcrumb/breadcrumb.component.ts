import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ResponseHeaderDetails } from '../../model/menu.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  constructor(private _route:ActivatedRoute) { }

  @Input() headerData: ResponseHeaderDetails;
  @Input() url:string;
  
  routeNames:any[] = [];
  routeUrl:string = '';
  routeCollection:any=[];

  ngOnInit(): void {
    
  }

  ngOnChanges(changes:SimpleChanges){
    if (changes.url && changes.url.currentValue) {
        this.routeNames = [];

      if (changes.url.currentValue.includes('alert')){
        this.routeNames.push({ name:'Alerts' ,routeUrl:'/alerts' });
        
      }
      else if (changes.url.currentValue.includes('report')){
        // this.routeName.push('Reports');
        // this.routeUrl = '/reports'
        this.routeNames.push({ name:'Reports' ,routeUrl:'/reports' });
      }
      else if (changes.url.currentValue.includes('label')){
        // this.routeName.push('Labeling');
        // this.routeUrl = '/label'
        this.routeNames.push({ name:'Labeling' ,routeUrl:'/label' });
      }

      if(changes.url.currentValue.includes('storesmapping'))
      this.routeNames.push({ name:'StoresMapping' ,routeUrl:changes.url.currentValue });
    }
  } 

}
