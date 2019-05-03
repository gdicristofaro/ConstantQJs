#!/bin/bash
EMCC="./emsdk/emscripten/1.38.30/emcc"
SOURCE_FILES=`ls -1 ./cpp/*.cpp | grep -v Tests.cpp | grep -v ConstantQOrchestrator.cpp`

ORCHESTRATOR="$EMCC --bind -s RESERVED_FUNCTION_POINTERS=20 -s ALLOW_MEMORY_GROWTH=1 -std=c++17 ./cpp/ConstantQOrchestrator.cpp -o ./build/main.js -s"
WORKER="$EMCC -s ALLOW_MEMORY_GROWTH=1 -std=c++17 $SOURCE_FILES -s EXPORTED_FUNCTIONS=\"['_initializeSession', '_sessionAnalyze']\" -s BUILD_AS_WORKER=1 -o ./build/worker.js"
echo $ORCHESTRATOR
eval $ORCHESTRATOR
echo $WORKER
eval $WORKER