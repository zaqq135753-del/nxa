# ADR — Decisões Técnicas de Animação e Interação (Motion Architecture)

## 1. Decisão: Escolha do Motor de Animação
- **Decisão:** Utilizar `motion/react` (Motion v14 / Framer Motion para React 19).
- **Racional:** O projeto já possui a dependência oficial instalada (`"motion": "^14.1.0"`). O uso de `motion/react` com `layoutId`, `animate`, e molas físicas (`type: "spring"`) garante 60fps no compositor da GPU sem overhead de bibliotecas pesadas de terceiros (Three.js/GSAP foram dispensados por não serem estritamente necessários para animação 2D de interface).
- **Parâmetros Iniciais de Mola:**
  - `type: "spring"`
  - `stiffness: 320`
  - `damping: 28`
  - `mass: 0.8`

## 2. Decisão: Arquitetura de Arraste e Pointer Events
- **Decisão:** Implementar a interação de arraste utilizando a API nativa de **Pointer Events** (`onPointerDown`, `onPointerMove`, `onPointerUp`, `onPointerCancel`, com `setPointerCapture` e `releasePointerCapture`).
- **Racional:** Suporte unificado de alta fidelidade para mouse, toque e caneta stylus em qualquer dispositivo (iOS, Android, macOS, Windows).
- **Comportamento de Snapping:**
  - Enquanto o usuário arrasta, a bolha acompanha o eixo X do ponteiro com clamping nos limites horizontais da barra de navegação.
  - Ao soltar o ponteiro (`pointerup`), calcula-se a distância euclidiana até o centro de cada item da barra e realiza-se o *snap* elástico suave para a aba mais próxima.
  - O evento `onChange` só é emitido se houver mudança de aba após o snap.

## 3. Decisão: Iluminação Dinâmica e Efeito Glow
- **Decisão:** Renderizar um glow com gradiente radial atrás da bolha interativa, animado via CSS Custom Properties (`--glow-color`, `--glow-accent`) e Motion.
- **Racional:** Evita filtros CSS pesados (`backdrop-filter` excessivos em camadas filhas) que causam quedas de frame em dispositivos móveis, utilizando opacidade e transformações aceleradas por hardware.

## 4. Decisão: Estrutura Modular e Desacoplada
- **Decisão:**
  - `navigation.types.ts`: Contratos estritos em TypeScript sem `any`.
  - `navigation.config.ts`: Configuração com as 5 abas da especificação (Home/Lime, Profile/Cyan, Messages/Orange, Media/Violet, Settings/Pink) e presets adicionais para Caraíva Digital.
  - `BubbleIndicator.tsx`: Componente que encapsula o círculo deslizante, glow, arraste e física da mola.
  - `NavigationItem.tsx`: Botões com semântica de acessibilidade (`role="tab"`, `aria-selected`, `aria-label`).
  - `BubbleNavigation.tsx`: Orquestrador com título dinâmico, acessibilidade, suporte a teclado (`ArrowLeft`, `ArrowRight`, `Home`, `End`), `prefers-reduced-motion` e integração com roteador/histórico.
  - `bubble-navigation.css`: Tokens de design system e variáveis de profundidade.

## 5. Decisão: Estratégia de Rollback e Não-Regressão
- **Decisão:** Manter a navegação original (`CaraivaDock.tsx` e `CaraivaLiquidTabs.tsx`) intacta. A nova navegação será disponibilizada como um componente plugável de primeira classe, com rota dedicada de demonstração e teste (`/navegacao` e no showroom de experiência), permitindo ativação condicional sem risco de quebra na aplicação principal.
