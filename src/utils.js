export const squareEuclidean = (n, x, y) => {
	let dist = [];
	for(let i = 0; i < n; ++i) {
		dist.push([]);
		for(let j = 0; j < n; ++j) {
			const xDif = Math.abs(i - x), yDif = Math.abs(j - y);
			dist[i].push(Math.sqrt(xDif * xDif + yDif * yDif));
		}
	}
	return dist;
}

export const squareManhattan = (n, x, y) => {
	let dist = [];
	for(let i = 0; i < n; ++i) {
		dist.push([]);
		for(let j = 0; j < n; ++j) {
			const xDif = Math.abs(i - x), yDif = Math.abs(j - y);
			dist[i].push(xDif + yDif);
		}
	}
	return dist;
}

export const moves = [[1, 0], [0, 1], [-1, 0], [0, -1]];

export const isInRange = (x, y, n) => {
	return x >= 0 && x < n && y >= 0 && y < n;
}