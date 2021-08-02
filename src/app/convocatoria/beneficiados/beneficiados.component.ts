import { Component, OnInit } from '@angular/core';
import { Solicitud } from '../../solicitud/solicitud';
import { ConvocatoriaSimple } from '../convocatoria-simple';
import { BeneficiadosService } from './beneficiados.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-beneficiados',
  templateUrl: './beneficiados.component.html',
  styleUrls: ['./beneficiados.component.scss']
})
export class BeneficiadosComponent implements OnInit {

  solicitudes: Solicitud[];
  convocatorias: ConvocatoriaSimple[];
  convocatoria_id: number = 0;
  displayedColumns: string[] = ['cedula','nombre','apellido','estado','programa_academico','Estrato','porcentaje_asignado_beca'];
  buscador: Boolean = true;
  paginable: Boolean = true;

  constructor(private beneficiadosService: BeneficiadosService,
              private activetedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.beneficiadosService.getConvocatorias()
      .subscribe(convocatorias => {
        this.convocatorias = convocatorias;
    });
  }

  getBeneficiariosConvocatoria(convocatoria_id: number){
    if (convocatoria_id !== 0) {
        this.beneficiadosService.getBeneficiarios(convocatoria_id)
        .subscribe(solicitudes => {
          this.solicitudes = solicitudes;
        });
    }
  }



}
