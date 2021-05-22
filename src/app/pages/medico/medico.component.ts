import { Component, OnInit, ViewChild } from '@angular/core';
import { map, switchMap, tap } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Medico } from '../../models/medico';
import { MedicoService } from '../../services/medico.service';
import { MedicoDialogoComponent } from './medico-dialogo/medico-dialogo.component';
import { ConfirmarEliminacionDialogoComponent } from '../../shared/confirmar-eliminacion-dialogo/confirmar-eliminacion-dialogo.component';
import { of } from 'rxjs';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {

  displayedColumns: string[] = ['idMedico', 'nombres', 'apellidos', 'cmp', 'acciones']
  dataSource: MatTableDataSource<Medico> = new MatTableDataSource<Medico>();
  @ViewChild(MatSort) sort!: MatSort; 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  cargando: boolean = true;

  constructor( private _medicoService: MedicoService,
                public dialog: MatDialog ) { }

  ngOnInit(): void {
    this._medicoService.listar()
      .pipe(
        tap( medicos => this.crearTabla(medicos) )
      )
      .subscribe(
      (medicos) => {
        this.crearTabla(medicos);
      }
    );

    this._medicoService.getMedicoCambio().subscribe(
      medicos => {
        this.crearTabla(medicos);
      }
    );
    this._medicoService.getMensajeCambio().subscribe( data => {
      this._medicoService.openSnackBar(data);
    });
  }

  crearTabla( medicos: Medico[]) {
    this.dataSource = new MatTableDataSource(medicos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cargando = false;
  }

  filtrar( valor: string ){
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(medico: Medico){
    this.dialog.open(ConfirmarEliminacionDialogoComponent, {
      width: '300px'
    }).beforeClosed()
      .pipe(
        switchMap( (data: boolean) => {
          if(data){
            return this._medicoService.eliminar(medico.idMedico).pipe(map( () => true));
          }else{
            return of(data);
          }
        }),
        switchMap( data => {
          if(data){
            return this._medicoService.listar();
          }else{
            return of(data);
          }
        })
      ).subscribe( data => {
        if(!data){
          return;
        }
        this._medicoService.setMensajeCambio("Se elimino el registro del médico correctamente");
        this._medicoService.setMedicoCambio(data);
      });
  }

  openDialogo( medico?: Medico): void {
    const dialogRef = this.dialog.open(MedicoDialogoComponent, {
      width: '350px',
      data: medico
    });
  }

}
