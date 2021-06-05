import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Paciente } from '../../models/paciente';
import { Especialidad } from '../../models/especialidad';
import { Medico } from '../../models/medico';
import { Examen } from '../../models/examen';
import { DetalleConsulta } from '../../models/detalleConsulta';
import { PacienteService } from '../../services/paciente.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { MedicoService } from '../../services/medico.service';
import { ConsultaService } from '../../services/consulta.service';
import { ExamenService } from '../../services/examen.service';
import { MatSelectChange } from '@angular/material/select';
import { MatStepper } from '@angular/material/stepper';
import { ConsultaListaExamenDTO } from '../../dto/consultaListaExamenDTO';
import { Consulta } from '../../models/consulta';

import * as moment from 'moment';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit {
  
  @ViewChild('stepper') stepper!: MatStepper;

  isLinear: boolean = false;

  medicoSeleccionado!: Medico;
  especialidadSeleccionado!: Especialidad;
  pacienteSeleccionado!: Paciente;
  examenSeleccionado!: Examen;
  
  primerFormGroup!: FormGroup;

  segundoFormGroup!: FormGroup;

  pacientes!: Paciente[];
  especialidades!: Especialidad[];
  medicos!: Medico[];
  examenes!: Examen[];


  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  diagnostico: string = '';
  tratamiento: string = '';

  detalleConsulta: DetalleConsulta[] = [];
  examenesSeleccionados: Examen[] = [];

  consultorios: number[] = [];
  consultorioSeleccionado: number = 0;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private especialidadService: EspecialidadService,
    private medicoService: MedicoService,
    private examenService: ExamenService,
    private consultaService: ConsultaService) { }

  ngOnInit(): void {

    this.primerFormGroup = this.fb.group({
      cboPaciente: ['', Validators.required],
      fecha: [new Date(), [Validators.required]],
      diagnostico: [''],
      tratamiento: [''],
      medico: ['', Validators.required]
    });

    this.segundoFormGroup = this.fb.group({
    });

    this.listarPacientes();
    this.listarMedicos();
    this.listarEspecialidad();
    this.listarExamenes();
    this.listarConsultorios();
  }

  seleccionarPaciente(e: MatSelectChange){
    this.pacienteSeleccionado = e.value;
  }
  
  seleccionarEspecialidad(e: MatSelectChange){
    this.especialidadSeleccionado = e.value;
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe( pacientes => this.pacientes = pacientes );
  }

  listarMedicos() {
    this.medicoService.listar().subscribe( medicos => this.medicos = medicos );
  }

  listarEspecialidad() {
    this.especialidadService.listar().subscribe(data => {
      this.especialidades = data;
    });
  }

  listarExamenes() {
    this.examenService.listar().subscribe(data => {
      this.examenes = data;
    });
  }

  listarConsultorios() {
    for (let i = 1; i <= 20; i++) {
      this.consultorios.push(i);  
    }
  }

  agregar() {
    if(this.diagnostico != '' && this.tratamiento != '') {
      let det = new DetalleConsulta();
      det.diagnostico = this.diagnostico;
      det.tratamiento = this.tratamiento;
      this.detalleConsulta.push(det);
      this.diagnostico = '';
      this.tratamiento = '';
    }else{
      this.examenService.openSnackBar("Debe agregar un diagnóstico y un tratamiento");
    }
  }

  removerDiagnostico( index: number ){
    this.detalleConsulta.splice(index, 1);
  }

  removerExamen( index: number ){
    this.examenesSeleccionados.splice(index, 1);
  }

  agregarExamen() {
    if(this.examenSeleccionado){
      let encontrado = this.examenesSeleccionados.some( examen => examen.idExamen === this.examenSeleccionado.idExamen );

      if(encontrado){
        this.examenService.openSnackBar('El examen ya se encuentra en la lista');
      }else{
        this.examenesSeleccionados.push(this.examenSeleccionado);
        this.examenSeleccionado = null!;
      }
    }
  }

  seleccionarMedico(medico: Medico){
    this.medicoSeleccionado = medico;
    this.primerFormGroup.value['medico'] = medico;
  }

  seleccionarConsultorio(consultario: number){
    this.consultorioSeleccionado = consultario;
  }

  nextManualStepper() {
    if(this.consultorioSeleccionado > 0) {
      this.isLinear = false;
      this.stepper.next();
    }else{
      this.examenService.openSnackBar("Debe seleccionar un consultorio");
    }
  }

  estadoBotonRegistrar(){
    return (this.detalleConsulta.length === 0 || this.especialidadSeleccionado === null || this.medicoSeleccionado === null || this.pacienteSeleccionado === null )
  }

  aceptar() {
    if(!this.estadoBotonRegistrar()){

      let consulta = new Consulta();
      consulta.medico = this.primerFormGroup.value['medico'];
      consulta.paciente = this.primerFormGroup.value['cboPaciente'];
      consulta.especialidad = this.especialidadSeleccionado;
      consulta.detalleConsulta = this.detalleConsulta;
      consulta.numConsultorio = "C1";
      consulta.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
      // let tzoffset = (new Date()).getTimezoneOffset() * 60000;
      // let localISOTime = (new Date(this.fechaSeleccionada.getTime() - tzoffset)).toISOString();
      let dto: ConsultaListaExamenDTO = new ConsultaListaExamenDTO();
      dto.consulta = consulta;
      dto.listaExamenes = this.examenesSeleccionados;

      this.consultaService.registrarTransaccion(dto).subscribe( () => {
        this.consultaService.openSnackBar('Se registro la consulta correctamente');
        setTimeout(() => {
          this.limpiarControler();
        }, 2000);
      });
    }
  }

  limpiarControler() {
    this.detalleConsulta = [];
    this.examenesSeleccionados = [];
    this.diagnostico = '';
    this.tratamiento = '';
    this.pacienteSeleccionado = null!;
    this.especialidadSeleccionado = null!;
    this.medicoSeleccionado = null!;
    this.examenSeleccionado = null!;
    this.detalleConsulta = [];
    this.examenesSeleccionados = [];
    this.fechaSeleccionada = new Date();
    this.consultorioSeleccionado = 0;
    this.stepper.reset();
    this.primerFormGroup.reset();
    this.segundoFormGroup.reset();
  }

}
