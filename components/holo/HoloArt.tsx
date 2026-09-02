import Sigil from "@/components/ui/Sigil";

/**
 * R-01's HoloArt scene — "the operator's desk".
 *
 * Every number below was measured against the source pixels, never
 * estimated: hotspot boxes trace the whole drawn object and each dot was
 * checked to sit on its machine and to resolve to its own hotspot (a later
 * box wins the pointer where two overlap, so the order here is load-bearing).
 *
 * Sharpness laws this file obeys:
 *  - No perspective / rotateX / rotateY / translateZ anywhere.
 *  - The raster is fixed. Motion is limited to the scan overlay.
 *  - The stage adopts the image's exact ratio with object-fit:fill, so the
 *    hotspot percentages cannot drift.
 *  - The art is capped at half its native width, which is the point where it
 *    stays pixel-exact on a 2x display. Raising that cap needs a bigger
 *    source, never CSS.
 *  - Plain <img>, no optimizer: the pre-encoded alpha-keyed AVIF IS the
 *    optimization, and re-encoding it only ever softens it.
 *
 * Labels describe what is drawn. The HUD panels carry only real dossier
 * values (record id, built commit, source count, the actual grade
 * vocabulary) because inventing telemetry on a page about verification
 * would be the one thing this project cannot afford.
 */

const NATIVE_W = 1672;
const NATIVE_H = 941;

type Hotspot = {
  key: string;
  label: string;
  /** box, as % of the stage */
  l: number;
  t: number;
  w: number;
  h: number;
  /** dot position within its own box, 0–1 */
  dx: number;
  dy: number;
  /** labels near the right edge open back into the stage */
  flip?: boolean;
};

/** Order = paint order. Later entries win the pointer where boxes overlap. */
const HOTSPOTS: Hotspot[] = [
  { key: "shatter", label: "Incoming traces", l: 6.579, t: 28.162, w: 27.811, h: 40.914, dx: 0.7312, dy: 0.4416 },
  { key: "barrier", label: "The barrier", l: 34.211, t: 20.191, w: 11.962, h: 57.917, dx: 0.465, dy: 0.2018 },
  { key: "console", label: "Operator console", l: 39.175, t: 45.165, w: 32.596, h: 26.036, dx: 0.8257, dy: 0.4898, flip: true },
  { key: "chair", label: "The seat", l: 50.239, t: 53.135, w: 10.467, h: 24.973, dx: 0.3714, dy: 0.4894 },
  { key: "mast", label: "Comms mast", l: 71.471, t: 19.129, w: 6.28, h: 52.285, dx: 0.4286, dy: 0.4472, flip: true },
  { key: "stack", label: "Equipment stack", l: 61.902, t: 70.988, w: 15.251, h: 20.616, dx: 0.4706, dy: 0.4845, flip: true },
];

export default function HoloArt({ commit, sources }: { commit: string; sources: number }) {
  return (
    <div className="wrap">
      <figure className="ha" data-holo-art>
        <div
          className="ha-stage"
          style={{ "--ha-w": NATIVE_W, "--ha-h": NATIVE_H } as React.CSSProperties}
        >
          <div className="ha-visual" data-ha-stage>
            <div className="ha-raster">
              <img
                src="/scenes/e2-1-r01-operators-desk.avif"
                width={NATIVE_W}
                height={NATIVE_H}
                loading="lazy"
                decoding="async"
                alt="An isometric wireframe drawing of a security operations desk: a curved console and seat on a circular platform, a projected barrier with incoming traces breaking against it, a comms mast, and an equipment stack."
              />
            </div>

            {/* The generated emblem was removed from the raster because the
                geometry is canon. This is the real mark in currentColor. */}
            <Sigil cut="master" className="ha-sigil" label="The KF sigil" />

            <div className="ha-hotspots">
              {HOTSPOTS.map((s) => {
                const cx = s.l + s.w / 2;
                const cy = s.t + s.h / 2;
                const x = s.l + s.w * s.dx;
                const y = s.t + s.h * s.dy;
                return (
                  <div className="ha-node" key={s.key}>
                    <button
                      type="button"
                      className={`ha-hot ha-hot--${s.key}`}
                      aria-label={s.label}
                      aria-pressed="false"
                      style={
                        {
                          "--l": `${cx}%`,
                          "--t": `${cy}%`,
                          "--w": `${s.w}%`,
                          "--h": `${s.h}%`,
                        } as React.CSSProperties
                      }
                    />
                    <span
                      className={`ha-marker${s.flip ? " ha-marker--flip" : ""}`}
                      style={{ "--x": `${x}%`, "--y": `${y}%` } as React.CSSProperties}
                      aria-hidden="true"
                    >
                      <span className="ha-dot" />
                      <span className="ha-label">{s.label}</span>
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="ha-scan" aria-hidden="true" />
          </div>

          <div className="ha-hud" data-ha-hud aria-hidden="true">
            <div className="ha-panel ha-panel--a">
              <div className="ha-panel-h">SCENE</div>
              <div className="ha-row">
                <span>RECORD</span>
                <span>R-01</span>
              </div>
              <div className="ha-row">
                <span>COMMIT</span>
                <span>{commit.slice(0, 7)}</span>
              </div>
              <div className="ha-row">
                <span>SOURCES</span>
                <span>{sources}</span>
              </div>
            </div>
            <div className="ha-panel ha-panel--b">
              <div className="ha-panel-h">GRADES</div>
              <div className="ha-row">
                <span>FACT</span>
              </div>
              <div className="ha-row">
                <span>HIGH-CONVICTION</span>
              </div>
              <div className="ha-row">
                <span>SCENARIO</span>
              </div>
            </div>
          </div>
        </div>
        <figcaption className="fine">
          The operator&rsquo;s desk. Drawn, not photographed. The sigil is the
          real mark, rendered live. Field audio is optional and silent until selected.
        </figcaption>
        <button className="ha-audio" type="button" data-ha-audio aria-pressed="false">
          FIELD AUDIO · OFF
        </button>
      </figure>
    </div>
  );
}
