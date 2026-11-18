import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlantasService } from '../../core/services/planta.service';
import { Planta } from '../../core/models/planta.model';
import { timer } from 'rxjs';
@Component({
  selector: 'app-manutencao-planta',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './manutencao-planta.html',
  styleUrl: './manutencao-planta.css',
})
export class ManutencaoPlanta implements OnInit {
  private fb = inject(FormBuilder);
  private plantaService = inject(PlantasService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  editingId: string | null = null;
  loading = false;
  loadingData = false;
  loadError = false;
  successMessage = '';
  errorMessage = '';

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    especie: ['', [Validators.required]],
    localizacao: ['', [Validators.required]],
    frequenciaRegaDias: [7, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
    ultimaManutencao: [''],
    observacoes: [''],
    precisaAtencao: [false],
  });

  ngOnInit(): void {
    const id =
      this.route.snapshot.paramMap.get('id') ?? this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.editingId = id;
      this.loadPlanta(id);
    }
  }

  loadPlanta(id: string): void {
    this.loadingData = true;
    this.loadError = false;
    this.errorMessage = '';
    this.plantaService
      .getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (planta) => {
          this.form.patchValue({
            nome: planta.nome,
            especie: planta.especie,
            localizacao: planta.localizacao,
            frequenciaRegaDias: planta.frequenciaRegaDias,
            ultimaManutencao: planta.ultimaManutencao ?? '',
            observacoes: planta.observacoes ?? '',
            precisaAtencao: planta.precisaAtencao,
          });

          this.loadingData = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.errorMessage = 'Erro ao carregar a planta. Tente novamente.';
          this.loadingData = false;
          this.loadError = true;
          this.cdr.markForCheck();
        },
      });
  }

  submit(): void {
    if (this.loading || this.loadingData || this.loadError || this.successMessage) {
      return;
    }
    this.successMessage = '';
    this.errorMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const plantaData: Omit<Planta, 'id'> = this.form.getRawValue();
    const editing = this.editingId !== null;
    const request$ =
      this.editingId !== null
        ? this.plantaService.update(this.editingId, plantaData)
        : this.plantaService.create(plantaData);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = editing
          ? 'Planta atualizada com sucesso!'
          : 'Planta criada com sucesso!';
        if (!editing) {
          this.form.reset();
        }
        this.cdr.markForCheck();
        timer(1000)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            void this.router.navigate(['/admin']);
          });
      },
      error: () => {
        this.loading = false;
        this.errorMessage = editing
          ? 'Erro ao atualizar a planta. Tente novamente.'
          : 'Erro ao criar a planta. Tente novamente.';
        this.cdr.markForCheck();
      },
    });
  }
}
