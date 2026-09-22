# tcg-guides

Static Pokémon TCG deck guides — strategy, decklists, matchups. Deployed at
**https://tcg.cativo.dev**.

No build step: plain HTML/CSS/JS under `site/`, served by nginx in a small
Docker image. Deployed manually to polaris2 alongside the rest of the
`cativo.dev` stack (Traefik, shared `space-server_web` network).

## Local preview

```bash
cd site && python3 -m http.server 8899
```

## Deploy (manual, no CI)

```bash
docker build -t cativo23/tcg-guides:latest .
docker push cativo23/tcg-guides:latest

ssh polaris2
mkdir -p ~/deploy/tcg-guides
# copy compose.prod.yml there
cd ~/deploy/tcg-guides
docker compose -f compose.prod.yml pull
docker compose -f compose.prod.yml up -d
```

DNS: `tcg.cativo.dev` is already covered by the `*.cativo.dev` wildcard record
— no DNS changes needed for a new subdomain under this domain.
