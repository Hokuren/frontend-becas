import { Injectable } from '@angular/core';
import { Solicitud } from '../../solicitud/solicitud';
import { Observable,throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import { ConvocatoriaSimple } from '../convocatoria-simple';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class BeneficiadosService {

  private urlEndPoint: string = 'http://localhost:8081/api/';

  constructor(private http: HttpClient) { }

  getConvocatorias(): Observable<any> {
    return this.http.get(this.urlEndPoint + 'convocatorias').pipe(
        map((response: any) => {
        (response as ConvocatoriaSimple[]).map(convocatoria => {
            return convocatoria
          });
          return response;
        }),
    );
  }

  getBeneficiarios(convocatoria_id: number): Observable<any> {
    return this.http.get(this.urlEndPoint + 'convocatoria/' + convocatoria_id + '/beneficiarios').pipe(
        map((response: any) => {
          console.log('***** 1 *****', response);
        (response as Solicitud[]).map(solicitud => {
            return solicitud
          });
          return response;
          console.log('***** 1 *****', response);
        }),
        catchError(e => {
           if(e.status == 400){
               return throwError(e);
           }
           console.error(e.error.mensaje);
           swal(e.error.mensaje, e.error.error, 'error');
           return throwError(e);
         })
    );
  }

}
