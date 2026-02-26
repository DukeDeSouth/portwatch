export interface PortInfo {
	port: number;
	pid: number;
	process: string;
	command: string;
	protocol: 'tcp' | 'tcp6';
	cpu: number;
	memory: number;
	user: string;
}

export type SortField = 'port' | 'process' | 'cpu' | 'memory';
