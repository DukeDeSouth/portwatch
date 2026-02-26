import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import { App } from './app.js';
import { getListeningPorts } from './services/ports.js';
import { enrichWithProcessInfo } from './services/processes.js';
import { killProcess } from './services/killer.js';
import { lookupPort } from './services/portdb.js';

const cli = meow(
	`
  Usage
    $ portwatch [options]

  Options
    --port, -p     Filter by specific port
    --json         Output as JSON (non-interactive)
    --kill         Kill process on port (non-interactive)
    --demo         Show demo with sample data
    --help, -h     Show help
    --version, -v  Show version

  Examples
    $ portwatch
    $ portwatch --port 3000
    $ portwatch --json
    $ portwatch --kill 3000

  Navigation
    ↑/k   Move up       ↓/j   Move down
    /     Filter         s     Sort
    enter Kill process   r     Refresh
    q     Quit
`,
	{
		importMeta: import.meta,
		flags: {
			port: { type: 'number', shortFlag: 'p' },
			json: { type: 'boolean', default: false },
			kill: { type: 'number' },
			demo: { type: 'boolean', default: false },
		},
	},
);

async function jsonMode(portFilter?: number) {
	const raw = getListeningPorts();
	const enriched = await enrichWithProcessInfo(raw);

	const seen = new Set<string>();
	const deduped = enriched.filter((p) => {
		const key = `${p.port}:${p.pid}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});

	const filtered = portFilter ? deduped.filter((p) => p.port === portFilter) : deduped;
	const enrichedWithMeta = filtered.map((p) => {
		const meta = lookupPort(p.port);
		return { ...p, service: meta.name, category: meta.category, risk: meta.risk, note: meta.note ?? null };
	});
	console.log(JSON.stringify(enrichedWithMeta, null, 2));
	process.exit(0);
}

async function killMode(port: number) {
	const raw = getListeningPorts();
	const target = raw.find((p) => p.port === port);

	if (!target) {
		console.error(`No process found on port ${port}`);
		process.exit(1);
	}

	const result = killProcess(target.pid);
	if (result.success) {
		console.log(`Killed ${target.process} (PID ${target.pid}) on port ${port}`);
		process.exit(0);
	} else {
		console.error(`Failed to kill: ${result.error}`);
		process.exit(1);
	}
}

if (cli.flags.json) {
	jsonMode(cli.flags.port);
} else if (cli.flags.kill !== undefined) {
	killMode(cli.flags.kill);
} else {
	render(<App portFilter={cli.flags.port} demo={cli.flags.demo} />);
}
