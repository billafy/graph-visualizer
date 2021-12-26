import React, { useState } from "react";
import {
	squareEuclidean,
	squareManhattan,
	isInRange,
	delay,
	getDefaultGraph,
	isVisitable,
	generateMaze,
} from "./utils/utils";
import {
	moves,
	backtrackSpeed,
	searchSpeed,
	cellSize,
	graphHeight,
} from "./utils/constants";
import PriorityQueue from "js-priority-queue";

export const GraphContext = React.createContext();

const GraphProvider = ({ children }) => {
	const [graphSize, setGraphSize] = useState([
		graphHeight / cellSize,
		Math.floor(window.innerWidth / cellSize),
	]);
	const [graph, setGraph] = useState(getDefaultGraph(graphSize));
	const [points, setPoints] = useState({ src: [-1, -1], dest: [-1, -1] });
	const [searching, setSearching] = useState(false);
	const [algorithm, setAlgorithm] = useState("Breadth First Search");
	const [pathLength, setPathLength] = useState(0);
	const [exploredCount, setExploredCount] = useState(0);

	const selectObstacles = (event, i, j) => {
		if (
			!searching &&
			event.buttons &&
			points.src[0] !== -1 &&
			points.dest[0] !== -1
		) {
			if (
				(points.src[0] !== i || points.src[1]) !== j &&
				(points.dest[0] !== i || points.dest[1] !== j)
			) {
				setGraph((_graph) => {
					_graph[i][j].obstacle = true;
					return [...graph];
				});
			}
		}
	};

	const selectCell = (i, j) => {
		if (searching) return;
		if (graph[i][j].obstacle) {
			setGraph((_graph) => {
				_graph[i][j].obstacle = false;
				return [...graph];
			});
		} else if (points.src[0] === -1) setPoints({ ...points, src: [i, j] });
		else if (points.dest[0] === -1) {
			if (points.src[0] !== i || points.src[1] !== j)
				setPoints({ ...points, dest: [i, j] });
		} else {
			if (
				(points.src[0] !== i || points.src[1]) !== j &&
				(points.dest[0] !== i || points.dest[1] !== j)
			) {
				setGraph((_graph) => {
					_graph[i][j].obstacle = true;
					return [...graph];
				});
			}
		}
	};

	const backtrack = async (_graph) => {
		let x = points.dest[0],
			y = points.dest[1];
		const pathPoints = [];
		while (x !== points.src[0] || y !== points.src[1]) {
			const a = x,
				b = y;
			x = _graph[a][b].prev[0];
			y = _graph[a][b].prev[1];
			if (x === -1 || y === -1) break;
			if (a - x === 1 && b - y === 0) _graph[x][y].direction = "down";
			else if (a - x === -1 && b - y === 0) _graph[x][y].direction = "up";
			else if (a - x === 0 && b - y === 1)
				_graph[x][y].direction = "right";
			else if (a - x === 0 && b - y === -1)
				_graph[x][y].direction = "left";
			pathPoints.push([x, y]);
		}
		for (let i = pathPoints.length - 1; i >= 0; --i) {
			_graph[pathPoints[i][0]][pathPoints[i][1]].path = true;
			setGraph([...graph]);
			setPathLength((_pathLength) => _pathLength + 1);
			await delay(backtrackSpeed);
		}
	};

	const bfs = async () => {
		let queue = [points.src];
		let _graph = graph;
		_graph[points.src[0]][points.src[1]].visited = true;
		while (queue.length > 0) {
			const [x, y] = queue[0];
			if (x === points.dest[0] && y === points.dest[1]) break;
			_graph[x][y].explored = true;
			setExploredCount((_exploredCount) => _exploredCount + 1);
			moves.forEach(([i, j]) => {
				if (
					isInRange(x + i, y + j, graphSize) &&
					isVisitable(_graph, x + i, y + j)
				) {
					_graph[x + i][y + j].visited = true;
					_graph[x + i][y + j].prev = [x, y];
					queue.push([x + i, y + j]);
				}
			});
			setGraph([..._graph]);
			await delay(searchSpeed);
			queue.shift();
		}
		await backtrack(_graph);
	};

	const aStar = async (type) => {
		let _graph = graph,
			x = points.src[0],
			y = points.src[1];
		let dist;
		if (type === "manhattan")
			dist = squareManhattan(graphSize, points.dest[0], points.dest[1]);
		else dist = squareEuclidean(graphSize, points.dest[0], points.dest[1]);
		const pq = new PriorityQueue({
			comparator: (a, b) => dist[a[0]][a[1]] - dist[b[0]][b[1]],
		});
		pq.queue([x, y]);
		while (pq.length > 0) {
			if (x === points.dest[0] && y === points.dest[1]) break;
			[x, y] = pq.dequeue();
			_graph[x][y].explored = true;
			setExploredCount((_exploredCount) => _exploredCount + 1);
			moves.forEach(([i, j]) => {
				if (
					isInRange(x + i, y + j, graphSize) &&
					isVisitable(_graph, x + i, y + j)
				) {
					_graph[x + i][y + j].visited = true;
					_graph[x + i][y + j].prev = [x, y];
					pq.queue([x + i, y + j]);
				}
			});
			setGraph([..._graph]);
			await delay(searchSpeed);
		}
		await backtrack(_graph);
	};

	const search = async () => {
		if (points.src[0] === -1 || points.dest[0] === -1) return;
		setSearching(true);
		if (algorithm === "Breadth First Search") await bfs();
		else if (algorithm === "A* - Manhattan") await aStar("manhattan");
		else if (algorithm === "A* - Euclidean") await aStar("euclidean");
		setSearching(false);
	};

	const defaultGraph = () => {
		setGraph(getDefaultGraph(graphSize));
		setPoints({ src: [-1, -1], dest: [-1, -1] });
		setPathLength(0);
		setExploredCount(0);
	};

	const getMaze = () => {
		const maze = generateMaze(graphSize);
		setGraph([...maze.graph]);
		setPoints({src: maze.src, dest: maze.dest});
	}

	const updateAlgorithm = (_algorithm) => {
		setGraph((_graph) => {
			return _graph.map((_row) => {
				return _row.map((_cell) => {
					return {
						visited: false,
						prev: [-1, -1],
						explored: false,
						path: false,
						obstacle: _cell.obstacle,
					};
				});
			});
		});
		setAlgorithm(_algorithm);
		setPathLength(0);
		setExploredCount(0);
	};

	const updateGraphSize = () => {
		const newWidth = window.innerWidth / cellSize;
		if (Math.floor(newWidth) !== graphSize[1])
			setGraphSize([...[graphSize[0], window.innerWidth / cellSize]]);
	};

	return (
		<GraphContext.Provider
			value={{
				algorithm,
				updateAlgorithm,
				searching,
				search,
				defaultGraph,
				pathLength,
				exploredCount,
				graph,
				selectCell,
				selectObstacles,
				points,
				graphSize,
				updateGraphSize,
				getMaze,
			}}
		>
			{children}
		</GraphContext.Provider>
	);
};

export default GraphProvider;