import { onRequestPost as __api_generate_ai_comment_ts_onRequestPost } from "C:\\Users\\kspcl\\Desktop\\ksp-local-info\\functions\\api\\generate-ai-comment.ts"

export const routes = [
    {
      routePath: "/api/generate-ai-comment",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_generate_ai_comment_ts_onRequestPost],
    },
  ]