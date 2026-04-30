export class MenuModel{
    id:number;
    menuName:string;
    isMainMenu:boolean;
    parentId:number;
    menuURL:string;
    displayName:string;
    menuOrder:number;
}

export class ResponseHeaderDetails{
    userLoginName:string;
    userFirstName:string;
    userLastName:string;
    home:string;
    companyLogo:string;
    headerMenuList:MenuModel[];
    themeName: string;
}

export class DisplayMenus
{
    id:number;
    menuName:string;
    isMainMenu:boolean;
    parentId:number;
    menuURL:string;
    displayName:string;
    menuOrder:number;
    subMenus:MenuModel[];
}


export class LoginModel{
    userDetails:User;
    isWebLogin:boolean;
}

export class User {
    email:string;
    password:string;
}