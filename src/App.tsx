import React from "react";

import "./App.css";
import { Entity, World } from "./game/world";
import { Vec2 } from "./game/vec2";

// cost of a guy, say... 100 food?
// maybe they have some upkeep cost as well... eventually.

let world = new World(700);
for (let i = 0; i < 10; i++) {
  world.addZombie();
}
world.addBuilding();

setInterval(() => {
  world.doStep();
}, 10);

// setInterval(() => {
//   if (world.zombies.length < 20) world.addZombie();
// }, 350);

function App() {
  const [frame, setFrame] = React.useState(0);
  const render = React.useCallback(
    () => setFrame(frame + 1),
    [frame, setFrame]
  );
  React.useEffect(() => {
    world.renderer = render;
  }, [render]);

  return (
    <div>
      <div
        style={{
          width: world.size,
          height: world.size,
          border: "1px solid black",
          backgroundColor: world.player.health <= 0 ? "red" : undefined,
        }}
        onClick={(ev) => {
          world.click(new Vec2(ev.clientX, ev.clientY));
        }}
      >
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
