import { Injectable } from '@angular/core';
import { Observable,throwError } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Criterio } from './criterio';
import { Programa } from './programa';
import { ESTADO_CONVOCATORIA,ProgramaMap,CriterioMap,ConvocatoriaMap,ServerResponseProgram, ServerResponse} from './map-convocatoria';

@Injectable({
  providedIn: 'root'
})

export class ConvocatoriaService {

    data_convocatoria: any;
    criterios: any;
    programas: any;

    private urlEndPoint: string = 'http://localhost:8081/api/';

    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

    constructor(private http: HttpClient) { }

    getCriterios(): Observable<any> {
      return this.http.get(this.urlEndPoint + 'criterios').pipe(
          map((response: any) => {
          (response as Criterio[]).map(criterio => {
              return criterio
            });
            return response;
          }),
      );
    }

    getProgramas(): Observable<any> {
      return this.http.get(this.urlEndPoint + 'programas').pipe(
          map((response: any) => {
          (response as Programa[]).map(convocatoria => {
              return convocatoria
            });
            return response;
          }),
      );
    }

    deleteCriterio(convocatoria_id: number,programa_id: number,criterio_id: number): Observable<Criterio>{
    return this.http.delete<Criterio>(`${this.urlEndPoint}eliminar/convocatoria/${convocatoria_id}/programa/${programa_id}/criterio/${criterio_id}`,{ headers: this.httpHeaders }).pipe(
      catchError( e => {
        console.error(e.error.mensaje);
        swal(e.error.mensaje, e.error.error , 'error');
        return throwError(e);
      })
    );
    }

    deletePrograma(convocatoria_id: number,programa_id: number): Observable<Programa>{
    return this.http.delete<Programa>(`${this.urlEndPoint}eliminar/convocatoria/${convocatoria_id}/programa/${programa_id}`,{ headers: this.httpHeaders }).pipe(
      catchError( e => {
        console.error(e.error.mensaje);
        swal(e.error.mensaje, e.error.error , 'error');
        return throwError(e);
      })
    );
    }

