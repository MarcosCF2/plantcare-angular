import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PlantasService } from '../../core/services/planta.service';
import { Planta } from '../../core/models/planta.model';
@Component({
  selector: 'app-admin',
  imports: [RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  private plantaService = inject(PlantasService);
  private router = inject(Router);

  plantas = signal<Planta[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  sucessMessage = signal('');

  loadPlantas(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.plantaService.getAll().subscribe({
      next: (response) => {
        this.plantas.set(response);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Erro ao carregar plantas');
        this.loading.set(false);
      },
    });
  }

  ngOnInit(): void {
    this.loadPlantas();
  }

  edit(id: string): void {
    this.router.navigate(['/admin/form'], {
      queryParams: { id },
    });
  }

  restaurar(): void {
    if (!confirm('Restaurar as 50 plantas iniciais? Os cadastros e alterações locais serão substituídos.')) return;
    this.plantaService.restaurarCatalogo().subscribe(plantas => {
      this.plantas.set(plantas);
      this.errorMessage.set('');
      this.sucessMessage.set('Catálogo de 50 plantas restaurado!');
    });
  }

  remove(id: string): void {
    const confirmDelete = confirm('Está certo disso?');
    if (!confirmDelete) {
      return;
    }

    this.plantaService.delete(id).subscribe({
      next: () => {
        this.plantas.update((lista) => lista.filter((p) => p.id !== id));
        this.sucessMessage.set('Planta removida com sucesso!');
        setTimeout(() => this.sucessMessage.set(''), 2000);
      },
      error: () => {
        this.errorMessage.set('Erro ao remover planta.');
      },
    });
  }
}
