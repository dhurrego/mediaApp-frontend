import { Component, OnInit } from '@angular/core';
import { ConsultaService } from '../../services/consulta.service';

import { Chart } from 'chart.js';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  tipo: string = 'line';
  chart: any;

  constructor(
    private consultaService: ConsultaService
  ) { }

  ngOnInit(): void {
    this.dibujar();
  }

  cambiar(tipo: string) {
    this.tipo = tipo;
    if(this.chart != null){
      this.chart.destroy();
    }
    this.dibujar();
  }

  dibujar() {
    this.consultaService.listarResumen().subscribe( consultaResumen => {
      const cantidades: number[] = consultaResumen.map(x => x.cantidad);
      const fechas: string[] = consultaResumen.map(x => x.fecha);

      this.chart = new Chart('canvas', {
        type: this.tipo,
        data: {
            labels: fechas,
            datasets: [{
                label: 'Cantidad',
                data: cantidades,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: "#3cba9f",
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            legend: {
              display: true
            },
            scales: {
              xAxes: [{
                display: true
              }],
              yAxes: [{
                display: true,
                ticks: {
                  beginAtZero: true
                }
              }]
            }
        }
      });
    });
  }

}
