import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, throwError } from 'rxjs';
import { Planta } from '../models/planta.model';
import { CATALOGO_INICIAL } from '../data/catalogo-plantas';

/** Armazenamento de demonstração: persiste no navegador, sem necessidade de Firebase. */
@Injectable({ providedIn: 'root' })
export class PlantasService {
  private readonly chave = 'plantcare-plantas-v1';
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  private ler(): Planta[] {
    if (!this.browser) return CATALOGO_INICIAL.map(p => ({ ...p }));
    try {
      const salvo = localStorage.getItem(this.chave);
      if (!salvo) return CATALOGO_INICIAL.map(p => ({ ...p }));
      const dados: unknown = JSON.parse(salvo);
      return Array.isArray(dados) ? dados as Planta[] : CATALOGO_INICIAL.map(p => ({ ...p }));
    } catch {
      return CATALOGO_INICIAL.map(p => ({ ...p }));
    }
  }

  private gravar(plantas: Planta[]): void {
    if (this.browser) localStorage.setItem(this.chave, JSON.stringify(plantas));
  }

  getAll(): Observable<Planta[]> {
    return of(this.ler());
  }

  getById(id: string): Observable<Planta> {
    const planta = this.ler().find(p => p.id === id);
    return planta ? of({ ...planta }) : throwError(() => new Error('Planta não encontrada'));
  }

  create(dados: Omit<Planta, 'id'>): Observable<Planta> {
    const planta: Planta = { ...dados, id: `planta-${Date.now()}-${Math.random().toString(36).slice(2, 9)}` };
    this.gravar([...this.ler(), planta]);
    return of(planta);
  }

  update(id: string, dados: Omit<Planta, 'id'>): Observable<Planta> {
    const lista = this.ler();
    const index = lista.findIndex(p => p.id === id);
    if (index < 0) return throwError(() => new Error('Planta não encontrada'));
    const atualizada: Planta = { ...lista[index], ...dados, id };
    lista[index] = atualizada;
    this.gravar(lista);
    return of(atualizada);
  }

  delete(id: string): Observable<void> {
    const lista = this.ler();
    if (!lista.some(p => p.id === id)) return throwError(() => new Error('Planta não encontrada'));
    this.gravar(lista.filter(p => p.id !== id));
    return of(void 0);
  }

  restaurarCatalogo(): Observable<Planta[]> {
    const originais = CATALOGO_INICIAL.map(p => ({ ...p }));
    this.gravar(originais);
    return of(originais);
  }
}
