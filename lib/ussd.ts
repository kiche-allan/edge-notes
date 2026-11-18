// USSD menu in Africa's Talking format: the gateway sends the whole path so far as "1*2",
// and we answer "CON ..." (keep the session open) or "END ..." (close it). Max ~182 characters.

export type UssdPost = { slug: string; title: string; dek: string };
export type UssdResult = { reply: string; subscribe?: boolean };

const MAX = 182;
const fit = (s: string) => (s.length <= MAX ? s : s.slice(0, MAX - 1) + "…");
const short = (s: string, n = 28) => (s.length <= n ? s : s.slice(0, n - 1) + "…");

const L = {
  en: { title: "EDGE NOTES", latest: "Latest notes", ask: "Ask a question", sub: "Subscribe by SMS", sw: "Kiswahili", back: "Back", exit: "Exit", read: "Read", askEnd: (sc: string) => `SMS your question to ${sc}. Answers come from the notes, with a link.`, subEnd: "Subscribed. 1 SMS per new note. Reply STOP to unsubscribe.", bad: "Invalid choice. Dial again." },
  sw: { title: "EDGE NOTES", latest: "Makala mpya", ask: "Uliza swali", sub: "Jiandikishe kwa SMS", sw: "English", back: "Rudi", exit: "Toka", read: "Soma", askEnd: (sc: string) => `Tuma swali lako kwa SMS kwenda ${sc}. Majibu yanatoka kwenye makala, pamoja na kiungo.`, subEnd: "Umejiandikisha. SMS 1 kwa kila makala mpya. Jibu STOP kujiondoa.", bad: "Chaguo si sahihi. Piga tena." },
};

/** Resolve "0" (back) entries so "1*0*2" behaves like "2". */
function path(text: string): string[] {
  const out: string[] = [];
  for (const t of text.split("*").map((s) => s.trim()).filter((s) => s !== "")) {
    if (t === "0") out.pop();
    else out.push(t);
  }
  return out;
}

export function ussd(text: string, posts: UssdPost[], opts: { siteUrl: string; shortcode: string }): UssdResult {
  let steps = path(text);
  let lang: "en" | "sw" = "en";
  if (steps[0] === "4") { lang = "sw"; steps = steps.slice(1); }
  const t = L[lang];
  const latest = posts.slice(0, 3);

  if (steps.length === 0) {
    return { reply: fit(`CON ${t.title}\n1. ${t.latest}\n2. ${t.ask}\n3. ${t.sub}\n${lang === "en" ? `4. ${t.sw}` : `0. ${t.back}`}`) };
  }
  const [first, second] = steps;
  if (first === "1") {
    if (!second) {
      return { reply: fit(`CON ${t.latest}\n${latest.map((p, i) => `${i + 1}. ${short(p.title)}`).join("\n")}\n0. ${t.back}`) };
    }
    const post = latest[Number(second) - 1];
    if (!post) return { reply: `END ${t.bad}` };
    // The link must survive intact, so the title and summary share whatever space is left.
    const link = `\n${t.read}: ${opts.siteUrl}/notes/${post.slug}`;
    const room = Math.max(0, MAX - "END ".length - link.length);
    const titleText = short(post.title, Math.min(60, room));
    const dekRoom = room - titleText.length - 1;
    const head = dekRoom > 12 ? `${titleText}\n${short(post.dek, dekRoom)}` : titleText;
    return { reply: `END ${head}${link}` };
  }
  if (first === "2") return { reply: fit(`END ${t.askEnd(opts.shortcode)}`) };
  if (first === "3") return { reply: fit(`END ${t.subEnd}`), subscribe: true };
  return { reply: `END ${t.bad}` };
}
