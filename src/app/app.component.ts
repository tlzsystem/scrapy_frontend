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
  public itemsScraped = '0';
  
  public fechaInicio: Date;
  public fechaFin: Date;

  comunaSelected = new FormControl();
  tipoViviendaSelected = new FormControl();
  fechaInicioSelected = new FormControl();
  fechaFinSelected = new FormControl();

  comunasInterface: Comunas[] = [
    { apiValue: 'Algarrobo', viewValue: 'algarrobo-quinta' },
    { apiValue: 'Alto Hospicio', viewValue: 'alto-hospicio-tarapaca' },
    { apiValue: 'Punta Arenas', viewValue: 'antartica-magallanes-y-antartica-chilena' },
    { apiValue: 'Antofagasta', viewValue: 'antofagasta-antofagasta' },
    { apiValue: 'Arica', viewValue: 'arica-arica-y-parinacota' },
    { apiValue: 'Buin', viewValue: 'buin-metropolitana' },
    { apiValue: 'Calama', viewValue: 'calama-antofagasta' },
    { apiValue: 'Calera de Tango', viewValue: 'calera-de-tango-metropolitana' },
    { apiValue: 'Calle Larga', viewValue: 'calle-larga-quinta' },
    { apiValue: 'Casablanca', viewValue: 'casablanca-quinta' },
    { apiValue: 'Cerrillos', viewValue: 'cerrillos-metropolitana' },
    { apiValue: 'Chiguayante', viewValue: 'chiguayante-bio-bio' },
    { apiValue: 'Chillán', viewValue: 'chillan-bio-bio' },
    { apiValue: 'Colina', viewValue: 'colina-metropolitana' },
    { apiValue: 'Coltauco', viewValue: 'coltauco-bernardo-ohiggins' },
    { apiValue: 'Concepción', viewValue: 'concepcion-bio-bio' },
    { apiValue: 'Conchalí', viewValue: 'conchali-metropolitana' },
    { apiValue: 'Concón', viewValue: 'concon-quinta' },
    { apiValue: 'Copiapó', viewValue: 'copiapo-copiapo' },
    { apiValue: 'Coquimbo', viewValue: 'coquimbo-coquimbo' },
    { apiValue: 'Coronel', viewValue: 'coronel-bio-bio' },
    { apiValue: 'Coyhaique', viewValue: 'coyhaique-aysen' },
    { apiValue: 'Curicó', viewValue: 'curico-maule' },
    { apiValue: 'El Tabo', viewValue: 'el-tabo-quinta' },
    { apiValue: 'Estación Central', viewValue: 'estacion-central-metropolitana' },
    { apiValue: 'Frutillar', viewValue: 'frutillar-los-lagos' },
    { apiValue: 'Graneros', viewValue: 'graneros-bernardo-ohiggins' },
    { apiValue: 'Huechuraba', viewValue: 'huechuraba-metropolitana' },
    { apiValue: 'Independencia', viewValue: 'independencia-metropolitana' },
    { apiValue: 'Iquique', viewValue: 'iquique-tarapaca' },
    { apiValue: 'Isla de Maipo', viewValue: 'isla-de-maipo-metropolitana' },
    { apiValue: 'La Calera', viewValue: 'la-calera-quinta' },
    { apiValue: 'La Cisterna', viewValue: 'la-cisterna-metropolitana' },
    { apiValue: 'La Cruz', viewValue: 'la-cruz-quinta' },
    { apiValue: 'La Florida', viewValue: 'la-florida-metropolitana' },
    { apiValue: 'La Granja', viewValue: 'la-granja-metropolitana' },
    { apiValue: 'La Ligua', viewValue: 'la-ligua-quinta' },
    { apiValue: 'Lampa', viewValue: 'lampa-metropolitana' },
    { apiValue: 'La Pintana', viewValue: 'la-pintana-metropolitana' },
    { apiValue: 'La Reina', viewValue: 'la-reina-metropolitana' },
    { apiValue: 'Las Condes', viewValue: 'las-condes-metropolitana' },
    { apiValue: 'La Serena', viewValue: 'la-serena-coquimbo' },
    { apiValue: 'Limache', viewValue: 'limache-quinta' },
    { apiValue: 'Llaillay', viewValue: 'llaillay-quinta' },
    { apiValue: 'Lo Barnechea', viewValue: 'lo-barnechea-metropolitana' },
    { apiValue: 'Los Andes', viewValue: 'los-andes-quinta' },
    { apiValue: 'Machalí', viewValue: 'machali-bernardo-ohiggins' },
    { apiValue: 'Macul', viewValue: 'macul-metropolitana' },
    { apiValue: 'Maipú', viewValue: 'maipu-metropolitana' },
    { apiValue: 'Maule', viewValue: 'maule-maule' },
    { apiValue: 'Mejillones', viewValue: 'mejillones-antofagasta' },
    { apiValue: 'Melipilla', viewValue: 'melipilla-metropolitana' },
    { apiValue: 'Mostazal', viewValue: 'mostazal-bernardo-ohiggins' },
    { apiValue: 'Navidad', viewValue: 'navidad-bernardo-ohiggins' },
    { apiValue: 'Ñuñoa', viewValue: 'nunoa-metropolitana' },
    { apiValue: 'Osorno', viewValue: 'osorno-los-lagos' },
    { apiValue: 'Ovalle', viewValue: 'ovalle-coquimbo' },
    { apiValue: 'Padre Hurtado', viewValue: 'padre-hurtado-metropolitana' },
    { apiValue: 'Padre las Casas', viewValue: 'padre-las-casas-araucania' },
    { apiValue: 'Papudo', viewValue: 'papudo-quinta' },
    { apiValue: 'Peñaflor', viewValue: 'penaflor-metropolitana' },
    { apiValue: 'Peñalolén', viewValue: 'penalolen-metropolitana' },
    { apiValue: 'Peumo', viewValue: 'peumo-bernardo-ohiggins' },
    { apiValue: 'Pichilemu', viewValue: 'pichilemu-bernardo-ohiggins' },
    { apiValue: 'Providencia', viewValue: 'providencia-metropolitana' },
    { apiValue: 'Puchuncaví', viewValue: 'puchuncavi-quinta' },
    { apiValue: 'Pucón', viewValue: 'pucon-araucania' },
    { apiValue: 'Pudahuel', viewValue: 'pudahuel-metropolitana' },
    { apiValue: 'Puente Alto', viewValue: 'puente-alto-metropolitana' },
    { apiValue: 'Puerto Montt', viewValue: 'puerto-montt-los-lagos' },
    { apiValue: 'Puerto Varas', viewValue: 'puerto-varas-los-lagos' },
    { apiValue: 'Antártica', viewValue: 'punta-arenas-magallanes-y-antartica-chilena' },
    { apiValue: 'Quilicura', viewValue: 'quilicura-metropolitana' },
    { apiValue: 'Quillota', viewValue: 'quillota-quinta' },
    { apiValue: 'Quilpué', viewValue: 'quilpue-quinta' },
    { apiValue: 'Quinta Normal', viewValue: 'quinta-normal-metropolitana' },
    { apiValue: 'Rancagua', viewValue: 'rancagua-bernardo-ohiggins' },
    { apiValue: 'Recoleta', viewValue: 'recoleta-metropolitana' },
    { apiValue: 'Renca', viewValue: 'renca-metropolitana' },
    { apiValue: 'Rengo', viewValue: 'rengo-bernardo-ohiggins' },
    { apiValue: 'Requínoa', viewValue: 'requinoa-bernardo-ohiggins' },
    { apiValue: 'San Antonio', viewValue: 'san-antonio-quinta' },
    { apiValue: 'San Bernardo', viewValue: 'san-bernardo-metropolitana' },
    { apiValue: 'San Esteban', viewValue: 'san-esteban-quinta' },
    { apiValue: 'San Felipe', viewValue: 'san-felipe-quinta' },
    { apiValue: 'San Fernando', viewValue: 'san-fernando-bernardo-ohiggins' },
    { apiValue: 'San Joaquín', viewValue: 'san-joaquin-metropolitana' },
    { apiValue: 'San Miguel', viewValue: 'san-miguel-metropolitana' },
    { apiValue: 'Santa Cruz', viewValue: 'santa-cruz-bernardo-ohiggins' },
    { apiValue: 'Santiago', viewValue: 'santiago-metropolitana' },
    { apiValue: 'Talagante', viewValue: 'talagante-metropolitana' },
    { apiValue: 'Temuco', viewValue: 'temuco-araucania' },
    { apiValue: 'Til Til', viewValue: 'til-til-metropolitana' },
    { apiValue: 'Valdivia', viewValue: 'valdivia-de-los-rios' },
    { apiValue: 'Valparaíso', viewValue: 'valparaiso-quinta' },
    { apiValue: 'Villa Alemana', viewValue: 'villa-alemana-quinta' },
    { apiValue: 'Villarrica', viewValue: 'villarrica-araucania' },
    { apiValue: 'Viña del Mar', viewValue: 'vina-del-mar-quinta' },
    { apiValue: 'Vitacura', viewValue: 'vitacura-metropolitana' },
    { apiValue: 'Zapallar', viewValue: 'zapallar-quinta' },
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
    let url: string = this.buildUrl(tipo, valor);
    var thisApp = this;

    let formatedFechaInicio = this.formatFecha(this.fechaInicio); // si es nula mandar una fecha mes anterior al día de hoy - un mes
    let formatedFechaFin = this.formatFecha(this.fechaFin); //un día más que la de inicio si está nula

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
        this.itemsScraped = status['jobs'][0]['items_scraped'];
        this.statusRequest = status['jobs'][0][''];
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

  formatFecha(fecha: Date): string{
    
    return '';
  }


}
