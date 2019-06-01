import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, pipe } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { WebapiService } from './services/webapi.service';
import { ExcelService } from './services/excel.service';

import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from './adapters/data-adapter';



export interface Comunas {
  apiValue: string;
  viewValue: string;
}

export interface Tipos {
  viewValue: string;
}
 export interface Operacion{
   viewValue: string;
 }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    WebapiService, 
    ExcelService,
    {
      provide: DateAdapter, useClass: AppDateAdapter
  },
  {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
  }
  ]
})
export class AppComponent {
  title = 'Datos Portal Inmobiliario';

  public isLoadingResults = false;
  public statusRequest = '';
  public itemsScraped = '0';
  
  public fechaInicio: Date = new Date();
  public fechaFin: Date = new Date();
  public formatedFechaInicio: string;
  public formatedFechaFin: string;

  tipoOPeracionSelected = new FormControl();
  comunaSelected = new FormControl();
  tipoViviendaSelected = new FormControl();
  fechaInicioSelected = new FormControl();
  fechaFinSelected = new FormControl();

  comunasInterface: Comunas[] = [
    { apiValue: 'Algarrobo', viewValue: 'algarrobo-valparaiso' },
    { apiValue: 'Alto Hospicio', viewValue: 'alto-hospicio-tarapaca' },
    { apiValue: 'Punta Arenas', viewValue: 'antartica-magallanes-y-antartica-chilena' },
    { apiValue: 'Antofagasta', viewValue: 'antofagasta-antofagasta' },
    { apiValue: 'Arica', viewValue: 'arica-arica-y-parinacota' },
    { apiValue: 'Buin', viewValue: 'buin-metropolitana' },
    { apiValue: 'Calama', viewValue: 'calama-antofagasta' },
    { apiValue: 'Calera de Tango', viewValue: 'calera-de-tango-metropolitana' },
    { apiValue: 'Calle Larga', viewValue: 'calle-larga-quinta' },
    { apiValue: 'Casablanca', viewValue: 'casablanca-valparaiso' },
    { apiValue: 'Cerrillos', viewValue: 'cerrillos-metropolitana' },
    { apiValue: 'Chiguayante', viewValue: 'chiguayante-biobio' },
    { apiValue: 'Chillán', viewValue: 'chillan-biobio' },
    { apiValue: 'Colina', viewValue: 'colina-metropolitana' },
    { apiValue: 'Coltauco', viewValue: 'coltauco-bernardo-ohiggins' },
    { apiValue: 'Concepción', viewValue: 'concepcion-biobio' },
    { apiValue: 'Conchalí', viewValue: 'conchali-metropolitana' },
    { apiValue: 'Concón', viewValue: 'concon-quinta' },
    { apiValue: 'Copiapó', viewValue: 'copiapo-copiapo' },
    { apiValue: 'Coquimbo', viewValue: 'coquimbo-coquimbo' },
    { apiValue: 'Coronel', viewValue: 'coronel-biobio' },
    { apiValue: 'Coyhaique', viewValue: 'coyhaique-aysen' },
    { apiValue: 'Curicó', viewValue: 'curico-maule' },
    { apiValue: 'El Tabo', viewValue: 'el-tabo-valparaiso' },
    { apiValue: 'Estación Central', viewValue: 'estacion-central-metropolitana' },
    { apiValue: 'Frutillar', viewValue: 'frutillar-los-lagos' },
    { apiValue: 'Graneros', viewValue: 'graneros-bernardo-ohiggins' },
    { apiValue: 'Huechuraba', viewValue: 'huechuraba-metropolitana' },
    { apiValue: 'Independencia', viewValue: 'independencia-metropolitana' },
    { apiValue: 'Iquique', viewValue: 'iquique-tarapaca' },
    { apiValue: 'Isla de Maipo', viewValue: 'isla-de-maipo-metropolitana' },
    { apiValue: 'La Calera', viewValue: 'la-calera-valparaiso' },
    { apiValue: 'La Cisterna', viewValue: 'la-cisterna-metropolitana' },
    { apiValue: 'La Cruz', viewValue: 'la-cruz-valparaiso' },
    { apiValue: 'La Florida', viewValue: 'la-florida-metropolitana' },
    { apiValue: 'La Granja', viewValue: 'la-granja-metropolitana' },
    { apiValue: 'La Ligua', viewValue: 'la-ligua-valparaiso' },
    { apiValue: 'Lampa', viewValue: 'lampa-metropolitana' },
    { apiValue: 'La Pintana', viewValue: 'la-pintana-metropolitana' },
    { apiValue: 'La Reina', viewValue: 'la-reina-metropolitana' },
    { apiValue: 'Las Condes', viewValue: 'las-condes-metropolitana' },
    { apiValue: 'La Serena', viewValue: 'la-serena-coquimbo' },
    { apiValue: 'Limache', viewValue: 'limache-valparaiso' },
    { apiValue: 'Llaillay', viewValue: 'llaillay-valparaiso' },
    { apiValue: 'Lo Barnechea', viewValue: 'lo-barnechea-metropolitana' },
    { apiValue: 'Los Andes', viewValue: 'los-andes-valparaiso' },
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
    { apiValue: 'Padre las Casas', viewValue: 'padre-las-casas-la-araucania' },
    { apiValue: 'Papudo', viewValue: 'papudo-valparaiso' },
    { apiValue: 'Peñaflor', viewValue: 'penaflor-metropolitana' },
    { apiValue: 'Peñalolén', viewValue: 'penalolen-metropolitana' },
    { apiValue: 'Peumo', viewValue: 'peumo-bernardo-ohiggins' },
    { apiValue: 'Pichilemu', viewValue: 'pichilemu-bernardo-ohiggins' },
    { apiValue: 'Providencia', viewValue: 'providencia-metropolitana' },
    { apiValue: 'Puchuncaví', viewValue: 'puchuncavi-valparaiso' },
    { apiValue: 'Pucón', viewValue: 'pucon-la-araucania' },
    { apiValue: 'Pudahuel', viewValue: 'pudahuel-metropolitana' },
    { apiValue: 'Puente Alto', viewValue: 'puente-alto-metropolitana' },
    { apiValue: 'Puerto Montt', viewValue: 'puerto-montt-los-lagos' },
    { apiValue: 'Puerto Varas', viewValue: 'puerto-varas-los-lagos' },
    { apiValue: 'Antártica', viewValue: 'punta-arenas-magallanes-y-antartica-chilena' },
    { apiValue: 'Quilicura', viewValue: 'quilicura-metropolitana' },
    { apiValue: 'Quillota', viewValue: 'quillota-valparaiso' },
    { apiValue: 'Quilpué', viewValue: 'quilpue-valparaiso' },
    { apiValue: 'Quinta Normal', viewValue: 'quinta-normal-metropolitana' },
    { apiValue: 'Rancagua', viewValue: 'rancagua-bernardo-ohiggins' },
    { apiValue: 'Recoleta', viewValue: 'recoleta-metropolitana' },
    { apiValue: 'Renca', viewValue: 'renca-metropolitana' },
    { apiValue: 'Rengo', viewValue: 'rengo-bernardo-ohiggins' },
    { apiValue: 'Requínoa', viewValue: 'requinoa-bernardo-ohiggins' },
    { apiValue: 'San Antonio', viewValue: 'san-antonio-valparaiso' },
    { apiValue: 'San Bernardo', viewValue: 'san-bernardo-metropolitana' },
    { apiValue: 'San Esteban', viewValue: 'san-esteban-valparaiso' },
    { apiValue: 'San Felipe', viewValue: 'san-felipe-valparaiso' },
    { apiValue: 'San Fernando', viewValue: 'san-fernando-bernardo-ohiggins' },
    { apiValue: 'San Joaquín', viewValue: 'san-joaquin-metropolitana' },
    { apiValue: 'San Miguel', viewValue: 'san-miguel-metropolitana' },
    { apiValue: 'Santa Cruz', viewValue: 'santa-cruz-bernardo-ohiggins' },
    { apiValue: 'Santiago', viewValue: 'santiago-metropolitana' },
    { apiValue: 'Talagante', viewValue: 'talagante-metropolitana' },
    { apiValue: 'Temuco', viewValue: 'temuco-la-araucania' },
    { apiValue: 'Til Til', viewValue: 'til-til-metropolitana' },
    { apiValue: 'Valdivia', viewValue: 'valdivia-de-los-rios' },
    { apiValue: 'Valparaíso', viewValue: 'valparaiso-valparaiso' },
    { apiValue: 'Villa Alemana', viewValue: 'villa-alemana-valparaiso' },
    { apiValue: 'Villarrica', viewValue: 'villarrica-la-araucania' },
    { apiValue: 'Viña del Mar', viewValue: 'vina-del-mar-valparaiso' },
    { apiValue: 'Vitacura', viewValue: 'vitacura-metropolitana' },
    { apiValue: 'Zapallar', viewValue: 'zapallar-valparaiso' },
  ];

