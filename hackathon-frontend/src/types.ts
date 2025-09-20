// src/types.ts

// Mantenha seu PostType original
export type PostType = {
  id: number;
  author: string;
  content: string;
  timestamp: number;
};


// Tipo para as citações (suposição da estrutura)
export type CitationType = {
  title: string;
  url: string;
  source: string;
};

// Tipo para a resposta completa do backend
export type PostDetailsType = {
  version: string;
  postId: number;
  stance: "SUPPORT" | "REFUTE" | "UNCLEAR" | string; // Usamos união de strings para autocompletar
  decision: string;
  confidence: number;
  scores: {
    relevance_llm: number;
    evidence_score: number;
    freshness_avg: number;
  };
  explanation: string;
  citations: CitationType[];
  latency_ms: number;
  model_used: string;
};