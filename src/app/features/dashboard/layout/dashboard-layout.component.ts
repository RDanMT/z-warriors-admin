import { Component, inject, signal, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToolbarModule, ButtonModule, ToastModule],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
  encapsulation: ViewEncapsulation.None // Mantenemos nuestra estrategia limpia
})
export class DashboardLayoutComponent implements OnInit {
  private auth = inject(AuthService);
  isDark = signal(false);

  ngOnInit() {
    // Sincroniza el signal con el DOM al cargar por si ya tenía la clase puesta
    this.isDark.set(document.documentElement.classList.contains('app-dark'));
  }

  toggleDark() {
    this.isDark.update(v => !v);
    // Esta es la manera oficial de PrimeNG v21 para alternar el tema
    document.documentElement.classList.toggle('app-dark');
  }

  logout() {
    this.auth.logout();
  }
}