import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar-eliminacion-dialogo',
  templateUrl: './confirmar-eliminacion-dialogo.component.html',
  styleUrls: ['./confirmar-eliminacion-dialogo.component.css']
})
export class ConfirmarEliminacionDialogoComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmarEliminacionDialogoComponent>) {}

  aceptar() {
    this.dialogRef.close(true);
  }

  cancelar() {
    this.dialogRef.close(false);
  }

}
