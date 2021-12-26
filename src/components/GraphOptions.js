import { useContext } from "react";
import { GraphContext } from "../context";

const GraphOptions = () => {
	const {
		searching,
		points,
		algorithm,
		updateAlgorithm,
		search,
		defaultGraph,
		pathLength,
		exploredCount,
		getMaze,
	} = useContext(GraphContext);

	const getSelectInfo = () => {
		if (searching) return "Searching...";
		if (points.src[0] === -1) return "Select Source";
		else if (points.dest[0] === -1) return "Select Destination";
		else return "Select Obstacles";
	};

	return (
		<div className="options">
			<div className="dropdown">
				{getSelectInfo()}
				<select
					value={algorithm}
					onChange={({ target: { value } }) => updateAlgorithm(value)}
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
				<button onClick={defaultGraph} disabled={searching}>
					Reset Graph
				</button>
				<button onClick={getMaze} disabled={searching}>
					Generate Maze
				</button>
			</div>
			<div className="stats">
				<p>
					{!searching && pathLength ? "Path Length " : ""}
					{!searching && pathLength ? <span>{pathLength}</span> : ""}
				</p>
				<p>
					{!searching && pathLength ? "Explored Nodes " : ""}
					{!searching && pathLength ? (
						<span>{exploredCount - 1}</span>
					) : (
						""
					)}
				</p>
			</div>
		</div>
	);
};

export default GraphOptions;