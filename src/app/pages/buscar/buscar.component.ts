import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConsultaService } from '../../services/consulta.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Consulta } from 'src/app/models/consulta';
import { BuscarDialogoComponent } from './buscar-dialogo/buscar-dialogo.component';
import * as moment from 'moment';
import { FiltroConsultaDTO } from '../../dto/filtroConsultaDTO';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {

  form: FormGroup = this.fb.group({
    dni: [''],
    nombreCompleto: [''],
    fechaConsulta: []
  });
  
  maxFecha: Date = new Date();

  displayedColumns: string[] = ['paciente', 'medico', 'especialidad', 'fecha', 'acciones'];
  dataSource!: MatTableDataSource<Consulta>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private fb: FormBuilder,
              private consultaService: ConsultaService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  buscar() {
    let fecha = this.form.value['fechaConsulta'];
    fecha = fecha != null ? moment(fecha).format('YYYY-MM-DDTHH:mm:ss') : '';

    let filtro = new FiltroConsultaDTO(this.form.value['dni'], this.form.value['nombreCompleto']);
 
    if(filtro.dni == null || filtro.dni.length === 0){
      delete filtro.dni;
    }

    if(filtro.nombreCompleto == null || filtro.nombreCompleto.length === 0){
      delete filtro.nombreCompleto;
    }

    if(fecha != null && fecha !== ''){
      this.consultaService.buscarFecha(fecha).subscribe(data => {
        if(data.length > 0){
          this.crearTabla(data)
        }else{
          this.consultaService.openSnackBar("No se encontraron resultados");
        }
      });
    }else{
      this.consultaService.buscarOtros(filtro).subscribe(data => {
        if(data.length > 0){
          this.crearTabla(data)
        }else{
          this.consultaService.openSnackBar("No se encontraron resultados");
        }
      });
    }
  }

  crearTabla(data: Consulta[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  verDetalle( consulta: Consulta) {
    this.dialog.open(BuscarDialogoComponent, {
      data: consulta
    });
  }

  limpiar() {
    this.form.reset();
    this.dataSource.data = [];
  }

}
