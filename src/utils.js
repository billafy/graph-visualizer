export const squareEuclidean = (n, x, y) => {
	let dist = [];
	for (let i = 0; i < n[0]; ++i) {
		dist.push([]);
		for (let j = 0; j < n[1]; ++j) {
			const xDif = Math.abs(i - x),
				yDif = Math.abs(j - y);
			dist[i].push(Math.sqrt(xDif * xDif + yDif * yDif));
		}
	}
	return dist;
};

export const squareManhattan = (n, x, y) => {
	let dist = [];
	for (let i = 0; i < n[0]; ++i) {
		dist.push([]);
		for (let j = 0; j < n[1]; ++j) {
			const xDif = Math.abs(i - x),
				yDif = Math.abs(j - y);
			dist[i].push(xDif + yDif);
		}
	}
	return dist;
};

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const isInRange = (x, y, n) => {
	return x >= 0 && x < n[0] && y >= 0 && y < n[1];
};