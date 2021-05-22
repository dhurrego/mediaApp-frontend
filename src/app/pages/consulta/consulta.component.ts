import { Component, OnInit } from '@angular/core';
import { Paciente } from 'src/app/models/paciente';
import { PacienteService } from '../../services/paciente.service';
import { Observable, of } from 'rxjs';
import { Medico } from '../../models/medico';
import { MedicoService } from '../../services/medico.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { Especialidad } from '../../models/especialidad';
import { Examen } from '../../models/examen';
import { ExamenService } from '../../services/examen.service';
import { DetalleConsulta } from '../../models/detalleConsulta';
import { Consulta } from '../../models/consulta';
import * as moment from 'moment';
import { ConsultaListaExamenDTO } from '../../dto/consultaListaExamenDTO';
import { ConsultaService } from '../../services/consulta.service';


@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {

  pacientes: Paciente[] = [];
  pacientes$: Observable<Paciente[]> = of([]);
  medicos$: Observable<Medico[]> = of([]);
  especialidades$: Observable<Especialidad[]> = of([]);
  examenes$: Observable<Examen[]> = of([]);

  idPacienteSeleccionado: number = 0;
  idMedicoSeleccionado: number = 0;
  idEspecialidadSeleccionado: number = 0;
  idExamenSeleccionado: number = 0;
  diagnostico: string = '';
  tratamiento: string = '';

  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date();

  detalleConsulta: DetalleConsulta[] = [];
  examenesSelecionados: Examen[] = [];

  constructor( private pacienteService: PacienteService,
                private medicoService: MedicoService,
                private especialidadService: EspecialidadService,
                private examenService: ExamenService,
                private consultaService: ConsultaService ) { }

  ngOnInit(): void {
    this.listarPacientes();
    this.listarMedicos();
    this.listarEspecialidades();
    this.listarExamenes();
  }

  aceptar() {
    if(!this.estadoBotonRegistrar()){

      let medico = new Medico();
      medico.idMedico = this.idMedicoSeleccionado;

      let paciente = new Paciente();
      paciente.idPaciente = this.idPacienteSeleccionado;
      
      let especialidad = new Especialidad();
      especialidad.idEspecialidad = this.idEspecialidadSeleccionado;

      let consulta = new Consulta();
      consulta.medico = medico;
      consulta.paciente = paciente;
      consulta.especialidad = especialidad;
      consulta.detalleConsulta = this.detalleConsulta;
      consulta.numConsultorio = "C1";
      consulta.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
      // let tzoffset = (new Date()).getTimezoneOffset() * 60000;
      // let localISOTime = (new Date(this.fechaSeleccionada.getTime() - tzoffset)).toISOString();
      let dto: ConsultaListaExamenDTO = new ConsultaListaExamenDTO();
      dto.consulta = consulta;
      dto.listaExamenes = this.examenesSelecionados;

      this.consultaService.registrarTransaccion(dto).subscribe( () => {
        this.consultaService.openSnackBar('Se registro la consulta correctamente');
        setTimeout(() => {
          this.limpiarControler();
        }, 2000);
      });
    }
  }

  estadoBotonRegistrar(){
    return (this.detalleConsulta.length === 0 || this.idEspecialidadSeleccionado === 0 || this.idMedicoSeleccionado === 0 || this.idPacienteSeleccionado === 0 )
  }

  agregarExamen() {
    if(this.idExamenSeleccionado > 0 ){

      let encontrado = this.examenesSelecionados.some( examen => examen.idExamen === this.idExamenSeleccionado );

      if(encontrado){
        this.examenService.openSnackBar('El examen ya se encuentra en la lista');
      }else{
        this.examenService.listarPorId(this.idExamenSeleccionado).subscribe( examen => {
          this.examenesSelecionados.push(examen);
          this.idExamenSeleccionado = 0;
        });
      }
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
    }
  }
  
  removerDiagnostico( index: number ){
    this.detalleConsulta.splice(index, 1);
  }

  removerExamen( index: number ){
    this.examenesSelecionados.splice(index, 1);
  }

  listarPacientes() {
    // this.pacienteService.listar().subscribe( pacientes => this.pacientes = pacientes );
    this.pacientes$ = this.pacienteService.listar();
  }
  
  listarMedicos() {
    this.medicos$ = this.medicoService.listar();
  }

  listarEspecialidades() {
    this.especialidades$ = this.especialidadService.listar();
  }

  listarExamenes() {
    this.examenes$ = this.examenService.listar();
  }

  limpiarControler() {
    this.detalleConsulta = [];
    this.examenesSelecionados = [];
    this.diagnostico = '';
    this.tratamiento = '';
    this.idPacienteSeleccionado = 0;
    this.idEspecialidadSeleccionado = 0;
    this.idMedicoSeleccionado = 0;
    this.idExamenSeleccionado = 0;
    this.fechaSeleccionada = new Date();
  }

  
}
