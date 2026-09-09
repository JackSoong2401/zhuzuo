export type BeadCategory =
  | "jade"
  | "agate"
  | "wood"
  | "crystal"
  | "pearl"
  | "metal"

export type BeadSheen =
  | "jade"
  | "wood"
  | "metal"
  | "pearl"
  | "crystal"
  | "amber"

export type Bead = {
  id: string
  name: string
  origin: string
  category: BeadCategory
  sizeMm: number
  price: number
  sheen: BeadSheen
  gradient: string
  overlay?: string
  description: string
}

export const CATEGORIES: { id: BeadCategory | "all"; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "jade", label: "玉石" },
  { id: "agate", label: "玛瑙" },
  { id: "wood", label: "木质" },
  { id: "crystal", label: "水晶" },
  { id: "pearl", label: "珍珠" },
  { id: "metal", label: "金珠" },
]

export const BEADS: Bead[] = [
  {
    id: "hetian-white-8",
    name: "和田白玉",
    origin: "新疆",
    category: "jade",
    sizeMm: 8,
    price: 88,
    sheen: "jade",
    gradient:
      "radial-gradient(circle at 32% 28%, #fffdf6 0%, #f4ecd8 42%, #e4d4b4 72%, #cbb58c 100%)",
    description: "脂粉温润，盘久更有油性。",
  },
  {
    id: "hetian-celadon-8",
    name: "和田青玉",
    origin: "新疆",
    category: "jade",
    sizeMm: 8,
    price: 72,
    sheen: "jade",
    gradient:
      "radial-gradient(circle at 30% 26%, #e7eedc 0%, #c5d0b0 40%, #8fa37a 75%, #6a8058 100%)",
    description: "青白过渡自然，适合日常。",
  },
  {
    id: "spinach-jade-10",
    name: "碧玉",
    origin: "俄罗斯",
    category: "jade",
    sizeMm: 10,
    price: 128,
    sheen: "jade",
    gradient:
      "radial-gradient(circle at 32% 28%, #8fb36e 0%, #4f7a3e 38%, #2f4a28 78%, #1c2e1a 100%)",
    overlay:
      "radial-gradient(circle at 68% 70%, transparent 40%, rgba(20,40,12,0.35) 100%)",
    description: "菠菜绿，颗粒更有分量。",
  },
  {
    id: "hetian-white-10",
    name: "和田白玉",
    origin: "新疆",
    category: "jade",
    sizeMm: 10,
    price: 138,
    sheen: "jade",
    gradient:
      "radial-gradient(circle at 32% 28%, #fffef8 0%, #f6ecda 40%, #e6d2ae 70%, #c4aa80 100%)",
    description: "10mm 更显脂白，适合主珠。",
  },
  {
    id: "nanhong-8",
    name: "南红玛瑙",
    origin: "保山",
    category: "agate",
    sizeMm: 8,
    price: 68,
    sheen: "crystal",
    gradient:
      "radial-gradient(circle at 30% 26%, #ffb08a 0%, #e35a3a 36%, #c43020 70%, #7a140e 100%)",
    overlay:
      "linear-gradient(125deg, transparent 40%, rgba(255,210,170,0.28) 52%, transparent 62%)",
    description: "柿子红，颜色饱满不发闷。",
  },
  {
    id: "nanhong-10",
    name: "南红玛瑙",
    origin: "保山",
    category: "agate",
    sizeMm: 10,
    price: 98,
    sheen: "crystal",
    gradient:
      "radial-gradient(circle at 30% 26%, #ffc09a 0%, #e45a36 34%, #b52618 72%, #6e100c 100%)",
    description: "10mm 南红，更有存在感。",
  },
  {
    id: "cinnabar-8",
    name: "朱砂",
    origin: "湖南",
    category: "agate",
    sizeMm: 8,
    price: 42,
    sheen: "jade",
    gradient:
      "radial-gradient(circle at 32% 28%, #e07068 0%, #c0392b 40%, #8e1b14 78%, #4a0c08 100%)",
    description: "正朱砂色，适合压阵。",
  },
  {
    id: "black-agate-8",
    name: "黑玛瑙",
    origin: "巴西",
    category: "agate",
    sizeMm: 8,
    price: 18,
    sheen: "crystal",
    gradient:
      "radial-gradient(circle at 30% 24%, #5a5a5a 0%, #2a2a2a 40%, #111 78%, #000 100%)",
    description: "低调纯黑，用来压色。",
  },
  {
    id: "zitan-8",
    name: "小叶紫檀",
    origin: "印度",
    category: "wood",
    sizeMm: 8,
    price: 28,
    sheen: "wood",
    gradient:
      "radial-gradient(circle at 30% 26%, #8a3a32 0%, #5a1e1a 42%, #3a100e 78%, #1a0706 100%)",
    overlay:
      "repeating-linear-gradient(118deg, transparent 0 3px, rgba(0,0,0,0.18) 3px 4px)",
    description: "棕红细密，盘久出包浆。",
  },
  {
    id: "agarwood-8",
    name: "沉香",
    origin: "海南",
    category: "wood",
    sizeMm: 8,
    price: 56,
    sheen: "wood",
    gradient:
      "radial-gradient(circle at 30% 28%, #c4a078 0%, #8a6240 40%, #5a3a24 75%, #2e1c12 100%)",
    overlay:
      "repeating-linear-gradient(112deg, transparent 0 4px, rgba(80,40,16,0.22) 4px 5px)",
    description: "油脂线自然，气味清雅。",
  },
  {
    id: "bodhi-8",
    name: "星月菩提",
    origin: "海南",
    category: "wood",
    sizeMm: 8,
    price: 16,
    sheen: "wood",
    gradient:
      "radial-gradient(circle at 32% 28%, #f0e6d0 0%, #d8c8a4 40%, #b89a72 75%, #8a6e4a 100%)",
    overlay:
      "radial-gradient(circle at 50% 52%, transparent 18%, rgba(90,60,30,0.18) 22%, transparent 26%)",
    description: "象牙底色，星月点清晰。",
  },
  {
    id: "lapis-8",
    name: "青金石",
    origin: "阿富汗",
    category: "crystal",
    sizeMm: 8,
    price: 48,
    sheen: "crystal",
    gradient:
      "radial-gradient(circle at 30% 26%, #4f74c8 0%, #1f3f8a 40%, #132868 75%, #0a1538 100%)",
    overlay:
      "radial-gradient(circle at 62% 38%, rgba(212,175,80,0.85) 0 1.2px, transparent 1.8px), radial-gradient(circle at 28% 64%, rgba(240,220,140,0.7) 0 0.9px, transparent 1.5px)",
    description: "帝王蓝，带金线矿点。",
  },
  {
    id: "turquoise-8",
    name: "绿松石",
    origin: "湖北",
    category: "crystal",
    sizeMm: 8,
    price: 86,
    sheen: "jade",
    gradient:
      "radial-gradient(circle at 30% 26%, #9fe0d2 0%, #3cb8a8 38%, #1e7f86 72%, #0e4a52 100%)",
    overlay:
      "linear-gradient(130deg, transparent 30%, rgba(20,60,70,0.22) 48%, transparent 62%)",
    description: "高瓷蓝绿，铁线自然。",
  },
  {
    id: "amber-8",
    name: "蜜蜡",
    origin: "波罗的海",
    category: "crystal",
    sizeMm: 8,
    price: 76,
    sheen: "amber",
    gradient:
      "radial-gradient(circle at 30% 26%, #ffe08a 0%, #f0b430 40%, #d08010 72%, #a05808 100%)",
    description: "鸡油黄，光线能透进去。",
  },
  {
    id: "blood-amber-8",
    name: "血珀",
    origin: "缅甸",
    category: "crystal",
    sizeMm: 8,
    price: 92,
    sheen: "amber",
    gradient:
      "radial-gradient(circle at 30% 26%, #ff8a50 0%, #d43018 42%, #8e120c 78%, #4a0806 100%)",
    description: "血红珀光，光线里发亮。",
  },
  {
    id: "obsidian-8",
    name: "黑曜石",
    origin: "墨西哥",
    category: "crystal",
    sizeMm: 8,
    price: 22,
    sheen: "crystal",
    gradient:
      "radial-gradient(circle at 28% 22%, #6a6a6e 0%, #242428 36%, #0a0a0c 78%, #000 100%)",
    overlay:
      "linear-gradient(125deg, transparent 42%, rgba(180,200,255,0.22) 50%, transparent 58%)",
    description: "玻璃光泽，用来压黑。",
  },
  {
    id: "amethyst-8",
    name: "紫水晶",
    origin: "乌拉圭",
    category: "crystal",
    sizeMm: 8,
    price: 36,
    sheen: "crystal",
    gradient:
      "radial-gradient(circle at 30% 26%, #d8b8f0 0%, #8a58c8 38%, #5a2a96 72%, #2e1458 100%)",
    description: "浅紫到深紫，晶莹通透。",
  },
  {
    id: "strawberry-8",
    name: "草莓晶",
    origin: "马达加斯加",
    category: "crystal",
    sizeMm: 8,
    price: 32,
    sheen: "crystal",
    gradient:
      "radial-gradient(circle at 30% 26%, #ffd4d0 0%, #e87890 42%, #c44868 75%, #8a2848 100%)",
    overlay:
      "radial-gradient(circle at 40% 48%, rgba(160,30,50,0.45) 0 1.4px, transparent 2px), radial-gradient(circle at 62% 36%, rgba(140,20,40,0.35) 0 1px, transparent 1.6px)",
    description: "粉红底带草莓点。",
  },
  {
    id: "moonstone-8",
    name: "月光石",
    origin: "斯里兰卡",
    category: "crystal",
    sizeMm: 8,
    price: 44,
    sheen: "pearl",
    gradient:
      "radial-gradient(circle at 30% 24%, #f6f8ff 0%, #dce6f4 40%, #b8c8dc 72%, #8a98b0 100%)",
    overlay:
      "linear-gradient(125deg, transparent 30%, rgba(180,230,255,0.45) 48%, rgba(255,200,230,0.2) 58%, transparent 70%)",
    description: "转动时有一道蓝光。",
  },
  {
    id: "garnet-8",
    name: "石榴石",
    origin: "莫桑比克",
    category: "crystal",
    sizeMm: 8,
    price: 38,
    sheen: "crystal",
    gradient:
      "radial-gradient(circle at 30% 26%, #e06070 0%, #a01828 40%, #6a0c18 75%, #3a060c 100%)",
    description: "酒红透明，颗粒均匀。",
  },
  {
    id: "tiger-eye-8",
    name: "虎眼石",
    origin: "南非",
    category: "crystal",
    sizeMm: 8,
    price: 24,
    sheen: "crystal",
    gradient:
      "radial-gradient(circle at 30% 26%, #e8c070 0%, #b07828 40%, #6e4814 75%, #3a2408 100%)",
    overlay:
      "repeating-linear-gradient(100deg, transparent 0 3px, rgba(255,220,140,0.28) 3px 5px, rgba(80,40,8,0.2) 5px 7px)",
    description: "猫眼闪光，黄棕条带。",
  },
  {
    id: "aquamarine-8",
    name: "海蓝宝",
    origin: "巴西",
    category: "crystal",
    sizeMm: 8,
    price: 52,
    sheen: "crystal",
    gradient:
      "radial-gradient(circle at 30% 26%, #d8f4ff 0%, #7ec8e8 38%, #3a88b8 72%, #1c5478 100%)",
    description: "海水蓝，干净通透。",
  },
  {
    id: "pearl-white-8",
    name: "淡水珍珠",
    origin: "诸暨",
    category: "pearl",
    sizeMm: 8,
    price: 48,
    sheen: "pearl",
    gradient:
      "radial-gradient(circle at 32% 28%, #fffef8 0%, #f4eadc 40%, #e0c8b0 72%, #c49a80 100%)",
    overlay:
      "linear-gradient(125deg, transparent 28%, rgba(220,240,255,0.5) 46%, rgba(255,210,230,0.25) 58%, transparent 72%)",
    description: "近圆强光，皮光细腻。",
  },
  {
    id: "pearl-pink-7",
    name: "粉珍珠",
    origin: "诸暨",
    category: "pearl",
    sizeMm: 7,
    price: 58,
    sheen: "pearl",
    gradient:
      "radial-gradient(circle at 32% 28%, #fff6f4 0%, #f4d0c8 40%, #e0a8a0 72%, #c48078 100%)",
    overlay:
      "linear-gradient(125deg, transparent 30%, rgba(255,220,230,0.55) 50%, transparent 68%)",
    description: "樱花粉，温柔不甜腻。",
  },
  {
    id: "coral-8",
    name: "红珊瑚",
    origin: "台湾",
    category: "pearl",
    sizeMm: 8,
    price: 96,
    sheen: "jade",
    gradient:
      "radial-gradient(circle at 30% 26%, #ff9a88 0%, #e04a4a 40%, #b02028 75%, #701018 100%)",
    description: "珊瑚红，适合点缀。",
  },
  {
    id: "gold-spacer-4",
    name: "18K 金隔片",
    origin: "深圳",
    category: "metal",
    sizeMm: 4,
    price: 28,
    sheen: "metal",
    gradient:
      "radial-gradient(circle at 30% 24%, #ffe9a8 0%, #e8c04a 38%, #c49218 70%, #8a6408 100%)",
    description: "扁隔片，用来透气分色。",
  },
  {
    id: "gold-bead-6",
    name: "足金隔珠",
    origin: "深圳",
    category: "metal",
    sizeMm: 6,
    price: 88,
    sheen: "metal",
    gradient:
      "radial-gradient(circle at 30% 24%, #fff3c0 0%, #f0c84a 36%, #d49a12 70%, #9a6808 100%)",
    description: "小金珠，作腰珠或主点。",
  },
  {
    id: "silver-spacer-4",
    name: "银隔片",
    origin: "云南",
    category: "metal",
    sizeMm: 4,
    price: 12,
    sheen: "metal",
    gradient:
      "radial-gradient(circle at 30% 24%, #f6f8fc 0%, #d0d8e0 40%, #9aa4b0 72%, #6a7480 100%)",
    description: "素银隔片，冷静衬玉。",
  },
  {
    id: "silver-bead-6",
    name: "素银珠",
    origin: "云南",
    category: "metal",
    sizeMm: 6,
    price: 22,
    sheen: "metal",
    gradient:
      "radial-gradient(circle at 30% 24%, #ffffff 0%, #d8dee6 40%, #a8b0bc 72%, #6e7c88 100%)",
    description: "亮银圆珠，点缀留白。",
  },
]

