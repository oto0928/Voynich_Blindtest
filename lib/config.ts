export const SITE = {
  title: "古文書転写 読取評価",
  subtitle: "独立評価（盲検）",
  researcher: "竹内 音碧",
  affiliation: "早稲田大学人間科学部人間情報学科",
  email: "toa0928koron@icloud.com",
} as const;

export const MODES = {
  "pilot-lite": {
    id: "pilot-lite" as const,
    label: "かんたん版",
    lines: 10,
    minutes: "約15分",
    description: "10行・質問2つだけ。はじめての方はこちら。",
    lite: true,
    pilot: true,
    tokenPick: false,
  },
  "pilot-full": {
    id: "pilot-full" as const,
    label: "パイロット標準版",
    lines: 10,
    minutes: "約30〜45分",
    description: "10行・語の位置指定あり。詳しく評価したい方向け。",
    lite: false,
    pilot: true,
    tokenPick: true,
  },
  full: {
    id: "full" as const,
    label: "フル版",
    lines: 44,
    minutes: "約2〜4時間",
    description: "全44行。パイロット後の続き、または時間に余裕がある方向け。",
    lite: false,
    pilot: false,
    tokenPick: true,
  },
} as const;

export const CHOICE_LABELS: Record<
  import("./types").ChoiceValue,
  { label: string; hint: string }
> = {
  yes: { label: "はい", hint: "明確に該当する" },
  partial: { label: "一部", hint: "部分的に該当、または曖昧" },
  no: { label: "いいえ", hint: "該当しない" },
  unsure: { label: "わからない", hint: "判断できない" },
};

export const PROCEDURAL_HELP = {
  title: "手順・処方・技術記述として読めますか？",
  examples: [
    "原料を入れて、加熱し、留出する、のような操作の流れ",
    "列挙やラベルだけの行は「いいえ」",
  ],
};

export const CHAIN_HELP = {
  title: "「原料 → 処理 → 製品」の順序が見えますか？",
  examples: [
    "出発する物質 → 変換・操作 → 得られる結果・製品",
    "二段だけ、または順序が逆なら「一部」",
  ],
};
