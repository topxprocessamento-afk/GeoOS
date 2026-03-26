# 🧭 GeoOS — Design de Interface Mobile

## Visão Geral

**GeoOS** é um aplicativo mobile para técnicos de campo de topografia registrarem Ordens de Serviço (OS) com evidências fotográficas geolocalizadas. O app possui dois perfis: **Técnico** (campo) e **Administrador** (painel em tempo real).

---

## 📱 Orientação e Princípios

- **Orientação**: Portrait (9:16) — uso com uma mão
- **Tema**: Escuro por padrão (economiza bateria, legível ao sol)
- **Tipografia**: 
  - Display: Oswald (títulos)
  - Body: IBM Plex Sans (legibilidade em campo)
  - Mono: JetBrains Mono (coordenadas GPS)
- **Cores Primárias**:
  - Vermelho de Ação: `#FF2020` (overlay de câmera, botões críticos)
  - Fundo Escuro: `#151718`
  - Superfície: `#1e2022`
  - Texto Primário: `#ECEDEE`
  - Texto Secundário: `#9BA1A6`
  - Sucesso: `#4ADE80`
  - Aviso: `#FBBF24`
  - Erro: `#F87171`

- **Princípios de UX para Campo**:
  - Botões grandes (mín. 56px altura) — uso com luvas
  - Alto contraste — legível sob luz solar
  - Feedback háptico em ações críticas
  - Ícones + rótulo (nunca ícone sozinho)
  - Indicadores de status GPS visíveis

---

## 🎯 Estrutura de Telas

### **FLUXO DE AUTENTICAÇÃO**

