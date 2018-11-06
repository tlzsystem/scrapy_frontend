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
  public statusRequest = '';

  comunaSelected = new FormControl();
  tipoViviendaSelected = new FormControl();

  comunasInterface: Comunas[] = [
    { apiValue: 'puente-alto-metropolitana', viewValue: 'Puente Alto' },
    { apiValue: 'la-florida-metropolitana', viewValue: 'La Florida' },
    { apiValue: 'quilicura-metropolitana', viewValue: 'Quilicura' }
  ];

  comunas: string[] = ['puente-alto-metropolitana', 'la-florida-metropolitana', 'quilicura-metropolitana'];

  tipos: Tipos[] = [
    { viewValue: 'Casa' },
    { viewValue: 'Departamento' }
  ];

  filteredOptions: Observable<string[]>;

  dataJson: any;

  constructor(
    private webApiService: WebapiService,
    private excelService: ExcelService
  ) { }

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


  generaJob(tipo: string, valor: string) {
    this.isLoadingResults = true;
    let entrarAqui = true;
    console.log('Iniciando el job ....');
    let url: string = this.buildUrl(tipo, valor);
    console.log('url: ' + url);

    this.webApiService.initJob(url).subscribe(
      jobResult => {

        if (jobResult['status'] = 'ok') {

          setInterval(() => {
            this.webApiService.getStatus(jobResult['jobid']).subscribe(
              status => {
                this.statusRequest = status['outcome'];
                entrarAqui = true;

                if (this.statusRequest == 'finished' && this.dataJson.length > 0) {
                  this.exportDataExcel(jobResult['jobid']);
                  this.isLoadingResults = false;
      
                } else {
                  this.isLoadingResults = false;
                  alert('No se encontraron Datos');
                }

              },

              error => {
                this.statusRequest = '';
                alert('Error en la petición de estado de los datos \n\nMotivo: ' + error.statusText + ': ' + error.status)
              }

            );
          }, 3000);          


        } else {
          this.isLoadingResults = false;
          alert('La petición de Datos Falló');
        }
      },

      error => {
        this.isLoadingResults = false;
        alert('No se pudo conectar al Portal Inmobiliario - No se inició el Trabajo. \n\nMotivo: ' + error.statusText + ': ' + error.status)

      }

    );


  }

  exportDataExcel(idJob: string) {
    this.isLoadingResults = true;

    this.webApiService.getDataJSON(idJob).subscribe(response => { //"356324/1/9"  "356324/1/25"
      this.dataJson = response;
      this.excelService.exportAsExcelFile(this.dataJson, 'datosPortal');
      this.isLoadingResults = false;
    });


  }

  buildUrl(tipoPropiedad: string, valor: string): string {
    return 'https://www.portalinmobiliario.com/venta/' + tipoPropiedad + '/' + valor + '?tp=1&op=1&ca=2&ts=1&dd=0&dh=6&bd=0&bh=6&or=&mn=2&sf=1&sp=0';
  }


}
