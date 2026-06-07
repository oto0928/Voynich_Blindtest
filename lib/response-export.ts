import type { EvalMode, EvalSession, ExportPayload, LineResponse } from "./types";
import { MODES } from "./config";

export function emptyLineResponse(
  challenge_id: string,
  line_ref: string
): LineResponse {
  return {
    challenge_id,
    line_ref,
    is_procedural: null,
    procedural_scale: null,
    has_source_process_product_chain: null,
    source_token_positions: [],
    process_token_positions: [],
    product_token_positions: [],
    confidence_1_to_5: null,
    free_notes: "",
  };
}

export function buildExport(session: EvalSession): ExportPayload {
  const mode = MODES[session.mode];
  const payload: ExportPayload = {
    version: mode.lite ? "1.1-lite" : mode.pilot ? "1.1-pilot" : "1.1",
    evaluator_id: session.evaluator_id,
    evaluator_background: session.evaluator_background,
    submitted_at: new Date().toISOString(),
    responses: session.responses.map((r) => {
      const base = { ...r };
      if (mode.lite) {
        return {
          ...base,
          source_token_positions: [],
          process_token_positions: [],
          product_token_positions: [],
          confidence_1_to_5: null,
        };
      }
      if (!mode.tokenPick) {
        return base;
      }
      return base;
    }),
  };

  if (mode.pilot) payload.pilot = true;
  if (mode.lite) {
    payload.lite_mode = true;
    payload.note =
      "Only is_procedural and has_source_process_product_chain required";
  }

  return payload;
}

export function downloadJson(data: ExportPayload, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function storageKey(mode: EvalMode) {
  return `blind-eval-session-${mode}`;
}

export function isLineComplete(
  line: LineResponse,
  mode: EvalMode,
  requireTokens: boolean
): boolean {
  if (!line.is_procedural || !line.has_source_process_product_chain) {
    return false;
  }
  if (MODES[mode].lite) return true;
  if (!requireTokens) return true;
  const hasChain =
    line.has_source_process_product_chain === "yes" ||
    line.has_source_process_product_chain === "partial";
  if (!hasChain) return line.confidence_1_to_5 !== null;
  const hasAnyToken =
    line.source_token_positions.length > 0 ||
    line.process_token_positions.length > 0 ||
    line.product_token_positions.length > 0;
  return hasAnyToken || line.confidence_1_to_5 !== null;
}
