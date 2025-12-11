// audioRecorderWorkletProcessor.js

class RecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buffer = [];
  }

  process(inputs) {
    const input = inputs[0];
    if (input && input[0]) {
      // send float32 audio frames to main thread
      this.port.postMessage(input[0]);
    }
    return true;
  }
}

registerProcessor("recorder-node", RecorderProcessor);
