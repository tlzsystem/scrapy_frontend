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


  generaJob(tipo: string, valor: string){
    this.isLoadingResults = true;
    console.log('Iniciando el job ....');
    let url: string = this.buildUrl(tipo,valor);
    console.log('url: ' + url);
    this.webApiService.initJob(url).subscribe(response => {
      var a =  JSON.stringify(response);
        if (a.status = 'ok'){

            console.log("ESTAMOS LISTO ");

        } else {
          this.isLoadingResults = false;
        }
    });


  }

  exportDataExcel(){
    this.isLoadingResults = true;
    console.log(' ' + this.tipoViviendaSelected.value.viewValue +  ' ' + this.comunaSelected.value);
    
    //this.webApiService.getData(url);

    this.webApiService.getDataJSON("356324/1/9").subscribe(response => {
      this.dataJson = response;
      this.isLoadingResults = false;
      this.exportAsXLSX();
    });

    
  }

  buildUrl(tipoPropiedad: string, valor: string):string{
    return 'https://www.portalinmobiliario.com/venta/'+tipoPropiedad +'/'+valor+'?tp=1&op=1&ca=2&ts=1&dd=0&dh=6&bd=0&bh=6&or=&mn=2&sf=1&sp=0';
  }

  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.dataJson, 'sample');
  }
}
