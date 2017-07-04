export class ReportBuilderData {

  reset() : void {
    this.reportCategory = new Reportcategory();
    this.reportcategoryFields = [];
  }

  modelName: string = "";
  reportCategory: Reportcategory = new Reportcategory();
  reportcategoryFields: ReportcategoryFields[] = [];
}

export class Reportcategory {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  modelName: string;
}

export class ReportcategoryFields {
  id: number;
  name: string;
  description: string;
  dataType: string;
  isActive: boolean;
  isDefault: boolean;
  isMeasure: boolean;
  modelName: string;
  columnName: boolean;
}
