# Denver Master Product Page — MMA 120

Protótipo estático pensado como **página mestra replicável** para a linha de máquinas Denver.

## Estrutura
- `index.html` — layout master
- `styles.css` — tokens visuais e responsividade
- `script.js` — animações discretas de entrada
- `data/product.json` — dados do produto extraídos do PDF na ordem editorial do folheto
- `assets/` — logo e assets da MMA 120 fornecidos pelo cliente

## Publicar no GitHub Pages
1. Crie um repositório.
2. Envie todos os arquivos desta pasta para a raiz do repositório.
3. Em **Settings → Pages**, selecione `Deploy from a branch`.
4. Escolha `main` e `/ (root)`.
5. Salve.

## Integração futura
O programador pode usar `data/product.json` como contrato de dados e renderizar os mesmos blocos no CMS/backend atual. A ordem de `sourceOrder` preserva a sequência do PDF.

## Tokens de marca usados
- Denver Orange: `#EB6E03` — extraído do SVG oficial fornecido.
- Fundo principal: claro/off-white.
- Contraste: preto/carvão e laranja.

### Tipografia
O HTML usa uma pilha de sistema moderna como **fallback temporário** (`Inter`/system UI). O CSS público do site atual não ficou disponível no crawler usado nesta análise, então a família tipográfica do site **não foi inventada como se fosse confirmada**. Assim que o desenvolvedor fornecer o nome/fonte ou o CSS, basta trocar `font-family` no `body`.

## Observação de fidelidade ao PDF
O conteúdo técnico foi preservado como aparece no folheto, inclusive `HOT STAR` e `Frequencia`, sem correção editorial silenciosa.
