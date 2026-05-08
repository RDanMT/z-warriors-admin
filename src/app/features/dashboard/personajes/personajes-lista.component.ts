import { Component, inject, signal, OnInit, DestroyRef, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, switchMap, catchError, EMPTY } from 'rxjs';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { CharacterService } from '../../../core/services/character.service';
import { Character } from '../../../core/models/character.model';
import { PersonajeDetalleComponent } from '../personaje-detalle/personaje-detalle.component';

type Severity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
  selector: 'app-personaje-lista',
  standalone: true,
  imports: [
    TableModule, TagModule, ButtonModule, ImageModule,
    ProgressBarModule, SkeletonModule, ToastModule
  ],
  providers: [DialogService, MessageService],
  templateUrl: './personaje-lista.component.html',
  styleUrl: './personaje-lista.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PersonajeListaComponent implements OnInit {
  private svc = inject(CharacterService);
  private dialogSvc = inject(DialogService);
  private msg = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  characters = signal<Character[]>([]);
  totalRecords = signal(0);
  loading = signal(true);
  skeletonRows = Array(10).fill(null);

  private loadSubject = new Subject<TableLazyLoadEvent>();

  ngOnInit() {
    this.loadSubject.pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(event => {
        this.loading.set(true);
        const rows = event.rows ?? 10;
        const page = Math.floor((event.first ?? 0) / rows) + 1;

        return this.svc.getCharacters(page, rows).pipe(
          catchError(() => {
            this.loading.set(false);
            this.msg.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Fallo al cargar la base de datos del rastreador.'
            });
            return EMPTY;
          })
        );
      })
    ).subscribe(res => {
      this.characters.set(res.items);
      this.totalRecords.set(res.meta.totalItems);
      this.loading.set(false);
    });
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    this.loadSubject.next(event);
  }

  openDetalle(char: Character) {
    this.dialogSvc.open(PersonajeDetalleComponent, {
      header: `⚡ ${char.name}`,
      width: '480px',
      modal: true,
      closable: true,
      data: { character: char },
      styleClass: 'zw-dialog'
    });
  }

  getRaceSeverity(race: string): Severity {
    const map: Record<string, Severity> = {
      'Saiyan': 'warn',
      'Human': 'info',
      'Namekian': 'success',
      'Frieza Race': 'danger'
    };
    return map[race] ?? 'secondary';
  }

  getGenderIcon(gender: string): string {
    if (!gender) return 'pi pi-question-circle';
    return gender.toLowerCase() === 'male' ? 'pi pi-mars' : 'pi pi-venus';
  }
}