import { Component, inject, signal, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { Character } from '../../../core/models/character.model';

const FACCIONES = [
  { label: 'Z Fighter', value: 'Z Fighter' },
  { label: 'Villain', value: 'Villain' },
  { label: 'Army of Frieza', value: 'Army of Frieza' },
  { label: 'Pride Troopers', value: 'Pride Troopers' },
  { label: 'Capsule Corp', value: 'Capsule Corp' },
  { label: 'Other', value: 'Other' }
];

@Component({
  selector: 'app-personaje-detalle',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule, InputNumberModule, SelectModule,
    DatePickerModule, InputTextModule
    // Eliminamos ToastModule de aquí, el padre se encarga
  ],
  templateUrl: './personaje-detalle.component.html',
  styleUrl: './personaje-detalle.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PersonajeDetalleComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private msg = inject(MessageService);

  char!: Character;
  facciones = FACCIONES;

  // Usamos Signal para la reactividad de la UI
  saving = signal(false);

  // Usamos nonNullable para evitar que los valores se vuelvan null accidentalmente
  form = this.fb.nonNullable.group({
    ki: [0, [Validators.required, Validators.min(0)]],
    affiliation: ['', Validators.required],
    registrationDate: [new Date()]
  });

  ngOnInit() {
    this.char = this.config.data.character as Character;
    const kiNum = parseInt(this.char.maxKi?.replace(/,/g, '') || '0', 10);

    this.form.patchValue({
      ki: isNaN(kiNum) ? 0 : kiNum,
      affiliation: this.char.affiliation || 'Other',
      registrationDate: new Date()
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    setTimeout(() => {
      this.msg.add({
        severity: 'success',
        summary: '¡Poder Guardado!',
        detail: `${this.char.name} ha sido actualizado correctamente.`,
        life: 3000
      });

      this.saving.set(false);
      this.ref.close(true);
    }, 1500);
  }

  close() {
    this.ref.close(false);
  }
}