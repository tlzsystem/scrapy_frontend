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

  comunas: string[] = [
    'algarrobo-quinta',
    'alto-hospicio-tarapaca',
    'antartica-magallanes-y-antartica-chilena',
    'antofagasta-antofagasta',
    'arica-arica-y-parinacota',
    'buin-metropolitana',
    'calama-antofagasta',
    'calera-de-tango-metropolitana',
    'calle-larga-quinta',
    'casablanca-quinta',
    'cerrillos-metropolitana',
    'chiguayante-bio-bio',
    'chillan-bio-bio',
    'colina-metropolitana',
    'coltauco-bernardo-ohiggins',
    'concepcion-bio-bio',
    'conchali-metropolitana',
    'concon-quinta',
    'copiapo-copiapo',
    'coquimbo-coquimbo',
    'coronel-bio-bio',
    'coyhaique-aysen',
    'curico-maule',
    'el-tabo-quinta',
    'estacion-central-metropolitana',
    'frutillar-los-lagos',
    'graneros-bernardo-ohiggins',
    'huechuraba-metropolitana',
    'independencia-metropolitana',
    'iquique-tarapaca',
    'isla-de-maipo-metropolitana',
    'la-calera-quinta',
    'la-cisterna-metropolitana',
    'la-cruz-quinta',
    'la-florida-metropolitana',
    'la-granja-metropolitana',
    'la-ligua-quinta',
    'lampa-metropolitana',
    'la-pintana-metropolitana',
    'la-reina-metropolitana',
    'las-condes-metropolitana',
    'la-serena-coquimbo',
    'limache-quinta',
    'llaillay-quinta',
    'lo-barnechea-metropolitana',
    'los-andes-quinta',
    'machali-bernardo-ohiggins',
    'macul-metropolitana',
    'maipu-metropolitana',
    'maule-maule',
    'mejillones-antofagasta',
    'melipilla-metropolitana',
    'mostazal-bernardo-ohiggins',
    'navidad-bernardo-ohiggins',
    'nunoa-metropolitana',
    'osorno-los-lagos',
    'ovalle-coquimbo',
    'padre-hurtado-metropolitana',
    'padre-las-casas-araucania',
    'papudo-quinta',
    'penaflor-metropolitana',
    'penalolen-metropolitana',
    'peumo-bernardo-ohiggins',
    'pichilemu-bernardo-ohiggins',
    'providencia-metropolitana',
    'puchuncavi-quinta',
    'pucon-araucania',
    'pudahuel-metropolitana',
    'puente-alto-metropolitana',
    'puerto-montt-los-lagos',
    'puerto-varas-los-lagos',
    'punta-arenas-magallanes-y-antartica-chilena',
    'quilicura-metropolitana',
    'quillota-quinta',
    'quilpue-quinta',
    'quinta-normal-metropolitana',
    'rancagua-bernardo-ohiggins',
    'recoleta-metropolitana',
    'renca-metropolitana',
    'rengo-bernardo-ohiggins',
    'requinoa-bernardo-ohiggins',
    'san-antonio-quinta',
    'san-bernardo-metropolitana',
    'san-esteban-quinta',
    'san-felipe-quinta',
    'san-fernando-bernardo-ohiggins',
    'san-joaquin-metropolitana',
    'san-miguel-metropolitana',
    'santa-cruz-bernardo-ohiggins',
    'santiago-metropolitana',
    'talagante-metropolitana',
    'temuco-araucania',
    'til-til-metropolitana',
    'valdivia-de-los-rios',
    'valparaiso-quinta',
    'villa-alemana-quinta',
    'villarrica-araucania',
    'vina-del-mar-quinta',
    'vitacura-metropolitana',
    'zapallar-quinta'];

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

  detieneJobs() {
    this.webApiService.stopJobs();
  }


  generaJob(tipo: string, valor: string) {

    this.isLoadingResults = true;
    let entrarAqui = true;
    let url: string = this.buildUrl(tipo, valor);
    var thisApp = this;

    if (this.webApiService.jobsStoped) {
      this.webApiService.initJob(url).subscribe(
        jobResult => {

          console.log(jobResult);

          if (jobResult['status'] = 'ok') {
            thisApp.checkJobResult(jobResult);
          } else {
            setTimeout(function () {
              thisApp.generaJob(tipo, valor);
            }, 5000);
          }
        },

        error => {
          setTimeout(function () {
            thisApp.generaJob(tipo, valor);
          }, 5000);
        }
      );
    }
    else {
      setTimeout(function () {
        thisApp.generaJob(tipo, valor);
      }, 5000);
    }
  }

  checkJobResult(jobResult: Object) {

    var thisApp = this;

    this.webApiService.getStatus(jobResult['jobid']).subscribe(
      status => {
        this.statusRequest = status['jobs'][0]['state'];
        if (this.statusRequest == 'finished') {
          this.exportDataExcel(jobResult['jobid']);
        } else {
          setTimeout(function () {
            thisApp.checkJobResult(jobResult);
          }, 5000);
        }
      },
      error => {
        this.statusRequest = '';
        this.isLoadingResults = false;
        alert('Error en la petición de estado de los datos \n\nMotivo: ' + error.statusText + ': ' + error.status);
      }
    );
  }



  exportDataExcel(idJob: string) {
    this.isLoadingResults = true;

    this.webApiService.getDataJSON(idJob).subscribe(response => { //"356324/1/9"  "356324/1/25"
      this.dataJson = response;
      if (this.dataJson.length > 0) {
        this.excelService.exportAsExcelFile(this.dataJson, 'datosPortal');
      } else {
        alert('La consulta no arrojó resultados');
      }
      this.isLoadingResults = false;
    });


  }

  buildUrl(tipoPropiedad: string, valor: string): string {
    return 'https://www.portalinmobiliario.com/venta/' + tipoPropiedad + '/' + valor + '?tp=1&op=1&ca=2&ts=1&dd=0&dh=6&bd=0&bh=6&or=&mn=2&sf=1&sp=0';
  }


}
