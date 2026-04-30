import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { MenuModel, ResponseHeaderDetails } from '../../model/menu.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {

  menuList:MenuModel[]= [];
  @Input() headerData:ResponseHeaderDetails;

  constructor(  
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes:SimpleChanges){
    if(this.headerData)
      this.getDisplayMenus(this.headerData.headerMenuList);
  }
  
  getDisplayMenus(menuData:MenuModel[]){
    this.menuList = (menuData || []).filter((menu) => menu.parentId == 0);
    this.sortByMenuOrder(this.menuList);
    this.menuList.map((menu: any) => {
      let subMenus: any = [];
      subMenus = (menuData || []).filter((submenu) => submenu.parentId == menu.id);
      this.sortByMenuOrder(subMenus); 
      menu.subMenus = subMenus;
    })
  }

  sortByMenuOrder(menuList:MenuModel[]){
    (menuList || []).sort((a,b)=> { return a.menuOrder - b.menuOrder })
  }

  getInitials(firstName:string='',lastName:string=''){
    let Initials = (firstName || '').substr(0,2);
    if(firstName && lastName)
        Initials = firstName.substr(0,1) + lastName.substr(0,1);
    return Initials.toLocaleUpperCase(); 
  }

  logout(){
    localStorage.removeItem("id_token");
    localStorage.removeItem("header_details");
    window.open(environment.logoutUrl, "_self");
    
  }

  openProfile(){
    localStorage.removeItem("id_token");
    localStorage.removeItem("header_details");
    window.open(environment.profileUrl, "_self");
    
  }
  openAlert(){
    localStorage.removeItem("id_token");
    localStorage.removeItem("header_details");
    window.open(environment.alertUrl, "_self");
    
  }
  
}
