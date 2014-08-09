// ************* TESTS
EasyGraph.Test = {};

EasyGraph.Test.test_undirected_dijkstra_1 = function(){
	var g = new EasyGraph.Graph
	g.import([
	[1,2,7],
	[1,3,9],
	[1,6,14],
	[6,3,2],
	[6,5,9],
	[2,3,10],
	[2,4,15],
	[3,4,11],
	[4,5,6] 
	])
	var a = new EasyGraph.Algorithms.Dijkstra(g);
	var d1_5 = a.distance(1, 5);

	this.assert_equal(d1_5, 20)

	var distances = a.distances(1);
	this.assert_equal( distances["1"], 0, "check distances", distances);
	this.assert_equal( distances["6"], 11, "check distances", distances);
	this.assert_equal( distances["5"], 20, "check distances", distances);

	var path = a.path(1, 5)

	this.assert_equal( path, "1,3,6,5");
}

EasyGraph.Test.test_undirected_dijkstra_2 = function(){

	var g = new EasyGraph.Graph
	g.import([
	[1,2,200],
	[1,3,100],
	[3,2,50],
	[3,4,15],
	[2,4,15]
	])
	var a = new EasyGraph.Algorithms.Dijkstra(g);

	this.assert_equal( a.distance(1, 2), 130);
}

EasyGraph.Test.test_undirected_dijkstra_3 = function(){
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
	var a = new EasyGraph.Algorithms.Dijkstra(g);

	var d1_6 = a.distance(1, 6);

	this.assert_equal(a.distance(1, 6), 5);
}

EasyGraph.Test.test_undirected_disconnected_graph = function(){

	var g = new EasyGraph.Graph;
	g.import([
	[5],
	[7,8,10],
	["constructor","toString",3], 
	["toString",3,4], 
	[3,"constructor",1],
	[7,9,2],
	])
	var list = g.separate();

	this.assert_equal(list.length, 3, "3 subgraphs expected", list);
	this.assert_equal(list[0].vertices.length, 1, "1 vertex expected", list[0])
	this.assert_equal(list[1].vertices.length, 3, "3 vertices expected", list[1]);
	this.assert_equal(list[2].vertices.length, 3, "3 vertices expected", list[2]);
}

EasyGraph.Test.test_directed_disconnected_graph = function(){

	var g = new EasyGraph.Graph;
	g.directed = true;
	g.import([ ["toString",2],[2,"constructor"],["constructor","toString"],[5,6] ]);

	var list = g.separate();

	this.assert_equal( list.length, 2, "2 subgraphs expected");
	this.assert_equal( list[0].vertices.length, 3, "3 vertices expected.");
	this.assert_equal( list[1].vertices.length, 2, "2 vertices expected.");

	this.assert_equal( list[1].weight(5,6), 0 );

	this.assert_equal( list[1].weight(6,5), undefined);
}

EasyGraph.Test.test_undirected_dfs = function(){
	var g = new EasyGraph.Graph
	g.import([
		["toString",2],
		["toString",3],
		["toString",4],
		[2,4],
		[2,5],
		[3,4],
		[3,6],
		[3,"constructor"],
		[5,6]
	]);

	var path = [];
	g.visit( "toString", function(visitedvertices, iterationVertex, node){
		path.push(iterationVertex);

		return true;
	}, "dfs");

	this.assert_equal( path, "toString,4,3,constructor,6,5,2")
}

EasyGraph.Test.test_directed_topological_sort = function(){
	var g = new EasyGraph.Graph;
	g.directed = true;
	g.import([
		[3,"constructor"],
		[5,"constructor"],
		[3,5],
		["toString",5],
		["toString",2],
		[2,3]
	]);

	var a = new EasyGraph.Algorithms.TopologicalSort(g);

	var path = a.order();

	this.assert_equal( path, "toString,2,3,5,constructor" );
}

