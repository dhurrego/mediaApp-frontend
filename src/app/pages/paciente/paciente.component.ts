import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Paciente } from 'src/app/models/paciente';
import { PacienteService } from '../../services/paciente.service';
import { PacienteEdicionComponent } from './paciente-edicion/paciente-edicion.component';
import { ConfirmarEliminacionDialogoComponent } from '../../shared/confirmar-eliminacion-dialogo/confirmar-eliminacion-dialogo.component';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['idPaciente', 'nombres', 'apellidos', 'acciones']
  dataSource: MatTableDataSource<Paciente> = new MatTableDataSource<Paciente>();
  cargando: boolean = true;
  
  @ViewChild(MatSort) sort!: MatSort; 
  @ViewChild(MatPaginator) paginator!: MatPaginator; 

  constructor(private _pacienteService: PacienteService,
              public dialog: MatDialog) { }
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 1000);
  }

  ngOnInit(): void {
    this._pacienteService.listar().subscribe(
      pacientes => {
        this.crearTabla(pacientes);
      }
    );
    this._pacienteService.getPacienteCambio().subscribe(
      pacientes => {
        this.crearTabla(pacientes);
      }
    );
    this._pacienteService.getMensajeCambio().subscribe( data => {
      this._pacienteService.openSnackBar(data);
    });
  }

  eliminar(id: number){
    this.dialog.open(ConfirmarEliminacionDialogoComponent, {
      width: '300px'
    }).beforeClosed()
      .pipe(
        switchMap( (data: boolean) => {
          if(data){
            return this._pacienteService.eliminar(id).pipe(map( () => true));
          }else{
            return of(data);
          }
        }),
        switchMap( data => {
          if(data){
            return this._pacienteService.listar();
          }else{
            return of(data);
          }
        })
      ).subscribe( data => {
        if(!data){
          return;
        }
        this._pacienteService.setMensajeCambio("Se elimino el registro del paciente correctamente");
        this._pacienteService.setPacienteCambio(data);
      });   
  }

  crearTabla( pacientes: Paciente[]) {
    this.dataSource = new MatTableDataSource(pacientes);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.cargando = false;
  }

  filtrar( valor: string ){
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  openDialogo( paciente?: Paciente) {
    const dialogRef = this.dialog.open(PacienteEdicionComponent, {
      width: '350px',
      data: paciente
    });
  }

}
