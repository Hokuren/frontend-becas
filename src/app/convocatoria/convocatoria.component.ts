import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { ModalService } from '../modal/modal.service';
import { ConvocatoriaSimple } from './convocatoria-simple';
import { BeneficiadosService } from './beneficiados/beneficiados.service';
import { Criterio } from './criterio';
import { ConvocatoriaService } from './convocatoria.service';
import { Programa } from './programa';
import swal from 'sweetalert2';
import { ESTADO_CONVOCATORIA,ConvocatoriaMap } from './map-convocatoria';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-convocatoria',
  templateUrl: './convocatoria.component.html',
  styleUrls: ['./convocatoria.component.scss']
})
export class ConvocatoriaComponent implements OnInit {
  numberFormControl = new FormControl('',  [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();

  panelOpenState = false;

  titleProgramas: String = 'Programas';
  titleCriterios: String = 'Criterios de Selección';
  errores: string[];
  title: String;
  lista: Object[];
  buscador: Boolean = true;
  convocatoria_id: number;
  convocatorias: ConvocatoriaSimple;
  criterios: Criterio[];
  programas: Programa[];
  convocatoria: any;
  estado_convocatoria: ESTADO_CONVOCATORIA;
  monto: number;
  tipo: string;
  lista_modal_recibida: string[];
  nombre_convocatoria: string;
  fecha_fin: Date;
  fecha_inicio: Date;
  data_convocatoria: ConvocatoriaMap;
  programa_id: number;
  elementos_quitar: String[];
  programa_criterios: any;
  charge: boolean = true;
  other_data: any;

  constructor(private modalService: ModalService,
              private beneficiadosService: BeneficiadosService,
              private convocatoriaService: ConvocatoriaService) { }

  ngOnInit(): void {
    this.beneficiadosService.getConvocatorias()
      .subscribe(convocatorias => {
        this.convocatorias = convocatorias;
      });
    this.convocatoriaService.getCriterios()
      .subscribe(criterios => {
        this.criterios = criterios;
      });
    this.convocatoriaService.getProgramas()
      .subscribe(programas => {
        this.programas = programas;
      });
  }

  abrirModal(tipo: string,programa_id: number,criterios:  any): void {
    this.programa_id = 0;
    this.programa_id = programa_id;
    if (tipo == 'criterio'){
      this.title = this.titleCriterios;
      this.lista = this.criterios;
      let valor: any = this.convocatoria.find(con => con.programa_id !== this.programa_id);
      this.elementos_quitar = criterios;
    } else if (tipo == 'programa'){
      this.title = this.titleProgramas;
      this.lista = this.programas;
      this.elementos_quitar = this.convocatoria
    }
    this.tipo = tipo;
    this.modalService.abrirModal();
  }


  eliminarPrograma(convocatoria_id: number,programa_id: number,nombre: string): void {
    swal({
     title: 'Está Seguro?',
     text: `¿Seguro que desea elimanar el programa? ${nombre}?`,
     type: 'warning',
     showCancelButton: true,
     confirmButtonColor: '#3085d6',
     cancelButtonColor: '#d33',
     confirmButtonText: 'Si, eliminar',
     confirmButtonClass: 'btn btn-success',
     cancelButtonClass: 'btn btn-danger',
     cancelButtonText: 'No, cancelar!',
     buttonsStyling: false,
     reverseButtons: true,
   }).then((result) => {
     if (result.value) {
       this.convocatoriaService.deletePrograma(convocatoria_id,programa_id).subscribe(
         response => {
           this.convocatoria = this.convocatoria.filter(con => con.programa_id !== programa_id);
           swal(
             'Programa Eliminado!',
             `Programa ${ nombre } eliminado con éxito.`,
             'success'
           )
         }
       )
     }
   })
  }

  getConvocatoria(convocatoria_id: number): void{
    if (convocatoria_id !== 0) {
        this.convocatoriaService.getConvocatoria(convocatoria_id)
        .subscribe(convocatoria => {
          this.estado_convocatoria = convocatoria.convocatoria.estado;
          this.monto = convocatoria.convocatoria.monto;
          this.nombre_convocatoria = convocatoria.convocatoria.nombre;
          this.fecha_fin = convocatoria.convocatoria.fecha_fin;
          this.fecha_inicio = convocatoria.convocatoria.fecha_inicio;

          this.convocatoria = convocatoria.convocatoria_map;
        });
    }
  }

  validarCerrada(): Boolean {
    return this.estado_convocatoria == 'CERRADA'? true : false;
  }

  updateConvocatoria(convocatoria_id: number,convocatoria: any): void{
    this.data_convocatoria = {
      convocatoria_id: this.convocatoria_id,
      estado: this.estado_convocatoria,
      monto: this.monto,
      nombre: this.nombre_convocatoria,
      fecha_fin: this.fecha_fin,
      fecha_inicio: this.fecha_inicio,
    }
    if (convocatoria_id !== 0) {
        this.convocatoriaService.updateConvocatoria(convocatoria_id,convocatoria,this.data_convocatoria)
        .subscribe(json => {
          swal('Convocatoria Actualizada', `La convocatoria ha sido actualizada con éxito`, 'success');
        },
        err => {
           this.errores = err.error.errors as string[];
           console.error('Código del error desde el backend: ' + err.status)
           console.error(err.error.errors);
        }
      );
     }
  }

  postGenerarBeneficiarios(convocatoria_id: number){
    if (convocatoria_id !== 0) {
        this.convocatoriaService.postGenerarBeneficiarios(convocatoria_id)
        .subscribe(json => {
          if(json.V_CODIGO == 1) {
              swal('Convocatoria Procesada', `La convocatoria ha sido "CERRADA" y se ha seleccionado los beneficiarios `, 'success');
          } else {
             swal('Error Convocatoria', 'No se ha podido procesar la convocatoria ', 'error');
          }
        },
        err => {
           this.errores = err.error.errors as string[];
           console.error('Código del error desde el backend: ' + err.status)
           console.error(err.error.errors);
        }
      );
     }
  }

  recibiendoListaModal(lista: any): void{
    this.charge = false;
    setTimeout(()=> { this.charge = true; }, 200);

    this.lista_modal_recibida = lista;
    if(this.tipo=='programa'){
      try {
        this.convocatoria.push({
          convocatoria_id: Number(this.convocatoria_id),
          criterios: [],
          estado: this.estado_convocatoria,
          nombre: lista[0].nombre,
          programa_id: lista[0].programa_id
        })
      } catch(e){
        console.log(e);
      }
    } else if(this.tipo=='criterio'){
        this.convocatoria.filter(con => {
          if (con.programa_id === this.programa_id){
            con.criterios.push({
              criterio_id: lista[0].criterio_id,
              nombre: lista[0].nombre,
              peso_criterio: 0,
              tipo_de_criterio: lista[0].tipo_de_criterio,
              valor_dos: lista[0].valor_dos,
              valor_uno: lista[0].valor_uno,
            })
          }
        })
    }
  }

  validarCriterios(criterios: any): number {
    try {
      let acumulador = 0;
      criterios.forEach((e)=> {
          acumulador = acumulador + e.peso_criterio;
      });
      return acumulador;
    } catch(e){

    }
  }
  validarTodosCriterios(programas: any): boolean {
    try {
      let validate: boolean = false;
      programas.forEach((e)=> {
          let acumulador = 0;
          e.criterios.forEach((e)=> {
              acumulador = acumulador + e.peso_criterio;
          });
          if(acumulador != 100){
            validate = true;
          }
      });
      return validate;
    } catch(e){

    }
  }

  validarGuardar(programas: any): boolean {
    console.log('programas', programas);
    try {
      let validate: boolean = false;
      programas.forEach((e)=> {
          if(e.criterios.length == 0 && validate == false){
            validate = true;
          }
      });
      console.log('validate ', validate);
      return validate;
    } catch(e){

    }
  }

}
