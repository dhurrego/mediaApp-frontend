import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { EspecialidadService } from '../../../services/especialidad.service';
import { of } from 'rxjs';
import { Especialidad } from 'src/app/models/especialidad';

@Component({
  selector: 'app-especialidad-edicion',
  templateUrl: './especialidad-edicion.component.html',
  styleUrls: ['./especialidad-edicion.component.css']
})
export class EspecialidadEdicionComponent implements OnInit {

  form: FormGroup = this.fb.group({
    idEspecialidad: [0],
    nombre: [''],
    descripcion: ['']
  });
  especialidad: Especialidad = new Especialidad();
  edicion: boolean = false;

  constructor(private fb: FormBuilder,
              private especialidadService: EspecialidadService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.route.params
          .pipe(
            switchMap( ({id}) => {
              if(!id){
                return of(null);
              }
              return this.especialidadService.listarPorId(id);
            })
          ).subscribe(
            data => {
              if(!data){
                this.edicion = false;
                return;
              }
              this.especialidad = data;
              this.form = this.fb.group(this.especialidad);
              this.edicion = true;
            }
          );
  }

  operar() {
    this.especialidad.idEspecialidad = this.form.get('idEspecialidad')?.value;
    this.especialidad.nombre = this.form.get('nombre')?.value;
    this.especialidad.descripcion = this.form.get('descripcion')?.value;
    if(this.edicion){
      this.especialidadService.modificar(this.especialidad)
            .pipe(
              switchMap( () => this.especialidadService.listar() )
            )
            .subscribe(
              especialidades => {
                this.router.navigate(['/especialidades']);
                this.especialidadService.setMensajeCambio("Se actualizo el registro de la especialidad correctamente");
                this.especialidadService.setEspecialidadCambio(especialidades);
              }
            );
    }else{
      this.especialidadService.registrar(this.especialidad)
            .pipe(
              switchMap( () => this.especialidadService.listar() )
            )
            .subscribe(
              especialidades => {
                this.router.navigate(['/especialidades']);
                this.especialidadService.setMensajeCambio("Se inserto el registro de la especialidad correctamente");
                this.especialidadService.setEspecialidadCambio(especialidades);
              }
            );
    }

  }

}
