import Link from "next/link";
import {
  Clock,
  FileText,
  Layers,
  ArrowRight,
  Mail,
  ClipboardList,
  Send,
  Shield,
} from "lucide-react";
import { MODES, SITE } from "@/lib/config";
import { SiteHeader, SiteFooter } from "@/components/blind-test/SiteHeader";

export default function Home() {
  return (
    <div className="page-shell">
      <SiteHeader />

      <main className="page-main space-y-10">
        {/* Hero */}
        <section className="card-padded space-y-4 border-primary/20">
          <span className="badge-primary">評価者向け</span>
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900 leading-snug">
            古文書転写の
            <br className="md:hidden" />
            読取評価にご協力ください
          </h2>
          <p className="section-lead max-w-prose">
            中世写本から抽出した転写テキストを読み、「手順・処方として読めるか」を判定していただく独立評価です。
            専門知識は不要で、約15分から参加できます。
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <Shield className="w-4 h-4 text-primary" />
              盲検中立（仮説非開示）
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <ClipboardList className="w-4 h-4 text-primary" />
              正解・不正解の試験ではありません
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="space-y-4">
          <h2 className="section-title">3ステップで完了</h2>
          <ol className="space-y-3">
            {[
              {
                icon: Layers,
                text: "コースを選ぶ（下の3つから1つ）",
              },
              {
                icon: FileText,
                text: "転写テキストを1行ずつ読み、質問に答える",
              },
              {
                icon: Send,
                text: "結果をダウンロードしてメールで送る",
              },
            ].map(({ icon: Icon, text }, i) => (
              <li key={text} className="card-padded flex items-start gap-4">
                <span className="step-number">{i + 1}</span>
                <div className="flex items-start gap-3 pt-1.5 min-w-0">
                  <Icon
                    className="w-5 h-5 text-primary shrink-0 mt-0.5"
                    aria-hidden
                  />
                  <span className="text-base text-stone-800">{text}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Courses */}
        <section className="space-y-4">
          <h2 className="section-title">コースを選ぶ</h2>
          <div className="grid gap-4">
            {(
              Object.entries(MODES) as [
                keyof typeof MODES,
                (typeof MODES)[keyof typeof MODES],
              ][]
            ).map(([key, cfg]) => (
              <Link
                key={key}
                href={`/evaluate?mode=${key}`}
                className="group card-padded hover:border-primary transition-all block"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg md:text-xl font-bold text-stone-900">
                        {cfg.label}
                      </h3>
                      {key === "pilot-lite" && (
                        <span className="badge-accent">おすすめ</span>
                      )}
                    </div>
                    <p className="text-sm md:text-base text-stone-600">
                      {cfg.description}
                    </p>
                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-500">
                      <span className="inline-flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-stone-400" />
                        {cfg.lines}行
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-stone-400" />
                        {cfg.minutes}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-stone-400" />
                        {cfg.lite ? "質問2つのみ" : "語の位置指定あり"}
                      </span>
                    </div>
                  </div>
                  <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary bg-primary-light shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <ArrowRight className="w-5 h-5 text-primary group-hover:text-white" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Rules */}
        <section className="alert-warning space-y-3">
          <p className="font-bold text-amber-950 text-base">評価中の注意</p>
          <ul className="text-sm text-amber-900 space-y-2">
            <li className="flex gap-2">
              <span className="font-bold shrink-0">1.</span>
              転写や行IDをウェブ検索しないでください
            </li>
            <li className="flex gap-2">
              <span className="font-bold shrink-0">2.</span>
              正解・不正解の試験ではありません
            </li>
            <li className="flex gap-2">
              <span className="font-bold shrink-0">3.</span>
              専門知識は不要です。素朴な読み取りが最も重要です
            </li>
            <li className="flex gap-2">
              <span className="font-bold shrink-0">4.</span>
              途中でブラウザを閉じても、同じコースから再開できます
            </li>
          </ul>
        </section>

        {/* Contact */}
        <section className="card-padded space-y-3">
          <p className="font-bold text-stone-900 inline-flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            お問い合わせ
          </p>
          <p className="text-sm text-stone-700">
            {SITE.researcher}
            <br />
            {SITE.affiliation}
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="inline-block text-primary font-medium underline underline-offset-2 break-all"
          >
            {SITE.email}
          </a>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
