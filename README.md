### Introduction

The purpose of this library is to give you easy way to work with graphs on JS.

### Examples

## Basic functions.
You can create vertices and edges via connect, vetrex functions or import them.

var g = new EasyGraph.Graph
g.import([
	[1,2,1],
	[2,"constructor",1],
	["constructor","toString",1],
	["toString",5,1],
	[5,6,1],
	[1,5,200],
	[2,5,200],
	[3,5,200]
	])

In the case of directed graph use 
var g = new EasyGraph.DirectedGraph

or 

var g = new EasyGraph.Graph
g.directed = true

# Find shortes distance.

g.distance(1,6) 
-> 5

# Find all distances from vertex

g.distances(1) 
-> Object {1: 0, 2: 1, 3: 204, 5: 4, 6: 5, constructor: 2, toString: 3}

# Find an distance of the path which started and ended in the same vertex.
g.distance(1, 1)
-> 2

# Find shortest path
g.path(1,6)
-> ["1", "2", "constructor", "toString", "5", "6"]

## Advenced methods.

You can break down graph on subgraphs with following function.

	var g = new EasyGraph.Graph;
	g.import([
	[5],
	[7,8,10],
	["constructor","toString",3], 
	["toString",3,4], 
	[3,"constructor",1],
	[7,9,2],
	])

# Split disconnected parts of the graph on individual graphs.
var list = g.separate();

# Split graph on strong connected components.
	var g = new EasyGraph.DirectedGraph;
	
	g.import([ 
		["a","b"],
		["a","c"],
		["b","d"],
		["b","e"],
		["c","d"],
		["d","a"],
		["d","g"],
		["e","g"],
		["g","e"],
		["e","f"],
		["f","g"],
		["f","h"],
		["f","toString"],
		["f","constructor"],
		["h","constructor"],
		["constructor", "toString"],
		["toString", "constructor"]
	]);

var list = g.separate("strong_connected");

## Inspectors.
You can inspect graph with "bfs", "dfs", "priorityQueue" or "topologicalSort" algorithms in the following way.

	var component = [];
	var start_vertex = "1"

	g.visit(start_vertex, function(visitedvertices, iterationVertex, node){
		component.push(iterationVertex);

		return true;
	}, "dfs", visitedVertices);

### More samples
Can be find in problems folder or in the test.js file/



