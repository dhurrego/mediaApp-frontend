import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Paciente } from '../../models/paciente';
import { PacienteService } from '../../services/paciente.service';
import { Medico } from '../../models/medico';
import { MedicoService } from '../../services/medico.service';

@Component({
  selector: 'app-consulta-especial',
  templateUrl: './consulta-especial.component.html',
  styleUrls: ['./consulta-especial.component.css']
})
export class ConsultaEspecialComponent implements OnInit {

  pacientes: Paciente[] = [];
  medicos: Medico[] = [];

  myControlPaciente: FormControl = new FormControl();
  myControlMedico: FormControl = new FormControl();
  
  form: FormGroup = new FormGroup({
    'paciente': this.myControlPaciente,
    'especialidad': new FormControl(),
    'medico': this.myControlMedico,
    'fecha': new FormControl(),
    'diagnostico': new FormControl(),
    'tratamiento': new FormControl(),
  });


  pacientesFiltrados$!: Observable<Paciente[]>;
  medicosFiltrados$!: Observable<Medico[]>;

  constructor( private pacienteService: PacienteService,
                private medicoService: MedicoService ) { }

  ngOnInit(): void {

    this.listarPacientes();
    this.listarMedicos();

    this.pacientesFiltrados$ = this.myControlPaciente.valueChanges
      .pipe(
        map(value => this.filtrarPacientes(value))
      );
    
    this.medicosFiltrados$ = this.myControlMedico.valueChanges
      .pipe(
        map(value => this.filtrarMedicos(value))
      );
  }

  listarPacientes() {
    this.medicoService.listar().subscribe( medicos => {
      this.medicos = medicos;
    }); 
  }

  mostrarMedico( medico: Medico ){
    return medico ? `${medico.nombres} ${medico.apellidos}` : medico;
  }

  listarMedicos() {
    this.pacienteService.listar().subscribe( pacientes => {
      this.pacientes = pacientes;
    }); 
  }

  mostrarPaciente( paciente: Paciente ){
    return paciente ? `${paciente.nombres} ${paciente.apellidos}` : paciente;
  }
  
  filtrarPacientes( value: Paciente | string ){
    if( typeof value === 'string' && value !== ''){
      return this.pacientes.filter( element => {
        const nombreCompleto = `${element.nombres} ${element.apellidos}`;
        return nombreCompleto.toLowerCase().includes(value?.toLowerCase()) || element.dni.toLowerCase().includes(value);
      });
    }else if( typeof value === 'object' && value != null && value.idPaciente > 0) {
      return this.pacientes.filter( element => {
        return element.nombres.toLowerCase().includes(value.nombres.toLowerCase()) || element.apellidos.toLowerCase().includes(value.apellidos.toLowerCase()) || element.dni.toLowerCase().includes(value.dni);
      });
    }
    return [];
    
  }

  filtrarMedicos( value: Medico | string ){
    if( typeof value === 'string' && value !== ''){
      return this.medicos.filter( element => {
        const nombreCompleto = `${element.nombres} ${element.apellidos}`;
        return nombreCompleto.toLowerCase().includes(value?.toLowerCase()) || element.cmp.toLowerCase().includes(value);
      });
    }else if( typeof value === 'object' && value != null && value.idMedico > 0) {
      return this.medicos.filter( element => {
        return element.nombres.toLowerCase().includes(value.nombres.toLowerCase()) || element.apellidos.toLowerCase().includes(value.apellidos.toLowerCase()) || element.cmp.toLowerCase().includes(value.cmp);
      });
    }
    return [];
    
  }

  aceptar() {
    console.log(this.form.value);
  }

}
