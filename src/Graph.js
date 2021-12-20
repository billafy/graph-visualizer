import React, { useState, useEffect, useRef } from "react";
import "./styles/graph.scss";
import {
	squareEuclidean,
	squareManhattan,
	isInRange,
	delay,
	getDefaultGraph,
} from "./utils/utils";
import {
	moves,
	backtrackSpeed,
	searchSpeed,
	cellSize,
	graphHeight,
} from "./utils/constants";
import PriorityQueue from "js-priority-queue";

const Graph = () => {
	const [graphSize, setGraphSize] = useState([
		graphHeight / cellSize,
		Math.floor(window.innerWidth / cellSize),
	]);
	const [graph, setGraph] = useState(getDefaultGraph(graphSize));
	const [points, setPoints] = useState({ src: [-1, -1], dest: [-1, -1] });
	const [searching, setSearching] = useState(false);
	const [algorithm, setAlgorithm] = useState("Breadth First Search");
	const graphRef = useRef(null);
	const [pathLength, setPathLength] = useState(0);

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
		if (points.src[0] === -1) setPoints({ ...points, src: [i, j] });
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

	const getSelectInfo = () => {
		if (searching) return "Searching...";
		if (points.src[0] === -1) return "Select Source";
		else if (points.dest[0] === -1) return "Select Destination";
		else return "Select Obstacles";
	};

	const getCellClass = (i, j) => {
		const visited = graph[i][j].visited,
			explored = graph[i][j].explored;
		if (points.src[0] === i && points.src[1] === j)
			return `src ${visited ? "src-visited visited" : ""} ${
				explored ? "explored" : ""
			}`;
		else if (points.dest[0] === i && points.dest[1] === j)
			return `dest ${visited ? "dest-visited visited" : ""} ${
				explored ? "explored" : ""
			}`;
		return `${visited ? "visited" : ""} ${explored ? "explored" : ""}`;
	};

	const isVisitable = (_graph, i, j) => {
		return !_graph[i][j].visited && !_graph[i][j].obstacle;
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
			else if (a - x === 0 && b - y === 1) _graph[x][y].direction = "right";
			else if (a - x === 0 && b - y === -1) _graph[x][y].direction = "left";
			pathPoints.push([x, y]);
		}
		for(let i = pathPoints.length - 1; i >= 0; --i) {
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
	};

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
	};

	const changeGraphSize = () => {
		const newWidth = window.innerWidth / cellSize;
		if(Math.floor(newWidth) !== graphSize[1]) 
			setGraphSize([...[graphSize[0], window.innerWidth / cellSize]]);
	};

	useEffect(() => {
		window.addEventListener("resize", changeGraphSize);
		return () => {
			window.removeEventListener("resize", changeGraphSize);
		};
	}, []);

	useEffect(() => {
		defaultGraph(true);
	}, [graphSize]);

	return (
		<div className="graph-container dark">
			<div className="options">
				<div className="dropdown">
					{getSelectInfo()}
					<select
						value={algorithm}
						onChange={({ target: { value } }) =>
							updateAlgorithm(value)
						}
						disabled={searching}
					>
						<option>Breadth First Search</option>
						<option>A* - Manhattan</option>
						<option>A* - Euclidean</option>
					</select>
				</div>
				<div className="buttons">
					<button onClick={search} disabled={searching}>
						Start Search
					</button>
					<button
						onClick={() => defaultGraph(true)}
						disabled={searching}
					>
						Reset Graph
					</button>
				</div>
				<p>
					{!searching && pathLength
						? `Path Length : ${pathLength}`
						: ""}
				</p>
			</div>
			<div
				className="graph"
				ref={graphRef}
				style={{ height: `${graphHeight}px` }}
			>
				{graph.map((row, i) => {
					return (
						<div className="row" key={i}>
							{graph[i].map((cell, j) => {
								const cellClass = getCellClass(i, j);
								return (
									<div
										className={`cell ${cellClass} ${
											cell.path ? "path" : ""
										} ${cell.obstacle ? "obstacle" : ""}`}
										key={j}
										style={{
											height: `${cellSize}px`,
											width: `${cellSize}px`,
										}}
										onClick={() => selectCell(i, j)}
										onMouseEnter={(event) =>
											selectObstacles(event, i, j)
										}
									>
										{cell.path ? (
											<img
												src={`${cell.direction}.png`}
												style={{ width: 750 / cellSize }}
												alt='arrow'
											/>
										) : (
											<></>
										)}
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Graph;