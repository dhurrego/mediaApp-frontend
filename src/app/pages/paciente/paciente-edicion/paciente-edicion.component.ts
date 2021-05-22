import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../../../services/paciente.service';
import { Paciente } from '../../../models/paciente';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-paciente-edicion',
  templateUrl: './paciente-edicion.component.html',
  styleUrls: ['./paciente-edicion.component.css']
})
export class PacienteEdicionComponent implements OnInit {

  form: FormGroup = new FormGroup({
    'id': new FormControl(0),
    'nombres': new FormControl(''),
    'apellidos': new FormControl(''),
    'dni': new FormControl(''),
    'telefono': new FormControl(''),
    'direccion': new FormControl(''),
    'email': new FormControl('')
  });
  id: number = 0;
  edicion: boolean = false;
  paciente: Paciente = new Paciente();

  constructor(public dialogRef: MatDialogRef<PacienteEdicionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Paciente,
              private pacienteService: PacienteService) { }

  ngOnInit(): void {
    this.paciente = this.data;
    if(this.paciente){
      this.pacienteService.listarPorId(this.paciente.idPaciente).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idPaciente),
          'nombres': new FormControl(data.nombres),
          'apellidos': new FormControl(data.apellidos),
          'dni': new FormControl(data.dni),
          'telefono': new FormControl(data.telefono),
          'direccion': new FormControl(data.direccion),
          'email': new FormControl(data.email)
        });
      });
    }else{
      this.edicion = true;
    }
  }

  operar(): void {
    let paciente = new Paciente();
    paciente.idPaciente = this.form.value['id'];
    paciente.nombres = this.form.value['nombres'];
    paciente.apellidos = this.form.value['apellidos'];
    paciente.dni = this.form.value['dni'];
    paciente.telefono = this.form.value['telefono'];
    paciente.direccion = this.form.value['direccion'];
    paciente.email = this.form.value['email'];

    if (this.edicion) {
      //MODIFICAR
      this.pacienteService.modificar(paciente).subscribe( () => {
        this.pacienteService.listar().subscribe( pacientes => {
          this.pacienteService.setPacienteCambio(pacientes);
          this.pacienteService.setMensajeCambio("Se modifico el paciente correctamente");
        });
        this.cerrar();
      },
      (error: HttpErrorResponse) => {
        this.pacienteService.openSnackBar(error.error.mensaje);
      }
      );
    } else {
      this.pacienteService.registrar(paciente).subscribe( () => {
        this.pacienteService.listar().subscribe( pacientes => {
          this.pacienteService.setPacienteCambio(pacientes);
          this.pacienteService.setMensajeCambio("Se registro paciente correctamente");
        });
        this.cerrar();
      });
    }
  }

  cerrar() {
    this.dialogRef.close();
  }

}
