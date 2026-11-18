import { AsyncPipe, DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { map, switchMap } from "rxjs";
import { PlantasService } from "../../core/services/planta.service";

@Component({
  selector: "app-detalhe-planta",
  imports: [AsyncPipe, DatePipe, RouterLink],
  templateUrl: "./detalhe-planta.html",
  styleUrl: "./detalhe-planta.css",
})
export class DetalhePlanta {
  readonly planta$;

  constructor(route: ActivatedRoute, plantasService: PlantasService) {
    this.planta$ = route.paramMap.pipe(
      map((parametros) => parametros.get("id") ?? ""),
      switchMap((id) => plantasService.getById(id)),
    );
  }
}
