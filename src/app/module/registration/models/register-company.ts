export class CustomerRegistrationRequest{
    registerCompany:RegisterCompany[];
    registerStore:RegisterStore[];
    registerUser:RegisterUser[];
    registerSubscription:RegisterSubscription[];
}

export class CustomerDetails{
    companyDetails:RegisterCompany;
    storeDetails:RegisterStore;
    userDetails:RegisterUser;
    subscDetails:RegisterSubscription[];
}

export class RegisterCompany{
    id:number;
    name:string;
    phone:string;
    address1:string;
    address2:string;
    city:string;
    state:string;
    zipcode:string;
    county:string;
    country:string;
    logoFile:string;
    isCommercial:number;

  
}

export class RegisterStore{
    name:string;
    regionName:string;
    territoryName:string;
    subTerritoryName:string;
    storeNumber:string
    phone:string;
    address1:string;
    address2:string;
    city:string;
    state:string;
    zipcode:string;
    county:string;
    country:string;
    latitude:string;
    longitude:string;
    timeZone:string;
    UTCOffSet:number;
}

export class RegisterUser{
    name:string;
    email:string;
    title:string;
    firstName:string;
    lastName:string
    password:string;
    landingPage:number;
    status:string;
    phone1:string;
    phone2:string;
    userType:string;
}

export class RegisterSubscription{
    subscriptionId:number;
}

export class FusebillInvoiceRequest{
    planId: number;
    planFrequencyId: number;
    couponCodes:string[];
    subscriptionProducts:SubscriptionProduct[];
    taxationAddress:TaxationAddress;
}


export class SubscriptionProduct{
    planProductUniqueId: number;
    quantity:number;
    isIncluded: boolean;
}

export class InvoiceResponse{
    fusebillDraftInvoiceResponse:FusebillDraftInvoiceResponse[];
    subtotal:number;
    totalDiscount:number;
    total:number;
    taxes:any;
}

export class FusebillDraftInvoiceResponse{
    productId:number;
    productName:string;
    productDescription:string;
    planCode:string;
    planName:string;
    planDescription:string;
    quantity:number;
    unitPrice:number;
    amount:number;
    discountAmount:number;
    discountType:string;
    discountDescription:string;
    taxableAmount:number;
}

export class CreateSubscriptionRequest{
    fusebillSubscriptionRequest:SubscriptionRequest[];
}

export class SubscriptionRequest{
    customerId:number;
    planId:number;
    planFrequencyId:number;
    couponCodes:string[];
    subscriptionProducts:SubscriptionProduct[];
}

export class FullBillPaymentRequest{
    customerId:number;
    publicApiKey:string;
    cvv:number;
    makeDefault:boolean;
    firstName:string;
    lastName:string;
    cardNumber:string;
    recaptcha:string;
    expirationMonth:number;
    expirationYear:number;
    countryId:number;
    stateId:number;
    countryCode:any;
    stateCode:any;
    address1:string;
    address2:string;
    city:string;
    postalZip:string;
    paymentCollectOptions:PaymentAmount
}

export class PaymentAmount{
    collectionAmount:number;
}

export class AddFuseBillCustomerRquest{
    firstName:string;
    lastName:string;
    companyName:string;
    primaryEmail:string;
    currency:string;
    billing:BillingAddress;
}

export class BillingAddress{
    companyName:string;
    line1:string;
    line2:string;
    city:string;
    postalZip:string;
    country:string;
    state:string;
}

export class TaxationAddress{
    line1:string;
    line2:string;
    city:string;
    postalZip:string;
    countryId:number;
    stateId:number;
}

export class ViewSubscriptionsResponse
{
    franchaiseCode:String;
    customerSubscriptions:CustomerSubscriptions[];
}

export class CustomerSubscriptions{
    currency:string;
    nextRechargeDate:Date;
    planFrequencyId:number;
    planId:number;
    planName:string;
    planProductUniqueId:number;
    price:number;
    productId:number;
    productName:string;
    quantity:number;
    status:String;
    subscriptionDetailDate:Date;
    subscriptionId:number;
    subscriptionProductId:number;
    couponDetail:CouponDetails[];
}
export class CouponDetails{
    couponCode:string;
    couponId:number;
    description:string;
    eligibilityEndDate:Date;
    eligibilityStartDate:Date;
    name:string;
    status:string;
}