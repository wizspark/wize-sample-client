import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Http, RequestOptionsArgs, Headers} from '@angular/http';
import {ReportsApiService} from "../../services/reports-api.service";

@Component({
  selector: 'cashflow',
  templateUrl: './cashflow.component.html',
  styleUrls: [`./cashflow.component.scss`],
  encapsulation: ViewEncapsulation.None
})

export class CashflowComponent implements OnInit {
  public appId: number;
  public toggle: any;
  public cars: any[];
  public cols: any[];
  public treeoutput: any[];
  public products: any[];
  public data: Object;
  public data1: Object;
  public primaryLiquidity: any[];
  public filteredPrimaryLiquidity: any[];
  public secondaryLiquidity: any[];
  public liquidityActions: any[];
  public total: any[];
  public options: any;
  public options1: any;
  public index: number = 0;
  public chartData: any[] = [];
  public chartDataset: any;
  public selectedHead: string = 'Select Head';
  public headsList: Set<string> = new Set<string>();

  public csvString: string = '';

  constructor(private _route: ActivatedRoute,
              private http: Http,
              private reportsApiService: ReportsApiService) {
    this.fetchData();
  }

  public parseData(data, values, skipLevel) {
    let arr = [];
    if (skipLevel.indexOf(data.level) !== -1) {
      data = data.value;
    }
    data.keys.forEach((item) => {
      if (item === 'Retail') {
        skipLevel.push(3);
      }
      if (!data.value) {
        this.index++;
        arr.push({ name: item, y: values[this.index - 1] });
      } else {
        let children = this.parseData(data.value, values, skipLevel);
        let y = children.map((d) => d.y).reduce((a, b) => a + b);
        arr.push({ name: item, children, y });
      }
    });
    return arr;
  }

  public generateChartData(arr) {
    if (!arr) {
      return;
    }
    arr.forEach((item) => {
      let data = item.children ? item.children.map((child) => {
        return {
          name: child.name,
          y: child.y,
          drilldown: child.children ? child.name : undefined
        };
      }) : undefined;
      let newItem = {
        name: item.name,
        id: item.name,
        data
      };
      this.chartData.push(newItem);
      this.generateChartData(item.children);
    });
  }