EasyGraph.Test.test_undirected_merge = function(){
	var g = new EasyGraph.Graph;

	g.import([
		[4,"constructor",10],
		["constructor",2,20],
		[2,3,30],
		[3,"constructor",40],
		["constructor",5,100],
		[5,6,3000],
		[5,7,4000]
	]);

	g.merge("constructor",5);

	this.assert_equal( g.vertices.length, 6);
	
	this.assert_equal( g.weight(3,5), 40);
	this.assert_equal( g.weight(5,3), 40);

	this.assert_equal( g.node(1), undefined, "vertex is not removed" );
	this.assert_equal( g.weight(1,5), undefined, "vertex is not removed" );
	this.assert_equal( g.vertices.indexOf("1"), -1, "vertex is not removed" );

	g.merge(2,3);

	this.assert_equal( g.weight(3,5), 60, "edge is not exists" );
}

EasyGraph.Test.test_words = function(){
	var g = new EasyGraph.Graph;

	g.import([
		["constructor", "typeof", 10],
		["typeof", "valueOf", 20],
		["valueOf", "toString", 30]
	]);

	this.assert_equal( g.weight("constructor", "typeof"), 10, "connection is not exists");

	var list = g.separate();
	this.assert_equal( list.length, 1, "expected 1 graph" )
	this.assert_equal( list[0].weight("constructor", "typeof"), 10, "connection is not exists" );

	var a = new EasyGraph.Algorithms.Dijkstra(list[0]);
	var d = a.distance("constructor", "toString");

	this.assert_equal(d, 60);
}

EasyGraph.Test.test_strong_connected_components_1 = function(){

	var g = new EasyGraph.Graph;
	g.directed = true;  
	
	g.import([ [3,4], [4,3], [1,2], [1,4], [1,3] ]);

	var a = new EasyGraph.Algorithms.StrongConnectedComponents(g);
	var graphs = a.run();

	list = [];
	for( var i = 0; i < graphs.length ; i++)
		list.push( graphs[i].vertices );

	this.assert_equal(JSON.stringify(list), "[[\"1\"],[\"2\"],[\"3\",\"4\"]]" );
}

EasyGraph.Test.test_strong_connected_components_2 = function(){

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

	var a = new EasyGraph.Algorithms.StrongConnectedComponents(g);
	var graphs = a.run();

	list = [];
	for( var i = 0; i < graphs.length ; i++)
		list.push( graphs[i].vertices );

	this.assert_equal( JSON.stringify(list), "[[\"a\",\"b\",\"c\",\"d\"],[\"e\",\"g\",\"f\"],[\"h\"],[\"toString\",\"constructor\"]]", "Expected 4 components" );
}

EasyGraph.Test.test_spfa_path = function(){
	var g = new EasyGraph.Graph
	g.directed = true;
	
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

	var a = new EasyGraph.Algorithms.SPFA(g);
	var path = a.path(1, 6);

	this.assert_equal(path, "1,2,constructor,toString,5,6");
}

EasyGraph.Test.test_spfa_negative_cicle = function(){
	var g = new EasyGraph.Graph
	g.directed = true;
	
	g.import([
	[1,2,-1],
	[2,3,-2],
	[3,1,-3]
	]);

	var a = new EasyGraph.Algorithms.SPFA(g);
	var path = a.path(1, 3);

	this.assert_equal(path, [1,2,3], "Incorrect path");
}

EasyGraph.Test.test_euler_path_1 = function(){
	var g = new EasyGraph.Graph
	g.import([[1,2],[1,4],[1,5],[2,3],[2,4],[2,5],[4,3],[4,5]])	

	a = new EasyGraph.Algorithms.EulerPath(g);
	var path = a.run();

	this.assert_equal(path, ["5", "4", "2", "5", "1", "4", "3", "2", "1"] , "Incorrect path");
}

EasyGraph.Test.test_euler_path_2 = function(){
	var g = new EasyGraph.Graph
	g.import([[1,2],[1,4],[1,5],[2,3],[2,4],[2,5],[4,3],[4,5],[7]])	

	a = new EasyGraph.Algorithms.EulerPath(g);
	var path = a.run();

	this.assert_equal(path, undefined , "Incorrect path");
}

