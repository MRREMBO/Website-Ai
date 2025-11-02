# Vercel AI Studio (Chat + Image) - Futuristic UI

This project contains a single-file frontend (`index.html`) and a Vercel serverless function (`api/generate.js`) that proxies requests to OpenAI's Chat and Images endpoints.

**Important:** Do NOT add your OpenAI key in code. Set it in Vercel Environment Variables as `OPENAI_API_KEY`.

## Files
- index.html         -> frontend (open in browser or deploy to Vercel)
- api/generate.js    -> Vercel serverless function (proxy to OpenAI)
- package.json       -> dependencies for serverless functions

## Deploy to Vercel (1-click from GitHub) - quick guide (mobile friendly)
1. Create a GitHub repository and push the project files (or upload ZIP via Vercel UI).
2. Go to https://vercel.com and login (connect GitHub or use email).
3. Click **'New Project'** -> import from GitHub -> pick your repo.
4. In project settings -> Environment Variables -> add:
   - Key: OPENAI_API_KEY
   - Value: (your OpenAI secret key, e.g. sk-...)
5. Deploy. Vercel will detect the `api/` folder and configure serverless functions.
6. Open the site URL and try chat & image generation.

## Local testing
- Install dependencies: `npm install`
- Start Vercel dev (requires Vercel CLI): `vercel dev`

## Troubleshooting
- 401 from the function: check OPENAI_API_KEY value in Vercel Project Settings.
- No image url: check function logs in Vercel dashboard.
- CORS: when deployed through Vercel functions, CORS is handled automatically (same origin).