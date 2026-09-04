# Denver Products — MMA 120 · V03

Página estática baseada no folheto MMA 120, com dados separados do layout. O HTML público funciona sem JavaScript e não depende de fontes ou bibliotecas externas.

## Arquivos principais

- `data/product.json`: conteúdo, especificações e referências dos assets.
- `templates/page.html`: estrutura do documento, cabeçalho e navegação.
- `scripts/generate.mjs`: composição dos blocos, escape de conteúdo e geração dos dois HTMLs.
- `styles.css`: tokens, layout, responsividade, teclado e impressão.
- `assets/fonts/`: Anton, Raleway e Rubik, hospedadas localmente.
- `index.html`: página gerada para publicar junto com os assets.
- `standalone.html`: a mesma página com fontes e imagens incorporadas.

## Editar e gerar

Com Node.js 22.12 ou superior:

```sh
npm ci
npm run generate
npm run check
```

Para editar o conteúdo, altere o JSON e execute `npm run generate`. Não edite os HTMLs gerados diretamente: isso evita divergências entre as versões. Para alterar o layout, edite o template, o gerador de blocos ou o CSS.

O gerador não precisa das dependências de desenvolvimento. `npm ci` instala somente o Vite usado na prévia local:

```sh
npm run dev
```

O Vite não é enviado ao navegador na página publicada. Não há React, componentes de terceiros, scripts de animação ou chamadas de API no frontend.

## Publicar no GitHub Pages

Mantenha `index.html`, `styles.css`, `assets/` e `.nojekyll` na raiz da branch publicada. O GitHub Pages serve os arquivos já gerados; não precisa executar Node. Após editar os dados, gere e inclua os HTMLs no mesmo commit.

Para revisar offline, abra `standalone.html` diretamente. Os links do manual, do folheto e do site institucional continuam externos.

## Contrato para o programador

O JSON mantém os grupos editoriais do folheto, na mesma sequência. O gerador valida os campos essenciais, o total de itens e a existência dos assets. Valores inseridos no HTML são escapados. O CMS pode usar o mesmo contrato para sua própria renderização no servidor.

A imagem da hero aceita `assets.hero.transparent: true` para um futuro PNG/WebP com alpha real. Nesse modo o layout dispensa a máscara usada para a imagem de estúdio. `src`, `alt`, `width` e `height` ficam juntos no JSON.

## Fontes e cor

Famílias confirmadas no CSS institucional em 04/09/2026: Anton (principal), Raleway (secundária) e Rubik (texto). O laranja institucional é `#FF5900`; o símbolo do logo fornecido conserva `#EB6E03`. O fundo off-white da V02 foi preservado. Os arquivos de licença acompanham as fontes.

## Fidelidade e pendências

- Dados técnicos preservados, incluindo `HOT STAR` e `Frequencia`, como no PDF. Não houve correção técnica silenciosa.
- Capitalização de chamadas adaptada para leitura, sem reescrever o conteúdo.
- Telefones, unidades e endereços seguem o PDF fornecido, não os contatos diferentes do site institucional atual.
- O manual usa o link “Manual - MMA120” encontrado na página de destino do QR code original.
- Hero: foi preservada a imagem aprovada, com máscara e composição CSS para integrar seu fundo ao off-white. A tentativa de gerar alpha real falhou; esta versão não deve ser descrita como imagem recortada transparente. A sombra original permanece, sem sombra CSS duplicada.
- Imagens de referência anteriores permanecem em `assets/`; a página usa apenas os assets declarados no JSON.
- As outras linhas aparecem como lista, sem falsos links nem caixas com “ASSET”. Novas fotos podem ser integradas quando fornecidas.
