import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { ConsultaListaExamenDTO } from '../dto/consultaListaExamenDTO';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  private url: string = `${environment.HOST}/consultas`;

  constructor( private http: HttpClient,
                private snackBar: MatSnackBar ) { }

  registrarTransaccion(consultaDTO: ConsultaListaExamenDTO) {
    return this.http.post(this.url, consultaDTO);
  }

  openSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, 'Aceptar',{
      duration: 5000
    });
  }

}
