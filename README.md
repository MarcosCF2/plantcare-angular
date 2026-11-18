# PlantCare — Gestão de plantas (Angular 21)

Aplicativo acadêmico de gerenciamento e consulta de plantas, com visual em tons de verde.

## Como executar

Requisitos: Node.js compatível com Angular 21 (Node 20.19+, 22.12+ ou 24.x) e npm.

```bash
npm ci
npm start
```

Abra http://localhost:4200 . A página **Plantas** começa com **50 espécies** e tem pesquisa, filtro, detalhes e indicadores de rega. A página **Admin** permite cadastrar, editar, excluir e restaurar o catálogo inicial.

## Onde os dados ficam armazenados?

**Modo demonstração local:** as 50 plantas são carregadas a partir de `src/app/core/data/catalogo-plantas.ts`, derivado do JSON original `public/plantcare_50_plantas.json`. As alterações do Admin são salvas no **localStorage do navegador**. Não há necessidade de configurar Firebase para executar este ZIP. Cada navegador mantém dados separados; limpar os dados do site apaga as alterações locais. No Admin, **Restaurar 50 plantas** repõe os exemplos iniciais e substitui cadastros locais, após confirmação. Não use este armazenamento como solução multiusuário em produção.

Esta versão usa armazenamento local para demonstração. Para integração multiusuário, configure um banco de dados próprio, autenticação e regras de acesso antes de publicar.

## Testes e compilação

```bash
npm test -- --watch=false
npm run build
```

## Organização

- `src/app/core/models/planta.model.ts`: modelo da planta.
- `src/app/core/services/planta.service.ts`: operações `getAll`, `getById`, `create`, `update`, `delete`, `restaurarCatalogo`.
- `src/app/core/data/catalogo-plantas.ts`: 50 registros iniciais.
- `src/app/features/plantas`: catálogo com pesquisa, filtros e cards.
- `src/app/features/detalhe-planta`: detalhes e link para edição.
- `src/app/features/admin` e `manutencao-planta`: manutenção do cadastro com formulário reativo e validação.

**Atenção:** regas são orientações aproximadas, não calendários fixos de irrigação.
