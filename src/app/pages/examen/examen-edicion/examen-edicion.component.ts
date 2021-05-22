import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { Examen } from '../../../models/examen';
import { ExamenService } from '../../../services/examen.service';

@Component({
  selector: 'app-examen-edicion',
  templateUrl: './examen-edicion.component.html',
  styleUrls: ['./examen-edicion.component.css']
})
export class ExamenEdicionComponent implements OnInit {

  form: FormGroup = this.fb.group({
    idExamen: [0],
    nombre: [''],
    descripcion: ['']
  });

  examen: Examen = new Examen();

  constructor(public dialogRef: MatDialogRef<ExamenEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Examen,
    private fb: FormBuilder,
    private examenService: ExamenService) { }

  ngOnInit(): void {
    this.examen = this.data || new Examen();
    if(this.examen){
      this.form = this.fb.group({
        idExamen: [this.examen!.idExamen],
        nombre: [this.examen!.nombre],
        descripcion: [this.examen!.descripcion]
      });
    }
  }

  operar() {
    this.examen.idExamen = this.form.get('idExamen')?.value;
    this.examen.nombre = this.form.get('nombre')?.value;
    this.examen.descripcion = this.form.get('descripcion')?.value;

    if (this.examen.idExamen && this.examen.idExamen > 0) {
      //MODIFICAR
      this.examenService.modificar(this.examen)
            .pipe(
              switchMap( () => this.examenService.listar() )
            ).subscribe(
              examenes => {
                this.examenService.setExamenCambio(examenes);
                this.examenService.setMensajeCambio("Se modifico el examen correctamente");
                this.cerrar();
              }
            );
    } else {
      this.examenService.registrar(this.examen)
            .pipe(
              switchMap( () => this.examenService.listar() )
            ).subscribe(
              examenes => {
                this.examenService.setExamenCambio(examenes);
                this.examenService.setMensajeCambio("Se registro el examen correctamente");
                this.cerrar();
              }
            );
    }
  }

  cerrar() {
    this.dialogRef.close();
  }

}
