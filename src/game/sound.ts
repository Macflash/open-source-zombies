import gameover from "../sound/gameover.wav";
import nuhuh from "../sound/nuhuh.wav";
import blam from "../sound/blam.wav";
import bang from "../sound/bang.wav";
import reload from "../sound/reload.wav";
import ouch from "../sound/ouch.wav";
import zombie from "../sound/zombie.wav";
import ding from "../sound/ding.wav";
import dong from "../sound/dong.wav";

const audioMap = new Map<string, HTMLAudioElement>();

let muted = true;

function play(src: string) {
  try {
    if (muted) return;
    let audio = audioMap.get(src);
    if (!audio) {
      audio = new Audio(src);
      audioMap.set(src, audio);
    }
    if (audio.paused) audio.play();
    else {
      audio.pause();
      audio.currentTime = 0;
      audio.play();
    }
  } catch {
    // probably the player hasn't done anything yet.
  }
}

export class Sound {
  static isMuted() {
    return muted;
  }
  static mute(m = !muted) {
    muted = m;
  }

  static gameover = () => play(gameover);
  static nuhuh = () => play(nuhuh);
  static blam = () => play(blam);
  static bang = () => play(bang);
  static reload = () => play(reload);
  static ouch = () => play(ouch);
  static zombie = () => play(zombie);
  static ding = () => play(ding);
  static dong = () => play(dong);
}
