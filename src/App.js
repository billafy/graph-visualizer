import React from "react";
import GraphVisualizer from "./components/GraphVisualizer";
import GraphProvider from "./context";

const App = () => {
	return (
		<GraphProvider>
			<GraphVisualizer />
		</GraphProvider>
	);
};

export default App;