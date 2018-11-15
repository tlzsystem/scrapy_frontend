import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable()
export class WebapiService {
  
  urlApi: string = 'https://app.scrapinghub.com/api/';
  urlStorage: string = 'https://storage.scrapinghub.com/';
  jobsStoped: boolean = false;
  urlFINAL : string = 'http://ec2-3-16-165-18.us-east-2.compute.amazonaws.com:6800/';

  constructor(private http: HttpClient) { }

  getData(url: string):Observable<any>{
    return this.http.get(this.urlApi);
  }

  getDataJSON(idItem: string):Observable<any>{
      return this.http.get('http://ec2-3-16-165-18.us-east-2.compute.amazonaws.com/' + idItem + '.jl');
  }

  initJob(inicial: string, fi:string, ff:string){
    let body = `project=${'portalinmobiliario'}&spider=${'listado'}&inicial=${inicial}&fi=${fi}&ff=${ff}`;

    var headerOptions = new HttpHeaders().set( 'Content-Type', 'application/x-www-form-urlencoded' );
    return this.http.post(this.urlFINAL + 'schedule.json', body, {headers: headerOptions});
  }

  getStatus():Observable<any> {    
    return this.http.get(this.urlFINAL+'listjobs.json?project=portalinmobiliario');
  }

  stopJobs(){

    var webApi = this;
    
    this.http.get(this.urlFINAL + 'listjobs.json?project=portalinmobiliario').subscribe(jobsData => {

      console.log(jobsData);

      if(jobsData["running"].length !== 0){
        jobsData["running"].forEach( (job) => {
              
          var data = new FormData();
          data.append("project", 'portalinmobiliario');
          data.append("job", job["id"]);  
          this.http.post(this.urlFINAL+'cancel.json', data ).subscribe(result => {
            console.log(result);
          });
        });
      }
      else{
        this.jobsStoped = true;
      }
    });
  }

}
