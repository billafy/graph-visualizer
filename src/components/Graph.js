import { useContext } from "react";
import { graphHeight, cellSize } from "../utils/constants";
import { GraphContext } from "../context";

const Graph = () => {
	const { graph, points, selectCell, selectObstacles } =
		useContext(GraphContext);

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

	return (
		<div className="graph" style={{ height: `${graphHeight}px` }}>
			{graph.map((_, i) => {
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
											style={{
												width: 750 / cellSize,
											}}
											alt="arrow"
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
	);
};

export default Graph;