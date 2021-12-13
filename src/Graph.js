import React, { useState, useEffect, useRef } from "react";
import "./graph.scss";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const Graph = () => {
	const [graph, setGraph] = useState([]);
	const [graphSize, setGraphSize] = useState(15);
	const [points, setPoints] = useState({ source: [-1, -1], dest: [-1, -1] });
	const [searching, setSearching] = useState(false);
	const graphRef = useRef(null);

	const selectCell = (i, j) => {
		if (searching) return;
		if (points.source[0] === -1) setPoints({ ...points, source: [i, j] });
		else if (points.dest[0] === -1) {
			if (points.source[0] !== i || points.source[1] !== j)
				setPoints({ ...points, dest: [i, j] });
		} else {
			if (
				(points.source[0] !== i || points.source[1]) !== j &&
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
		if (points.source[0] === -1) return "Select Source Cell";
		else if (points.dest[0] === -1) return "Select Destination Cell";
		else return "Select Multiple Cells as Obstacles";
	};

	const getCellClass = (i, j) => {
		const visited = graph[i][j].visited;
		if (points.source[0] === i && points.source[1] === j)
			return `source ${visited ? "source-visited visited" : ""}`;
		else if (points.dest[0] === i && points.dest[1] === j)
			return `dest ${visited ? "dest-visited visited" : ""}`;
		return `${visited ? "visited" : ""}`;
	};

	const bfs = async () => {
		if (points.source[0] !== -1 && points.dest[0] !== -1) {
			setSearching(true);
			let queue = [points.source];
			let _graph = graph;
			_graph[points.source[0]][points.source[1]].visited = true;
			while (queue.length > 0) {
				const [x, y] = queue[0];
				if (x === points.dest[0] && y === points.dest[1]) break;
				for (let i = -1; i <= 1; ++i) {
					for (let j = -1; j <= 1; ++j) {
						if (Math.abs(i) === Math.abs(j)) continue;
						if (
							x + i >= 0 &&
							x + i < graphSize &&
							y + j >= 0 &&
							y + j < graphSize
						) {
							if (
								!_graph[x + i][y + j].visited &&
								!_graph[x + i][y + j].obstacle
							) {
								_graph[x + i][y + j].visited = true;
								_graph[x + i][y + j].prev = [x, y];
								queue.push([x + i, y + j]);
							}
						}
					}
				}
				setGraph([..._graph]);
				await delay(1);
				queue.shift();
			}
			let x = points.dest[0],
				y = points.dest[1];
			while (x !== points.source[0] || y !== points.source[1]) {
				const a = x,
					b = y;
				x = _graph[a][b].prev[0];
				y = _graph[a][b].prev[1];
				if(x == -1 || y == -1) 
					break;
				_graph[x][y].path = true;
				setGraph([..._graph]);
				await delay(100);
			}
			setGraph([...graph]);
		}
	};

	const dfsUtil = async (_graph, x, y) => {
		_graph[x][y].visited = true;
		setGraph([..._graph]);
		if(x === points.dest[0] && y === points.dest[1]) 
			return true;
		let reached = false;
		for(let i = -1; i <= 1; ++i) {
			if(reached) 
				break;
			for(let j = -1; j <= 1; ++j) {
				if(Math.abs(i) === Math.abs(j)) continue;
				if(x + i >= 0 && x + i < graphSize && y + j >= 0 && y + j < graphSize) {
					if(!_graph[x + i][y + j].visited && !_graph[x + i][y + j].obstacle) 
						reached = await dfsUtil(_graph, x + i, y + j);
					await delay(1);
					if(reached) 
						break;
				}
			}
		}
		if(reached) {
			_graph[x][y].path = true;
			setGraph([..._graph]);
		}
		return reached;
	}

	const dfs = () => {
		setSearching(true);
		let _graph = graph;
		dfsUtil(_graph, points.source[0], points.source[1]);
	}

	const search = () => {
		dfs();
	}

	const defaultGraph = () => {
		let _graph = [];
		for (let i = 0; i < graphSize; ++i) {
			_graph.push([]);
			for (let j = 0; j < graphSize; ++j)
				_graph[i].push({
					visited: false,
					prev: [-1, -1],
					path: false,
					obstacle: false,
				});
		}
		setGraph(_graph);
		setSearching(false);
		setPoints({source: [-1, -1], dest: [-1, -1]})
	}

	useEffect(() => {
		defaultGraph();
	}, []);

	return (
		<div className="graph-container">
			<p className="info">
				{getSelectInfo()}
				<button onClick={search} disabled={searching}>
					Start Search
				</button>
				<button onClick={defaultGraph}>
					Reset
				</button>
			</p>
			<div
				className="graph"
				ref={graphRef}
				style={
					graphRef.current
						? { height: graphRef.current.clientWidth }
						: {}
				}
			>
				{graph.map((row, i) => {
					return (
						<div className="row" key={i}>
							{graph.map((cell, j) => {
								const cellClass = getCellClass(i, j);
								return (
									<div
										className={`cell ${cellClass} ${
											graph[i][j].path ? "path" : ""
										} ${
											graph[i][j].obstacle
												? "obstacle"
												: ""
										}`}
										key={j}
										style={{
											width:
												graphRef.current.clientWidth /
												graphSize,
											height:
												graphRef.current.clientWidth /
												graphSize,
										}}
										onClick={() => selectCell(i, j)}
									></div>
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