  comunas: string[] = [
    'algarrobo-valparaiso',
    'alto-hospicio-tarapaca',
    'antartica-magallanes-y-antartica-chilena',
    'antofagasta-antofagasta',
    'arica-arica-y-parinacota',
    'buin-metropolitana',
    'calama-antofagasta',
    'calera-de-tango-metropolitana',
    'calle-larga-valparaiso',
    'casablanca-valparaiso',
    'cerrillos-metropolitana',
    'chiguayante-biobio',
    'chillan-biobio',
    'colina-metropolitana',
    'coltauco-bernardo-ohiggins',
    'concepcion-biobio',
    'conchali-metropolitana',
    'concon-valparaiso',
    'copiapo-copiapo',
    'coquimbo-coquimbo',
    'coronel-biobio',
    'coyhaique-aysen',
    'curico-maule',
    'el-tabo-valparaiso',
    'estacion-central-metropolitana',
    'frutillar-los-lagos',
    'graneros-bernardo-ohiggins',
    'huechuraba-metropolitana',
    'independencia-metropolitana',
    'iquique-tarapaca',
    'isla-de-maipo-metropolitana',
    'la-calera-valparaiso',
    'la-cisterna-metropolitana',
    'la-cruz-valparaiso',
    'la-florida-metropolitana',
    'la-granja-metropolitana',
    'la-ligua-valparaiso',
    'lampa-metropolitana',
    'la-pintana-metropolitana',
    'la-reina-metropolitana',
    'las-condes-metropolitana',
    'la-serena-coquimbo',
    'limache-valparaiso',
    'llaillay-valparaiso',
    'lo-barnechea-metropolitana',
    'los-andes-valparaiso',
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
    'padre-las-casas-la-araucania',
    'papudo-valparaiso',
    'penaflor-metropolitana',
    'penalolen-metropolitana',
    'peumo-bernardo-ohiggins',
    'pichilemu-bernardo-ohiggins',
    'providencia-metropolitana',
    'puchuncavi-valparaiso',
    'pucon-la-araucania',
    'pudahuel-metropolitana',
    'puente-alto-metropolitana',
    'puerto-montt-los-lagos',
    'puerto-varas-los-lagos',
    'punta-arenas-magallanes-y-antartica-chilena',
    'quilicura-metropolitana',
    'quillota-valparaiso',
    'quilpue-valparaiso',
    'quinta-normal-metropolitana',
    'rancagua-bernardo-ohiggins',
    'recoleta-metropolitana',
    'renca-metropolitana',
    'rengo-bernardo-ohiggins',
    'requinoa-bernardo-ohiggins',
    'san-antonio-valparaiso',
    'san-bernardo-metropolitana',
    'san-esteban-valparaiso',
    'san-felipe-valparaiso',
    'san-fernando-bernardo-ohiggins',
    'san-joaquin-metropolitana',
    'san-miguel-metropolitana',
    'santa-cruz-bernardo-ohiggins',
    'santiago-metropolitana',
    'talagante-metropolitana',
    'temuco-la-araucania',
    'til-til-metropolitana',
    'valdivia-de-los-rios',
    'valparaiso-valparaiso',
    'villa-alemana-valparaiso',
    'villarrica-la-araucania',
    'vina-del-mar-valparaiso',
    'vitacura-metropolitana',
    'zapallar-valparaiso'];

