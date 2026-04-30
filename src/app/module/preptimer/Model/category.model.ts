export interface Category {
    categoryId: number;
    categoryName: string;
    isDefault: boolean;
  }
  
  export interface CreateCategory {
    categoryName: string;
     storeIds: number[];
  }
  