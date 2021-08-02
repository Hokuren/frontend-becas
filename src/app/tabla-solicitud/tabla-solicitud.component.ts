import { Component, OnInit, Input,ViewChild,AfterViewInit } from '@angular/core';
import { Solicitud } from '../solicitud/solicitud';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-tabla-solicitud',
  templateUrl: './tabla-solicitud.component.html',
  styleUrls: ['./tabla-solicitud.component.scss']
})

export class TablaSolicitudComponent implements OnInit {

  @Input() displayedColumns: String[];
  @Input() solicitudes: Solicitud[] = [];
  @Input() buscador: boolean = false;
  @Input() paginable: boolean = false;

  dataSource: MatTableDataSource<Solicitud>
   applyFilter(event: Event) {
     const filterValue = (event.target as HTMLInputElement).value;
     this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor() { }

  ngOnInit(): void {

    this.dataSource = new MatTableDataSource(this.solicitudes);
  }

}
