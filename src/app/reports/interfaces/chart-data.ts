export class ChartData {
  chartType: string = "";
  title: string = "";
  value: string = "";
  preText: string = "";
  isPreTextSuperscript: boolean = false;
  postText: string ="";
  isPostTextSuperscript: boolean = false;
  columns: any = {};
  labelColumn: string = "";
  dataSetColumns: string[] = [];
  xAxisTitle: string = "";
  yAxisTitle: string = "";
  yAxisFormat: string = "";
  labels: any[] = [];
  datasets: DataSet[] = [];
  chartColorsIndex: number[] = [];
  options: Options  = new Options();

  chartErrorFlag: boolean;
  chartErrorMessage: string;
  initialized: boolean;
}

export class DataSet {
  label: string = "";
  backgroundColor: any;
  borderColor: any;
  hoverBackgroundColor: any;
  pointBackgroundColor: any;
  pointBorderColor: any;
  pointHoverBackgroundColor: any;
  pointHoverBorderColor: any;
  data: any[] = [];
}

export class Options {
  title: Title = new Title();
  legend: Legend = new Legend();
  scales: Scales = new Scales();

  constructor() {
    let xAx = new Scale();
    let yAx = new Scale();
    this.scales.xAxes.push(xAx);
    this.scales.xAxes.push(yAx);
  }
}

export class Title {
  display: boolean = true;
  text: string = "";
}

export class Legend {
  position: string;
}

export class Scales {
  xAxes: Scale[] = [];
  yAxes: Scale[] = [];
}

export class ScaleLabel {
  display: boolean = true
  labelString: string = "";
}

export class Scale {
  scaleLabel: ScaleLabel = new ScaleLabel();
  ticks: any = {};
}
