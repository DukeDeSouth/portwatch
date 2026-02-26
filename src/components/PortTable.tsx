import React from 'react';
import { Box, Text } from 'ink';
import type { PortInfo, SortField } from '../types.js';
import { lookupPort, RISK_LABELS, CATEGORY_ICONS } from '../services/portdb.js';

interface PortTableProps {
	ports: PortInfo[];
	selected: number;
	sortField: SortField;
}

function formatCpu(cpu: number): string {
	return cpu.toFixed(1) + '%';
}

function formatMemory(mem: number): string {
	if (mem >= 100) return Math.round(mem) + 'M';
	if (mem >= 1) return mem.toFixed(1) + 'M';
	if (mem > 0) return '<1M';
	return '-';
}

function cpuColor(cpu: number): string {
	if (cpu > 50) return 'red';
	if (cpu > 20) return 'yellow';
	return 'green';
}

function truncate(str: string, max: number): string {
	if (str.length <= max) return str;
	return str.slice(0, max - 1) + '~';
}

function pad(str: string, width: number): string {
	return str.padEnd(width);
}

function rpad(str: string, width: number): string {
	return str.padStart(width);
}

export function PortTable({ ports, selected, sortField }: PortTableProps) {
	if (ports.length === 0) {
		return (
			<Box flexDirection="column" paddingY={2}>
				<Text color="green" bold>  [OK] All clear</Text>
				<Text dimColor>  No listening ports. You're clean.</Text>
			</Box>
		);
	}

	return (
		<Box flexDirection="column">
			<Box>
				<Text bold dimColor>
					{'  '}
					{pad('ST', 5)}
					{rpad('PORT', 6)}
					{'  '}
					{pad('TYPE', 5)}
					{pad('SERVICE', 16)}
					{pad('PROCESS', 22)}
					{rpad('PID', 7)}
					{rpad('CPU', 7)}
					{rpad('MEM', 7)}
					{'  NOTE'}
				</Text>
			</Box>

			<Text dimColor>  {'─'.repeat(90)}</Text>

			{ports.map((p, i) => {
				const isSelected = i === selected;
				const meta = lookupPort(p.port);
				const risk = RISK_LABELS[meta.risk];
				const catTag = CATEGORY_ICONS[meta.category];

				return (
					<Box key={`${p.port}-${p.pid}-${i}`}>
						<Text inverse={isSelected} color={isSelected ? 'cyan' : undefined}>
							{isSelected ? '> ' : '  '}
							<Text color={risk.color} bold={meta.risk === 'danger'}>{pad(risk.label, 5)}</Text>
							<Text color="yellow" bold>{rpad(String(p.port), 6)}</Text>
							{'  '}
							<Text dimColor>{pad(catTag, 5)}</Text>
							<Text>{pad(truncate(meta.name, 15), 16)}</Text>
							<Text bold color={meta.risk === 'danger' ? 'red' : undefined}>{pad(truncate(p.process, 21), 22)}</Text>
							<Text dimColor>{rpad(String(p.pid), 7)}</Text>
							<Text color={cpuColor(p.cpu)}>{rpad(formatCpu(p.cpu), 7)}</Text>
							<Text dimColor>{rpad(formatMemory(p.memory), 7)}</Text>
							{'  '}
							{meta.note && <Text color={meta.risk === 'danger' ? 'red' : 'yellow'}>{meta.note}</Text>}
						</Text>
					</Box>
				);
			})}

			<Text dimColor>  {'─'.repeat(90)}</Text>

			<Box marginTop={1} gap={1}>
				<Text>  </Text>
				<Text color="green" bold>OK</Text>
				<Text dimColor>safe</Text>
				<Text> </Text>
				<Text color="yellow" bold>DEV</Text>
				<Text dimColor>dev-only</Text>
				<Text> </Text>
				<Text color="magenta" bold>SENS</Text>
				<Text dimColor>sensitive</Text>
				<Text> </Text>
				<Text color="red" bold>WARN</Text>
				<Text dimColor>check config</Text>
				<Text>    </Text>
				<Text dimColor>sort:</Text>
				<Text color="cyan" bold> {sortField}</Text>
			</Box>
		</Box>
	);
}
