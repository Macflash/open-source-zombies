import gameover from "../sound/gameover.wav";
import nuhuh from "../sound/nuhuh.wav";
import blam from "../sound/blam.wav";
import bang from "../sound/bang.wav";
import reload from "../sound/reload.wav";
import ouch from "../sound/ouch.wav";
import zombie from "../sound/zombie.wav";

const audioMap = new Map<string, HTMLAudioElement>();

let muted = true;

function play(src: string) {
  if (muted) return;
  let audio = audioMap.get(src);
  if (!audio) {
    audio = new Audio(src);
    audioMap.set(src, audio);
  }
  audio.play();
}

export class Sound {
  static gameover = () => play(gameover);
  static nuhuh = () => play(nuhuh);
  static blam = () => play(blam);
  static bang = () => play(bang);
  static reload = () => play(reload);
  static ouch = () => play(ouch);
  static zombie = () => play(zombie);
}
