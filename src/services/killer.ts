export interface KillResult {
	success: boolean;
	error?: string;
}

export function killProcess(pid: number): KillResult {
	try {
		process.kill(pid, 'SIGTERM');
		return { success: true };
	} catch (err: unknown) {
		const code = (err as NodeJS.ErrnoException).code;
		if (code === 'EPERM') {
			return { success: false, error: 'Permission denied. Try running with sudo.' };
		}
		if (code === 'ESRCH') {
			return { success: false, error: 'Process already exited.' };
		}
		return { success: false, error: String(err) };
	}
}
