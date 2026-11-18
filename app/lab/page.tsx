import type { Metadata } from "next";
import PlaceTheTask from "./PlaceTheTask";
import BreakTheNetwork from "./BreakTheNetwork";
import WatchItLearn from "./WatchItLearn";

export const metadata: Metadata = { title: "The Lab" };

export default function LabPage() {
  return (
    <div className="night">
      <section className="wrap stack" style={{ padding: "72px 32px 48px" }}>
        <div className="kicker">The Lab</div>
        <h1 className="display">Research you can play with.</h1>
        <p className="lede" style={{ maxWidth: 640 }}>Small, honest simulations of the systems I study. Each one links back to the notes that explain it.</p>
      </section>
      <section className="wrap" style={{ paddingBottom: 48 }}><PlaceTheTask /></section>
      <section className="wrap row" style={{ paddingBottom: 96, gap: 32 }}>
        <BreakTheNetwork />
        <WatchItLearn />
      </section>
    </div>
  );
}
