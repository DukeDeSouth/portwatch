import React, { useState, useMemo } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { Header } from './components/Header.js';
import { PortTable } from './components/PortTable.js';
import { StatusBar } from './components/StatusBar.js';
import { KillConfirm } from './components/KillConfirm.js';
import { usePortData } from './hooks/usePortData.js';
import { killProcess } from './services/killer.js';
import { lookupPort } from './services/portdb.js';
import { getDemoPorts } from './services/demo.js';
import type { SortField } from './types.js';

interface AppProps {
	portFilter?: number;
	demo?: boolean;
}

const SORT_CYCLE: SortField[] = ['port', 'cpu', 'memory', 'process'];

export function App({ portFilter, demo }: AppProps) {
	const realData = usePortData();
	const ports = demo ? getDemoPorts() : realData.ports;
	const loading = demo ? false : realData.loading;
	const error = demo ? null : realData.error;
	const refresh = demo ? () => {} : realData.refresh;
	const [selected, setSelected] = useState(0);
	const [showKill, setShowKill] = useState(false);
	const [filter, setFilter] = useState('');
	const [filterMode, setFilterMode] = useState(false);
	const [sortField, setSortField] = useState<SortField>('port');
	const [killResult, setKillResult] = useState<string | null>(null);
	const { exit } = useApp();

	const filtered = useMemo(() => {
		let list = ports;

		if (portFilter) {
			list = list.filter((p) => p.port === portFilter);
		}

		if (filter) {
			const f = filter.toLowerCase();
			list = list.filter(
				(p) => p.process.toLowerCase().includes(f) || String(p.port).includes(f),
			);
		}

		list = [...list].sort((a, b) => {
			const av = a[sortField];
			const bv = b[sortField];
			if (typeof av === 'number' && typeof bv === 'number') return av - bv;
			return String(av).localeCompare(String(bv));
		});

		return list;
	}, [ports, portFilter, filter, sortField]);

	const dangerCount = filtered.filter((p) => lookupPort(p.port).risk === 'danger').length;
	const sensitiveCount = filtered.filter((p) => lookupPort(p.port).risk === 'sensitive').length;

	const clampSelected = (s: number) => Math.max(0, Math.min(s, filtered.length - 1));

	useInput((input, key) => {
		if (killResult) {
			setKillResult(null);
			return;
		}

		if (showKill) {
			if (input === 'y' || input === 'Y') {
				const target = filtered[clampSelected(selected)];
				if (target) {
					const result = killProcess(target.pid);
					setKillResult(
						result.success ? `✓ Killed ${target.process} (PID ${target.pid})` : `✗ ${result.error}`,
					);
					setShowKill(false);
					setTimeout(refresh, 500);
				}
			}
			if (input === 'n' || input === 'N' || key.escape) {
				setShowKill(false);
			}
			return;
		}

		if (filterMode) {
			if (key.escape) {
				setFilterMode(false);
				setFilter('');
				return;
			}
			if (key.return) {
				setFilterMode(false);
				return;
			}
			if (key.backspace || key.delete) {
				setFilter((f) => f.slice(0, -1));
				return;
			}
			if (input && !key.ctrl && !key.meta) {
				setFilter((f) => f + input);
				setSelected(0);
			}
			return;
		}

		if (input === 'q') exit();
		if (input === '/') {
			setFilterMode(true);
			setFilter('');
		}
		if (input === 'r') refresh();
		if (input === 's') {
			const idx = SORT_CYCLE.indexOf(sortField);
			setSortField(SORT_CYCLE[(idx + 1) % SORT_CYCLE.length]!);
		}
		if (key.upArrow || input === 'k') setSelected((s) => clampSelected(s - 1));
		if (key.downArrow || input === 'j') setSelected((s) => clampSelected(s + 1));
		if (key.return && filtered.length > 0) setShowKill(true);
	});

	return (
		<Box flexDirection="column" paddingX={1}>
			<Header count={filtered.length} loading={loading} dangerCount={dangerCount} sensitiveCount={sensitiveCount} />

			{error ? (
				<Box>
					<Text color="red">Error: {error}</Text>
				</Box>
			) : (
				<PortTable ports={filtered} selected={clampSelected(selected)} sortField={sortField} />
			)}

			{showKill && filtered[clampSelected(selected)] && (
				<KillConfirm port={filtered[clampSelected(selected)]!} />
			)}

			{killResult && (
				<Box marginY={1}>
					<Text color={killResult.startsWith('✓') ? 'green' : 'red'}>{killResult}</Text>
					<Text dimColor> (press any key)</Text>
				</Box>
			)}

			<StatusBar filterMode={filterMode} filter={filter} />
		</Box>
	);
}
