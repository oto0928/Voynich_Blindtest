# 古文書転写 読取評価 — 評価者向けWebサイト

中世写本転写の盲検（独立評価）を、ZIP/JSONなしでブラウザから完了できるサイトです。

## 起動方法

```bash
cd /Users/oto/Voynich_Blindtest
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開いてください。

## コース

| コース | URL | 行数 | 目安 |
|--------|-----|------|------|
| かんたん版（おすすめ） | `/evaluate?mode=pilot-lite` | 10 | 約15分 |
| パイロット標準版 | `/evaluate?mode=pilot-full` | 10 | 約30分 |
| フル版 | `/evaluate?mode=full` | 44 | 2〜4時間 |

## 評価者の流れ

1. トップページでコースを選ぶ
2. イニシャルを入力
3. 1行ずつ質問に回答（自動保存）
4. 完了画面で JSON をダウンロード or コピー
5. `toa0928koron@icloud.com` にメール送付

## 研究側（採点）

返送された JSON を Voynich リポジトリで採点:

```bash
# パイロット
python3 analysis/blind_challenge_score.py \
  --key data/processed/blind_challenge_pilot_key.json \
  responses/EVALUATOR.json

# フル44行
python3 analysis/blind_challenge_score.py responses/EVALUATOR.json
```

## データ更新

チャレンジデータを再同期:

```bash
cp /Users/oto/Voynich/data/public/blind_challenge_pilot/challenge.json data/pilot-challenge.json
cp /Users/oto/Voynich/data/public/blind_challenge_dist/challenge.json data/full-challenge.json
```

## デプロイ（Vercel）

```bash
vercel
```

評価者にはデプロイ後の URL を共有してください。
