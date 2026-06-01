import { t } from "../../../utils/i18n";

let audioCtx = null;
let gainNode = null;
let compressor = null;
let connectedVideos = new WeakSet();
let observer = null;

const GAIN = 1.5;
const COMPRESSOR = {
  threshold: -24,
  knee: 10,
  ratio: 4,
  attack: 0.003,
  release: 0.25,
};

function ensureAudioGraph() {
  if (audioCtx) return; // đã build rồi, không build lại

  audioCtx = new AudioContext();

  gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(GAIN, audioCtx.currentTime);

  compressor = audioCtx.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(
    COMPRESSOR.threshold,
    audioCtx.currentTime,
  );
  compressor.knee.setValueAtTime(COMPRESSOR.knee, audioCtx.currentTime);
  compressor.ratio.setValueAtTime(COMPRESSOR.ratio, audioCtx.currentTime);
  compressor.attack.setValueAtTime(COMPRESSOR.attack, audioCtx.currentTime);
  compressor.release.setValueAtTime(COMPRESSOR.release, audioCtx.currentTime);

  gainNode.connect(compressor);
  compressor.connect(audioCtx.destination);

  console.log("[amp] graph built, gain:", gainNode.gain.value);
}

function connectVideo(video) {
  if (connectedVideos.has(video)) return;

  ensureAudioGraph();

  try {
    const source = audioCtx.createMediaElementSource(video);
    source.connect(gainNode);
    connectedVideos.add(video);
    console.log("[amp] connected video, gain:", gainNode.gain.value);
  } catch (e) {
    console.warn("[amp] skipped:", e.message);
  }
}

function scanAndConnect() {
  document.querySelectorAll("video").forEach(connectVideo);
}

function resumeOnInteraction() {
  if (audioCtx?.state === "suspended") {
    audioCtx.resume().then(() => {
      console.log("[amp] resumed, gain:", gainNode?.gain.value);
    });
  }
}

export default {
  id: "volume-amplifier",
  get name() {
    return t("tweak_volumeAmplifier_name");
  },
  get description() {
    return t("tweak_volumeAmplifier_desc");
  },
  default: false,
  extra: null,

  enable() {
    scanAndConnect();

    observer = new MutationObserver(scanAndConnect);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener("click", resumeOnInteraction);

    if (audioCtx?.state === "suspended") audioCtx.resume();
  },

  disable() {
    observer?.disconnect();
    observer = null;

    document.removeEventListener("click", resumeOnInteraction);

    if (gainNode) {
      gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    }
  },
};
