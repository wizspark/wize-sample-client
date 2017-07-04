import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Http, Headers, RequestOptionsArgs} from '@angular/http';
import {ReportsApiService} from "../../services/reports-api.service";

@Component({
  selector: 'chart-support',
  templateUrl: './chart-support.component.html',
  styleUrls: ['./chart-support.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ChartSupportComponent implements OnInit {
  public appId: number;
  public toggle: any;
  public data: any;
  public options: any;
  public tableData: any[];
  public lossData: any[];
  public barData: any;
  public barData2: any;
  public options2: any;
  public options3:any;
  public csvString: string = '';

  constructor(private _route: ActivatedRoute, private http: Http,
              private reportsApiService: ReportsApiService) {
    // let headers = new Headers();
    // headers.append("Accept", "application/json");
    // http.get('/app/reports/data/chartssupport.json')
    //   .map(res=>res.json())
    //   .subscribe(data=> this.tableData = data,
    //     err=> console.log(err));
    // http.get('/app/reports/data/chartssupport.json', <RequestOptionsArgs>{
    //   url: `/app/reports/data/chartssupport.json`,
    //   headers: headers
    //
    // }).map((res) => res.json())
    //   .subscribe((data) => this.tableData = data,
    //     (err) => console.log(err));

    this.reportsApiService.fetchStaticData("/app/reports/data/chartssupport.json").subscribe((data: any) => {
      this.tableData = data.chartsSupport;
      this.lossData = data.cLoss;
    });
  }

  public ngOnInit() {
    this.appId = +this._route.snapshot.params['id'];

    this.options = {
      title: {
        display: true,
        text: 'Cumulative Loss(% of Total)',
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
      labels: ['0.00%-0.25%', '0.26%-0.50%', '0.51%-0.75%', '0.76%-1.00%',
                '1.01%-1.25%', '1.26%-1.50%', '1.51%-1.75%', '1.76%-2.00%',
        '2.01%-2.25%', '2.26%-2.50%', '2.51%-2.75%', '2.76%-3.00%',
        '3.01%-3.25%', '3.26%-3.50%', '3.51%-3.75%', '3.76%-4.00%',
        '4.01%-4.25%', '4.26%-4.50%', '4.51%-4.75%', '4.76%-5.00%','>5.00%','No Hit'],
      datasets: [
        {
          label: '% of Total',
          data: [43.80, 12.48, 9.28, 5.38,
            2.34, 1.84, 2.41, 2.26,
          1.00, 0.51, 0.88, 1.76,
          0.90, 0.59, 1.74, 0.40,
          0, 1.29, 1.49, 0.51, 7.63, 1.50],
          fill: false,
          borderColor: '#144736',
          borderWidth: '3',
          lineTension: 0,
        }
      ]
    };

    this.barData = {
      labels: [["Net", "Stressed", "Outflows", "2016‐Q3"], ["Deposit", "Outflows"], ["Borrowing", "Outflows"], ["Loan", "Repayments"], ["Loan", "HFS"],
        ["Commitment", "Draws"], ["Mortgage", "Pipelines"], ["LIHTC", "&", "SBIC Fundings"], ["Net", "Stressed", "Outflows", "2016‐Q4"]],
      datasets: [
        {
          data: [0, 100, 100, 50, 50, 100, 100, 100, 0],
          backgroundColor: ['#FFFFFF', "#FFFFFF", '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
          hoverBackgroundColor: '#FFFFFF',
        },
        {
          data: [100, 10, 10, 50, 50, 50, 50, 10, 110],
          backgroundColor: ['#003300', "#c30c3e", '#0d8e0a', '#0d8e0a', '#c30c3e', '#c30c3e', '#0d8e0a', '#c30c3e', '#003300']

        }
      ]
    };

    this.barData2 = {
      labels: [["Net", "Stressed", "Outflows", "2016‐Q3"], ["Deposit", "Outflows"], ["Borrowing", "Outflows"], ["Loan", "Repayments"], ["Loan", "HFS"],
        ["Commitment", "Draws"], ["Mortgage", "Pipelines"], ["LIHTC", "&", "SBIC Fundings"], ["Net", "Stressed", "Outflows", "2016‐Q4"]],
      datasets: [
        {
          data: [0, 200, 200, 150, 150, 200, 200, 200, 0],
          backgroundColor: ['#FFFFFF', "#FFFFFF", '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
          hoverBackgroundColor: '#FFFFFF',
        },
        {
          data: [200, 20, 20, 50, 50, 50, 50, 75, 275],
          backgroundColor: ['#003300', "#c30c3e", '#0d8e0a', '#0d8e0a', '#c30c3e', '#c30c3e', '#0d8e0a', '#c30c3e', '#003300']
        }
      ]
    };

    this.options2 = {
      title:{
        display:true,
        text:'$10'
      },
      scales: {
        xAxes: [{
          stacked: true,
          gridLines: {
            display: true
          },
          ticks: {
            maxRotation: 210
          },
        }],
        yAxes: [{
          display: true,
          stacked: true,
          gridLines: {
            display: false
          }
        }]
      }, legend: {
        display: false
      }, tooltips: {
        enabled: false
      }
    };

    this.options3 = {
      title:{
        display:true,
        text:'$75'
      },
      scales: {
        xAxes: [{
          stacked: true,
          gridLines: {
            display: true
          },
          ticks: {
            maxRotation: 210
          },
        }],
        yAxes: [{
          display: true,
          stacked: true,
          gridLines: {
            display: false
          }
        }]
      }, legend: {
        display: false
      }, tooltips: {
        enabled: false
      }
    }

  }

  private export(){
    this.csvString = `Field Name,30 Days,90 Days,180 Days,360 Days\n`;
    this.tableData.forEach((child) => this.createCSV(child));
    this.download(this.csvString, 'Stress Test Report');
  }

  private download(csvData:any, filename:string){
    var a: any = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    var blob = new Blob([csvData], { type: 'text/csv' });
    var url= window.URL.createObjectURL(blob);
    a.href = url;

    var isIE = /*@cc_on!@*/false || !!(<any> document).documentMode;

    if (isIE)
    {
      var retVal = navigator.msSaveBlob(blob, filename+'.csv');
    }
    else{
      a.download = filename+'.csv';
    }
    a.click();
  }

  private createCSV(item) {
    let arr = [];
    item.data.name ? arr.push(item.data.name.split(',').join('')) : arr.push('');
    item.data.oneMonth ? arr.push(item.data.oneMonth.split(',').join('')) : arr.push('');
    item.data.threeMonth ? arr.push(item.data.threeMonth.split(',').join('')) : arr.push('');
    item.data.sixMonth ? arr.push(item.data.sixMonth.split(',').join('')) : arr.push('');
    item.data.twelveMonth ? arr.push(item.data.twelveMonth.split(',').join('')) : arr.push('');
    this.csvString = `${this.csvString}${arr.join(',')}\n`;
    if (item.children) {
      item.children.forEach((child) => this.createCSV(child));
    }
  }

}