export const BEAD_MAP = Object.fromEntries(BEADS.map((bead) => [bead.id, bead]))

export function getBead(id: string): Bead {
  const bead = BEAD_MAP[id]
  if (!bead) {
    throw new Error(`Unknown bead: ${id}`)
  }
  return bead
}

export type Template = {
  id: string
  name: string
  hint: string
  pattern: string[]
}

export const TEMPLATES: Template[] = [
  {
    id: "nanhong-sun",
    name: "南红暖日",
    hint: "柿红 + 金隔",
    pattern: [
      "nanhong-8",
      "nanhong-8",
      "gold-spacer-4",
      "nanhong-8",
      "gold-spacer-4",
    ],
  },
  {
    id: "hetian-quiet",
    name: "青白雅",
    hint: "白玉青玉相间",
    pattern: ["hetian-white-8", "hetian-celadon-8", "silver-spacer-4"],
  },
  {
    id: "zitan-gold",
    name: "紫檀金",
    hint: "木质包浆 + 金",
    pattern: ["zitan-8", "zitan-8", "zitan-8", "gold-bead-6"],
  },
  {
    id: "moon-pearl",
    name: "月光静",
    hint: "月光石与珍珠",
    pattern: ["moonstone-8", "pearl-white-8", "silver-spacer-4"],
  },
]
