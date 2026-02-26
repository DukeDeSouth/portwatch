import React from 'react';
import { Box, Text } from 'ink';

interface StatusBarProps {
	filterMode: boolean;
	filter: string;
}

export function StatusBar({ filterMode, filter }: StatusBarProps) {
	if (filterMode) {
		return (
			<Box marginTop={1}>
				<Text color="cyan">/ </Text>
				<Text bold>{filter}</Text>
				<Text dimColor>_</Text>
				<Text dimColor>  (esc cancel  enter apply)</Text>
			</Box>
		);
	}

	return (
		<Box marginTop={1}>
			<Text dimColor>
				{'  '}
				<Text color="cyan" bold>j/k</Text>{' nav  '}
				<Text color="cyan" bold>/</Text>{' filter  '}
				<Text color="cyan" bold>enter</Text>{' kill  '}
				<Text color="cyan" bold>s</Text>{' sort  '}
				<Text color="cyan" bold>r</Text>{' refresh  '}
				<Text color="cyan" bold>q</Text>{' quit'}
			</Text>
		</Box>
	);
}
