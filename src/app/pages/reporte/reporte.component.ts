import { Component, OnInit } from '@angular/core';
import { ConsultaService } from '../../services/consulta.service';

import { Chart } from 'chart.js';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  tipo: string = 'line';
  chart: any;
  pdfSrc: string = '';
  nombreArchivo: string = '';
  archivosSeleccionados!: FileList;
  imagenData: any = '';
  imagenEstado: boolean = false;

  constructor(
    private consultaService: ConsultaService,
    private sanitization: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.consultaService.leerArchivo().subscribe( data => {
      this.convertir(data);
    });
    this.dibujar();
  }

  cambiar(tipo: string) {
    this.tipo = tipo;
    if(this.chart != null){
      this.chart.destroy();
    }
    this.dibujar();
  }

  generarReporte() {
    this.consultaService.generarReporte().subscribe( data => {
      //this.pdfSrc = URL.createObjectURL(data);
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
      }
      reader.readAsArrayBuffer(data);
    });
  }

  
  descargarReporte() {
    this.consultaService.generarReporte().subscribe( data => {
      const element = document.createElement('a');
      const fecha = moment(new Date).format('DDMMYYYYHHmmss');
      element.setAttribute('href', URL.createObjectURL(data));
      element.setAttribute('download', `reporteConsultas${fecha}.pdf`);
      document.body.appendChild(element);
      element.click();
    });
  }
  
  subirArchivo() {
    if(this.archivosSeleccionados.item(0) === null) {
      return;
    }
    this.consultaService.guardarArchivo(this.archivosSeleccionados.item(0)!).subscribe();
  }

  seleccionarArchivo(e: any){
    this.nombreArchivo = e.target.files[0].name;
    this.archivosSeleccionados = e.target.files;
  }

  convertir(data: any) {
    const reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      const base64 = reader.result;
      this.sanar(base64);  
      this.imagenEstado = true;
    }
  }

  sanar(base64: any) {
    this.imagenData = this.sanitization.bypassSecurityTrustResourceUrl(base64);
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
            responsive: true,
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
