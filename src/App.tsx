import React from "react";

import "./App.css";
import { Entity } from "./game/world";
import { Game } from "./game/game";
import { offsetRect } from "./game/physics/rect";
import { GAMEWORLD_ID, Mouse } from "./game/input/mouse";
import { Sound } from "./game/sound";
import { Vec2 } from "./game/physics/vec2";
import { Keyboard } from "./game/input/keyboard";

const game = new Game(700);
let hasStarted = false;

function App() {
  const { world } = game;
  const [frame, setFrame] = React.useState(0);
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
      <div style={{ fontSize: "3rem", fontFamily: "fantasy" }}>OSZ</div>

      <div
        id={GAMEWORLD_ID}
        style={{
          cursor: "crosshair",
          width: world.size,
          height: world.size,
          border: "1px solid black",
          position: "relative",
          backgroundColor: world.player.health <= 0 ? "red" : "white",
          overflow: "hidden",
        }}
      >
        {/* Corpses */}
        {world.corpses.map((z) => (
          <EntityElement
            {...z}
            key={z.key} // dumb you have to do this.
          />
        ))}

        {/* drops */}
        {world.drops.map((d, i) => (
          <EntityElement
            {...d}
            image={d.gun.image}
            size={new Vec2(40, 25)}
            key={i} // dumb you have to do this.
          />
        ))}

        {/* Buildings */}
        {world.buildings.map((b, i) => (
          <EntityElement {...b} key={i} />
        ))}

        {/* Player bullets */}
        {world.playerBullets.map((b) => (
          <EntityElement {...b} key={b.key} />
        ))}

        {/* {world.activeMelee.isSwinging ? (
          <EntityElement
            {...world.player}
            image={undefined}
            color={world.activeGun"lightgrey"}
            size={Vec2.square((world.activeGun.length + 10) * 2)}
            radius={1000}
          />
        ) : null} */}

        {/* Zombies */}
        {world.zombies.map((z) => (
          <EntityElement
            {...z}
            color={z.health > 0 ? "green" : "brown"}
            key={z.key} // dumb you have to do this.
          />
        ))}

        {/* player gun */}
        {world.activeGun.isInWall && false ? null : (
          <div
            style={{
              backgroundBlendMode: "darken",
              width: 200,
              height: 100,
              borderRadius: 1,
              // backgroundColor: world.activeGun.color || "black",
              position: "absolute",
              left: world.player.pos.x,
              top: world.player.pos.y - 50,
              rotate: `${world.activeGun.dir.angle()}rad`,
              transform: world.activeGun.dir.x < 0 ? "scaleY(-1)" : undefined,
              transformOrigin: `0 50px`,
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <img
              src={world.activeGun.image}
              width={world.activeGun.length}
              style={{ userSelect: "none", marginLeft: 10 }}
              draggable={false}
            />
          </div>
        )}

        {/* Player */}
        <EntityElement {...world.player} />
      </div>
      <div>
        {world.player.health} ❤️ {Math.floor(world.player.sprint)} 🏃
        <div>
          {world.activeGun.name}:{world.activeGun.clip} / {world.activeGun.ammo}{" "}
        </div>
        ➤{world.activeGun.isReloading ? "Reloading..." : ""}
        SCORE {world.playerScore}
      </div>
      {game.isGameOver() || !hasStarted ? (
        <button
          onClick={() => {
            game.restart();
            hasStarted = true;
          }}
        >
          New game?
        </button>
      ) : null}
      {world.player.health > 0 ? (
        game.isGameRunning() ? (
          ""
        ) : (
          <div>
            PAUSED:{" "}
            <button
              onClick={() => {
                Sound.mute();
                setFrame(Number(!frame));
              }}
            >
              {Sound.isMuted() ? "Unmute" : "Mute"}
            </button>
          </div>
        )
      ) : (
        `YOU DIED. Score: ${world.playerScore}`
      )}
      <a
        style={{ fontFamily: "cursive" }}
        href="https://github.com/macflash/zombie-gunner"
      >
        Open Source Zombies on github
      </a>
    </div>
  );
}

interface EntityElementProps extends Entity {}

export function EntityElement(props: EntityElementProps) {
  const { className, color, size, radius, image } = props;
  const offset = offsetRect(props);
  return (
    <div
      className={className}
      style={{
        overflow: "hidden",
        position: "absolute",
        width: size.x,
        height: size.y,
        borderRadius: radius ?? 4,
        backgroundColor: color,
        top: offset.pos.y, // - 0.5 * size.y,
        left: offset.pos.x, // - 0.5 * size.x,
      }}
    >
      {image ? (
        <img
          style={{ position: "absolute", userSelect: "none" }}
          src={image}
          draggable={false}
          height={size.y}
          width={size.x}
        />
      ) : null}
    </div>
  );
}

export default App;
