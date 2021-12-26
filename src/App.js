import React from "react";
import Visualizer from "./components/Visualizer";
import GraphProvider from "./context";

const App = () => {
	return (
		<GraphProvider>
			<Visualizer />
		</GraphProvider>
	);
};

export default App;