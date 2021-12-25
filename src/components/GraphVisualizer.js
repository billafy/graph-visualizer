import React, { useEffect, useContext } from "react";
import { GraphContext } from "../context";
import Graph from './Graph';
import GraphOptions from './GraphOptions';
import "../styles/graphVisualizer.scss";

const GraphVisualizer = () => {
	const {
		defaultGraph,
		graphSize,
		updateGraphSize,
	} = useContext(GraphContext);

	useEffect(() => {
		window.addEventListener("resize", updateGraphSize);
		return () => {
			window.removeEventListener("resize", updateGraphSize);
		};
	});

	useEffect(() => {
		defaultGraph(true);
	}, [graphSize]);

	return (
		<div className="graph-container">
			<GraphOptions/>
			<Graph/>
		</div>
	);
};

export default GraphVisualizer;