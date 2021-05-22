import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenericService } from './generic.service';
import { Medico } from '../models/medico';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicoService extends GenericService<Medico> {

  private medicoCambio: Subject<Medico[]> = new Subject<Medico[]>();
  private mensajeCambio: Subject<string> = new Subject<string>();

  constructor(protected _http: HttpClient, protected snackBar: MatSnackBar) { 
    super(
      _http, 
      `${environment.HOST}/medicos`,
      snackBar);
  }

  getMedicoCambio() {
    return this.medicoCambio.asObservable();
  }

  setMedicoCambio(medicos: Medico[]) {
    this.medicoCambio.next(medicos);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
