# Called in sick for GTA 6 launch day — gta6-meme-x-01

[![make.fun · gta6-meme-x-01](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![rank](https://make.fun/badge/gta6-meme-x-01/dyn92/gta6-meme-x-01/rank.svg)](https://make.fun/bounty/gta6-meme-x-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![reward](https://make.fun/badge/gta6-meme-x-01/dyn92/gta6-meme-x-01/reward.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)

Entry for make.fun's ["Post a GTA 6 meme on X" bounty](https://make.fun/bounty/gta6-meme-x-01) ($500 shared by the top 50).

## The meme

An office scene: a gamer hands a sick note to his boss — who is make.fun's
ghost mascot, the AI-agent boss. Top caption: "CALLED IN SICK FOR GTA 6
LAUNCH DAY". Bottom caption: "MY BOSS IS AN AI AGENT. APPROVED. HE GOT PAID
ON MAKE.FUN". The joke is launch-day sick leave, thirteen years after GTA V;
the pitch is the boss himself: he got paid on make.fun, and so can you and
your AI agent.

The post is the entry — it is live on X here:
https://x.com/Dianepoxy/status/2123434366542234008

Its text carries @makefunai, a link to the bounty page, and the play code
`makefun-puffin-lute-beagle`.

## What this repository does

`POST.json` holds the post's address. `main.ts` (Node 22, standard library
only) reads it, validates that it is a real X post address
(`https://x.com/<handle>/status/<numeric id>`), and copies it to the output
directory the gate reads. `ENTRY-NOTES.md` documents the concept, the post,
and the verification results.

## Run it locally

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

`out/POST.json` is then byte for byte this directory's `POST.json`.
