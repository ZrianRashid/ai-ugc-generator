# n8n Workflow

The n8n workflow file is not included in this repository due to API keys.

## Setup Instructions

1. Download the workflow JSON from your secure source
2. Import into n8n: Workflows → Import from File
3. Update the following credentials:
   - Anthropic API key (Claude Sonnet 4.5)
   - Kie.ai API key (Sora 2 Pro)
4. Activate the workflow
5. Copy the webhook URL to your environment variables

## Webhook Configuration

- **Method:** POST
- **Path:** `/webhook/ugc-app`
- **Response Mode:** Last Node
- **CORS:** Enabled

## Workflow Overview

1. Webhook receives video generation request
2. Normalize input with smart defaults
3. Build Claude API request bodies (prompt + hooks)
4. Call Claude to generate Sora 2 prompt
5. Call Claude to generate 5 hook variations
6. Submit to Kie.ai Sora 2 Pro
7. Poll every 15s until complete (max 40 attempts)
8. Return video URL + hooks to frontend