# Edge Notes

Allan's corner of the internet: research on distributed systems and reinforcement learning, build logs, guitar, health and whatever else has his attention. Written in Nairobi.

It's a Next.js site backed by its own Postgres, running in Docker on a VPS. Every push to `main` deploys itself.

## What's in it

| Page | What it does |
| --- | --- |
| `/` | Home: the network of everything the site covers, Ask box, latest posts, Lab, work, office hours |
| `/notes` | All posts, filtered by lane (Research, Build log, Guitar, Health, Off-grid) or topic; series drawn as matatu routes |
| `/notes/<slug>` | A post: English/Kiswahili switch, save for offline, reader margin notes, packet trace with the reader's own ping |
| `/ask` | Ask the Notes: answers quoted only from the posts, every passage cited |
| `/lab` | Place the Task (weekly game with a leaderboard), Break the Network, Watch it learn |
| `/work` | Papers in plain words, and the demos |
| `/now` | Now, Uses and Shelf |
| `/ussd` | A phone simulator that runs the real USSD menu |
| `/fail-log` | Experiments that didn't work |
| `/rss.xml` | RSS feed |

## Writing a post

Add a markdown file to `content/posts/`, commit and push. That's it.

```markdown
---
title: "My post title"
dek: "One line that sells it."
lane: guitar          # research | build | guitar | health | off-grid
date: 2026-11-20
topics: [Guitar]
series: kubernetes-from-zero   # optional: puts it on a matatu route
part: 2                        # optional: which stop on the route
featured: true                 # optional: top of /notes
draft: true                    # optional: hidden until you remove this line
---

Write here. ==Double equals== highlights a line.
```

For a Kiswahili version, add `my-post.sw.md` next to it with its own `title`, `dek` and body. The post then gets an EN/SW switch.

Everything that isn't a post (Now, Uses, Shelf, papers, fail log, series, the USSD code, the booking link) lives in `lib/site.ts`. Text in `[brackets]` is a placeholder waiting for you.

## Running it on your computer

```bash
npm install
npm run dev            # http://localhost:3000, works without a database
```

To use the database locally, start Postgres with Docker, then point the site at it:

```bash
docker run -d --name edge-db -e POSTGRES_PASSWORD=dev -e POSTGRES_USER=edge -e POSTGRES_DB=edge_notes -p 5432:5432 pgvector/pgvector:pg16
set DATABASE_URL=postgres://edge:dev@localhost:5432/edge_notes      # Windows (cmd)
npm run migrate
npm run dev
```

## Going live on the VPS

1. **On the VPS**, as root (or with `sudo`):

   ```bash
   curl -fsSL https://raw.githubusercontent.com/kiche-allan/edge-notes/main/scripts/vps-setup.sh | sudo bash
   ```

   It installs Docker if needed, starts Postgres and the site on **port 8080** (Piwigo keeps 80/443), and prints the address plus four values for GitHub.

2. **On GitHub**: Repo › Settings › Secrets and variables › Actions. Add `VPS_HOST`, `VPS_USER`, `VPS_PORT` and `VPS_SSH_KEY` exactly as the script printed them.

3. Push anything to `main`. The **CI and deploy** workflow type-checks, builds, then logs into the VPS, pulls and restarts. It fails loudly if the site doesn't come back healthy.

### Useful commands on the VPS

```bash
cd /opt/edge-notes
docker compose ps                    # is it running?
docker compose logs -f web           # site logs
docker compose exec db psql -U edge edge_notes    # the database
docker compose exec db pg_dump -U edge edge_notes > backup.sql   # back it up
```

### Adding a domain later

Point the domain's A record at the VPS, set `SITE_URL=https://yourdomain` in `/opt/edge-notes/.env`, and put a reverse proxy (Caddy or Nginx, whichever Piwigo already uses) in front of port 8080 for HTTPS. Then `docker compose up -d`.

## Database

Postgres 16 with pgvector, in the same Docker Compose project, never exposed to the internet. Tables: `subscribers` (email and SMS), `margin_notes`, `questions` (everything asked on /ask), `lab_scores`, and `note_chunks` (ready for semantic search). Migrations in `db/migrations/` run automatically on every start.

## USSD for real

`/api/ussd` already speaks the Africa's Talking USSD format. Register a service code with Africa's Talking, set its callback to `https://<your-domain>/api/ussd?key=<USSD_SECRET>`, put the same secret in `.env`, and update `ussdCode` in `lib/site.ts`.

## Testing

- `npm run typecheck` and `npm run build` run on every push.
- `postman/edge-notes.postman_collection.json` covers every API with tests. Import it into Postman and set `baseUrl` to `http://<VPS-IP>:8080`, or run it from the command line: `npx newman run postman/edge-notes.postman_collection.json --env-var baseUrl=http://<VPS-IP>:8080`.
- `sonar-project.properties` is ready for SonarQube.
