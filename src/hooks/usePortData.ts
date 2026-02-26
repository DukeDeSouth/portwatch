import { useState, useEffect, useCallback } from 'react';
import { getListeningPorts } from '../services/ports.js';
import { enrichWithProcessInfo } from '../services/processes.js';
import type { PortInfo } from '../types.js';

export function usePortData(refreshInterval = 2000) {
	const [ports, setPorts] = useState<PortInfo[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const refresh = useCallback(async () => {
		try {
			const raw = getListeningPorts();
			const enriched = await enrichWithProcessInfo(raw);

			const seen = new Set<string>();
			const deduped = enriched.filter((p) => {
				const key = `${p.port}:${p.pid}`;
				if (seen.has(key)) return false;
				seen.add(key);
				return true;
			});

			setPorts(deduped);
			setError(null);
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : String(e));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		refresh();
		const interval = setInterval(refresh, refreshInterval);
		return () => clearInterval(interval);
	}, [refresh, refreshInterval]);

	return { ports, loading, error, refresh };
}
