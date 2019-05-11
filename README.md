# ConstantQJs

In this project, someone can view all the pitches in a piece of music.  ConstantQJs utilizes Benjamin Blankertz's [algorithm](http://doc.ml.tu-berlin.de/bbci/material/publications/Bla_constQ.pdf) implementing the [Constant Q Transform](https://en.wikipedia.org/wiki/Constant-Q_transform).

The live demo can be found [here](http://gdicristofaro.github.io/ConstantQJs/).

## How it works

Audio file data is imported utilizing the Web Audio API.  Then the audio data is analyzed for pitch information.  The algorithm implementation utilizes web assembly in combination with web workers to facilitate performance.

## Setup and install

The project can be built with `npm install` and ran with `npm start`.  The compiled web assembly is included, however the web assembly code can be built from the C++ code using `npm buildwasm`.  