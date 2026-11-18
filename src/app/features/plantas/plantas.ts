import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Planta } from '../../core/models/planta.model';
import { PlantasService } from '../../core/services/planta.service';

@Component({
  selector: 'app-plantas',
  imports: [RouterLink],
  templateUrl: './plantas.html',
  styleUrl: './plantas.css',
})
export class Plantas implements OnInit {
  private service = inject(PlantasService);
  plantas = signal<Planta[]>([]);
  pesquisa = signal('');
  categoriaSelecionada = signal('Todas');
  carregando = signal(true);
  erro = signal('');

  categorias = computed(() => ['Todas', ...new Set(this.plantas().map(p => p.categoria || 'Outras'))]);
  plantasFiltradas = computed(() => {
    const busca = this.pesquisa().toLocaleLowerCase('pt-BR').trim();
    const categoria = this.categoriaSelecionada();
    return this.plantas().filter(p =>
      (categoria === 'Todas' || (p.categoria || 'Outras') === categoria) &&
      (!busca || [p.nome, p.especie, p.localizacao].some(t => t.toLocaleLowerCase('pt-BR').includes(busca)))
    );
  });

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: plantas => { this.plantas.set(Array.isArray(plantas) ? plantas : []); this.carregando.set(false); },
      error: () => { this.erro.set('Não foi possível carregar as plantas.'); this.carregando.set(false); }
    });
  }

  atualizarPesquisa(event: Event): void {
    this.pesquisa.set((event.target as HTMLInputElement).value);
  }

  atualizarCategoria(event: Event): void {
    this.categoriaSelecionada.set((event.target as HTMLSelectElement).value);
  }
}