  tipos: Tipos[] = [
    { viewValue: 'Casa' },
    { viewValue: 'Departamento' },
    { viewValue: 'Oficina' },
    { viewValue: 'Parcela' },
    { viewValue: 'Sitio' },
    { viewValue: 'Bodega' },
  ];

  operaciones: Operacion[] = [
    { viewValue: 'Venta'},
    { viewValue: 'Arriendo'},
  ];

  filteredOptions: Observable<Comunas[]>;

  dataJson: any;

  constructor(
    private webApiService: WebapiService,
    private excelService: ExcelService
  ) { }

  ngOnInit() {
    
    this.fechaInicio.setDate(this.fechaInicio.getDate() - 7);
    this.fechaFin.setDate(this.fechaFin.getDate() + 1);

    this.filteredOptions = this.comunaSelected.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): Comunas[] {
    const filterValue = value.toLowerCase();

    return this.comunasInterface.filter(comuna => comuna.apiValue.toLowerCase().includes(filterValue));
  }

  detieneJobs() {
    this.webApiService.stopJobs();
  }


  generaJob(operacion: string, tipo: string, valor: string) {

    if(this.fechaInicio > this.fechaFin){
      alert('La fecha de inicio es mayor a la fecha de Fin');
      return;
    }

    this.formatedFechaInicio = this.formatFecha(this.fechaInicio); // si es nula mandar una fecha mes anterior al día de hoy - un mes
    this.formatedFechaFin = this.formatFecha(this.fechaFin); //un día más que la de inicio si está nula

    this.isLoadingResults = true;    
    let url: string = this.buildUrl(operacion, tipo, valor);   

      this.webApiService.initJob(url, this.formatedFechaInicio, this.formatedFechaFin).subscribe(
        jobResult => {
          console.log('INICIAMOS EL JOB: ' + jobResult);
          if (jobResult['status'] = 'ok') {
            this.checkJobResult(jobResult);
          } else {
            setTimeout(function () {
              this.generaJob(tipo, valor);
            }, 5000);
          }
        }

      );
  }

