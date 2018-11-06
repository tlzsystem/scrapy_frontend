import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class WebapiService {

  urlApi: string = '';
  urlStorage: string = 'https://storage.scrapinghub.com/';

  constructor(private http: HttpClient) { }

  getData(url: string):Observable<any>{
    return this.http.get(this.urlApi);
  }

  getDataJSON(idItem: string):Observable<any>{
    

      return this.http.get(this.urlStorage+"items/"+idItem+"?format=json&apikey=34954489cef24031afb3ade02be8bd4d")
  }

}
