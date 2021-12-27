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
};

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

export const isVisitable = (graph, i, j) => {
	return !graph[i][j].visited && !graph[i][j].obstacle;
};

export const randomInt = (max, min) => {
	return Math.floor(Math.random() * (max - min) + min);
};


// maze generation 2.0.0

const moves = [[[-2, 0], [-1, 0]], [[0, -2], [0, -1]], [[0, 2], [0, 1]], [[2, 0], [1, 0]]];
const getRandomMove = (graph, i, j, n) => {
	const possibleMoves = [];
	moves.forEach(([move, wallMove]) => {
		if (
			i + move[0] >= 0 &&
			i + move[0] < n[0] &&
			j + move[1] >= 0 &&
			j + move[1] < n[1] &&
			!graph[i + move[0]][j + move[1]].visited &&
			!graph[i + move[0]][j + move[1]].obstacle
		) 
			possibleMoves.push([[i + move[0], j + move[1]], [i + wallMove[0], j + wallMove[1]]]);
	});
	if(!possibleMoves.length) 
		return [false, false];
	return possibleMoves[randomInt(0, possibleMoves.length)];
};

export const generateMaze = (n) => {
	let graph = getDefaultGraph(n), src = [0, 0];
	for(let i = 0; i < n[0]; ++i) {
		let step = i % 2 ? 1 : 2, start = !(i % 2) ? 1 : 0;
		for(let j = start; j < n[1]; j += step) 
			graph[i][j].obstacle = true;
	}
	let stack = [src];
	while(stack.length) {
		const node = stack.at(-1);
		const [move, wallMove] = getRandomMove(graph, node[0], node[1], n);
		if(!move) {
			stack.pop();
			continue;
		}
		graph[move[0]][move[1]].visited = true;
		graph[wallMove[0]][wallMove[1]].visited = true;
		graph[wallMove[0]][wallMove[1]].obstacle = false;
		stack.push(move);
	}
	graph.forEach(row => {
		row.forEach(cell => {
			cell.visited = false;
		})
	})
	return {graph, src: [-1, -1], dest: [-1, -1]};
}

// random maze generator 1.0.0

/* const getRandomMove = (graph, i, j, n) => {
	const possibleMoves = [];
	moves.forEach((move) => {
		if (
			i + move[0] >= 0 &&
			i + move[0] < n[0] &&
			j + move[1] >= 0 &&
			j + move[1] < n[1] &&
			!graph[i + move[0]][j + move[1]].visited &&
			!graph[i + move[0]][j + move[1]].obstacle
		) 
			possibleMoves.push([i + move[0], j + move[1]]);
	});
	if(!possibleMoves.length) 
		return false;
	return possibleMoves[randomInt(0, possibleMoves.length)];
};

export const generateMaze2 = (n) => {
	let graph = getDefaultGraph(n),
		src = [randomInt(0, n[0]), randomInt(0, n[1])],
		dest = [-1, -1],
		maxDepth = 0;
	const stack = [src];
	while (stack.length) {
		const node = stack.at(-1);
		const adjNode = getRandomMove(graph, node[0], node[1], n);
		if(!adjNode) {
			stack.pop();
			continue;
		}
		graph[adjNode[0]][adjNode[1]].visited = true;
		stack.push(adjNode);
		const wallNode = getRandomMove(graph, node[0], node[1], n);
		if(wallNode) 
			graph[wallNode[0]][wallNode[1]].obstacle = true;
		if(stack.length > maxDepth) {
			dest = adjNode;
			maxDepth = stack.length;
		}
	}
	graph.forEach(row => {
		row.forEach(cell => {
			cell.visited = false;
		})
	})
	return {graph, src: [-1, -1], dest: [-1, -1]};
}; */