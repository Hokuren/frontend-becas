import { Component, OnInit, Input  } from '@angular/core';
import { CriterioPeso } from '../criterio-peso';
import swal from 'sweetalert2';
import { ConvocatoriaService } from '../convocatoria.service';


@Component({
  selector: 'app-tabla-criterios',
  templateUrl: './tabla-criterios.component.html',
  styleUrls: ['./tabla-criterios.component.scss']
})
export class TablaCriteriosComponent implements OnInit {

  @Input() displayedColumns: String[] = ['criterio_id','nombre','peso_criterio','eliminar'];
  @Input() criterios: CriterioPeso[];
  @Input() convocatoria_id: number;
  @Input() programa_id: number;
  @Input() convocatoria_cerrada: boolean;

  constructor(private convocatoriaService: ConvocatoriaService) { }

  ngOnInit(): void {

  }

  eliminarCriterio(convocatoria_id: number,programa_id: number,criterio_id: number,nombre: string): void {
    swal({
     title: 'Está Seguro?',
     text: `¿Seguro que desea elimanar el criterio? ${nombre.toLocaleLowerCase()}?`,
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
       this.convocatoriaService.deleteCriterio(convocatoria_id,programa_id,criterio_id).subscribe(
         response => {
           this.criterios = this.criterios.filter(cli => cli.criterio_id !== criterio_id);
           swal(
             'Criterio Eliminado!',
             `Criterio ${ nombre } eliminado con éxito.`,
             'success'
           )
         }
       )
     }
   })
  }




}
