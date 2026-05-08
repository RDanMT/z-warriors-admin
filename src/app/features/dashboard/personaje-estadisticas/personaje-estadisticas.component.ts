import { Component, inject, signal, computed, OnInit, ViewEncapsulation } from '@angular/core';
import { CharacterService } from '../../../core/services/character.service';
import { Character } from '../../../core/models/character.model';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

interface RaceStat { race: string; count: number; pct: number; color: string; }

@Component({
  selector: 'app-personaje-estadisticas',
  standalone: true,
  imports: [CardModule, TagModule, SkeletonModule, ProgressBarModule, ToastModule],
  providers: [MessageService],
  templateUrl: './personaje-estadisticas.component.html',
  styleUrl: './personaje-estadisticas.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PersonajeEstadisticasComponent implements OnInit {
  private svc = inject(CharacterService);
  private msg = inject(MessageService);

  //Fuentes de la verdad (Estado base)
  loading = signal(true);
  allChars = signal<Character[]>([]);
  totalChars = signal(0);

  //Estado derivado (Computed Signals)
  topChar = computed(() => {
    const chars = this.allChars();
    if (!chars.length) return null;

    return [...chars].sort((a, b) => {
      // Extraemos solo los números para evitar problemas con strings como "10,000" o "1 Billion"
      const ka = parseInt(a.maxKi?.replace(/,/g, '') || '0', 10);
      const kb = parseInt(b.maxKi?.replace(/,/g, '') || '0', 10);
      return kb - ka;
    })[0];
  });

  raceStats = computed<RaceStat[]>(() => {
    const chars = this.allChars();
    const raceMap = new Map<string, number>();

    chars.forEach(c => {
      const r = c.race || 'Desconocida';
      raceMap.set(r, (raceMap.get(r) || 0) + 1);
    });

    const raceArr = Array.from(raceMap.entries()).sort((a, b) => b[1] - a[1]);
    const max = raceArr[0]?.[1] || 1; // Para calcular el porcentaje de la barra

    return raceArr.map(([race, count]) => ({
      race,
      count,
      pct: Math.round((count / max) * 100),
      color: this.RACE_COLORS[race] || '#6b7280'
    }));
  });

  distinctRacesCount = computed(() => this.raceStats().length);
  dominantRace = computed(() => this.raceStats()[0]?.race || '—');

  private RACE_COLORS: Record<string, string> = {
    'Saiyan': '#f59e0b',
    'Human': '#3b82f6',
    'Namekian': '#10b981',
    'Frieza Race': '#a855f7',
    'Android': '#ef4444',
    'Majin': '#ec4899',
    'God': '#fbbf24',
    'Angel': '#e0e7ff'
  };

  ngOnInit() {
    this.svc.getCharacters(1, 50).subscribe({
      next: (res) => {
        this.totalChars.set(res.meta.totalItems);
        this.allChars.set(res.items);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.msg.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Los datos del radar del dragón se han corrompido.'
        });
      }
    });
  }
}