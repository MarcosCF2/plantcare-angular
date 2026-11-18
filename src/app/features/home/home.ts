import { AsyncPipe } from "@angular/common";
import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { map } from "rxjs";
import { PlantasService } from "../../core/services/planta.service";

@Component({
  selector: "app-home",
  imports: [RouterLink, AsyncPipe],
  templateUrl: "./home.html",
  styleUrl: "./home.css",
})
export class Home {
  readonly plantasDestaque$;

  constructor(plantasService: PlantasService) {
    this.plantasDestaque$ = plantasService
      .getAll()
      .pipe(map((plantas) => plantas.slice(0, 10)));
  }

  moverCarrossel(trilho: HTMLElement, direcao: number): void {
    trilho.scrollBy({ left: direcao * 340, behavior: "smooth" });
  }
}
