import psList from 'ps-list';
import type { PortInfo } from '../types.js';

export async function enrichWithProcessInfo(ports: PortInfo[]): Promise<PortInfo[]> {
	if (ports.length === 0) return [];

	try {
		const processes = await psList();
		const processMap = new Map(processes.map((p) => [p.pid, p]));

		return ports.map((port) => {
			const proc = processMap.get(port.pid);
			if (!proc) return port;

			return {
				...port,
				cpu: proc.cpu ?? 0,
				memory: proc.memory ?? 0,
				command: proc.cmd ?? port.process,
				process: cleanProcessName(proc.name ?? port.process),
			};
		});
	} catch {
		return ports;
	}
}

function cleanProcessName(name: string): string {
	return name.split('/').pop() ?? name;
}
