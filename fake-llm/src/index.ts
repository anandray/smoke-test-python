import express from "express";

const app = express();
app.use(express.json());

const RESPONSES = [
  "240 patients (120 per arm)",
  "Randomized controlled trial, double-blind, placebo-controlled",
  "Statistically significant improvement (p<0.001)",
  "87 studies, 342 effect sizes",
  "Systematic review and meta-analysis with random-effects models",
  "High attrition rate (22%), no long-term follow-up",
  "15,000 citations across 5 review topics",
  "Two-stage LLM screening pipeline compared against expert consensus",
  "96.2% sensitivity, 67.8% specificity",
  "18,500 adults aged 50-75, 8-year follow-up",
  "Prospective cohort study with Cox proportional hazards models",
  "U-shaped association between sleep duration and cardiovascular risk",
  "12,400 participants across 6 countries",
  "Mixed-methods: difference-in-differences analysis + qualitative interviews",
  "15% reduction in anxiety/depression scores",
  "Publication bias detected via funnel plot asymmetry",
  "Performance varied significantly across domains",
  "Predominantly White European sample limits generalizability",
  "Self-selection bias in non-randomized sites",
  "Moderate effect size (d=0.45, 95% CI: 0.28-0.62)",
];

app.post("/v1/chat/completions", async (req, res) => {
  const delay = 500 + Math.random() * 1500;
  await new Promise((r) => setTimeout(r, delay));

  if (Math.random() < 0.1) {
    res.status(500).json({
      error: {
        message: "Internal server error",
        type: "server_error",
        code: "internal_error",
      },
    });
    return;
  }

  const content = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];

  res.json({
    id: `chatcmpl-${Date.now()}`,
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model: "fake-llm-1",
    choices: [
      {
        index: 0,
        message: { role: "assistant", content },
        finish_reason: "stop",
      },
    ],
    usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
  });
});

app.get("/v1/models", (_req, res) => {
  res.json({
    object: "list",
    data: [
      {
        id: "fake-llm-1",
        object: "model",
        created: Math.floor(Date.now() / 1000),
        owned_by: "local",
      },
    ],
  });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Fake LLM server running on http://localhost:${PORT}`);
});
