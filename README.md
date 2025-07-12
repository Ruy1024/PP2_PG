# Projeto Prático 2 — Processamento Gráfico

## Cena Interativa 3D com Three.js

Este projeto foi desenvolvido como parte da disciplina de **Processamento Gráfico**, com o objetivo de construir uma cena 3D interativa aplicando os principais conceitos estudados: criação de objetos 3D, uso de shaders personalizados, múltiplas câmeras, movimentação e aplicação de texturas.

---

## Integrantes do Grupo

| Nome                                        | RA      |
|---------------------------------------------|---------|
| Caio Monteiro Arraes                        | 822659  |
| Gabriel Henrique Urbano                     | 824031  |
| Guilherme Saggion Moraes                    | 823159  |
| Matheus Ruy Bernardo                        | 824365  |
| Thales Leonardo Euler Vieira de Sousa       | 822881  |

---

## Especificações Atendidas

- **Visualização de objetos 3D**  
  A cena contém **cinco objetos 3D distintos**, representando os membros do grupo. Cada objeto foi **posicionado e redimensionado individualmente**.

- **Shader próprio**  
  Um dos objetos (esfera) utiliza um **shader personalizado** implementado com `RawShaderMaterial` em GLSL.

- **Múltiplas câmeras**  
  Foram implementadas **três câmeras**:
  - Perspectiva (visão 3D padrão);
  - Ortográfica de topo;
  - Ortográfica lateral.  
  O usuário pode **alternar entre as câmeras com a tecla `C`**.

- **Movimento simples animado**  
  Os objetos apresentam animações:  
  - **Lua orbitando o cubo**;  
  - **Saturno girando sobre si**;  
  - **Foguete girando em órbita pela cena**.

- **Textura aplicada** 
  O cubo da cena recebe uma **textura externa** (`terra.jfif`), carregada com `THREE.TextureLoader`.

- **Documentação no GitHub**  
  Este `README.md` contém:
  - As especificações atendidas;
  - O modo de interação com a cena;
  - As principais características implementadas.

---

## Objetos 3D Criados

| Objeto     | Descrição                                                |
|------------|----------------------------------------------------------|
| Cubo       | Texturizado com imagem da Terra; possui uma lua orbital  |
| Esfera     | Aplicação de shader em GLSL com efeito de onda luminosa  |
| Saturno    | Planeta com anéis girando lentamente                     |
| Foguete    | Foguete com corpo, cone e asas orbitando a cena          |
| Fundo      | Estrelas distribuídas em 3D, compondo o espaço           |

---

## Modo de Interação

- **Trocar câmera:** pressione a tecla `C`.
- A cena é **responsiva** e se ajusta ao tamanho da janela.
- A movimentação dos objetos ocorre automaticamente.

---

## Como Executar o Projeto

Clone o repositório:
   git clone https://github.com/Ruy1024/PP2_PG.git