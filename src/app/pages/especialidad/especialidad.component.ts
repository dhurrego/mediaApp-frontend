import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Especialidad } from '../../models/especialidad';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { EspecialidadService } from '../../services/especialidad.service';
import { MatDialog } from '@angular/material/dialog';
import { EspecialidadEdicionComponent } from './especialidad-edicion/especialidad-edicion.component';
import { ConfirmarEliminacionDialogoComponent } from '../../shared/confirmar-eliminacion-dialogo/confirmar-eliminacion-dialogo.component';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-especialidad',
  templateUrl: './especialidad.component.html',
  styleUrls: ['./especialidad.component.css']
})
export class EspecialidadComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['idEspecialidad', 'nombre', 'descripcion', 'acciones']
  dataSource: MatTableDataSource<Especialidad> = new MatTableDataSource<Especialidad>();
  cargando: boolean = true;
  
  @ViewChild(MatSort) sort!: MatSort; 
  @ViewChild(MatPaginator) paginator!: MatPaginator; 

  constructor(private _especialidadService: EspecialidadService,
              public route: ActivatedRoute,
              public dialog: MatDialog) { }
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 1000);
  }

  ngOnInit(): void {
    this._especialidadService.listar().subscribe(
      pacientes => {
        this.crearTabla(pacientes);
      }
    );
    this._especialidadService.getEspecialidadCambio().subscribe(
      pacientes => {
        this.crearTabla(pacientes);
      }
    );
    this._especialidadService.getMensajeCambio().subscribe( data => {
      this._especialidadService.openSnackBar(data);
    });
  }

  eliminar(id: number){
    this.dialog.open(ConfirmarEliminacionDialogoComponent, {
      width: '300px'
    }).beforeClosed()
      .pipe(
        switchMap( (data: boolean) => {
          if(data){
            return this._especialidadService.eliminar(id).pipe(map( () => true));
          }else{
            return of(data);
          }
        }),
        switchMap( data => {
          if(data){
            return this._especialidadService.listar();
          }else{
            return of(data);
          }
        })
      ).subscribe( data => {
        if(!data){
          return;
        }
        this._especialidadService.setMensajeCambio("Se elimino el registro de la especialidad correctamente");
        this._especialidadService.setEspecialidadCambio(data);
      });   
  }

  crearTabla( especialidades: Especialidad[]) {
    this.dataSource = new MatTableDataSource(especialidades);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.cargando = false;
  }

  filtrar( valor: string ){
    this.dataSource.filter = valor.trim().toLowerCase();
  }

}
