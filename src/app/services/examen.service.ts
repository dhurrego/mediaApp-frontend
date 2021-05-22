import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Examen } from '../models/examen';
import { GenericService } from './generic.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamenService extends GenericService<Examen>{

  private examenCambio: Subject<Examen[]> = new Subject<Examen[]>();
  private mensajeCambio: Subject<string> = new Subject<string>();

  constructor(protected _http: HttpClient, protected snackBar: MatSnackBar) { 
    super(
      _http, 
      `${environment.HOST}/examenes`,
      snackBar);
  }

  getExamenCambio() {
    return this.examenCambio.asObservable();
  }

  setExamenCambio(examenes: Examen[]) {
    this.examenCambio.next(examenes);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
