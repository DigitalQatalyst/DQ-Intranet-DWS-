#!/usr/bin/env bash
set -euo pipefail

OWNER="${GITHUB_OWNER:?Set GITHUB_OWNER}"
REPO="${GITHUB_REPO:?Set GITHUB_REPO}"
TOKEN="${GITHUB_TOKEN:?Set GITHUB_TOKEN}"

echo "Starting branch protection setup..."
echo "Repo: ${OWNER}/${REPO}"

PAYLOAD=$(jq -n '{
  required_status_checks: null,
  enforce_admins: true,
  required_pull_request_reviews: {
    dismiss_stale_reviews: true,
    require_code_owner_reviews: false,
    required_approving_review_count: 2,
    require_last_push_approval: true
  },
  restrictions: null,
  required_linear_history: false,
  allow_force_pushes: false,
  allow_deletions: false,
  block_creations: false,
  required_conversation_resolution: true
}')

HTTP_CODE=$(curl -s \
  -o /tmp/api_response.json \
  -w "%{http_code}" \
  -X PUT \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -H "Content-Type: application/json" \
  -d "${PAYLOAD}" \
  "https://api.github.com/repos/${OWNER}/${REPO}/branches/trial-main/protection")

if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 201 ]; then
  echo "  SUCCESS - trial-main protected (HTTP ${HTTP_CODE})"
else
  echo "  FAILED - HTTP ${HTTP_CODE}"
  cat /tmp/api_response.json
fi

echo ""
echo "Done. Verify at:"
echo "https://github.com/${OWNER}/${REPO}/settings/branches"
