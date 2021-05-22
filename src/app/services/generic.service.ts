import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericService<T> {

  constructor( protected http: HttpClient,
                @Inject(String) protected url: string,
                protected snackBar: MatSnackBar ) { }

  listar(): Observable<T[]>{
    return this.http.get<T[]>(this.url);
  }

  listarPorId(id: number): Observable<T>{
    return this.http.get<T>(`${ this.url }/${id}`);
  }

  registrar(t: T): Observable<T>{
    return this.http.post<T>(this.url, t);
  }

  modificar(t: T): Observable<T>{
    return this.http.put<T>(this.url, t);
  }

  eliminar(id: number): Observable<void>{
    return this.http.delete<void>(`${ this.url }/${id}`);
  }

  openSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, 'Aceptar',{
      duration: 5000
    });
  }
}
