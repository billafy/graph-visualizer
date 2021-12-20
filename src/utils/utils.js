export const getDefaultGraph = (n) => {
	let _graph = [];
	for (let i = 0; i < n[0]; ++i) {
		_graph.push([]);
		for (let j = 0; j < n[1]; ++j)
			_graph[i].push({
				visited: false,
				prev: [-1, -1],
				explored: false,
				path: false,
				obstacle: false,
			});
	}
	return _graph;
}

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

/*
const dfsUtil = async (_graph, x, y) => {
	_graph[x][y].visited = true;
	setGraph([..._graph]);
	if (x === points.dest[0] && y === points.dest[1]) return true;
	let reached = false;
	for (let i = -1; i <= 1; ++i) {
		if (reached) break;
		for (let j = -1; j <= 1; ++j) {
			if (Math.abs(i) === Math.abs(j)) continue;
			if (isInRange(x + i, y + j, graphSize)) {
				if (isVisitable(_graph, x + i, y + j))
					reached = await dfsUtil(_graph, x + i, y + j);
				await delay(searchSpeed);
				if (reached) break;
			}
		}
	}
	if (reached) {
		setPathLength((_pathLength) => _pathLength + 1);
		_graph[x][y].path = true;
		setGraph([..._graph]);
	}
	return reached;
};

const dfs = async () => {
	let _graph = graph;
	await dfsUtil(_graph, points.src[0], points.src[1]);
};
*/