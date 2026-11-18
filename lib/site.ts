// Everything on the site that is not a post lives here. Edit freely; [brackets] are placeholders.

export const SITE = {
  name: "Edge Notes",
  author: "Allan",
  city: "Nairobi",
  tagline: "Notes from the edge of the network.",
  description:
    "Research on distributed systems and reinforcement learning, build logs from real projects, and everything else I love: guitar, health and whatever has my attention this month.",
  ussdCode: "*384*[code]#",
  smsShortcode: "[shortcode]",
  // Paste a Calendly / Cal.com link here to switch on the "Book a slot" button.
  bookingUrl: "",
};

export type Series = { id: string; num: string; title: string; dek: string; stops: string[] };

export const SERIES: Series[] = [
  { id: "scheduling-at-the-edge", num: "01", title: "Scheduling at the edge", dek: "From one scheduler to many: the ideas behind PRISM.", stops: ["Why one scheduler isn't enough", "[Part 2]", "[Part 3]", "[Part 4]"] },
  { id: "kubernetes-from-zero", num: "02", title: "Kubernetes from zero", dek: "Three months, one cluster, every mistake written down.", stops: ["The plan", "[Part 2]", "[Part 3]", "[Part 4]", "[Part 5]", "[Part 6]"] },
  { id: "building-sauti-ya-sheria", num: "03", title: "Building Sauti ya Sheria", dek: "A Swahili voice assistant for Kenyan data law, end to end.", stops: ["[Part 1]", "Answering out loud on WhatsApp", "[Part 3]"] },
];

export const NOW = {
  updated: "Nov 2026",
  items: [
    { kind: "Learning", text: "Kubernetes from scratch: a three-month plan, written up as I go." },
    { kind: "Building", text: "Sauti ya Sheria, a Swahili voice-note bot on WhatsApp for questions about Kenyan data law." },
    { kind: "Researching", text: "Multi-coordinator RL for task placement at the vehicular edge." },
    { kind: "Studying", text: "MSc in Data Science." },
    { kind: "Playing", text: "[What you're learning on guitar right now.]" },
    { kind: "Training", text: "[Your current health or fitness focus.]" },
  ],
};

export const USES = [
  { group: "Hardware", items: [{ name: "Windows PC", note: "Main development machine" }, { name: "[Guitar]", note: "[note]" }] },
  { group: "Editor & terminal", items: [{ name: "[Editor]", note: "[note]" }, { name: "[Terminal]", note: "[note]" }] },
  { group: "Research stack", items: [{ name: "SUMO", note: "Vehicular traffic simulation" }, { name: "Lightning AI", note: "Experiment runs" }] },
  { group: "Build stack", items: [{ name: "FastAPI · FAISS · Ollama", note: "RAG services" }, { name: "Next.js · PostgreSQL", note: "Web apps, including this one" }, { name: "Docker · Kubernetes · Terraform", note: "Infrastructure" }] },
];

export const SHELF = [
  { kind: "Paper", status: "Reading", title: "[Paper title]", note: "[The line you would underline.]", spine: "#B4472B" },
  { kind: "Book", status: "Finished", title: "[Book title]", note: "[The line you would underline.]", spine: "#3F5A4A" },
  { kind: "Book", status: "Up next", title: "[Book title]", note: "[Why it is next.]", spine: "#7A5C1F" },
  { kind: "Paper", status: "Finished", title: "[Paper title]", note: "[The line you would underline.]", spine: "#1F1A14" },
];

export const PAPERS = [
  {
    tag: "Research report · Carnegie Mellon",
    title: "PRISM: multi-coordinator reinforcement learning for IoT task placement",
    meta: "With [co-authors] · [year] · GNN-based RL, SUMO vehicular simulations",
    lab: { label: "Play Place the Task", href: "/lab#place-the-task" },
    plain: "When cars keep moving, one central scheduler is always a step behind. PRISM splits the job across several coordinators that each learn where to send tasks, and they work together.",
    why: "Faster, steadier placement for connected vehicles and IoT devices at the network edge.",
    pdf: "",
  },
  {
    tag: "Research · Carnegie Mellon",
    title: "Cozaik: a distributed dataflow compiler",
    meta: "[Authors] · [year] · QPF evaluation, contention detection",
    lab: { label: "Play Break the Network", href: "/lab#break-the-network" },
    plain: "A compiler that takes one program and splits it across many machines. The work here is measuring it honestly, and spotting when the pieces start fighting over the same resources.",
    why: "Distributed programs that are easier to write and easier to trust.",
    pdf: "",
  },
];

export type FailStatus = "post" | "stuck" | "abandoned";

export const FAILS: { num: string; project: string; date: string; title: string; tried: string; happened: string; learned: string; status: FailStatus }[] = [
  { num: "001", project: "[Project]", date: "[Month Year]", title: "[What you expected to work]", tried: "[The approach, in one or two sentences.]", happened: "[What actually happened, with the number or error if you have it.]", learned: "[What you would do differently.]", status: "post" },
];

export const ISSUES: { title: string; date: string; href: string }[] = [];
