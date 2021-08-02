import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Criterio } from '../criterio';

@Component({
  selector: 'app-tabla-list',
  templateUrl: './tabla-list.component.html',
  styleUrls: ['./tabla-list.component.scss']
})
export class TablaListComponent implements OnInit {

  @Input() displayedColumns: String[] = ['nombre'];
  @Input() lista: any[];
  @Input() tipo: String;
  @Input() elementos_quitar: any[];
  @Input() criterios: any;
  @Output() lista_tabla = new EventEmitter<any>();

  nombre: String;
  nueva_lista: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.nombre = '';
    this.nueva_lista = [];
    if(this.tipo=='programa') {
      this.lista.forEach(lis => {
        let encontro: any = [];
        encontro = this.elementos_quitar.find(item => {
          if(item.programa_id == lis.programa_id){
            return lis;
          }
        })
        if (encontro){
        } else {
            this.nueva_lista.push(lis);
        }
      })
    } else if(this.tipo=='criterio') {
      this.lista.forEach(lis => {
        let encontro: any = [];
        encontro = this.elementos_quitar.find(item => {
          if(item.criterio_id == lis.criterio_id){
            return lis;
          }
        })
        if (encontro){
        } else {
            this.nueva_lista.push(lis);
        }
      })
    }
  }

  selectItem(nombre: String){
    this.nombre = nombre;
    this.enviarLista();
  }
  
  enviarLista(): void{
    this.lista_tabla.emit(this.lista.filter(lis => lis.nombre === this.nombre));
  }

}
