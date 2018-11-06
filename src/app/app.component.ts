import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { WebapiService } from './services/webapi.service';
import { ExcelService } from './services/excel.service';

export interface Comunas {
  apiValue: string;
  viewValue: string;
}

export interface Tipos {  
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [WebapiService, ExcelService]
})
export class AppComponent {
  title = 'Datos Portal Inmobiliario';

  public isLoadingResults = false;
  comunaSelected = new FormControl();
  tipoViviendaSelected = new FormControl();
    
  comunasInterface: Comunas[] = [
    {apiValue: 'puente-alto-metropolitana', viewValue: 'Puente Alto'},
    {apiValue: 'la-florida-metropolitana', viewValue: 'La Florida'},
    {apiValue: 'quilicura-metropolitana', viewValue: 'Quilicura'}
  ];

  comunas: string[] = ['puente-alto-metropolitana', 'la-florida-metropolitana', 'quilicura-metropolitana'];
  
  tipos: Tipos[] = [
    { viewValue: 'Casa' },
    { viewValue: 'Departamento' }
  ];
  
  filteredOptions: Observable<string[]>;

  data: any = [{
    eid: 'e101',
    ename: 'ravi',
    esal: 1000
  },
  {
    eid: 'e102',
    ename: 'ram',
    esal: 2000
  },
  {
    eid: 'e103',
    ename: 'rajesh',
    esal: 3000
  }];

  dataJson:any;

  constructor(
    private webApiService: WebapiService,
    private excelService: ExcelService
  ){ }

  ngOnInit() {
    this.filteredOptions = this.comunaSelected.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.comunas.filter(option => option.toLowerCase().includes(filterValue));
  }

  exportDataExcel(){
    this.isLoadingResults = true;
    console.log(' ' + this.tipoViviendaSelected.value.viewValue +  ' ' + this.comunaSelected.value);
    let url:string = this.buildUrl();
    console.log('url: ' + url);
    this.webApiService.getData(url);

    this.webApiService.getData(url).subscribe(response => {
      this.dataJson = response;
      this.isLoadingResults = false;
      this.exportAsXLSX();
    });

    
  }

  buildUrl():string{
    return 'https://www.portalinmobiliario.com/venta/casa/puente-alto-metropolitana?tp=1&op=1&ca=2&ts=1&dd=0&dh=6&bd=0&bh=6&or=&mn=2&sf=1&sp=0';
  }

  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.data, 'sample');
  }
}
