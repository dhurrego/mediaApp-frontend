import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { ConsultaListaExamenDTO } from '../dto/consultaListaExamenDTO';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Consulta } from '../models/consulta';
import { FiltroConsultaDTO } from '../dto/filtroConsultaDTO';
import { ConsultaResumenDTO } from '../dto/consultaResumenDTO';

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

  buscarOtros(filtroConsulta: FiltroConsultaDTO) {
    return this.http.post<Consulta[]>(`${this.url}/buscar/otros`, filtroConsulta);
  }

  buscarFecha(fecha: string) {
    return this.http.get<Consulta[]>(`${this.url}/buscar?fecha=${fecha}`);
  }

  listarExamenPorConsulta(idconsulta: number) {
    return this.http.get<ConsultaListaExamenDTO[]>(`${environment.HOST}/consultaexamenes/${idconsulta}`);
  }

  listarResumen() {
    return this.http.get<ConsultaResumenDTO[]>(`${this.url}/listarResumen`);
  }

  generarReporte() {
    return this.http.get(`${this.url}/generarReporte`, { responseType: 'blob'});
  }

  // guardarArchivo(data: File) {    
  //   const formData: FormData = new FormData();
  //   formData.append('adjunto', data);
  //   return this.http.post(`${this.url}/guardarArchivo`, formData);
  // }

  guardarArchivo(file: File) {

    const params = new HttpParams()
          .set('usuario', 'Deivid');
    const formData: FormData = new FormData();
    formData.append('file', file, 'prueba.png');
    return this.http.post(`${this.url}/upload`, formData, { params });
  }

  leerArchivo() {
    return this.http.get(`${this.url}/leerArchivo/1`, { responseType: 'blob'});
  }

  openSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, 'Aceptar',{
      duration: 5000
    });
  }

}
