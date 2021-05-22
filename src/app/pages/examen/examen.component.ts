import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Examen } from '../../models/examen';
import { ExamenEdicionComponent } from './examen-edicion/examen-edicion.component';
import { ExamenService } from '../../services/examen.service';
import { ConfirmarEliminacionDialogoComponent } from '../../shared/confirmar-eliminacion-dialogo/confirmar-eliminacion-dialogo.component';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.css']
})
export class ExamenComponent implements OnInit {

  displayedColumns: string[] = ['idExamen', 'nombre', 'descripcion', 'acciones']
  dataSource: MatTableDataSource<Examen> = new MatTableDataSource<Examen>();
  cargando: boolean = true;
  
  @ViewChild(MatSort) sort!: MatSort; 
  @ViewChild(MatPaginator) paginator!: MatPaginator; 

  constructor(private _examenService: ExamenService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this._examenService.listar().subscribe(
      pacientes => {
        this.crearTabla(pacientes);
      }
    );
    this._examenService.getExamenCambio().subscribe(
      pacientes => {
        this.crearTabla(pacientes);
      }
    );
    this._examenService.getMensajeCambio().subscribe( data => {
      this._examenService.openSnackBar(data);
    });
  }

  eliminar(id: number){
    this.dialog.open(ConfirmarEliminacionDialogoComponent, {
      width: '300px'
    }).beforeClosed()
      .pipe(
        switchMap( (data: boolean) => {
          if(data){
            return this._examenService.eliminar(id).pipe(map( () => true));
          }else{
            return of(data);
          }
        }),
        switchMap( data => {
          if(data){
            return this._examenService.listar();
          }else{
            return of(data);
          }
        })
      ).subscribe( data => {
        if(!data){
          return;
        }
        this._examenService.setMensajeCambio("Se elimino el registro del examen correctamente");
        this._examenService.setExamenCambio(data);
      });   
  }

  crearTabla( examenes: Examen[]) {
    this.dataSource = new MatTableDataSource(examenes);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.cargando = false;
  }

  filtrar( valor: string ){
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  openDialogo( examen?: Examen) {
    const dialogRef = this.dialog.open(ExamenEdicionComponent, {
      width: '350px',
      data: examen
    });
  }

}
