import { Routes } from "@angular/router";
export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./features/home/home").then((m) => m.Home),
    title: "Início | PlantCare",
  },
  {
    path: "sobre",
    loadComponent: () => import("./features/sobre/sobre").then((m) => m.Sobre),
    title: "Sobre | PlantCare",
  },
  {
    path: "plantas",
    loadComponent: () =>
      import("./features/plantas/plantas").then((m) => m.Plantas),
    title: "Plantas | PlantCare",
  },
  {
    path: "plantas/:id",
    loadComponent: () =>
      import("./features/detalhe-planta/detalhe-planta").then(
        (m) => m.DetalhePlanta,
      ),
    title: "Detalhes da planta | PlantCare",
  },
  {
    path: "admin",
    loadComponent: () => import("./features/admin/admin").then((m) => m.Admin),
    title: "Admin | PlantCare",
  },
  {
    path: "admin/form",
    loadComponent: () =>
      import("./features/manutencao-planta/manutencao-planta").then(
        (m) => m.ManutencaoPlanta,
      ),
    title: "Nova planta | PlantCare",
  },
  {
    path: "admin/form/:id",
    loadComponent: () =>
      import("./features/manutencao-planta/manutencao-planta").then(
        (m) => m.ManutencaoPlanta,
      ),
    title: "Editar planta | PlantCare",
  },
  { path: "**", redirectTo: "" },
];
