/**
 * URL base da API \u2014 resolvida em tempo de build pelo Vite.
 *
 * Produ\u00E7\u00E3o / Vercel:
 *   Usa VITE_API_URL do arquivo .env \u2192 aponta para o Azure.
 *
 * Desenvolvimento local:
 *   Crie um arquivo Challenge-Sprint/.env.local com:
 *     VITE_API_URL=http://localhost:8080
 *   O Vite carrega .env.local com prioridade sobre .env,
 *   e o arquivo j\u00E1 est\u00E1 no .gitignore via padr\u00E3o *.local.
 *
 * .replace(/^\uFEFF/, '') \u2192 remove BOM (Byte Order Mark) que editores
 * Windows \u00E0s vezes inserem no in\u00EDcio de arquivos .env, evitando erros
 * silenciosos de URL como "\uFEFFhttps://..." que o fetch n\u00E3o reconhece.
 */
export const API_URL = (import.meta.env.VITE_API_URL || 'https://app-orbitalcare-api.azurewebsites.net')
  .replace(/^\uFEFF/, '') // remove BOM do Windows
  .trim();

/**
 * API de c\u00E1lculo de risco cl\u00EDnico (AstraCare) \u2014 Python/Flask hospedado no Render.
 * Sobrescreva com VITE_RISCO_API_URL no .env / Vercel se a URL do Render for outra.
 */
export const RISCO_API_URL = (import.meta.env.VITE_RISCO_API_URL || 'https://estelar-risco-api.onrender.com')
  .replace(/^\uFEFF/, '')
  .trim();

/**
 * API de IA (OrbitalCare) \u2014 modelos scikit-learn em Python/Flask hospedados no Render.
 * Sobrescreva com VITE_IA_API_URL no .env / Vercel se a URL do Render for outra.
 */
export const IA_API_URL = (import.meta.env.VITE_IA_API_URL || 'https://estelar-ia-api.onrender.com')
  .replace(/^\uFEFF/, '')
  .trim();
