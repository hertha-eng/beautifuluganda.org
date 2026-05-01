#!/usr/bin/env bash
set -euo pipefail

rm -rf dist
mkdir -p dist

cp -R \
  *.html \
  css \
  js \
  images \
  "blog pages" \
  robots.txt \
  sitemap.xml \
  dist/
