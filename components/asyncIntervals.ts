const asyncIntervals: boolean[] = [];

const runAsyncInterval = async (
	cb: () => Promise<unknown>,
	interval: number,
	intervalIndex: number
) => {
	await cb();
	if (asyncIntervals[intervalIndex]) {
		setTimeout(
			() => runAsyncInterval(cb, interval, intervalIndex),
			interval
		);
	}
};

export const setAsyncInterval = (
	cb: () => Promise<unknown>,
	interval: number
) => {
	if (cb && typeof cb === "function") {
		const intervalIndex = asyncIntervals.length;
		asyncIntervals.push(true);
		runAsyncInterval(cb, interval, intervalIndex);
		return intervalIndex;
	} else {
		throw new Error("Callback must be a function");
	}
};

export const clearAsyncInterval = (intervalIndex: number) => {
	if (asyncIntervals[intervalIndex]) {
		asyncIntervals[intervalIndex] = false;
	}
};