  checkJobResult(jobResult: Object) {

    var thisApp = this;
    console.log('VAMOS A VERIFICAR EL ESTADO DEL JOB');
    this.webApiService.getStatus().subscribe(
      status => {
        console.log('sacamos el estado de todo: Es ESTE =>');
        console.log(status);
        let termino:  boolean;
        termino = false;
        status['finished'].forEach(element => {
          if (element['id'] === jobResult['jobid'] ){
            termino = true;
            console.log('YA TERMINO');
            this.exportDataExcel(jobResult['jobid']);
          }
        }); 

      if (!termino) {
        console.log('NO TERMINO');
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
    this.isLoadingResults = false;
    console.log("VAMOS A EXPORTAR");
    this.webApiService.getDataJSON(idJob).subscribe(response => {
      console.log("LLEGARON ESTOS DATOS: "+response);
      this.dataJson = response;
      if (this.dataJson.length > 0) {
        this.excelService.exportAsExcelFile(this.dataJson, 'datosPortal');
      } else {
        alert('La consulta no arrojó resultados');
      }
      this.isLoadingResults = false;
    });


  }

  buildUrl(operacion: string, tipoPropiedad: string, valor: string): string {
    return 'https://www.portalinmobiliario.com/'+operacion+'/' + tipoPropiedad + '/' + valor + '?tp=1&op=1&ca=2&ts=1&dd=0&dh=6&bd=0&bh=6&or=&mn=2&sf=1&sp=0';
  }

  formatFecha(fecha: Date): string{       
    return this.to2digit(fecha.getDate()) + '-' + this.to2digit((fecha.getMonth() + 1 )) + '-' + fecha.getFullYear();
  }

  private to2digit(n: number) {
    return ('00' + n).slice(-2);
  }


}
