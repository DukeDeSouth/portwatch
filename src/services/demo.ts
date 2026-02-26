import type { PortInfo } from '../types.js';

export function getDemoPorts(): PortInfo[] {
	return [
		{ port: 22, pid: 1, process: 'sshd', command: '/usr/sbin/sshd', protocol: 'tcp', cpu: 0.0, memory: 2.1, user: 'root' },
		{ port: 80, pid: 420, process: 'nginx', command: 'nginx: master process', protocol: 'tcp', cpu: 0.3, memory: 12.4, user: 'www-data' },
		{ port: 443, pid: 420, process: 'nginx', command: 'nginx: master process', protocol: 'tcp', cpu: 0.1, memory: 12.4, user: 'www-data' },
		{ port: 3000, pid: 8842, process: 'next-server', command: 'node .next/standalone/server.js', protocol: 'tcp', cpu: 2.3, memory: 148.0, user: 'dev' },
		{ port: 5432, pid: 501, process: 'postgres', command: '/usr/lib/postgresql/16/bin/postgres', protocol: 'tcp', cpu: 0.4, memory: 38.2, user: 'postgres' },
		{ port: 5433, pid: 16840, process: 'postgres', command: 'postgres -p 5433', protocol: 'tcp', cpu: 0.2, memory: 24.0, user: 'postgres' },
		{ port: 6379, pid: 612, process: 'redis-server', command: 'redis-server *:6379', protocol: 'tcp', cpu: 0.8, memory: 9.6, user: 'redis' },
		{ port: 8000, pid: 9103, process: 'uvicorn', command: 'uvicorn main:app --port 8000', protocol: 'tcp', cpu: 1.1, memory: 64.0, user: 'dev' },
		{ port: 8080, pid: 7721, process: 'node', command: 'node dist/server.js', protocol: 'tcp', cpu: 0.5, memory: 52.3, user: 'dev' },
		{ port: 9229, pid: 8842, process: 'node', command: 'node --inspect dist/cli.js', protocol: 'tcp', cpu: 0.0, memory: 48.0, user: 'dev' },
		{ port: 27017, pid: 830, process: 'mongod', command: '/usr/bin/mongod --config /etc/mongod.conf', protocol: 'tcp', cpu: 1.5, memory: 256.0, user: 'mongodb' },
		{ port: 5672, pid: 944, process: 'beam.smp', command: 'rabbitmq-server', protocol: 'tcp', cpu: 0.3, memory: 82.0, user: 'rabbitmq' },
		{ port: 9200, pid: 1055, process: 'java', command: 'elasticsearch', protocol: 'tcp', cpu: 4.2, memory: 512.0, user: 'elastic' },
		{ port: 2375, pid: 1100, process: 'dockerd', command: '/usr/bin/dockerd -H tcp://0.0.0.0:2375', protocol: 'tcp', cpu: 0.6, memory: 96.0, user: 'root' },
	];
}
