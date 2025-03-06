#!/bin/bash

# List of files to update
files=(
  "src/app/api/reviews/[id]/flag/route.ts"
  "src/app/api/speed-tests/submit/route.ts"
  "src/app/api/isp/reviews/route.ts"
  "src/app/api/reviews/[id]/verify/route.ts"
  "src/app/api/isp/reviews/vote/route.ts"
  "src/app/api/user/settings/route.ts"
  "src/app/api/tips/vote/route.ts"
  "src/app/api/tips/[id]/vote/route.ts"
  "src/app/api/conversations/route.ts"
  "src/app/api/apartments/[id]/reviews/route.ts"
  "src/app/api/apartments/route.ts"
  "src/app/api/conversations/[id]/messages/route.ts"
  "src/app/api/faqs/[id]/vote/route.ts"
  "src/app/api/comparisons/[id]/route.ts"
  "src/app/api/complexes/[id]/route.ts"
  "src/app/api/complexes/[id]/reviews/route.ts"
  "src/app/api/favorites/[id]/route.ts"
  "src/app/api/complexes/[id]/badges/route.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    # Add runtime = "nodejs" and update auth import
    sed -i '' '1i\
export const runtime = "nodejs"\
\
' "$file"
    
    # Replace auth import
    sed -i '' 's/import { auth } from "@\/lib\/auth"/import { auth } from "@\/auth"/' "$file"
  fi
done 