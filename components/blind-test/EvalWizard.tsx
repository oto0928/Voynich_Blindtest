"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import pilotChallenge from "@/data/pilot-challenge.json";
import fullChallenge from "@/data/full-challenge.json";
import type {
  ChallengeData,
  EvalMode,
  EvalSession,
  LineResponse,
  TokenTag,
} from "@/lib/types";
import { MODES, SITE, PROCEDURAL_HELP, CHAIN_HELP } from "@/lib/config";
import {
  buildExport,
  downloadJson,
  emptyLineResponse,
  isLineComplete,
  storageKey,
} from "@/lib/response-export";
import { ChoiceGroup } from "@/components/blind-test/ChoiceGroup";
import { TokenPicker } from "@/components/blind-test/TokenPicker";
import { ProgressBar } from "@/components/blind-test/ProgressBar";
import { SiteHeader, SiteFooter } from "@/components/blind-test/SiteHeader";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Copy,
  CheckCircle2,
  AlertCircle,
  Save,
  User,
  Flag,
} from "lucide-react";

type WizardStep = "intro" | "profile" | "evaluate" | "complete";

const VALID_MODES: EvalMode[] = ["pilot-lite", "pilot-full", "full"];

function getChallenge(mode: EvalMode): ChallengeData {
  return mode === "full"
    ? (fullChallenge as ChallengeData)
    : (pilotChallenge as ChallengeData);
}

function initSession(mode: EvalMode): EvalSession {
  const challenge = getChallenge(mode);
  return {
    mode,
    evaluator_id: "",
    evaluator_background: "",
    currentStep: 0,
    responses: challenge.lines.map((l) =>
      emptyLineResponse(l.challenge_id, l.line_ref)
    ),
    started_at: new Date().toISOString(),
  };
}

