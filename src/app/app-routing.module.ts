import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PacienteComponent } from './pages/paciente/paciente.component';
import { MedicoComponent } from './pages/medico/medico.component';
import { ExamenComponent } from './pages/examen/examen.component';
import { EspecialidadComponent } from './pages/especialidad/especialidad.component';
import { EspecialidadEdicionComponent } from './pages/especialidad/especialidad-edicion/especialidad-edicion.component';
import { ConsultaComponent } from './pages/consulta/consulta.component';
import { ConsultaEspecialComponent } from './pages/consulta-especial/consulta-especial.component';
import { WizardComponent } from './pages/wizard/wizard.component';
import { BuscarComponent } from './pages/buscar/buscar.component';

const routes: Routes = [
  { path: 'buscar', component: BuscarComponent },
  { path: 'consulta', component: ConsultaComponent },
  { path: 'consulta-especial', component: ConsultaEspecialComponent },
  { path: 'consulta-wizard', component: WizardComponent },
  { 
    path: 'especialidades', 
    component: EspecialidadComponent,
    children: [
      { path: 'nuevo', component: EspecialidadEdicionComponent },
      { path: 'editar/:id', component: EspecialidadEdicionComponent },
    ]
  },
  { path: 'examenes', component: ExamenComponent },
  { path: 'medicos', component: MedicoComponent },
  { path: 'pacientes', component: PacienteComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
