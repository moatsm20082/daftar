#!/bin/sh
# builds docs/app/app.js from src/ (order matters: file names sort into load order)
set -e
cd "$(dirname "$0")"
cat src/1-i18n.js src/2-sectors.js src/3-core.js src/4-views.js src/4b-driver.js src/5-forms.js src/5b-files.js src/6-support.js src/6b-tools.js src/6d-grow.js src/7-app.js > docs/app/app.js
node --check docs/app/app.js
echo "built docs/app/app.js ($(wc -c < docs/app/app.js) bytes)"
