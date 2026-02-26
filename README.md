# portwatch

See what's listening on every port. Know what's safe, what's risky, and kill it in one keystroke.

```
npx portwatch
```

```
[portwatch]  14 ports listening  |  refresh 2s
  5 warnings found  |  3 sensitive

  ST     PORT  TYPE SERVICE          PROCESS                 PID     CPU     MEM  NOTE
  ─────────────────────────────────────────────────────────────────────────────────────
> OK       22  sys  SSH              sshd                      1   0.0%   2.1M
  OK       80  web  HTTP             nginx                   420   0.3%  12.4M
  WARN   2375  dock Docker (unenc)   dockerd                1100   0.6%  96.0M  remote API unencrypted!
  DEV    3000  dev  Dev server       next-server             8842   2.3%   148M  Next.js / Express
  SENS   5432  db   PostgreSQL       postgres                 501   0.4%  38.2M
  WARN   6379  mem  Redis            redis-server             612   0.8%   9.6M  no auth by default
  DEV    8000  dev  Dev server       uvicorn                 9103   1.1%  64.0M  Django / PHP
  WARN   9200  db   Elasticsearch    java                    1055   4.2%   512M  often open
  WARN   9229  dev  Node debugger    node                    8842   0.0%  48.0M  remote code exec!
  WARN  27017  db   MongoDB          mongod                   830   1.5%   256M  often unauthed!

  OK safe   DEV dev-only   SENS sensitive   WARN check config     sort: port

  j/k nav  / filter  enter kill  s sort  r refresh  q quit
```

## Install

```bash
# Run instantly — no install needed
npx portwatch

# Or install globally
npm i -g portwatch
```

## What it does

- Scans all listening ports on your machine
- Identifies 70+ known services (databases, caches, dev tools, containers)
- Classifies risk: `OK` / `DEV` / `SENS` / `WARN`
- Shows CPU and memory per process
- Lets you kill processes interactively with confirmation

## Usage

```bash
# Interactive TUI
portwatch

# Filter by port
portwatch --port 3000

# JSON output for scripting
portwatch --json

# Kill process on port (non-interactive)
portwatch --kill 3000

# Demo mode (sample data, no real ports)
portwatch --demo
```

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `j` / `k` | Navigate up/down |
| `/` | Filter by port or process |
| `Enter` | Kill selected process |
| `s` | Cycle sort (port → cpu → mem → name) |
| `r` | Force refresh |
| `q` | Quit |

## Risk levels

| Level | Meaning | Example |
|-------|---------|---------|
| `OK` | Safe, standard service | SSH, nginx, HTTPS |
| `DEV` | Dev-only, fine locally | Vite, Next.js, Storybook |
| `SENS` | Sensitive, check access | PostgreSQL, RabbitMQ |
| `WARN` | Check config now | Redis (no auth), MongoDB (unauthed), Docker API |

## JSON output

```bash
portwatch --json
```

```json
[
  {
    "port": 6379,
    "pid": 612,
    "process": "redis-server",
    "cpu": 0.8,
    "memory": 9.6,
    "service": "Redis",
    "category": "cache",
    "risk": "danger",
    "note": "no auth by default"
  }
]
```

## Why not just `lsof`?

| | portwatch | lsof | netstat |
|---|---|---|---|
| Install | `npx` | pre-installed | pre-installed |
| Output | Interactive TUI | Raw text | Raw text |
| Risk assessment | Yes | No | No |
| Service identification | 70+ services | No | No |
| CPU/Memory | Yes | No | No |
| Kill process | One keystroke | Manual | Manual |
| JSON export | Yes | No | No |

## Requirements

- Node.js 18+
- macOS or Linux

## License

MIT
