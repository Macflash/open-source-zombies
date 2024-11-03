import React from "react";

import "./App.css";
import { Entity, World } from "./game/world";
import { Vec2 } from "./game/vec2";
import { Game } from "./game/game";

// cost of a guy, say... 100 food?
// maybe they have some upkeep cost as well... eventually.

const game = new Game(700);
game.restart();
game.play();

function App() {
  const { world } = game;
  const [_, setFrame] = React.useState(0);
  React.useEffect(() => {
    game.renderFunction = setFrame;
  }, [setFrame]);

  return (
    <div
      style={{
        backgroundColor: "grey",
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        // display: "flex",
        // flexDirection: "column",
        // alignItems: "center",
        // justifyContent: "center",
        userSelect: "none",
      }}
      onClick={(ev) => {
        world.click(new Vec2(ev.clientX, ev.clientY));
      }}
    >
      <div
        style={{
          width: world.size,
          height: world.size,
          border: "1px solid black",
          position: "relative",
          backgroundColor: world.player.health <= 0 ? "red" : "white",
          overflow: "hidden",
        }}
      >
        {world.player.health > 0
          ? null
          : `YOU DIED. Score: ${world.playerScore}`}

        {/* Zombies */}
        {world.zombies.map((z) => (
          <EntityElement {...z} color={z.health > 0 ? "green" : "brown"} />
        ))}

        {/* Player bullets */}
        {world.playerBullets.map((b) => (
          <EntityElement {...b} />
        ))}

        {/* Player */}
        <EntityElement {...world.player} />
      </div>
      <div>
        {world.player.health} HP {world.activeGun.clip} / {world.activeGun.ammo}{" "}
        ➤{world.activeGun.isReloading ? "Reloading..." : ""}
        SCORE {world.playerScore}
      </div>
    </div>
  );
}

export function EntityElement({ pos, size, color }: Entity) {
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: 4,
        backgroundColor: color,
        top: pos.y - 0.5 * size,
        left: pos.x - 0.5 * size,
      }}
    ></div>
  );
}

export default App;
