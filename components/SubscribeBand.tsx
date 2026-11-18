import SubscribeForm from "./SubscribeForm";

export default function SubscribeBand({ title = "New dispatches, straight to your inbox.", id = "email" }: { title?: string; id?: string }) {
  return (
    <section id="subscribe" className="subscribe">
      <div className="wrap">
        <div style={{ flex: "1 1 360px", display: "flex", flexDirection: "column", gap: 12 }}>
          <h2 className="h2">{title}</h2>
          <div style={{ fontSize: 15, display: "flex", flexWrap: "wrap", gap: 16 }}>
            <a href="/rss.xml" className="link">RSS feed</a>
            <a href="/ussd" className="link">Or by SMS</a>
          </div>
        </div>
        <SubscribeForm id={id} />
      </div>
    </section>
  );
}
