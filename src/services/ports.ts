import { execSync } from 'node:child_process';
import { platform } from 'node:os';
import type { PortInfo } from '../types.js';

export function getListeningPorts(): PortInfo[] {
	const os = platform();

	if (os === 'darwin') {
		return parseLsof();
	}

	if (os === 'linux') {
		const lsofResult = tryLsofLinux();
		if (lsofResult !== null) return lsofResult;
		return parseSs();
	}

	throw new Error(`Unsupported platform: ${os}. portwatch supports macOS and Linux.`);
}

function runCommand(cmd: string): string | null {
	try {
		return execSync(cmd, { encoding: 'utf8', timeout: 5000, stdio: ['pipe', 'pipe', 'pipe'] });
	} catch {
		return null;
	}
}

function parseLsof(): PortInfo[] {
	const output = runCommand('lsof -iTCP -sTCP:LISTEN -P -n');
	if (!output) return [];

	return output
		.split('\n')
		.slice(1)
		.filter((line) => line.trim())
		.map((line) => {
			const parts = line.trim().split(/\s+/);
			if (parts.length < 9) return null;

			const namePart = parts[parts.length - 2]!;
			const portStr = namePart.split(':').pop();
			if (!portStr) return null;
			const port = parseInt(portStr, 10);
			if (isNaN(port)) return null;

			return {
				port,
				pid: parseInt(parts[1]!, 10),
				process: parts[0]!,
				command: parts[0]!,
				protocol: (parts[4]?.includes('6') ? 'tcp6' : 'tcp') as PortInfo['protocol'],
				cpu: 0,
				memory: 0,
				user: parts[2] ?? '',
			};
		})
		.filter((p): p is PortInfo => p !== null);
}

function parseSs(): PortInfo[] {
	const output = runCommand('ss -tlnp');
	if (!output) return [];

	return output
		.split('\n')
		.slice(1)
		.filter((line) => line.startsWith('LISTEN'))
		.map((line) => {
			const parts = line.trim().split(/\s+/);
			if (parts.length < 5) return null;

			const localAddr = parts[3]!;
			const portStr = localAddr.split(':').pop();
			if (!portStr) return null;
			const port = parseInt(portStr, 10);
			if (isNaN(port) || port <= 0) return null;

			const processInfo = parts.slice(5).join(' ');
			const processMatch = processInfo.match(/\("([^"]+)",pid=(\d+)/);
			const processName = processMatch?.[1] ?? 'unknown';
			const pid = parseInt(processMatch?.[2] ?? '0', 10);

			return {
				port,
				pid,
				process: processName,
				command: processName,
				protocol: (localAddr.includes('[') ? 'tcp6' : 'tcp') as PortInfo['protocol'],
				cpu: 0,
				memory: 0,
				user: '',
			};
		})
		.filter((p): p is PortInfo => p !== null);
}

function tryLsofLinux(): PortInfo[] | null {
	const which = runCommand('which lsof');
	if (!which) return null;
	return parseLsof();
}
