export type ChoiceValue = "yes" | "partial" | "no" | "unsure";

export type EvalMode = "pilot-lite" | "pilot-full" | "full";

export type TokenTag = "source" | "process" | "product" | null;

export interface ChallengeToken {
  pos: number;
  eva: string;
}

export interface ChallengeLine {
  challenge_id: string;
  line_ref: string;
  section_code?: string;
  token_count: number;
  eva: string;
  tokens: ChallengeToken[];
}

export interface ChallengeData {
  version: string;
  title: string;
  blind_neutral: boolean;
  pilot?: boolean;
  line_count: number;
  lines: ChallengeLine[];
}

export interface LineResponse {
  challenge_id: string;
  line_ref: string;
  is_procedural: ChoiceValue | null;
  procedural_scale?: number | null;
  has_source_process_product_chain: ChoiceValue | null;
  source_token_positions: number[];
  process_token_positions: number[];
  product_token_positions: number[];
  confidence_1_to_5: number | null;
  free_notes: string;
}

export interface EvalSession {
  mode: EvalMode;
  evaluator_id: string;
  evaluator_background: string;
  currentStep: number;
  responses: LineResponse[];
  started_at: string;
}

export interface ExportPayload {
  version: string;
  evaluator_id: string;
  evaluator_background: string;
  submitted_at: string;
  pilot?: boolean;
  lite_mode?: boolean;
  note?: string;
  responses: LineResponse[];
}