export default function EvalWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const modeParam = searchParams.get("mode") as EvalMode | null;
  const mode: EvalMode =
    modeParam && VALID_MODES.includes(modeParam) ? modeParam : "pilot-lite";

  const modeConfig = MODES[mode];
  const challenge = useMemo(() => getChallenge(mode), [mode]);
  const totalLines = challenge.lines.length;

  const [wizardStep, setWizardStep] = useState<WizardStep>("intro");
  const [session, setSession] = useState<EvalSession>(() => initSession(mode));
  const [lineIndex, setLineIndex] = useState(0);
  const [activeTag, setActiveTag] = useState<TokenTag>(null);
  const [copied, setCopied] = useState(false);
  const [savedHint, setSavedHint] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey(mode));
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as EvalSession;
        if (parsed.mode === mode && parsed.responses.length === totalLines) {
          setSession(parsed);
          if (parsed.evaluator_id) {
            setWizardStep("evaluate");
          }
        }
      } catch {
        /* ignore */
      }
    }
  }, [mode, totalLines]);

  const persist = useCallback(
    (next: EvalSession) => {
      setSession(next);
      localStorage.setItem(storageKey(mode), JSON.stringify(next));
      setSavedHint(true);
      const t = setTimeout(() => setSavedHint(false), 2000);
      return () => clearTimeout(t);
    },
    [mode]
  );

  const currentLine = challenge.lines[lineIndex];
  const currentResponse = session.responses[lineIndex];

  const completedCount = session.responses.filter((r) =>
    isLineComplete(r, mode, modeConfig.tokenPick)
  ).length;

  const updateResponse = (patch: Partial<LineResponse>) => {
    const responses = [...session.responses];
    responses[lineIndex] = { ...responses[lineIndex], ...patch };
    persist({ ...session, responses });
  };

  const canProceedLine =
    currentResponse.is_procedural &&
    currentResponse.has_source_process_product_chain;

  const exportPayload = buildExport(session);

  const handleDownload = () => {
    const id = session.evaluator_id || "anonymous";
    const suffix = mode === "full" ? "full" : "pilot";
    downloadJson(exportPayload, `blind_eval_${id}_${suffix}.json`);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(exportPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const startEvaluate = () => {
    if (!session.evaluator_id.trim()) return;
    persist({ ...session, evaluator_id: session.evaluator_id.trim() });
    setWizardStep("evaluate");
    setLineIndex(0);
  };

  const finishAll = () => {
    persist({ ...session, responses: session.responses });
    setWizardStep("complete");
  };

  const savedBadge = savedHint ? (
    <span className="badge border-success text-success bg-success-light inline-flex items-center gap-1">
      <Save className="w-3.5 h-3.5" /> 保存済み
    </span>
  ) : undefined;

  // ── Intro ──
  if (wizardStep === "intro") {
    return (
      <div className="page-shell">
        <SiteHeader
          subtitle={`${modeConfig.label} — 開始前`}
          backHref="/"
          badge={savedBadge}
        />
        <main className="page-main space-y-6">
          <section className="card-padded space-y-4">
            <h2 className="section-title">この評価について</h2>
            <p className="section-lead">
              中世写本から抽出した転写テキスト{" "}
              <strong className="text-primary">{totalLines}行</strong>
              を読み、各行が
              <strong>手順・処方・技術記述</strong>
              として読めるかを判定していただきます。
            </p>
          </section>

          <section className="alert-warning space-y-3">
            <p className="font-bold text-amber-950 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              評価中のルール
            </p>
            <ul className="text-sm text-amber-900 space-y-2">
              <li>転写や行IDをウェブ検索しない</li>
              <li>正解・不正解の試験ではありません</li>
              <li>専門知識は不要です</li>
              <li>途中保存されます。ブラウザを閉じても再開できます</li>
            </ul>
          </section>

          <section className="card-padded space-y-3 border-primary/30">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              選択中のコース
            </p>
            <p className="text-xl font-bold text-primary">{modeConfig.label}</p>
            <p className="text-stone-600">{modeConfig.description}</p>
            <p className="text-sm text-stone-500">
              {totalLines}行 · 目安 {modeConfig.minutes}
            </p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-sm text-primary font-medium hover:underline"
            >
              コースを変更する
            </button>
          </section>

          <button
            type="button"
            onClick={() => setWizardStep("profile")}
            className="btn-primary w-full"
          >
            はじめる
            <ChevronRight className="w-5 h-5" />
          </button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // ── Profile ──
  if (wizardStep === "profile") {
    return (
      <div className="page-shell">
        <SiteHeader subtitle="あなたの情報" backHref="/" />
        <main className="page-main space-y-6">
          <section className="card-padded space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <User className="w-5 h-5" />
              <h2 className="section-title">評価者情報</h2>
            </div>
            <p className="section-lead text-sm">
              イニシャルのみで構いません。結果ファイル名に使用します。
            </p>
          </section>

          <div className="card-padded space-y-5">
            <label className="block space-y-2">
              <span className="label-text">イニシャル（必須）</span>
              <input
                type="text"
                maxLength={8}
                placeholder="例: YT"
                value={session.evaluator_id}
                onChange={(e) =>
                  setSession({ ...session, evaluator_id: e.target.value })
                }
                className="input-field"
              />
              <span className="hint-text">本名は不要です</span>
            </label>
            <label className="block space-y-2">
              <span className="label-text">背景（任意）</span>
              <input
                type="text"
                placeholder="例: 特になし / 科学史 / 言語学"
                value={session.evaluator_background}
                onChange={(e) =>
                  setSession({
                    ...session,
                    evaluator_background: e.target.value,
                  })
                }
                className="input-field"
              />
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setWizardStep("intro")}
              className="btn-secondary px-4"
            >
              <ChevronLeft className="w-5 h-5" /> 戻る
            </button>
            <button
              type="button"
              disabled={!session.evaluator_id.trim()}
              onClick={startEvaluate}
              className="btn-primary flex-1"
            >
              評価を開始
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // ── Complete ──
  if (wizardStep === "complete") {
    return (
      <div className="page-shell">
        <SiteHeader subtitle="完了" badge={savedBadge} />
        <main className="page-main space-y-6">
          <section className="card-padded space-y-3 border-success/40 bg-success-light/30">
            <div className="flex items-center gap-3 text-success">
              <CheckCircle2 className="w-10 h-10 shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-stone-900">
                  完了しました
                </h2>
                <p className="text-sm text-stone-600 mt-1">
                  ご協力ありがとうございました
                </p>
              </div>
            </div>
          </section>

          <p className="section-lead">
            以下のいずれかの方法で、結果を研究代表者にお送りください。
          </p>

          <div className="card-padded space-y-4">
            <h3 className="font-bold text-stone-900">
              方法1: JSONファイルをダウンロード
            </h3>
            <p className="text-sm text-stone-600">
              ファイルをメールに添付して送付してください。
            </p>
            <button type="button" onClick={handleDownload} className="btn-primary w-full">
              <Download className="w-5 h-5" />
              JSONをダウンロード
            </button>
          </div>

          <div className="card-padded space-y-4">
            <h3 className="font-bold text-stone-900">
              方法2: 内容をコピー
            </h3>
            <p className="text-sm text-stone-600">
              メール本文に貼り付けて送付してください。
            </p>
            <button type="button" onClick={handleCopy} className="btn-outline w-full">
              <Copy className="w-5 h-5" />
              {copied ? "コピーしました" : "JSONをコピー"}
            </button>
          </div>

          <div className="card-padded text-sm space-y-2">
            <p>
              <span className="font-semibold text-stone-800">送付先: </span>
              <a
                href={`mailto:${SITE.email}?subject=${encodeURIComponent("古文書転写評価結果 " + session.evaluator_id)}`}
                className="text-primary underline underline-offset-2 break-all"
              >
                {SITE.email}
              </a>
            </p>
            <p className="text-stone-600">
              担当: {SITE.researcher}（{SITE.affiliation}）
            </p>
          </div>

          {mode !== "full" && (
            <div className="alert-info text-sm">
              <p className="font-bold text-primary">フル版（44行）もご協力いただけます</p>
              <p className="text-stone-700 mt-1">
                時間に余裕があれば、
                <a href="/" className="text-primary underline ml-1">
                  トップページ
                </a>
                から「フル版」を選んで続けてください。
              </p>
            </div>
          )}
        </main>
        <SiteFooter />
      </div>
    );
  }

  // ── Evaluate ──
  return (
    <div className="page-shell">
      <SiteHeader
        subtitle={`${modeConfig.label} — 評価中`}
        backHref="/"
        badge={savedBadge}
      />
      <main className="page-main space-y-5 pb-10">
        <ProgressBar
          current={completedCount}
          total={totalLines}
          label="回答済み"
          lineIndex={lineIndex}
        />

        <article className="card overflow-hidden">
          <div className="px-4 py-3 bg-primary text-white flex justify-between items-center">
            <span className="text-sm font-semibold flex items-center gap-2">
              <Flag className="w-4 h-4" />
              行 {lineIndex + 1} / {totalLines}
            </span>
            <span className="text-xs font-mono opacity-80">
              {currentLine.line_ref}
            </span>
          </div>

          <div className="p-4 md:p-6 space-y-7">
            <div>
              <p className="label-text mb-2">転写テキスト</p>
              <p className="transcription-block">{currentLine.eva}</p>
            </div>

            <ChoiceGroup
              index={1}
              name="procedural"
              label={PROCEDURAL_HELP.title}
              help={PROCEDURAL_HELP.examples}
              value={currentResponse.is_procedural}
              onChange={(v) => updateResponse({ is_procedural: v })}
            />

            <ChoiceGroup
              index={2}
              name="chain"
              label={CHAIN_HELP.title}
              help={CHAIN_HELP.examples}
              value={currentResponse.has_source_process_product_chain}
              onChange={(v) =>
                updateResponse({ has_source_process_product_chain: v })
              }
            />

            {modeConfig.tokenPick && (
              <>
                <TokenPicker
                  line={currentLine}
                  response={currentResponse}
                  activeTag={activeTag}
                  onActiveTagChange={setActiveTag}
                  onUpdate={(r) => {
                    const responses = [...session.responses];
                    responses[lineIndex] = r;
                    persist({ ...session, responses });
                  }}
                />
                <div className="space-y-2">
                  <span className="label-text">
                    自信度（1=低い 〜 5=高い）
                  </span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() =>
                          updateResponse({ confidence_1_to_5: n })
                        }
                        className={`min-w-[44px] min-h-[44px] rounded-[var(--radius-button)] border-2 font-bold transition-all ${
                          currentResponse.confidence_1_to_5 === n
                            ? "border-primary bg-primary-light text-primary"
                            : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <label className="block space-y-2">
              <span className="label-text">メモ（任意）</span>
              <textarea
                rows={2}
                value={currentResponse.free_notes}
                onChange={(e) =>
                  updateResponse({ free_notes: e.target.value })
                }
                placeholder="気づいたことがあれば自由に"
                className="input-field min-h-[80px] py-3 resize-y"
              />
            </label>
          </div>
        </article>

        {!canProceedLine && (
          <p className="text-sm text-stone-500 text-center">
            質問1・2に回答すると次へ進めます
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            disabled={lineIndex === 0}
            onClick={() => {
              setLineIndex((i) => i - 1);
              setActiveTag(null);
            }}
            className="btn-secondary px-4"
          >
            <ChevronLeft className="w-5 h-5" /> 前へ
          </button>

          {lineIndex < totalLines - 1 ? (
            <button
              type="button"
              disabled={!canProceedLine}
              onClick={() => {
                setLineIndex((i) => i + 1);
                setActiveTag(null);
              }}
              className="btn-primary flex-1"
            >
              次の行
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={completedCount < totalLines}
              onClick={finishAll}
              className="btn-primary flex-1"
            >
              <CheckCircle2 className="w-5 h-5" />
              完了して送信準備
            </button>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
