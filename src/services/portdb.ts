export type PortCategory = 'database' | 'web' | 'cache' | 'messaging' | 'devtool' | 'system' | 'container' | 'unknown';
export type PortRisk = 'safe' | 'dev' | 'sensitive' | 'danger';

export interface PortMeta {
	name: string;
	category: PortCategory;
	risk: PortRisk;
	note?: string;
}

const DB: Record<number, PortMeta> = {
	// Databases
	3306: { name: 'MySQL', category: 'database', risk: 'sensitive', note: 'default creds?' },
	5432: { name: 'PostgreSQL', category: 'database', risk: 'sensitive' },
	5433: { name: 'PostgreSQL (alt)', category: 'database', risk: 'sensitive' },
	27017: { name: 'MongoDB', category: 'database', risk: 'danger', note: 'often unauthed!' },
	27018: { name: 'MongoDB (shard)', category: 'database', risk: 'danger' },
	6379: { name: 'Redis', category: 'cache', risk: 'danger', note: 'no auth by default' },
	6380: { name: 'Redis (alt)', category: 'cache', risk: 'danger' },
	11211: { name: 'Memcached', category: 'cache', risk: 'danger', note: 'no auth' },
	9042: { name: 'Cassandra', category: 'database', risk: 'sensitive' },
	26257: { name: 'CockroachDB', category: 'database', risk: 'sensitive' },
	8529: { name: 'ArangoDB', category: 'database', risk: 'sensitive' },
	7687: { name: 'Neo4j', category: 'database', risk: 'sensitive' },
	9200: { name: 'Elasticsearch', category: 'database', risk: 'danger', note: 'often open' },
	9300: { name: 'Elasticsearch (node)', category: 'database', risk: 'danger' },
	5984: { name: 'CouchDB', category: 'database', risk: 'sensitive' },

	// Web servers
	80: { name: 'HTTP', category: 'web', risk: 'safe' },
	443: { name: 'HTTPS', category: 'web', risk: 'safe' },
	8080: { name: 'HTTP (alt)', category: 'web', risk: 'dev' },
	8443: { name: 'HTTPS (alt)', category: 'web', risk: 'dev' },
	8888: { name: 'HTTP proxy', category: 'web', risk: 'dev' },
	3000: { name: 'Dev server', category: 'devtool', risk: 'dev', note: 'Next.js / Express' },
	3001: { name: 'Dev server', category: 'devtool', risk: 'dev' },
	4000: { name: 'Dev server', category: 'devtool', risk: 'dev' },
	5000: { name: 'Dev server', category: 'devtool', risk: 'dev', note: 'Flask / AirPlay' },
	5173: { name: 'Vite', category: 'devtool', risk: 'dev' },
	5174: { name: 'Vite (alt)', category: 'devtool', risk: 'dev' },
	4200: { name: 'Angular', category: 'devtool', risk: 'dev' },
	8000: { name: 'Dev server', category: 'devtool', risk: 'dev', note: 'Django / PHP' },
	8001: { name: 'Dev server', category: 'devtool', risk: 'dev' },
	1234: { name: 'Parcel', category: 'devtool', risk: 'dev' },
	3456: { name: 'Dev server', category: 'devtool', risk: 'dev' },
	4321: { name: 'Astro', category: 'devtool', risk: 'dev' },
	1420: { name: 'Tauri', category: 'devtool', risk: 'dev' },
	6006: { name: 'Storybook', category: 'devtool', risk: 'dev' },
	9000: { name: 'MinIO / PHP-FPM', category: 'web', risk: 'dev' },
	9001: { name: 'MinIO Console', category: 'web', risk: 'dev' },

	// Messaging / queues
	5672: { name: 'RabbitMQ', category: 'messaging', risk: 'sensitive' },
	15672: { name: 'RabbitMQ UI', category: 'messaging', risk: 'sensitive' },
	9092: { name: 'Kafka', category: 'messaging', risk: 'sensitive' },
	4222: { name: 'NATS', category: 'messaging', risk: 'sensitive' },
	1883: { name: 'MQTT', category: 'messaging', risk: 'sensitive' },

	// Container / orchestration
	2375: { name: 'Docker (unenc)', category: 'container', risk: 'danger', note: 'remote API unencrypted!' },
	2376: { name: 'Docker (TLS)', category: 'container', risk: 'sensitive' },
	2377: { name: 'Docker Swarm', category: 'container', risk: 'sensitive' },
	6443: { name: 'Kubernetes API', category: 'container', risk: 'sensitive' },
	10250: { name: 'Kubelet', category: 'container', risk: 'danger', note: 'often misconfigured' },

	// System / infra
	22: { name: 'SSH', category: 'system', risk: 'safe' },
	53: { name: 'DNS', category: 'system', risk: 'safe' },
	25: { name: 'SMTP', category: 'system', risk: 'sensitive' },
	587: { name: 'SMTP (submit)', category: 'system', risk: 'safe' },
	993: { name: 'IMAPS', category: 'system', risk: 'safe' },
	631: { name: 'CUPS (printing)', category: 'system', risk: 'safe' },
	5353: { name: 'mDNS', category: 'system', risk: 'safe' },
	7000: { name: 'AirPlay', category: 'system', risk: 'safe' },
	49152: { name: 'macOS system', category: 'system', risk: 'safe' },

	// Monitoring / admin
	9090: { name: 'Prometheus', category: 'devtool', risk: 'dev' },
	3100: { name: 'Grafana Loki', category: 'devtool', risk: 'dev' },
	9411: { name: 'Zipkin', category: 'devtool', risk: 'dev' },
	16686: { name: 'Jaeger', category: 'devtool', risk: 'dev' },
	8200: { name: 'Vault', category: 'system', risk: 'sensitive' },

	// Dev tools
	9229: { name: 'Node debugger', category: 'devtool', risk: 'danger', note: 'remote code exec!' },
	9222: { name: 'Chrome DevTools', category: 'devtool', risk: 'danger', note: 'remote debug' },
	5555: { name: 'ADB', category: 'devtool', risk: 'danger', note: 'full device access' },
	4040: { name: 'ngrok', category: 'devtool', risk: 'dev', note: 'tunnel active' },
};

export function lookupPort(port: number): PortMeta {
	const known = DB[port];
	if (known) return known;

	if (port >= 49152) {
		return { name: 'ephemeral', category: 'system', risk: 'safe' };
	}
	if (port >= 1024) {
		return { name: 'unknown', category: 'unknown', risk: 'dev' };
	}
	return { name: 'privileged', category: 'system', risk: 'sensitive' };
}

export const RISK_LABELS: Record<PortRisk, { icon: string; color: string; label: string }> = {
	safe: { icon: '*', color: 'green', label: 'OK' },
	dev: { icon: '*', color: 'yellow', label: 'DEV' },
	sensitive: { icon: '!', color: 'magenta', label: 'SENS' },
	danger: { icon: '!', color: 'red', label: 'WARN' },
};

export const CATEGORY_ICONS: Record<PortCategory, string> = {
	database: 'db',
	web: 'web',
	cache: 'mem',
	messaging: 'mq',
	devtool: 'dev',
	system: 'sys',
	container: 'dock',
	unknown: '???',
};
