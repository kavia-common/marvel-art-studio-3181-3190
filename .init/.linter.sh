#!/bin/bash
cd /tmp/kavia/workspace/code-generation/marvel-art-studio-3181-3190/drawing_canvas_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

