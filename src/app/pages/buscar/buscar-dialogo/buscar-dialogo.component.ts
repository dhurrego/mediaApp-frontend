import { Component, Inject, OnInit } from '@angular/core';
import { Consulta } from '../../../models/consulta';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConsultaService } from '../../../services/consulta.service';
import { Examen } from '../../../models/examen';

interface ConsultaExamenesDTO {
  consulta: Consulta,
  examen: Examen
}

@Component({
  selector: 'app-buscar-dialogo',
  templateUrl: './buscar-dialogo.component.html',
  styleUrls: ['./buscar-dialogo.component.css']
})
export class BuscarDialogoComponent implements OnInit {

  consulta!: Consulta;
  listaExamenes!: ConsultaExamenesDTO[];

  constructor(
    private dialogRef: MatDialogRef<BuscarDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Consulta,
    private consultaService: ConsultaService
  ) { }

  ngOnInit(): void {
    this.consulta = this.data;
    this.listarExamenes();
  }

  listarExamenes() {
    this.consultaService.listarExamenPorConsulta(this.consulta.idConsulta).subscribe(
      (data: any) => {
        this.listaExamenes = data;
      }
    );
  }

  cerrar() {
    this.dialogRef.close();
  }

}
