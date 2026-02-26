import React from 'react';
import { Box, Text } from 'ink';
import type { PortInfo } from '../types.js';

interface KillConfirmProps {
	port: PortInfo;
	result?: string | null;
}

export function KillConfirm({ port, result }: KillConfirmProps) {
	if (result) {
		const isError = result.toLowerCase().includes('denied') || result.toLowerCase().includes('error');
		return (
			<Box marginY={1} paddingX={2}>
				<Text color={isError ? 'red' : 'green'}>{result}</Text>
			</Box>
		);
	}

	return (
		<Box flexDirection="column" marginY={1} paddingX={2} borderStyle="round" borderColor="red">
			<Text bold color="red">
				⚠ Kill process?
			</Text>
			<Box marginTop={1}>
				<Text>
					<Text bold>{port.process}</Text>
					<Text dimColor> (PID {port.pid})</Text>
					<Text> on port </Text>
					<Text color="yellow">{port.port}</Text>
				</Text>
			</Box>
			{port.command !== port.process && (
				<Box>
					<Text dimColor>{port.command}</Text>
				</Box>
			)}
			<Box marginTop={1}>
				<Text>
					<Text color="green" bold>[y]</Text>
					<Text> kill  </Text>
					<Text color="red" bold>[n]</Text>
					<Text> cancel</Text>
				</Text>
			</Box>
		</Box>
	);
}
