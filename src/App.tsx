import React from "react";

import "./App.css";
import { Entity } from "./game/world";
import { Game } from "./game/game";
import { offsetRect } from "./game/physics";
import { GAMEWORLD_ID, Mouse } from "./game/input/mouse";
import { Sound } from "./game/sound";
import { Vec2 } from "./game/vec2";

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
        // This doens't work with the aiming right now.
        // likely need to subtract the clientX/Y of the relative div.
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
      }}
      onMouseDown={Mouse.onMouseDown}
      onMouseUp={Mouse.onMouseUp}
      onMouseMove={Mouse.onMouseMove}
      onContextMenu={(ev) => {
        ev.preventDefault();
        return false;
      }}
    >
      <div style={{ fontSize: "2rem", fontFamily: "fantasy" }}>OSZ</div>
      <div style={{ fontFamily: "cursive" }}>Open Source Zombies</div>
      <div
        id={GAMEWORLD_ID}
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
          ? game.isGameRunning()
            ? ""
            : "PAUSED"
          : `YOU DIED. Score: ${world.playerScore}`}

        {/* Corpses */}
        {world.corpses.map((z) => (
          <EntityElement
            {...z}
            key={z.key} // dumb you have to do this.
          />
        ))}

        {/* Buildings */}
        {world.buildings.map((b, i) => (
          <EntityElement {...b} key={i} />
        ))}

        {/* drops */}
        {world.drops.map((z, i) => (
          <EntityElement
            {...z}
            key={i} // dumb you have to do this.
          />
        ))}

        {/* Player bullets */}
        {world.playerBullets.map((b) => (
          <EntityElement {...b} key={b.key} />
        ))}

        {world.activeMelee.isSwinging ? (
          <EntityElement
            {...world.player}
            color="lightgrey"
            size={Vec2.square(world.activeMelee.range)}
          />
        ) : null}

        {/* Player */}
        <EntityElement {...world.player} />

        <div
          style={{
            width: world.activeGun.length,
            height: 4,
            borderRadius: 1,
            backgroundColor: "black",
            position: "absolute",
            left: world.player.pos.x,
            top: world.player.pos.y - 2,
            rotate: `${world.player.dir.angle()}rad`,
            transformOrigin: "0 2px",
          }}
        ></div>

        {/* Zombies */}
        {world.zombies.map((z) => (
          <EntityElement
            {...z}
            color={z.health > 0 ? "green" : "brown"}
            key={z.key} // dumb you have to do this.
          />
        ))}
      </div>
      <div>
        {world.player.health} HP {world.activeGun.clip} / {world.activeGun.ammo}{" "}
        ➤{world.activeGun.isReloading ? "Reloading..." : ""}
        SCORE {world.playerScore}
        <button
          onClick={() => {
            Sound.mute();
            setFrame(-1);
          }}
        >
          {Sound.isMuted() ? "Unmute" : "Mute"}
        </button>
      </div>
    </div>
  );
}

export function EntityElement(props: Entity) {
  const { className, color, size } = props;
  const offset = offsetRect(props);
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        width: size.x,
        height: size.y,
        borderRadius: 4,
        backgroundColor: color,
        top: offset.pos.y, // - 0.5 * size.y,
        left: offset.pos.x, // - 0.5 * size.x,
      }}
    ></div>
  );
}

export default App;