//http://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Minimum_spanning_tree.svg/450px-Minimum_spanning_tree.svg.png
EasyGraph.Test.test_spanning_tree = function(){
	var g = new EasyGraph.Graph
	g.import([
		[1,2,9],
		[1,3,9],
		[1,4,8],
		[1,9,18],
		[2,3,3],
		[2,6,6],
		[3,4,9],
		[3,5,4],
		[3,6,4],
		[4,5,8],
		[4,7,7],
		[4,10,9],
		[4,9,10],
		[5,6,2],
		[5,7,9],
		[6,7,9],
		[7,8,4],
		[7,10,5],
		[8,10,1],
		[8,9,4],
		[9,10,3]])	

	a = new EasyGraph.Algorithms.MSP(g)
	var g2 = a.run();

	this.assert_equal( 10, g2.vertices.length )
	this.assert_equal( 8, g2.weight(1,4) )
	this.assert_equal( 2, g2.weight(5,6) )
	this.assert_equal( 3, g2.weight(10,9) )
	this.assert_equal( 1, g2.weight(8,10) )
	this.assert_equal( 3, g2.weight(2,3) )
	this.assert_equal( 4, g2.weight(3,5) )
	this.assert_equal( 7, g2.weight(4,7) )
	this.assert_equal( 8, g2.weight(4,5) )
	this.assert_equal( 4, g2.weight(8,7) )
	this.assert_equal( undefined, g2.weight(6,7) )
	this.assert_equal( undefined, g2.weight(6,3) )
	this.assert_equal( undefined, g2.weight(7,10) )
}

EasyGraph.Test.test_tsp_distance = function(){
	var g = new EasyGraph.Graph
	g.import([
		[1,2,9],
		[1,3,9],
		[1,4,8],
		[1,9,18],
		[2,3,3],
		[2,6,6],
		[3,4,9],
		[3,5,4],
		[3,6,4],
		[4,5,8],
		[4,7,7],
		[4,10,9],
		[4,9,10],
		[5,6,2],
		[5,7,9],
		[6,7,9],
		[7,8,4],
		[7,10,5],
		[8,10,1],
		[8,9,4],
		[9,10,3]]);

	a = new EasyGraph.Algorithms.TSP(g);

	this.assert_equal( 16, a.distance([1,4]) );
	this.assert_equal( 21, a.distance([1,2,3]) );
	this.assert_equal( 58, a.distance(g.vertices) );
}

EasyGraph.Test.test_tsp_path = function(){
	var g = new EasyGraph.Graph
	g.import([
		[1,2,9],
		[1,3,9],
		[1,4,8],
		[1,9,18],
		[2,3,3],
		[2,6,6],
		[3,4,9],
		[3,5,4],
		[3,6,4],
		[4,5,8],
		[4,7,7],
		[4,10,9],
		[4,9,10],
		[5,6,2],
		[5,7,9],
		[6,7,9],
		[7,8,4],
		[7,10,5],
		[8,10,1],
		[8,9,4],
		[9,10,3]]);

	a = new EasyGraph.Algorithms.TSP(g);
	this.assert_equal( ["1", "4", "7", "8", "10", "9", "10", "7", "5", "6", "3", "2", "1"], a.path(g.vertices))
}

EasyGraph.Test.run = function(){

	this.test_incrementor = 1;

	console.log("Start EasyGraph tests.");
	for( var name in this){
		if (typeof EasyGraph.Test[name] == "function" && name.substr(0,5) == "test_" )
			EasyGraph.Test[name].call( this )
	}
}

EasyGraph.Test.assert_equal = function( v1, v2, message, debug_obj ){
	if( String(v1) !== String(v2) ){

		var err_obj = null;
		try { throw Error('') } catch(err) { err_obj = err; }
		var sp = err_obj.stack.split("\n")[3].trim().split(" ");
		console.log("error "+String(this.test_incrementor++)+":", sp[1].split(".")[3], ":",sp[2].split(":")[2], ".", v1, "!==", v2, ".", message);
		if( debug_obj !== undefined)
			console.log("was: ", debug_obj);
	}
}