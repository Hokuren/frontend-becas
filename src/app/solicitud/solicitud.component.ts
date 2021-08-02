import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { ErrorStateMatcher} from '@angular/material/core';

import { Solicitud } from './solicitud';
import { SolicitudService } from './solicitud.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.scss']
})

export class SolicitudComponent implements OnInit {
  numberFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();

  solicitudes: Solicitud[];
  cedula: number;
  //titulos: String[] = ['Cedula','Nombre','Apellido','Estado','Programa académico','Estrato','Porcentaje asignado de beca','convocatoria'];
  displayedColumns: string[] = ['cedula','nombre','apellido','estado','programa_academico','Estrato','porcentaje_asignado_beca','convocatoria'];

  constructor(private activetedRoute: ActivatedRoute,
              private solicitudService: SolicitudService) { }

  ngOnInit(): void {
    this.activetedRoute.paramMap.subscribe(params => {
      let id: number = +params.get("cedula")
      if(id){
        this.solicitudService.getAspirantes(id).subscribe(solicitudes =>{
          this.solicitudes = solicitudes;
          if(this.solicitudes?.length == 0){
            // this.cedula = null;
            swal('Aspirante no encontrado',
            `no hay un aspitante con la cedula ${id} asociado a una convocatorio`,'info');
          }
        });
      }
    })
  }

}
