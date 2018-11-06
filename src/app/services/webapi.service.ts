import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable()
export class WebapiService {

  urlApi: string = 'https://app.scrapinghub.com/api/';
  urlStorage: string = 'https://storage.scrapinghub.com/';

  constructor(private http: HttpClient) { }

  getData(url: string):Observable<any>{
    return this.http.get(this.urlApi);
  }

  getDataJSON(idItem: string):Observable<any>{
    

      return this.http.get(this.urlStorage+'items/'+idItem+'?format=json&apikey=34954489cef24031afb3ade02be8bd4d')
  }

  initJob(inicial: string){
    let body = `project=${'356324'}&spider=${'listado'}&inicial=${inicial}`;

    var headerOptions = new HttpHeaders().set( 'Content-Type', 'application/x-www-form-urlencoded' );
    return this.http.post(this.urlApi + 'run.json?apikey=34954489cef24031afb3ade02be8bd4d', body, {headers: headerOptions});
  }

}
