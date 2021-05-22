import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Medico } from '../../../models/medico';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MedicoService } from '../../../services/medico.service';
import { HttpErrorResponse } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-medico-dialogo',
  templateUrl: './medico-dialogo.component.html',
  styleUrls: ['./medico-dialogo.component.css']
})
export class MedicoDialogoComponent implements OnInit {

  form: FormGroup = this.fb.group({
    idMedico: [''],
    nombres: [''],
    apellidos: [''],
    cmp: [''],
    fotoUrl: [''],
  });

  medico: Medico = new Medico();

  get fotoUrl() {
    return this.form.get('fotoUrl')?.value;
  }

  constructor(public dialogRef: MatDialogRef<MedicoDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Medico,
    private fb: FormBuilder,
    private medicoService: MedicoService) { }

  ngOnInit(): void {
    this.medico = this.data || new Medico();
    if(this.medico){
      this.form = this.fb.group({
        idMedico: [this.medico!.idMedico],
        nombres: [this.medico!.nombres],
        apellidos: [this.medico!.apellidos],
        cmp: [this.medico!.cmp],
        fotoUrl: [this.medico!.fotoUrl],
      });
    }
  }

  operar() {
    this.medico.idMedico = this.form.get('idMedico')?.value;
    this.medico.nombres = this.form.get('nombres')?.value;
    this.medico.apellidos = this.form.get('apellidos')?.value;
    this.medico.cmp = this.form.get('cmp')?.value;
    this.medico.fotoUrl = this.form.get('fotoUrl')?.value;

    if (this.medico.idMedico && this.medico.idMedico > 0) {
      //MODIFICAR
      this.medicoService.modificar(this.medico)
            .pipe(
              switchMap( () => this.medicoService.listar() )
            ).subscribe(
              medicos => {
                this.medicoService.setMedicoCambio(medicos);
                this.medicoService.setMensajeCambio("Se modifico el médico correctamente");
                this.cerrar();
              }
            );
    } else {
      this.medicoService.registrar(this.medico)
            .pipe(
              switchMap( () => this.medicoService.listar() )
            ).subscribe(
              medicos => {
                this.medicoService.setMedicoCambio(medicos);
                this.medicoService.setMensajeCambio("Se modifico el médico correctamente");
                this.cerrar();
              }
            );
    }
  }

  cerrar() {
    this.dialogRef.close();
  }

}