#### Tela: Login (`app/(auth)/login.tsx`)
- **Conteúdo Principal**:
  - Logo GeoOS (centralizado)
  - Campo de email
  - Campo de senha
  - Botão "Entrar" (vermelho #FF2020, 56px altura)
  - Link "Esqueceu a senha?"
  - Indicador de carregamento durante autenticação
- **Fluxo**: Após login bem-sucedido, redireciona por cargo (Técnico → Dashboard Técnico | Admin → Dashboard Admin)

#### Tela: Recuperação de Senha (`app/(auth)/forgot-password.tsx`)
- **Conteúdo Principal**:
  - Campo de email
  - Botão "Enviar Link de Recuperação"
  - Mensagem de confirmação após envio

---

### **FLUXO TÉCNICO DE CAMPO** (`app/(tecnico)/`)

#### Tela: Dashboard Técnico (`app/(tecnico)/index.tsx`)
- **Conteúdo Principal**:
  - Saudação: "Olá, [Nome Técnico]"
  - **Card de Status GPS**: 
    - Ícone de localização + "GPS Ativo" (verde) ou "GPS Inativo" (cinza)
    - Precisão atual (ex: ±3,20m)
    - Botão para ativar/desativar GPS
  - **Card de OS Ativa**:
    - Nº da OS
    - Nome da obra
    - Status (em andamento, pausada, etc.)
    - Botão "Abrir OS"
  - **Resumo Rápido**:
    - Total de OSs hoje
    - Fotos capturadas
    - OSs concluídas
  - **Tab Bar**: Home | OSs | Câmera | Perfil

#### Tela: Lista de Ordens de Serviço (`app/(tecnico)/ordens/index.tsx`)
- **Conteúdo Principal**:
  - Filtro: Todas | Pendentes | Em Andamento | Concluídas
  - **Lista de Cards de OS**:
    - Nº OS + Nome Obra
    - Status com cor (vermelho=pendente, amarelo=em andamento, verde=concluída)
    - Data de abertura
    - Botão "Abrir" → Detalhes da OS
  - Botão flutuante "Nova OS" (vermelho, canto inferior direito)

#### Tela: Criar Nova OS (`app/(tecnico)/ordens/nova.tsx`)
- **Conteúdo Principal**:
  - Seletor de Obra (dropdown com lista de obras ativas)
  - Seletor de Tipo de Serviço (levantamento, locação, nivelamento, etc.)
  - Campo de Título (obrigatório)
  - Campo de Descrição (texto livre)
  - Botão "Criar OS" (verde, 56px)
  - Botão "Cancelar"

#### Tela: Detalhes da OS (`app/(tecnico)/ordens/[id]/index.tsx`)
- **Conteúdo Principal**:
  - **Header**:
    - Nº OS + Nome Obra
    - Status (badge com cor)
  - **Seções Abas**:
    - **Info**: Descrição, tipo de serviço, responsável, datas
    - **Fotos**: Galeria de fotos capturadas (thumbnails em grid)
    - **Histórico**: Log de ações (criação, mudança de status, etc.)
  - **Botões de Ação**:
    - "Capturar Foto" (vermelho) → Abre câmera
    - "Pausar/Retomar" (amarelo)
    - "Concluir OS" (verde)
    - "Editar" (azul)

#### Tela: Câmera com Overlay (`app/(tecnico)/ordens/[id]/camera.tsx`)
- **Conteúdo Principal**:
  - **Visualização da Câmera** (tela cheia)
  - **Overlay em Tempo Real**:
    - Texto vermelho (#FF2020) no canto superior esquerdo
    - Mostra: Data/Hora, GPS (Lat/Lon/Precisão), Endereço, Nº OS, Técnico, Observação
  - **Painel Inferior** (escuro, translúcido):
    - Campo "Etapa" (seletor: Início | Durante | Conclusão | Detalhe | Outro)
    - Campo "Observação" (texto livre, até 200 caracteres)
    - Indicador de GPS (ativo/inativo com precisão)
    - Botão "Capturar" (vermelho, grande, 64px)
    - Botão "Cancelar" (cinza)
  - **Feedback**:
    - Após captura: preview da foto com overlay
    - Botão "Salvar" (verde) ou "Descartar" (cinza)

#### Tela: Galeria de Fotos da OS (`app/(tecnico)/ordens/[id]/fotos.tsx`)
- **Conteúdo Principal**:
  - Grid de fotos capturadas (2 colunas)
  - Cada foto mostra:
    - Thumbnail com overlay visível
    - Etapa (Início, Durante, etc.)
    - Data/Hora
  - Tap na foto → Visualização em tela cheia com overlay
  - Swipe para navegar entre fotos
  - Botão "Compartilhar" (abre share sheet)

#### Tela: Perfil do Técnico (`app/(tecnico)/perfil.tsx`)
- **Conteúdo Principal**:
  - Avatar do técnico
  - Nome completo
  - Matrícula
  - Cargo
  - Telefone
  - Botão "Editar Perfil"
  - Botão "Sair" (vermelho)
  - Versão do app

---

### **FLUXO ADMINISTRADOR** (`app/(admin)/`)

#### Tela: Dashboard Admin (`app/(admin)/index.tsx`)
- **Conteúdo Principal**:
  - **Resumo em Tempo Real**:
    - Total de OSs ativas
    - Total de fotos hoje
    - Equipes online
    - Taxa de conclusão (%)
  - **Feed de Atividades** (atualiza em tempo real via Supabase):
    - "João Silva capturou foto em OS-2024-0047"
    - "OS-2024-0045 marcada como concluída"
    - Cada item mostra: ícone, ação, timestamp
  - **Mapa em Tempo Real**:
    - Pins das OSs ativas com cores (vermelho=pendente, amarelo=em andamento, verde=concluída)
    - Tap no pin → Detalhes da OS
  - **Tab Bar**: Dashboard | Obras | Equipe | Relatórios | Perfil

#### Tela: Lista de Obras (`app/(admin)/obras/index.tsx`)
- **Conteúdo Principal**:
  - Filtro: Todas | Ativas | Pausadas | Concluídas
  - **Lista de Cards de Obra**:
    - Código + Nome da Obra
    - Cliente
    - Status com cor
    - Data de início e previsão de fim
    - Botão "Abrir" → Detalhes da Obra
  - Botão flutuante "Nova Obra"

#### Tela: Detalhes da Obra (`app/(admin)/obras/[id].tsx`)
- **Conteúdo Principal**:
  - **Header**: Nome da obra, cliente, status
  - **Seções Abas**:
    - **Info**: Endereço, cidade, estado, responsável, descrição
    - **Mapa**: Mapa com localização da obra
    - **OSs**: Lista de OSs desta obra (com status)
    - **Equipe**: Técnicos atribuídos
  - **Botões de Ação**:
    - "Editar" (azul)
    - "Pausar/Ativar" (amarelo)
    - "Concluir" (verde)

#### Tela: Gerenciar Equipes (`app/(admin)/equipe/index.tsx`)
- **Conteúdo Principal**:
  - **Lista de Técnicos**:
    - Nome, matrícula, cargo, status (online/offline)
    - Indicador de atividade (última ação)
    - Botão "Detalhes" → Perfil do técnico
  - **Lista de Equipes**:
    - Nome da equipe, supervisor, membros
    - Botão "Editar" → Gerenciar membros
  - Botão flutuante "Adicionar Técnico"

#### Tela: Gerar Relatórios (`app/(admin)/relatorios/index.tsx`)
- **Conteúdo Principal**:
  - **Filtros**:
    - Data de início e fim
    - Obra (seletor)
    - Técnico (seletor)
    - Tipo de serviço (seletor)
  - **Opções de Relatório**:
    - "Relatório de Conclusão" (PDF com fotos)
    - "Relatório de Horas" (tempo gasto por técnico)
    - "Relatório de Cobertura Fotográfica" (mapa com pins de fotos)
  - Botão "Gerar PDF" (verde, 56px)
  - Botão "Compartilhar" (após geração)

#### Tela: Perfil do Admin (`app/(admin)/perfil.tsx`)
- Similar ao perfil do técnico, mas com opções adicionais:
  - "Gerenciar Usuários"
  - "Configurações do App"
  - "Sair"

---

## 🎨 Componentes Reutilizáveis

| Componente | Uso | Especificação |
|---|---|---|
| `OSCard` | Listagem de OSs | Mostra nº, obra, status, data |
| `ObraCard` | Listagem de obras | Mostra código, cliente, status |
| `FotoThumbnail` | Galeria | Thumbnail com overlay visível |
| `StatusBadge` | Status visual | Cor + texto (Pendente, Em Andamento, etc.) |
| `GPSIndicator` | Status GPS | Ícone + precisão + ativo/inativo |
| `OverlayPreview` | Preview de overlay | Mostra como ficará o texto na foto |
| `HistoricoItem` | Log de ações | Ícone + ação + timestamp |
| `FeedItem` | Feed em tempo real | Ícone + descrição + timestamp |

---

## 🔄 Fluxos Principais

### Fluxo 1: Técnico Captura Foto
1. Técnico abre OS → Clica "Capturar Foto"
2. Câmera abre com overlay em tempo real
3. Técnico preenche Etapa + Observação
4. Clica "Capturar" → Foto com overlay é salva
5. Preview da foto com overlay
6. Clica "Salvar" → Upload para Supabase Storage
7. Registro criado em `registros_foto`
8. Admin vê foto em tempo real no feed

### Fluxo 2: Admin Acompanha em Tempo Real
1. Admin abre Dashboard
2. Vê resumo de OSs ativas
3. Mapa mostra pins de OSs
4. Feed atualiza em tempo real com novas fotos
5. Clica no pin → Detalhes da OS com fotos
6. Gera relatório PDF com fotos

### Fluxo 3: Modo Offline (Técnico sem internet)
1. Técnico captura foto (app detecta sem internet)
2. Foto é salva localmente em queue
3. Quando internet retorna, app sincroniza automaticamente
4. Admin vê foto após sincronização

---

## 📐 Especificações de Overlay na Câmera

**Posição**: Canto superior esquerdo, `top: 24px`, `left: 20px`

**Estilo de Texto**:
- Cor: `#FF2020` (vermelho vivo)
- Fonte: Bold, sem serifa (Oswald ou RobotoCondensed-Bold)
- Tamanho: 22–26sp
- Sombra: `2px 2px 4px #000, -1px -1px 3px #000` (contraste sobre qualquer fundo)
- Sem fundo, sem caixa, sem borda
- Espaçamento entre linhas: `lineHeight: 30`

**Linhas do Overlay** (de cima para baixo):
1. Data por extenso + hora (ex: `26 de mar. de 2026  14:32:07`)
2. Lat + Lon + Precisão GPS (ex: `20,4586S  49,2648W  ±3,20m`)
3. Número + Nome da rua (ex: `565 Rua das Flores`)
4. Bairro (ex: `Jardim das Acácias`)
5. Cidade (ex: `Goiânia`)
6. Estado (ex: `Goiás`)
7. Nº OS + Nome da Obra (ex: `OS-2024-0047 | PLAENGE ALAMEDA`)
8. Técnico + Observação (ex: `João Silva | Marco P-07 instalado`)

---

## ✅ Checklist de Implementação

- [ ] Telas de autenticação (login, recuperação de senha)
- [ ] Dashboard técnico com status GPS
- [ ] Lista e criação de OSs
- [ ] Câmera com overlay estilo Timestamp
- [ ] Galeria de fotos com overlay visível
- [ ] Dashboard admin em tempo real
- [ ] Mapa com pins de OSs
- [ ] Gerenciamento de equipes
- [ ] Geração de relatórios PDF
- [ ] Modo offline com queue de sincronização
- [ ] Notificações push (opcional)
- [ ] Testes end-to-end dos fluxos principais
