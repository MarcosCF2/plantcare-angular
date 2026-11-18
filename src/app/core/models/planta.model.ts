export interface Planta {
  id: string;
  nome: string;
  especie: string;
  localizacao: string;
  frequenciaRegaDias: number;
  ultimaManutencao: string;
  observacoes: string;
  precisaAtencao: boolean;
  // Informações opcionais do catálogo botânico.
  categoria?: string;
  iluminacao?: string;
  regaIntervaloMinDias?: number;
  regaIntervaloMaxDias?: number;
  imagemUrl?: string | null;
}
