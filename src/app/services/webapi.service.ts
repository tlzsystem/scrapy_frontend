import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable()
export class WebapiService {
  
  urlApi: string = 'https://app.scrapinghub.com/api/';
  urlStorage: string = 'https://storage.scrapinghub.com/';
  jobsStoped: boolean = false;

  constructor(private http: HttpClient) { }

  getData(url: string):Observable<any>{
    return this.http.get(this.urlApi);
  }

  getDataJSON(idItem: string):Observable<any>{
      return this.http.get(this.urlStorage+'items/'+idItem+'?format=json&apikey=34954489cef24031afb3ade02be8bd4d');
  }

  initJob(inicial: string){
    let body = `project=${'356324'}&spider=${'listado'}&inicial=${inicial}`;

    var headerOptions = new HttpHeaders().set( 'Content-Type', 'application/x-www-form-urlencoded' );
    return this.http.post(this.urlApi + 'run.json?apikey=34954489cef24031afb3ade02be8bd4d', body, {headers: headerOptions});
  }

  getStatus(jobId: string):Observable<any> {
    // AQUI DEBIESE IR A LA PETICIÓN para saber si EL TRABAJO TERMINADO
    // var headerOptions = new HttpHeaders().set( 'Content-Type', 'application/x-www-form-urlencoded' );
    // let a = this.http.get('https://app.scrapinghub.com/api/jobs/list.json?project=356324&state=running', {headers: headerOptions});

    return this.http.get('https://app.scrapinghub.com/api/jobs/list.json?job='+jobId+'&project=356324&apikey=34954489cef24031afb3ade02be8bd4d');
  }

  stopJobs(){
    let result = this.http.get('https://app.scrapinghub.com/api/jobs/list.json?state=running&project=356324&apikey=34954489cef24031afb3ade02be8bd4d');

    var webApi = this;
    
    result.subscribe(jobsData => {

      console.log(jobsData);

      if(jobsData["total"] !== 0){
        jobsData["jobs"].forEach( (job) => {
              
          var data = new FormData();
          data.append("job", job["id"]);
          data.append("project", '356324');
          data.append("apikey", '34954489cef24031afb3ade02be8bd4d');

          this.http.post('https://app.scrapinghub.com/api/jobs/stop.json', data ).subscribe(result => {
            console.log(result);
            setTimeout(function(){
              webApi.stopJobs();
            }, 1500);
          });
        });
      }
      else{
        this.jobsStoped = true;
      }
    });
  }

}
