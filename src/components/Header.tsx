import React from 'react';
import { Box, Text } from 'ink';

interface HeaderProps {
	count: number;
	loading: boolean;
	dangerCount: number;
	sensitiveCount: number;
}

export function Header({ count, loading, dangerCount, sensitiveCount }: HeaderProps) {
	return (
		<Box flexDirection="column" marginBottom={1}>
			<Box>
				<Text bold color="cyan">[portwatch]</Text>
				<Text dimColor>
					{'  '}
					{loading ? 'scanning...' : `${count} port${count !== 1 ? 's' : ''} listening`}
					{'  |  refresh 2s'}
				</Text>
			</Box>
			{(dangerCount > 0 || sensitiveCount > 0) && (
				<Box>
					{dangerCount > 0 && (
						<Text color="red" bold>
							{'  '}{dangerCount} warning{dangerCount !== 1 ? 's' : ''} found
						</Text>
					)}
					{sensitiveCount > 0 && (
						<Text color="magenta">
							{dangerCount > 0 ? '  |  ' : '  '}{sensitiveCount} sensitive
						</Text>
					)}
				</Box>
			)}
		</Box>
	);
}
