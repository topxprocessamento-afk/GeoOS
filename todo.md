# GeoOS — Project TODO

## Phase 1: Setup e Configuração Base
- [x] Configurar Supabase (schema SQL + cliente)
- [x] Implementar autenticação com Supabase Auth
- [x] Configurar Zustand para estado global
- [x] Implementar persistência de sessão com SecureStore
- [x] Configurar Expo Router com layouts por role (auth, tecnico, admin)

## Phase 2: Autenticação e Perfil
- [x] Tela de login com validação
- [x] Tela de recuperação de senha
- [x] Redirecionamento por cargo (Técnico vs Admin)
- [x] Tela de perfil do técnico
- [x] Tela de perfil do admin (placeholder)
- [x] Logout funcional

## Phase 3: Módulo de Obras e Ordens de Serviço
- [ ] CRUD de obras (criar, listar, editar, deletar) — em progresso
- [ ] CRUD de OSs (criar, listar, editar, atualizar status) — em progresso
- [x] Numeração automática de OS (OS-AAAA-NNNN) — implementado em osStore
- [ ] Tela de lista de OSs para técnico
- [ ] Tela de detalhes de OS
- [ ] Tela de criar nova OS
- [ ] Tela de lista de obras para admin
- [ ] Tela de detalhes de obra com mapa

## Phase 4: Módulo de Câmera com Overlay
- [ ] Integração expo-camera com permissões
- [ ] Integração expo-location com GPS de alta precisão
- [ ] Geocoding reverso (endereço a partir de Lat/Lon)
- [ ] Renderização de overlay estilo Timestamp (react-native-view-shot)
- [ ] Overlay com: Data/Hora, GPS, Endereço, Nº OS, Técnico, Observação
- [ ] Captura de foto com overlay impresso
- [ ] Upload de foto para Supabase Storage
- [ ] Persistência de registro em registros_foto
- [ ] Indicador de status GPS na câmera
- [ ] Preview de foto com overlay antes de salvar

## Phase 5: Galeria de Fotos e Detalhes
- [ ] Tela de galeria de fotos da OS (grid)
- [ ] Visualização em tela cheia com overlay
- [ ] Navegação entre fotos (swipe)
- [ ] Compartilhamento de fotos
- [ ] Metadados visíveis (data, hora, GPS, etapa)

## Phase 6: Dashboard Admin em Tempo Real
- [ ] Dashboard com resumo de OSs ativas
- [ ] Feed de atividades em tempo real (Supabase Realtime)
- [ ] Mapa com pins de OSs ativas
- [ ] Cores de pins por status (vermelho=pendente, amarelo=em andamento, verde=concluída)
- [ ] Tap no pin → Detalhes da OS
- [ ] Indicador de técnicos online

## Phase 7: Gerenciamento de Equipes
- [ ] Tela de lista de técnicos
- [ ] Tela de lista de equipes
- [ ] Adicionar técnico à equipe
- [ ] Remover técnico da equipe
- [ ] Editar informações de técnico

## Phase 8: Relatórios PDF
- [ ] Geração de PDF com fotos e metadados
- [ ] Filtros de relatório (data, obra, técnico, tipo de serviço)
- [ ] Compartilhamento de PDF (expo-sharing)
- [ ] Relatório de conclusão (fotos + info da OS)
- [ ] Relatório de horas (tempo por técnico)
- [ ] Relatório de cobertura fotográfica (mapa com pins)

## Phase 9: Modo Offline e Sincronização
- [ ] Queue local de fotos não sincronizadas
- [ ] Detecção de conexão (expo-network)
- [ ] Sincronização automática quando internet retorna
- [ ] Persistência de dados locais com AsyncStorage
- [ ] Indicador visual de sincronização

## Phase 10: Notificações e Polish
- [ ] Integração expo-notifications
- [ ] Notificações push para admin (nova foto, OS concluída)
- [ ] Feedback háptico em ações críticas
- [ ] Animações sutis de transição
- [ ] Estados de loading/erro em todas as telas
- [ ] Validação de formulários com React Hook Form + Zod

## Phase 11: Testes e Documentação
- [ ] Testes unitários de componentes críticos
- [ ] Testes de integração de fluxos principais
- [ ] README com instruções de instalação
- [ ] Documentação de variáveis de ambiente
- [ ] Guia de configuração do Supabase

## Phase 12: Entrega Final
- [ ] Revisão de código
- [ ] Verificação de todos os fluxos end-to-end
- [ ] Checkpoint final
- [ ] Documentação completa
