const nodeExec = require('child_process').exec;
const fs = require('fs');
const path = require('path')


const emcc = "/Users/gregdicristofaro/git/constantqwasm/emsdk/emscripten/1.38.30/emcc";
const cppDir = '/src/cppwasm/';

const wasmOutdir = '/src/assets/wasm';
const workerOutFile = 'worker.js';
const orchestratorOutFile = 'constantq.js';

const orchestratorCppFile = 'ConstantQOrchestrator.cpp';
const workerExcludeCppFiles = ['Tests.cpp', orchestratorCppFile];

const workerParams = [
    '-s ALLOW_MEMORY_GROWTH=1',
    '-std=c++17',
    "-s EXPORTED_FUNCTIONS=\"['_initializeSession', '_sessionAnalyze']\"",
    '-s BUILD_AS_WORKER=1'
];

const orchestratorParams = [
    '--bind',
    '-s RESERVED_FUNCTION_POINTERS=20',
    '-s ALLOW_MEMORY_GROWTH=1',
    '-std=c++17'
];


function baseExec(command, cwd, callback, showError, showStd) {
  nodeExec(command, {cwd }, (error,stdout,stderr) => {
    if (stderr && showError)
      console.error(stderr);

    if (error && showError)
      console.error(error);

    if (stdout && showStd)
      console.log(stdout);

    if (callback)
      callback(error,stdout,stderr);
  });
}

function emccBuild(emccPath, sourceFiles, outFile, params) {
    const command = [emccPath, ...params, ...sourceFiles, 
        '-o', outFile].join(" ");

    console.log(`Executing: ${command}`);
    baseExec(command, undefined, undefined, true, true);
}

const workerSourceFiles = fs.readdirSync(path.join(__dirname, cppDir))
    .filter(file => file.endsWith('.cpp') && workerExcludeCppFiles.indexOf(file) < 0)
    .map(f => path.join(__dirname, cppDir, f));

emccBuild(emcc, workerSourceFiles, 
     path.join(__dirname, wasmOutdir, workerOutFile), workerParams);
emccBuild(emcc, [path.join(__dirname, cppDir, orchestratorCppFile)], 
    path.join(__dirname, wasmOutdir, orchestratorOutFile), orchestratorParams);