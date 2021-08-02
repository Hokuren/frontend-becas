import { Component, OnInit, Input,Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './modal.service';
import { Criterio } from '../convocatoria/criterio';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() titulo: String;
  @Input() lista: String[];
  @Input() tipo: String;
  @Input() elementos_quitar: String[];
  @Input() criterios: any;
  @Output() lista_modal = new EventEmitter<any>();

  lista_recibida: String[];


  constructor(private activetedRoute: ActivatedRoute,
              public modalService: ModalService) { }

  ngOnInit(): void {
  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.lista_recibida = [];
  }

  recibiendoLista(lista: any){
    this.lista_recibida = lista;
  }
  enviandoListaModal(){
    this.lista_modal.emit(this.lista_recibida);
    this.cerrarModal();
  }


}
