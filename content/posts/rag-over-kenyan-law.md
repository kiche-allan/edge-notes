---
title: "Retrieval over Kenyan law: a RAG stack that cites its sources"
dek: "Chunking, grounding and refusing to answer when the text does not say."
lane: build
date: 2026-09-12
topics: [RAG, Kenyan law]
---

The compliance assistant answers questions on the Data Protection Act and AML/CFT rules for fintechs. Every answer shows the clause it came from, side by side. The stack is FastAPI, FAISS and Ollama, with a Next.js front end and PostgreSQL.

## Grounding

[Body paragraph: chunking the Act, and refusing to answer when the text does not say.]
