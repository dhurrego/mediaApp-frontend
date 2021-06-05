import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Paciente } from '../../models/paciente';
import { PacienteService } from '../../services/paciente.service';
import { Medico } from '../../models/medico';
import { MedicoService } from '../../services/medico.service';
import { Examen } from '../../models/examen';
import { Especialidad } from '../../models/especialidad';
import { DetalleConsulta } from '../../models/detalleConsulta';
import { ExamenService } from '../../services/examen.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { ConsultaService } from '../../services/consulta.service';
import { MatSelectChange } from '@angular/material/select';
import { Consulta } from '../../models/consulta';
import * as moment from 'moment';
import { ConsultaListaExamenDTO } from '../../dto/consultaListaExamenDTO';

@Component({
  selector: 'app-consulta-especial',
  templateUrl: './consulta-especial.component.html',
  styleUrls: ['./consulta-especial.component.css']
})
export class ConsultaEspecialComponent implements OnInit {

  pacientes: Paciente[] = [];
  medicos: Medico[] = [];
  especialidades: Especialidad[] = [];
  examenes: Examen[] = [];

  detalleConsulta: DetalleConsulta[] = [];
  examenesSeleccionados: Examen[] = [];

  diagnostico: string = '';
  tratamiento: string = '';
  mensaje: string = '';

  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  pacienteSeleccionado!: Paciente;
  medicoSeleccionado!: Medico;
  especialidadSeleccionada!: Especialidad;
  examenSeleccionado!: Examen;

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

  constructor( 
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private examenService: ExamenService,
    private especialidadService: EspecialidadService,
    private consultaService: ConsultaService ) { }

  ngOnInit(): void {

    this.listarPacientes();
    this.listarMedicos();
    this.listarEspecialidad();
    this.listarExamenes();

    this.pacientesFiltrados$ = this.myControlPaciente.valueChanges
      .pipe(
        map(value => this.filtrarPacientes(value))
      );
    
    this.medicosFiltrados$ = this.myControlMedico.valueChanges
      .pipe(
        map(value => this.filtrarMedicos(value))
      );
  }

  listarMedicos() {
    this.medicoService.listar().subscribe( medicos => {
      this.medicos = medicos;
    }); 
  }

  mostrarMedico( medico: Medico ){
    return medico ? `${medico.nombres} ${medico.apellidos}` : medico;
  }

  listarPacientes() {
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

  seleccionarEsp( e: MatSelectChange ) {
    console.log(e.value);
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

  estadoBotonRegistrar(){
    return (this.detalleConsulta.length === 0 || this.especialidadSeleccionada === null || this.medicoSeleccionado === null || this.pacienteSeleccionado === null )
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

  aceptar() {
    if(!this.estadoBotonRegistrar()){

      let consulta = new Consulta();
      consulta.medico = this.form.value['medico'];
      consulta.paciente = this.form.value['paciente'];
      consulta.especialidad = this.form.value['especialidad'];
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
    this.especialidadSeleccionada = null!;
    this.medicoSeleccionado = null!;
    this.examenesSeleccionados = null!;
    this.fechaSeleccionada = new Date();

    this.myControlMedico.reset();
    this.myControlPaciente.reset();
  }

}
