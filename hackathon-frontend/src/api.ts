// src/api.ts
import type { PostDetailsType } from './types';

// Esta função simula uma chamada de rede para buscar detalhes de um post.
export const fetchPostDetails = (postId: number): Promise<PostDetailsType> => {
  console.log(`Buscando detalhes para o post ID: ${postId}...`);

  // Usamos uma Promise com setTimeout para simular a latência da rede (1 segundo)
  return new Promise((resolve) => {
    setTimeout(() => {
      // Criamos dados falsos que correspondem ao schema do backend
      const mockDetails: PostDetailsType = {
        version: "rag.results.v1",
        postId: postId,
        stance: ["SUPPORT", "REFUTE", "UNCLEAR"][Math.floor(Math.random() * 3)],
        decision: "Factually Correct (with context)",
        confidence: Math.random() * (0.98 - 0.75) + 0.75, // Confiança entre 75% e 98%
        scores: {
          relevance_llm: Math.random(),
          evidence_score: Math.random(),
          freshness_avg: Math.random(),
        },
        explanation: "The claim is generally supported by evidence, but lacks some critical context regarding the timeline of events. Multiple sources confirm the main assertion.",
        citations: [
          { title: "Primary Source Report on Event X", url: "#", source: "news-source.com" },
          { title: "Analysis of Timeline", url: "#", source: "analysis-journal.org" },
        ],
        latency_ms: Math.floor(Math.random() * (1200 - 800) + 800), // Latência entre 800ms e 1200ms
        model_used: Math.random() > 0.5 ? "gpt-4o-mini" : "llama3.1:8b-instruct",
      };
      console.log("Detalhes recebidos:", mockDetails);
      resolve(mockDetails);
    }, 1000); // Atraso de 1000ms (1 segundo)
  });
};