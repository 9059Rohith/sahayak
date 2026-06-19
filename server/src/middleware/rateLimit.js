import rateLimit from "express-rate-limit";

/**
 * Basic abuse protection. The triage endpoint calls a paid LLM, so we cap
 * requests per IP. Values are deliberately demo-friendly but production-shaped.
 */
export const triageRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 triage requests / IP / minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "RATE_LIMITED",
    message: "Too many requests. Please wait a minute and try again.",
  },
});
