# Opal + Google Cloud Functions — Order Tracking 

This repository is an implementation of a WhatsApp Order Tracking automation using:

- **Google Opal** (visual orchestrator) — flow JSON included as `opal_flow.json` (placeholder values).
- **Google Cloud Function** (`index.js`) — Node.js implementation of `getOrderStatus`.
- **GitHub Actions** workflow (`.github/workflows/deploy.yml`) — deploy to Google Cloud Functions (uses repository secrets).
- **Local test harness** (`test/local_test.js`) — to run against a local functions emulator.

> IMPORTANT: This repository is for demonstration purposes. **Do not commit real secrets**. Replace `{{...}}` placeholders with real values only when deploying to a real environment, and keep placeholder values.

## Files
- `index.js` — Cloud Function code (Node.js)
- `package.json` — dependencies and scripts
- `test/local_test.js` — simple test client
- `.github/workflows/deploy.yml` — CI/CD deploy workflow
- `opal_flow.json` — Opal canvas mapping (simplified)
- `README.md` — this file

## How to use (local preview)
1. Install Node.js >= 18.
2. Install dependencies:
   ```
   npm install
   ```
3. Run functions-framework locally:
   ```
   npx @google-cloud/functions-framework --target=getOrderStatus --port=8080
   ```
4. In another terminal run:
   ```
   node test/local_test.js
   ```
   The test will call `http://localhost:8080/`.

## How to push to GitHub (step-by-step)
1. Create a new repository on GitHub (e.g., `opal-order-tracking-demo`).
2. On your machine:
   ```
   git init
   git add .
   git commit -m "Initial demo: Opal + Cloud Function order tracking"
   git branch -M main
   git remote add origin git@github.com:<your-username>/opal-order-tracking-demo.git
   git push -u origin main
   ```
   Or use GitHub CLI:
   ```
   gh repo create <your-username>/opal-order-tracking-demo --private --source=. --remote=origin --push
   ```

## GitHub Secrets needed (if you plan to deploy)
- `GCP_SA_KEY` (service account JSON) — **do not** commit to repo.
- `GCP_PROJECT`
- `GCP_REGION`
- `OPAL_SA_EMAIL` (service account for Opal invoker)
- `ORDER_API_URL`
- `ORDER_API_KEY`

## Notes for placeholders
- Keep `ORDER_API_KEY` placeholders.
- Update `README.md` to describe your role, decisions, and architecture choices.
- Add screenshots of Opal canvas and Cloud Function logs for visual proof.

