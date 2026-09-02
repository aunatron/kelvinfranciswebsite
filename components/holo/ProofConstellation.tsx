import type { Sourced } from "@/lib/content";
import type { RecordEntry } from "@/lib/validate";

const NATIVE_W = 1672;
const NATIVE_H = 941;

type Station = {
  name: string;
  l: number;
  t: number;
  w: number;
  h: number;
  dx: number;
  dy: number;
  flip?: boolean;
};

const STATIONS: readonly Station[] = [
  { name: "Client delivery", l: 11.4, t: 26.6, w: 24.8, h: 23.4, dx: 0.72, dy: 0.77 },
  { name: "Language AI", l: 7.8, t: 56.9, w: 26.6, h: 30.3, dx: 0.5, dy: 0.45 },
  { name: "Aunatron Systems", l: 36.5, t: 8.7, w: 28.7, h: 62.5, dx: 0.5, dy: 0.48 },
  { name: "Regulatory systems", l: 71.2, t: 8.9, w: 15.9, h: 41.6, dx: 0.5, dy: 0.55, flip: true },
  { name: "Fraud detection", l: 67.6, t: 59.5, w: 22.1, h: 28, dx: 0.48, dy: 0.45, flip: true },
];

export default function ProofConstellation({ entries }: { entries: Sourced<RecordEntry>[] }) {
  return (
    <figure className="ha pc" data-holo-art>
      <div
        className="ha-stage"
        style={{ "--ha-w": NATIVE_W, "--ha-h": NATIVE_H } as React.CSSProperties}
      >
        <div className="ha-visual" data-ha-stage>
          <div className="ha-raster">
            <img
              src="/scenes/e2-2-r02-proof-constellation.avif"
              width={NATIVE_W}
              height={NATIVE_H}
              loading="lazy"
              decoding="async"
              alt="Five gold wireframe stations connected to a central structure, representing the five dated entries in the builds ledger."
            />
          </div>
          <div className="ha-hotspots">
            {STATIONS.map((station) => {
              const entry = entries.find((item) => item.name === station.name);
              if (!entry) return null;
              const cx = station.l + station.w / 2;
              const cy = station.t + station.h / 2;
              const x = station.l + station.w * station.dx;
              const y = station.t + station.h * station.dy;
              return (
                <div className="ha-node" key={entry.source.path}>
                  <button
                    type="button"
                    className="ha-hot"
                    aria-label={`${entry.name}, ${entry.year}, ${entry.status}`}
                    aria-pressed="false"
                    style={
                      {
                        "--l": `${cx}%`,
                        "--t": `${cy}%`,
                        "--w": `${station.w}%`,
                        "--h": `${station.h}%`,
                      } as React.CSSProperties
                    }
                  />
                  <span
                    className={`ha-marker${station.flip ? " ha-marker--flip" : ""}`}
                    style={{ "--x": `${x}%`, "--y": `${y}%` } as React.CSSProperties}
                    aria-hidden="true"
                  >
                    <span className="ha-dot" />
                    <span className="ha-label">{entry.name} · {entry.year} · {entry.status}</span>
                  </span>
                </div>
              );
            })}
          </div>
          <div className="ha-scan" aria-hidden="true" />
        </div>
      </div>
      <figcaption className="fine">
        The proof constellation. Five symbolic stations, labelled from the source ledger.
        A station is evidence of a recorded build, not a claim that the image is a literal system diagram.
      </figcaption>
    </figure>
  );
}
