import { Injectable } from '@angular/core';
import { Solicitud } from './solicitud';
import { Observable,throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})

export class SolicitudService {
  private urlEndPoint: string = 'http://localhost:8081/api/aspirante/';

  constructor(private http: HttpClient) { }

  getAspirantes(numero_de_identificacion: number): Observable<any> {
    return this.http.get(this.urlEndPoint + numero_de_identificacion + '/solicitud').pipe(
        map((response: any) => {
        (response as Solicitud[]).map(solicitud => {
            return solicitud
          });
          return response;
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
