export class ChartSettings {
  id: number;
  userId: number;
  ReportCategoryId: number;
  name: string = "";
  description: string = "";
  type: string = "";
  isActive: boolean = true;
  dataQuery: any;
  chartSettings: any;
  access: string = "everyOne";
}
