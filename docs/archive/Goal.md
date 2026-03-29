# SUPERHERO 3D CUSTOMIZER — **Especificación Integral v5.0**

> **Qué incluye**: visión de negocio, arquitectura de la app, clasificación completa de arquetipos y **guía exhaustiva de nomenclatura** con ejemplos detallados para *todas* las categorías de piezas. Esta versión es la referencia única para modeladores, desarrolladores y QA.

---

## 1 · Visión & Objetivo de Negocio

Crear una **aplicación web** (tipo HeroForge) que permita a los clientes **diseñar, visualizar y comprar** miniaturas 3D de superhéroes modulares por **4–6 USD**. El modelo se muestra en WebGL 2 / Three.js y, tras el pago, un servicio server‑side fusiona las piezas y entrega un STL de alta resolución.

---

## 2 · Funcionalidades Principales

| # | Función                  | Descripción                                                      |
| - | ------------------------ | ---------------------------------------------------------------- |
| 1 | Selector de arquetipo    | Plantillas (Fuerte, Ágil, Tecnológico, etc.)                     |
| 2 | Configurador modular     | Torso, piernas, botas, manos, cabeza, capa, símbolos, accesorios |
| 3 | Visor 3D interactivo     | Órbita, zoom, HDRI + SMAA                                        |
| 4 | Precio dinámico          | Actualiza al agregar/quitar piezas                               |
| 5 | Checkout Stripe & PayPal | Flujos PCI compliant                                             |
| 6 | STL fusionado en la nube | Lambda Node + link S3 caducable                                  |
| 7 | Panel de administración  | Subida de GLB, precios, compatibilidades                         |

---

## 3 · Arquitectura Técnica

| Capa             | Stack                                      | Motivo                          |
| ---------------- | ------------------------------------------ | ------------------------------- |
| 3D               | **Three.js r170** + **@react-three/fiber** | React synergy                   |
| UI               | React 18 · Zustand · Tailwind              | Estado ligero & estilos rápidos |
| Optimización GLB | DRACO + KTX2 (`gltf‑pipeline`)             | <60 % peso                      |
| Backend          | Supabase (Postgres + Storage)              | Auth, DB, CDN                   |
| Pagos            | Stripe Checkout v3                         | Minimiza PCI                    |
| Hosting          | Vercel Edge Functions                      | CI/CD continuo                  |

---

## 4 · Clasificación de Arquetipos & Poderes

| # | Arquetipo   | Rol típico  | Prefijo                          | Paleta sugerida    | Piezas icónicas                      |
| - | ----------- | ----------- | -------------------------------- | ------------------ | ------------------------------------ |
| 1 | Fuerte      | Tanque      | `fuerte`                         | Rojo, gris acero   | Guanteletes, capa corta              |
| 2 | Ágil        | DPS         | `agil`                           | Amarillo, rojo     | Visor, botas ligeras                 |
| 3 | Justiciero  | DPS/Soporte | `justiciero`                     | Negro, azul marino | Capucha, utility‑belt                |
| 4 | Tecnológico | Tanque/DPS  | `tech`                           | Metálico + neón    | Casco HUD, backpack jet              |
| 5 | Mágico      | Healer/DPS  | `magico`                         | Morado, dorado     | Túnica, bastón/libro                 |
| 6 | Elemental   | Varía       | `fuego`, `hielo`, `electrico`, … | Según elemento     | Hombros temáticos, texturas emisivas |
| 7 | Psíquico    | Control     | `mental`                         | Púrpura, blanco    | Diadema PSI, orbe                    |
| 8 | Mutante     | Tanque/DPS  | `mutante`                        | Verdes, ocres      | Garras, púas                         |
| 9 | Cósmico     | DPS/Soporte | `cosmico`                        | Azul, verde neón   | Casco esférico, capa galaxia         |

---

## 5 · Guía de Nomenclatura (completa)

### 5.1 Patrón Universal

```
{arquetipo}_{categoria}_{variante}[ _t{torsoXX} ][ _p{piernasXX} ][{sufijos}].glb
```

* **`arquetipo`** → prefijo de la tabla de arquetipos.
* **`categoria`** → torso, piernas, boots, hands\_hammer, cape…
* **`variante`** → 2 dígitos `01‑99` (identidad de la pieza).
* **`_tXX`** → solo si la pieza depende de un torso concreto (paleta, ornamentos).
* **`_pXX`** → solo usado por **boots** para reflejar el patrón/textura de unas piernas concretas.
* **Sufijos permitidos** (en cualquier orden lógico):

  * `_l`, `_r` — lado izquierdo/derecho
  * `_pair` — botas exportadas juntas
  * `_g`, `_ng` — con / sin guante
  * `_nc`, `_ns`, `_nt` — sin capa / símbolo / torsosuit
  * `_lod{n}` — nivel de detalle
  * `_v{mm}` — versión mayor‑menor
* **Longitud máxima**: 32 caracteres antes de `.glb`.

> **Ejemplo avanzado**
> `fuerte_hands_hammer_02_t01_r_g_lod2.glb`
> ↳ arquetipo **fuerte**, mano martillo variante **02**, dedicada al **torso 01**, lado derecho, con guante, LOD2.