    getConvocatoria(convocatoria_id: number): Observable<any> {
      this.getCriterios()
        .subscribe(criterios => {
          this.criterios = criterios;
        });
      this.getProgramas()
        .subscribe(programas => {
          this.programas = programas;
      });
      return this.http.get(this.urlEndPoint + 'convocatoria/'+ convocatoria_id ).pipe(
          map((response: any) => {
            let lista = response.lista_programas.map(item =>{
              let estra = this.criterios.filter( c =>  c.criterio_id == item.criterio_id);
              let progra = this.programas.filter( c =>  c.programa_id == item.programa_id);
              return { convo_progra_id: item.convo_progra_id,
              convocatoria_id: item.convocatoria_id,
              criterio_id: item.criterio_id,
              peso_criterio: item.peso_criterio,
              programa_id: item.programa_id,
              criterio: estra[0],
              programa: progra[0]
             }
            })
            let convocatoria_armada = {
              convocatoria_id: response.convocatoria_id,
              nombre: response.nombre,
              monto: response.monto,
              fecha_inicio: response.fecha_inicio,
              fecha_fin: response.fecha_fin,
              estado: response.estado,
              lista_programas:  lista
            }
            return {
               "convocatoria": convocatoria_armada,
               "convocatoria_map": this.mappingPrograma(convocatoria_armada as unknown as ServerResponse)}
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

    updateConvocatoria(convocatoria_id: number,convocatoria: any,data_convocatoria: ConvocatoriaMap): Observable<any> {
       let map_convocatoria = this.genertaDataForCreateOrEdit(convocatoria,data_convocatoria);
       return this.http.put<any>(`${this.urlEndPoint}convocatoria/${convocatoria_id}`,map_convocatoria, { headers: this.httpHeaders }).pipe(
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

    postGenerarBeneficiarios(convocatoria_id: number): Observable<any>{
      return this.http.post(this.urlEndPoint+'convocatoria/'+convocatoria_id+'/generar_beneficiaros', { headers: this.httpHeaders }).pipe(
        map( (response: any) => response),
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

    extracCriteriosByProgam(program_id: number, data: ServerResponseProgram[]): CriterioMap[] {
      const criterios: CriterioMap[] = data.filter(e => e.programa_id === program_id).map(item => ({
        criterio_id: item.criterio.criterio_id,
        nombre: item.criterio.nombre,
        tipo_de_criterio: item.criterio.tipo_de_criterio,
        valor_dos: item.criterio.valor_dos,
        valor_uno: item.criterio.valor_uno,
        convo_progra_id: item.convo_progra_id,
        peso_criterio: item.peso_criterio
      }))
      return criterios;
    }

    mappingPrograma(data: ServerResponse): ProgramaMap[] {
      const dataMap: Map<number, ProgramaMap> = new Map();
      data.lista_programas.map(item => {
        const programa: ProgramaMap = {
          covocatoria_id: item.convocatoria_id,
          nombre: item.programa.nombre,
          programa_id: item.programa.programa_id,
          criterios: this.extracCriteriosByProgam(item.programa_id, data.lista_programas)
        }
        return programa
      }).forEach(e => {
        if (!dataMap.has(e.programa_id)) dataMap.set(e.programa_id, e);
      })
      return [...dataMap.values()]
    }

    genertaDataForCreateOrEdit (programs: ProgramaMap[],data_convocatoria: ConvocatoriaMap): ServerResponse {
      if (programs.length > 0) {
          const data: ServerResponse = {
              convocatoria_id: data_convocatoria.convocatoria_id,
              nombre: data_convocatoria.nombre,
              monto: data_convocatoria.monto,
              fecha_inicio: data_convocatoria.fecha_inicio,
              fecha_fin: data_convocatoria.fecha_fin,
              estado: data_convocatoria.estado,
              lista_programas: []
          };
          programs.forEach((e)=> {
              let criterios = []
              if (e.criterios.length > 0){
                  criterios =  e.criterios.map(item => {
                    const criterial: ServerResponseProgram = {
                        convo_progra_id: item.convo_progra_id,
                        criterio_id: item.criterio_id,
                        peso_criterio: item.peso_criterio,
                        convocatoria_id: Number(data_convocatoria.convocatoria_id),
                        programa_id: e.programa_id,
                        // programa: {
                        //     programa_id: e.programa_id,
                        //     nombre: e.nombre,
                        // },
                        // criterio: item,
                        // convocatoria: {
                        //     nombre: data_convocatoria.nombre,
                        //     convocatoria_id: data_convocatoria.convocatoria_id,
                        //     estado: data_convocatoria.estado,
                        //     fecha_fin: data_convocatoria.fecha_fin,
                        //     fecha_inicio: data_convocatoria.fecha_inicio,
                        //     monto: data_convocatoria.monto,
                        // }

                    }
                    return criterial
                })
                data.lista_programas = [...data.lista_programas,...criterios];
              }//  else {
              //   const criterial: ServerResponseProgram = {
              //       convocatoria_id: Number(data_convocatoria.convocatoria_id),
              //       programa_id: e.programa_id,
              //       programa: {
              //           programa_id: e.programa_id,
              //           nombre: e.nombre,
              //       },
              //       convocatoria: {
              //           nombre: data_convocatoria.nombre,
              //           convocatoria_id: data_convocatoria.convocatoria_id,
              //           estado: data_convocatoria.estado,
              //           fecha_fin: data_convocatoria.fecha_fin,
              //           fecha_inicio: data_convocatoria.fecha_inicio,
              //           monto: data_convocatoria.monto,
              //       },
              //       criterio: {
              //       }
              //   }
              //   data.lista_programas.push(criterial);
              // } //fin else

          })
          return data;
      }
      return {} as ServerResponse
  }

}
