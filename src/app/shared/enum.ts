export enum WsSweetAlertType {
    success = 'success',
    error = 'error',
    warning = 'warning',
    info = 'info',
    question = 'question'
  }
  export enum DateFilterValueEnum {
    Hour = "1",
    Day = "2",
    Week = "3",
    Month = "4",
    NintyDays = "5",
    YearToDate = "6",
    CustomRange = "7"
  }
  
  export enum DateFilterTextEnum {
    Hour = "Last Hour",
    Day = "Last 24 Hours",
    Week = "Last 7 Days",
    Month = "Last 30 Days",
    NintyDays = "Last 90 Days",
    YearToDate = "Year To Date",
    CustomRange = "Custom"
  }

  export enum ViewAsValueEnum {
    Table = "1",
    PChart = "2",
    BChart = "3",
    LChart = "4",
    Image = "5"
  }
  
  export enum ViewAsTextEnum {
    Table = "Table",
    PChart = "Pie Chart",
    BChart = "Bar Chart",
    LChart = "Line Chart",
    Image = "Image View"
  }

  export enum logicalOperatorValueEnum {
    AND = "AND",
    OR = "OR",
  }
  
  export enum logicalOperatorTextEnum {
    AND = "AND",
    OR = "OR",
  }
 
  export enum stringValueEnum {
    EqualTo = "Equal To",
    NotEqualTo = "Not Equal To",
    In = "Contains",
  }
  
  export enum stringTextEnum {
    EqualTo = "Equal To",
    NotEqualTo = "Not Equal To",
    In = "Contains",
  }

  export enum numberDateValueEnum {
    EqualTo = "Equal To",
    NotEqualTo = "Not Equal To",
    In = "Contains",
    GreaterThenEqualTo = "Greater Then Equal To",
    LessThenEqualTo = "Less Then Equal To",
    GreaterThen = "Greater Then",
    LessThen="Less Then"
  }
  
  export enum numberDateTextEnum {
    EqualTo = "Equal To",
    NotEqualTo = "Not Equal To",
    In = "Contains",
    GreaterThenEqualTo = "Greater Then Equal To",
    LessThenEqualTo = "Less Then Equal To",
    GreaterThen = "Greater Then",
    LessThen="Less Then"
  } 
  
  export enum  EquipmentTextEnum {
    storeName="Store Name",
    equipmentName = "Equipment Name",
    equipmentTypeName = "Equipment Type",
    manufacturer = "Manufacturer",
    manufacturerDate = "Manufacturing Date",
    manufacturerDateTime = "Manufacturing Time",
    modelNumber = "Model Number",
    serialNumber = "Serial Number",
    warranty="Warranty",
    propertyName="Name",
    propertyValue="Data",
    propertyGroup="Group",
    propertyDOC="Date",
    propertyDOCTime="Time",
    alertName="Alert Description",
    userName="User Name",
    operatingProcedure="Operating Procedure",
    alertCreatedDate="alert Date",
    alertCreatedDateTime="alert Time",
    surveyName="Survey",
    questionName = "Question",
    answerTypeName= "Answer Type",
    surveyDate   = "Survey Date",
    surveyDateTime   = "Survey Time",
    username= "User Name",
    mediaType = "Media Type",
    mediaPath = "Media Path",
    notes= "Notes",
    answer = "Answer",
    latitude= "Latitude",
    longitude= "Longitude",
    answerValue = "Answer"
  }