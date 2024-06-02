import { ProductType, ProductCategory } from "@prisma/client";
import { type ProductSpecification } from "~/server/types/product.type";

type Template = {
  specification: ProductSpecification;
  names: readonly string[];
};

const arabicaPronto = {
  specification: {
    type: ProductType.CoffeeArabica,
    category: ProductCategory.Pronto,
  },
  names: [
    "CAFÉ 17/18 PRONTO CEREJA - SEMI-WASHED",
    "CAFÉ 14/16 PRONTO CEREJA - SEMI-WASHED",
    "CAFÉ 17/18 PRONTO FINO - FINE CUP",
    "CAFÉ 14/16 PRONTO FINO - FINE CUP",
    "CAFÉ 17/18 PRONTO BOM - GOOD CUP",
    "CAFÉ 14/16 PRONTO BOM - GOOD CUP",
    "CAFÉ 17/18 RIO MINAS PRONTO",
    "CAFÉ 14/16 RIO MINAS PRONTO",
    "CAFÉ 17/18 RIO ZONA PRONTO",
    "CAFÉ 14/16 RIO ZONA PRONTO",
    "GRINDERS 12 UP FINO - FINE CUP",
    "GRINDERS 12 UP - GOOD CUP",
    "GRINDERS 13 UP - FINE CUP",
    "GRINDERS 13 UP - GOOD CUP",
  ],
} as const satisfies Template;

const arabicaMercadoInterno = {
  specification: {
    type: ProductType.CoffeeArabica,
    category: ProductCategory.MercadoInterno,
  },
  names: [
    "CONSUMO 600 DF 1% FD10 /1 % IMPUREZA DURO ATE 2 RIADAS ATE 5% BROCA",
    "CONSUMO 600 DF 1% FD10 /1 % IMPUREZA DURO ATE 2 RIADAS",
    "CONSUMO 600 DF 1% FD10 /1 % IMPUREZA DURO /RIADO/RIO",
    "CONSUMO 600 DF 1% FD10 /1 % IMPUREZA DURO /RIADO/RIO",
    "CONSUMO 800 DF 2% FD10/2% IMPUREZA   DURO ATE 2 RIADAS",
    "CONSUMO 800 DF 2% FD10/2% IMPUREZA DURO /RIADO/RIO",
    "CONSUMO 600 DF 1% FD10/1% IMPUREZA RIO",
    "CONSUMO 800 DF 2% FD10/2% IMPUREZA / RIO",
  ],
} as const satisfies Template;

const arabicaBicaCorrida = {
  specification: {
    type: ProductType.CoffeeArabica,
    category: ProductCategory.BicaCorrida,
  },
  names: [
    "CAFÉ CEREJA SEMI-WASHED - 25% P17AC - 10% CATAÇÃO",
    "CAFÉ CEREJA SEMI-WASHED - 25% P17AC - 15% CATAÇÃO",
    "CAFÉ FINO - FINE CUP - 25% P17AC -15 %CATAÇÃO",
    "CAFÉ FINO - FINE CUP - 25% P17AC -20 %CATAÇÃO",
    "CAFÉ BOM - GOOD CUP – 25% P17AC – 20%CATAÇÃO",
    "CAFÉ BOM – GOOD CUP – 25% P17AC – 25% CATAÇÃO",
    "CAFÉ BOM – GOOD CUP – 25% P17AC – 30% CATAÇÃO",
    "CAFÉ DURO ATÉ 2 RIADAS - GOOD CUP – 25% P17AC – 20% CATAÇÃO",
    "CAFÉ DURO ATÉ 2 RIADAS - GOOD CUP – 25% P17AC – 25% CATAÇÃO",
    "CAFÉ DURO ATÉ 2 RIADAS - GOOD CUP – 25% P17AC – 30% CATAÇÃO",
    "CAFÉ DURO RIADO - GOOD CUP – 25% P17AC – 20% CATAÇÃO",
    "CAFÉ DURO RIADO - GOOD CUP – 25% P17AC – 25% CATAÇÃO",
    "CAFÉ DURO RIADO - GOOD CUP – 25% P17AC – 30% CATAÇÃO",
    "CAFÉ DURO RIADO RIO - GOOD CUP – 25% P17AC – 20% CATAÇÃO",
    "CAFÉ DURO RIADO RIO - GOOD CUP – 25% P17AC – 25% CATAÇÃO",
    "CAFÉ DURO RIADO RIO - GOOD CUP – 25% P17AC – 30% CATAÇÃO",
    "CAFÉ RIO MINAS PANO – 25% P17AC – 20% CATAÇÃO",
    "CAFÉ RIO MINAS PANO – 25% P17AC – 25%CATAÇÃO",
    "CAFÉ RIO VARREÇÃO – 25% P17AC – 20% CATAÇÃO",
    "CAFÉ RIO VARREÇÃO – 25% P17AC – 25%CATAÇÃO",
    "CAFÉ RIO ZONA PANO – 25% P17 – 20% CATAÇÃO",
    "CAFÉ RIO ZONA PANO -25% P17AC – 25% CATAÇÃO",
  ],
} as const satisfies Template;

const robustaPronto = {
  specification: {
    type: ProductType.CoffeeRobusta,
    category: ProductCategory.Pronto,
  },
  names: [
    "CONILON 12 UP PRONTO",
    "CONILON 13 UP PRONTO",
    "CONILON 14 UP PRONTO",
    "CONILON 16 UP PRONTO",
  ],
} as const satisfies Template;

const robustaMercadoInterno = {
  specification: {
    type: ProductType.CoffeeRobusta,
    category: ProductCategory.MercadoInterno,
  },
  names: [
    "CONILON – 500 DEF 1% FD10 / 1% IMPUREZA",
    "CONILON – 600 DEF 1% FD10 / 1% IMPUREZA",
    "CONILON – 800 DEF 2% FD10 / 2% IMPUREZA",
  ],
} as const satisfies Template;

const robustaBicaCorrida = {
  specification: {
    type: ProductType.CoffeeRobusta,
    category: ProductCategory.BicaCorrida,
  },
  names: [
    "CONILON – 200 DEF 1% FD10 / 1% IMPUREZA TIPO 7",
    "CONILON – 300 DEF 1% FD10 / 1% IMPUREZA TIPO 7/8",
  ],
} as const satisfies Template;

const colorPool = {
  "Castleton green": "#006954",
  "Payne's gray": "#0e5e7a",
  "Atomic tangerine": "#f7915e",
  Jasmine: "#ffd374",
  "Prussian blue": "#063447",
  Auburn: "#963831",
  Eggplant: "#4a3941",
  Celadon: "#b9d29d",
  "Rich black": "#001219",
  "Midnight green": "#005f73",
  "Dark cyan": "#0a9396",
  "Tiffany Blue": "#94d2bd",
  Vanilla: "#e9d8a6",
  Gamboge: "#ee9b00",
  "Alloy orange": "#ca6702",
  Rust: "#bb3e03",
  Rufous: "#ae2012",
} as const;

const colors = Object.values(colorPool);

export const initialProducts = [
  arabicaPronto,
  arabicaMercadoInterno,
  arabicaBicaCorrida,
  robustaPronto,
  robustaMercadoInterno,
  robustaBicaCorrida,
].flatMap(({ specification, names }) =>
  names.map((name, index) => ({
    name,
    type: specification.type,
    category: specification.category,
    mainColor: colors[index % colors.length]!,
  })),
);
