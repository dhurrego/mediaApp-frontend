import { Consulta } from '../models/consulta';
import { Examen } from '../models/examen';

export class ConsultaListaExamenDTO {
    consulta: Consulta = new Consulta();
    listaExamenes: Examen[] = [];
}