  public ngOnInit() {
    this.appId = +this._route.snapshot.params['id'];

    this.options = {
      title: {
        display: true,
        text: 'Revenue per Product',
        fontSize: 20,
        fontWeight: 500,
        fontFamily: 'Roboto, sans-serif',
        fontColor:'#4a4c50'
      },
      legend: {
        display: true,
        position: 'bottom',
        label: {
          fillStyle: 'none'
        }
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          }
        }],
        yAxes: [{
          gridLines: {
            display: true
          }
        }]
      }
    };


    this.data = {
      labels: ['10/1 ARM', '3/1 ARM', '5/1 ARM', '7/1 ARM',
        '5/1 ARM - JUMBO', '7/1 ARM - JUMBO', '15-YEAR FIXED RATE', '30-YEAR FIXED RATE',
        '15-YEAR FIXED RATE - JUMBO', '30-YEAR FIXED RATE - JUMBO'],
      datasets: [
        {
          label: 'Interest ($)',
          data: [4500000, 5984000, 3344000, 7776000,
            4224000, 4928000, 7360000, 8064000,
            3840000, 5920000],
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          borderWidth: '3',
          lineTension: 0,
        }
      ]
    };

    this.data1 = {
      labels: ['10/1 ARM', '3/1 ARM', '5/1 ARM', '7/1 ARM',
        '5/1 ARM - JUMBO', '7/1 ARM - JUMBO', '15-YEAR FIXED RATE', '30-YEAR FIXED RATE',
        '15-YEAR FIXED RATE - JUMBO', '30-YEAR FIXED RATE - JUMBO'],
      datasets: [
        {
          label: 'Number of Loans',
          data: [225, 340, 128, 243,
            132, 154, 230, 252,
            120, 185],
          backgroundColor: '#9CCC65',
          borderColor: '#7CB342',
          borderWidth: '3',
          lineTension: 0,
        }
      ]
    };

    this.options1 = {
      title: {
        display: true,
        text: 'Loans per Product',
        fontSize: 20,
        fontWeight: 500,
        fontFamily: 'Roboto, sans-serif',
        fontColor:'#4a4c50'
      },
      legend: {
        display: true,
        position: 'bottom',
        label: {
          fillStyle: 'none'
        }
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          }
        }],
        yAxes: [{
          gridLines: {
            display: true
          }
        }]
      }
    };
  }

  public liquidityFilterChange(head) {
    this.selectedHead = head;
    this.filteredPrimaryLiquidity = [];
    this.primaryLiquidity.forEach((item) => this.filterPrimaryLiquidityData(item));
  }

  public clearLiquidityFilter() {
    this.selectedHead = 'Select Head';
    this.filteredPrimaryLiquidity = this.primaryLiquidity;
  }

  private export(reportType: string){
    switch(reportType){
      case 'cashoutin':
        this.csvString = `Name,Current Position,30 Days,3 mo,6 mo,12 mo\n`;
        this.treeoutput.forEach((child) => this.createCSV(child, reportType));
        this.download(this.csvString, 'Cash Inflows');
        break;
      case 'primaryliquidity':
        this.csvString = `Name,Current Position,30 Days,3 mo,6 mo,12 mo\n`;
        this.filteredPrimaryLiquidity.forEach((child) => this.createCSV(child, reportType));
        this.download(this.csvString, 'Primary Liquidity');
        break;
      case 'liquidityactions':
        this.csvString = `Name,Current Position,30 Days,3 mo,6 mo,12 mo\n`;
        this.liquidityActions.forEach((child) => this.createCSV(child, reportType));
        this.download(this.csvString, 'Liquidity Actions');
        break;
      case 'secondaryliquidity':
        this.csvString = `Name,30 Days,3 mo,6 mo,12 mo\n`;
        this.secondaryLiquidity.forEach((child) => this.createCSV(child, reportType));
        this.download(this.csvString, 'Secondary Liquidity');
        break;
      case 'total':
        this.csvString = `Name,30 Days,3 mo,6 mo,12 mo\n`;
        this.total.forEach((child) => this.createCSV(child, reportType));
        this.download(this.csvString, 'Totals');
        break;
    }
  }

  private download(csvData:any, filename:string){
    var a: any = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    var blob = new Blob([csvData], { type: 'text/csv' });
    var url= window.URL.createObjectURL(blob);
    a.href = url;
    var isIE = /*@cc_on!@*/false || !!(<any> document).documentMode;
    if (isIE){
      var retVal = navigator.msSaveBlob(blob, filename+'.csv');
    }
    else{
      a.download = filename+'.csv';
    }
    a.click();
  }

  private createCSV(item, reportType) {
    let arr = [];
    switch(reportType){
      case 'cashoutin':
      case 'primaryliquidity':
      case 'liquidityactions':
        item.data.name ? arr.push(item.data.name.split(',').join('')) : arr.push('');
        item.data.cp ? arr.push(item.data.cp.split(',').join('')) : arr.push('');
        item.data.oneMonth ? arr.push(item.data.oneMonth.split(',').join('')) : arr.push('');
        item.data.threeMonths ? arr.push(item.data.threeMonths.split(',').join('')) : arr.push('');
        item.data.sixMonths ? arr.push(item.data.sixMonths.split(',').join('')) : arr.push('');
        item.data.twelveMonths ? arr.push(item.data.twelveMonths.split(',').join('')) : arr.push('');
        break;
      case 'secondaryliquidity':
      case 'total':
        item.data.name ? arr.push(item.data.name.split(',').join('')) : arr.push('');
        item.data.oneMonth ? arr.push(item.data.oneMonth.split(',').join('')) : arr.push('');
        item.data.threeMonths ? arr.push(item.data.threeMonths.split(',').join('')) : arr.push('');
        item.data.sixMonths ? arr.push(item.data.sixMonths.split(',').join('')) : arr.push('');
        item.data.twelveMonths ? arr.push(item.data.twelveMonths.split(',').join('')) : arr.push('');
        break;
    }
    this.csvString = `${this.csvString}${arr.join(',')}\n`;
    if (item.children) {
      item.children.forEach((child) => this.createCSV(child, reportType));
    }
  }

  private filterPrimaryLiquidityData(item, preName?) {
    let name = (preName ?  preName + ' > ' : '') + item.data.name;
    if (this.selectedHead === item.data.name) {
      let itemToPush = {
        data: {
          'name': name,
          'cp': item.data.cp,
          'oneMonth': item.data['oneMonth'],
          'threeMonths': item.data['threeMonths'],
          'sixMonths': item.data['sixMonths'],
          'twelveMonths': item.data['twelveMonths'],
        }
      };
      this.filteredPrimaryLiquidity.push(itemToPush);
    }
    if (item.children) {
      item.children.forEach((child) => this.filterPrimaryLiquidityData(child, name));
    }
  }

  private setHeads(item) {
    this.headsList.add(item.data.name);
    if (item.children) {
      item.children.forEach((child) => this.setHeads(child));
    }
  }

  private fetchData() {
    // let headers = new Headers();
    // headers.append("Accept", "application/json");

    // this.http.get('/app/reports/data/cashoutin.json', <RequestOptionsArgs>{
    //   url: `/app/reports/data/cashoutin.json`,
    //   headers: headers
    //
    // }).map((res) => res.json())
    //   .subscribe((data) => this.treeoutput = data,
    //     (err) => console.log(err));

    let chartData = {};
    this.reportsApiService.fetchStaticData("/app/reports/data/cashoutin.json").subscribe((data: any) => {
      chartData = data;
      // this.treeoutput = data.cashOutIn;
      // this.primaryLiquidity = data.primaryliquidity;
      // this.filteredPrimaryLiquidity = this.primaryLiquidity;
      // this.headsList.clear();
      // this.primaryLiquidity.forEach((item) => this.setHeads(item));
      // this.liquidityActions = data.liquidityactions;
      // this.secondaryLiquidity = data.secondaryliquidity;
      // this.total = data.total;
      // this.chartDataset = data.chartData;
      // let parsedData = this.parseData(this.chartDataset.data, this.chartDataset.values, []);
      // this.generateChartData(parsedData);
      // this.options.drilldown.series.push(...this.chartData);
      this.products = data.products;

    });
    // this.http.get('/app/reports/data/cashoutin.json')
    //   .map((res) => res.json())
    //   .subscribe((data) => this.treeoutput = data,
    //     (err) => console.log(err));

    // this.http.get('/app/reports/data/primaryliquidity.json')
    //   .map((res) => res.json())
    //   .subscribe((data) => {
    //       this.primaryLiquidity = data;
    //       this.filteredPrimaryLiquidity = this.primaryLiquidity;
    //       this.headsList.clear();
    //       this.primaryLiquidity.forEach((item) => this.setHeads(item));
    //     },
    //     (err) => console.log(err));

    // this.http.get('/app/reports/data/primaryliquidity.json', <RequestOptionsArgs>{
    //   url: `/app/reports/data/primaryliquidity.json`,
    //   headers: headers
    // }).map((res) => res.json())
    //   .subscribe((data) => {
    //       this.primaryLiquidity = data;
    //       this.filteredPrimaryLiquidity = this.primaryLiquidity;
    //       this.headsList.clear();
    //       this.primaryLiquidity.forEach((item) => this.setHeads(item));
    //     },
    //     (err) => console.log(err));

    // this.reportsApiService.fetchStaticData("/app/reports/data/primaryliquidity.json").subscribe((data: any) => {
    //   this.primaryLiquidity = data;
    //   this.filteredPrimaryLiquidity = this.primaryLiquidity;
    //   this.headsList.clear();
    //   this.primaryLiquidity.forEach((item) => this.setHeads(item));
    // });

    // this.http.get('/app/reports/data/liquidityactions.json')
    //   .map((res) => res.json())
    //   .subscribe((data) => this.liquidityActions = data,
    //     (err) => console.log(err));

    // this.http.get('app/reports/data/liquidityactions.json', <RequestOptionsArgs>{
    //   url: `app/reports/data/liquidityactions.json`,
    //   headers: headers
    // }).map((res) => res.json())
    //   .subscribe((data) => this.liquidityActions = data,
    //     (err) => console.log(err));

    // this.reportsApiService.fetchStaticData("app/reports/data/liquidityactions.json").subscribe((data: any) => {
    //   this.liquidityActions = data;
    // });
    // this.http.get('/app/reports/data/secondaryliquidity.json')
    //   .map((res) => res.json())
    //   .subscribe((data) => this.secondaryLiquidity = data,
    //     (err) => console.log(err));

    // this.http.get('/app/reports/data/secondaryliquidity.json', <RequestOptionsArgs>{
    //   url: `/app/reports/data/secondaryliquidity.json`,
    //   headers: headers
    // }).map((res) => res.json())
    //   .subscribe((data) => this.secondaryLiquidity = data,
    //     (err) => console.log(err));

    // this.reportsApiService.fetchStaticData("/app/reports/data/secondaryliquidity.json").subscribe((data: any) => {
    //   this.secondaryLiquidity = data;
    // });
    // this.http.get('/app/reports/data/total.json')
    //   .map((res) => res.json())
    //   .subscribe((data) => this.total = data,
    //     (err) => console.log(err));

    // this.http.get('/app/reports/data/total.json', <RequestOptionsArgs>{
    //   url: `/app/reports/data/total.json`,
    //   headers: headers
    // }).map((res) => res.json())
    //   .subscribe((data) => this.total = data,
    //     (err) => console.log(err));

    // this.reportsApiService.fetchStaticData("/app/reports/data/total.json").subscribe((data: any) => {
    //   this.total = data;
    // });

    // this.http.get('/app/reports/data/chartdata.json')
    //   .map((res) => res.json())
    //   .subscribe((data) => {
    //       this.chartDataset = data;
    //       let parsedData = this.parseData(this.chartDataset.data, this.chartDataset.values, []);
    //       this.generateChartData(parsedData);
    //       this.options.drilldown.series.push(...this.chartData);
    //     },
    //     (err) => console.log(err));

    // this.http.get('/app/reports/data/chartdata.json', <RequestOptionsArgs>{
    //   url: `/app/reports/data/chartdata.json`,
    //   headers: headers
    // }).map((res) => res.json())
    //   .subscribe((data) => {
    //       this.chartDataset = data;
    //       let parsedData = this.parseData(this.chartDataset.data, this.chartDataset.values, []);
    //       this.generateChartData(parsedData);
    //       this.options.drilldown.series.push(...this.chartData);
    //     },
    //     (err) => console.log(err));

    // this.reportsApiService.fetchStaticData("/app/reports/data/chartdata.json").subscribe((data: any) => {
    //   this.chartDataset = data;
    //   let parsedData = this.parseData(this.chartDataset.data, this.chartDataset.values, []);
    //   this.generateChartData(parsedData);
    //   this.options.drilldown.series.push(...this.chartData);
    // });

    this.options = {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Cash Inflows and Outflows (Current Positions)'
      },
      subtitle: {
        text: 'Click the slices to view details.'
      },
      exporting:false,
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y}'
          }
        }
      },
      credits: {
        enabled: false
      },
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>'
      },
      series: [{
        name: 'Cash flow',
        colorByPoint: true,
        data: [
          {
            name: 'Cash Inflows and Outflows',
            y: 64089,
            drilldown: 'Cash Inflows and Outflows'
          },
          {
            name: 'Primary Sources of Liquidity',
            y: 12627,
            drilldown: 'Primary Sources of Liquidity'
          }, {
            name: 'Liquidity Actions',
            y: 56945,
            drilldown: 'Liquidity Actions'
          }, {
            name: 'Secondary Sources of Liquidity',
            y: 0,
            drilldown: 'Secondary Sources of Liquidity'
          }
        ]
      }],
      drilldown: {
        series: [
          {
            name: 'Cash Inflows and Outflows',
            id: 'Cash Inflows and Outflows',
            data: [
              {
                name: 'Customer Deposits',
                y: 56233,
                drilldown: 'Customer Deposits'
              },
              {
                name: 'Term Wholesale Funding',
                y: 6920,
                drilldown: 'Term Wholesale Funding'
              },
              {
                name: 'Term Wholesale Funding',
                y: 603,
                drilldown: 'Term Wholesale Funding'
              },
              {
                name: 'Payment Streams Out',
                y: 30,
                drilldown: 'Payment Streams Out'
              },
              {
                name: 'Payment Streams In',
                y: 300,
                drilldown: 'Payment Streams In'
              },
              {
                name: 'Undrawn Commitments',
                y: 0,
                drilldown: 'Undrawn Commitments'
              },
              {
                name: 'Derivatives net MTM',
                y: 3,
                drilldown: 'Derivatives net MTM'
              }
            ]
          }
        ]
      }
    };

    this.options1 = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Cash Flow & Closing Balance'
      },

      credits: {
        enabled: false
      },
      exporting:false,
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true
          },
          enableMouseTracking: false
        }
      },
      yAxis: {
        title: {
          text: 'Cash($M)'
        }
      },
      series: [{
        name: 'Cash Flow',
        data: [5.4, 3.1, 4.2, 7, 2, 4, 2, 1, 3, 5, 0, 1, 5, 3, 4, 7, 2, 4, 2, 1, 3, 5, 0, 1]
      },
        {
          name: 'Closing Balance',
          type: 'line',
          data: [1, 2, 4, 2, 5, 7, 4, 1, 3, 5, 0, 1, 1, 2, 4, 2, 5, 7, 4, 1, 3, 5, 0, 1]
        }]
    };
  }
}
