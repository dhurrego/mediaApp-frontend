import { Paciente } from './paciente';
import { Medico } from './medico';
import { Especialidad } from './especialidad';
import { DetalleConsulta } from './detalleConsulta';

export class Consulta {
    idConsulta!: number;
    paciente: Paciente = new Paciente();
    medico: Medico = new Medico();
    especialidad: Especialidad = new Especialidad();
    fecha: string = '';
    numConsultorio: string = '';
    detalleConsulta: DetalleConsulta[] = [];
}