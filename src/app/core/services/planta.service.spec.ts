import { TestBed } from '@angular/core/testing';
import { PlantasService } from './planta.service';
import { firstValueFrom } from 'rxjs';

describe('PlantasService (catálogo inicial)', () => {
  let service: PlantasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantasService);
    localStorage.removeItem('plantcare-plantas-v1');
  });

  afterEach(() => localStorage.removeItem('plantcare-plantas-v1'));

  it('carrega 50 plantas iniciais', async () => {
    const plantas = await firstValueFrom(service.getAll());
    expect(plantas).toHaveLength(50);
    expect(plantas[0].nome).toBe('Jiboia');
  });

  it('cadastra, atualiza e exclui uma planta', async () => {
    const dados = {
      nome: 'Planta de teste', especie: 'Espécie de teste', localizacao: 'Sala',
      frequenciaRegaDias: 5, ultimaManutencao: '', observacoes: '', precisaAtencao: false,
    };
    const criada = await firstValueFrom(service.create(dados));
    expect((await firstValueFrom(service.getAll())).length).toBe(51);
    const alterada = await firstValueFrom(service.update(criada.id, { ...dados, nome: 'Planta editada' }));
    expect(alterada.nome).toBe('Planta editada');
    expect((await firstValueFrom(service.getById(criada.id))).nome).toBe('Planta editada');
    await firstValueFrom(service.delete(criada.id));
    expect((await firstValueFrom(service.getAll())).length).toBe(50);
  });
});
