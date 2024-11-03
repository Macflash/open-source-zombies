import bang from "../sound/bang.wav";
import reload from "../sound/reload.wav";
import ouch from "../sound/ouch.wav";
import zombie from "../sound/zombie.wav";

const audioMap = new Map<string, HTMLAudioElement>();

function play(src: string) {
  let audio = audioMap.get(src);
  if (!audio) {
    audio = new Audio(src);
    audioMap.set(src, audio);
  }
  audio.play();
}

export class Sound {
  static bang = () => play(bang);
  static reload = () => play(reload);
  static ouch = () => play(ouch);
  static zombie = () => play(zombie);
}
