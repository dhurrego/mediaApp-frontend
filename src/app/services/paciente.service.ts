import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { Paciente } from '../models/paciente';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenericService } from './generic.service';
import { PacientePage } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PacienteService extends GenericService<Paciente> {

  private pacienteCambio: Subject<Paciente[]> = new Subject<Paciente[]>();
  private mensajeCambio: Subject<string> = new Subject<string>();


  constructor(protected _http: HttpClient, protected snackBar: MatSnackBar) { 
      super(
        _http, 
        `${environment.HOST}/pacientes`,
        snackBar);
  }

  listarPageable(page: number, size: number) {
    return this.http.get<PacientePage>(`${this.url}/pageable?page=${page}&size=${size}`);
  }

  getPacienteCambio() {
    return this.pacienteCambio.asObservable();
  }

  setPacienteCambio(pacientes: Paciente[]) {
    this.pacienteCambio.next(pacientes);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }

}
