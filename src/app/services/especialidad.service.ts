import { Injectable } from '@angular/core';
import { Especialidad } from '../models/especialidad';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService extends GenericService<Especialidad>{

  private especialidadCambio: Subject<Especialidad[]> = new Subject<Especialidad[]>();
  private mensajeCambio: Subject<string> = new Subject<string>();

  constructor(protected _http: HttpClient, protected snackBar: MatSnackBar) { 
    super(
      _http, 
      `${environment.HOST}/especialidades`,
      snackBar);
  }

  getEspecialidadCambio() {
    return this.especialidadCambio.asObservable();
  }

  setEspecialidadCambio(especialidades: Especialidad[]) {
    this.especialidadCambio.next(especialidades);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