### 5.2 Dependencias Rápidas

| Categoría                                                        | `_tXX` | `_pXX` | Comentario                               |
| ---------------------------------------------------------------- | ------ | ------ | ---------------------------------------- |
| torso                                                            | —      | —      | raíz de la paleta                        |
| piernas                                                          | —      | —      | independientes del torso                 |
| boots                                                            | —      | ✔      | usa `_pXX` si combinan patrón de piernas |
| beltchest                                                        | —      | —      | independiente                            |
| cabeza / hands / cape / symbol / torsosuit / shoulder / backpack | ✔      | —      | heredan estética del torso               |

### 5.3 Tabla de Sufijos

| Sufijo       | Significado              |
| ------------ | ------------------------ |
| `_l` / `_r`  | Lado izquierdo / derecho |
| `_pair`      | Botas par único          |
| `_g` / `_ng` | Con / sin guante         |
| `_nc`        | Sin capa                 |
| `_ns`        | Sin símbolo              |
| `_nt`        | Sin torsosuit            |
| `_lod{n}`    | LOD opcional             |
| `_v{mm}`     | Versión mayor‑menor      |

### 5.4 Ejemplos Exhaustivos (arquetipos más usados)

| Arquetipo / Pieza                      | Nombre de archivo                    |
| -------------------------------------- | ------------------------------------ |
| **Fuerte · Torso 01**                  | `fuerte_torso_01.glb`                |
| Fuerte · Piernas 01                    | `fuerte_piernas_01.glb`              |
| Fuerte · Botas para Piernas 01         | `fuerte_boots_01_p01_pair.glb`       |
| Fuerte · Mano der. martillo A (guante) | `fuerte_hands_hammer_01_t01_r_g.glb` |
| Fuerte · Mano der. martillo B (guante) | `fuerte_hands_hammer_02_t01_r_g.glb` |
| **Ágil · Bota izq. para Piernas 02**   | `agil_boots_01_p02_l.glb`            |
| Tech · Backpack para Torso 02          | `tech_backpack_jet_01_t02.glb`       |
| Magico · Capa sin capa (placeholder)   | `magico_cape_01_t01_nc.glb`          |
| Mental · Symbol sin símbolo            | `mental_symbol_01_t01_ns.glb`        |

*(Sigue misma lógica para resto de arquetipos.)*

### 5.5 Plantillas JSON

#### a) Pieza dependiente de torso

```json
{
  "id": "fuerte_hands_hammer_02_t01_r_g",
  "category": "hands_hammer",
  "archetype": "fuerte",
  "gltfPath": "/assets/fuerte/hands/fuerte_hands_hammer_02_t01_r_g.glb",
  "priceUSD": 0.60,
  "compatible": ["fuerte_torso_01"],
  "thumbnail": "/thumbs/fuerte_hands_hammer_02_t01_r_g.webp",
  "attributes": { "side": "right", "weapon": "hammer_b", "glove": true }
}
```

#### b) Piernas independientes

```json
{
  "id": "agil_piernas_02",
  "category": "piernas",
  "archetype": "agil",
  "gltfPath": "/assets/agil/piernas/agil_piernas_02.glb",
  "priceUSD": 1.00,
  "compatible": ["agil_torso_01", "agil_torso_02"],
  "thumbnail": "/thumbs/agil_piernas_02.webp"
}
```

#### c) Botas dependientes de piernas

```json
{
  "id": "agil_boots_01_p02_pair",
  "category": "boots",
  "archetype": "agil",
  "gltfPath": "/assets/agil/boots/agil_boots_01_p02_pair.glb",
  "priceUSD": 0.75,
  "compatible": ["agil_piernas_02"],
  "thumbnail": "/thumbs/agil_boots_01_p02_pair.webp",
  "attributes": { "pair": true }
}
```

---

## 6 · Pipeline de Modelos

1. Esculpir → retopo (Blender/ZBrush).
2. Bake normales y AO (1–2 K).
3. Exportar GLB origen 0,0,0.
4. `gltf‑pipeline` → DRACO + KTX2.
5. Nombrar siguiendo sec. 5, subir a CDN.
6. STL high‑poly se fusiona tras pago.

---

## 7 · Estrategia de Precios

| Pieza                                       | Precio USD |
| ------------------------------------------- | ---------- |
| Torso                                       | 1.50       |
| Piernas                                     | 1.00       |
| Cabeza                                      | 0.75       |
| Accesorios (cape, symbol, hands…)           | 0.50       |
| Base                                        | 0.25       |
| **Meta** ≤ **6.00 USD** por héroe completo. |            |

---

## 8 · Roadmap (8 semanas)

| Semana | Entregable clave                      |
| ------ | ------------------------------------- |
| 1‑2    | Setup repo + R3F canvas dummy         |
| 3‑4    | Loader modular + UI sidebar + pricing |
| 5      | Motor STL merge + Stripe sandbox      |
| 6      | Optimización GLB + QA mobile          |
| 7      | Beta cerrada feedback                 |
