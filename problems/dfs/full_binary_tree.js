// https://code.google.com/codejam/contest/2984486/dashboard#s=p1

// A tree is a connected graph with no cycles.

// A rooted tree is a tree in which one special vertex is called the root. If there is an edge between X and Y in a rooted tree, 
// we say that Y is a child of X if X is closer to the root than Y (in other words, the shortest path from the root to X is shorter 
// than the shortest path from the root to Y).

// A full binary tree is a rooted tree where every node has either exactly 2 children or 0 children.

// You are given a tree G with N nodes (numbered from 1 to N). You are allowed to delete some of the nodes. 
// When a node is deleted, the edges connected to the deleted node are also deleted. Your task is to delete as few nodes 
// as possible so that the remaining nodes form a full binary tree for some choice of the root from the remaining nodes.

EasyGraph.problems.codejam_2014_1a_b = function( input ){
	
	var gr = new EasyGraph.Graph;
	gr.import( input );

	var dfs = function( v, parentV ){
		var ws = [];
		for(var iterationVertex in gr.node(v))
			if( iterationVertex != parentV )
    			ws.push(dfs(iterationVertex, v));

      	if( ws.length == 0) {return 1;}
      	if( ws.length == 1) {removed_vertices += ws[0]; return 1;}

      	var max1 = 0;
      	var max2 = 0;
      	for ( var i = 0; i < ws.length ; i++){
      		if( max1 < ws[i]){
      			removed_vertices += max1;
      			max1 = ws[i];
      		}else if (max2 < ws[i]){
      			removed_vertices += max2;
      			max2 = ws[i];
      		}else
      			removed_vertices += ws[i];

      		if (max1 > max2){
      			var tmp = max1;
      			max1 = max2;
    	  		max2 = tmp;
	      	}
      	}

      	return max1 + max2 + 1;
	}

	var best = Infinity; 
	for( var i = 0 ; i < gr.vertices.length ; i++){
		var removed_vertices = 0;
		dfs( gr.vertices[i] );

		if (best > removed_vertices)
			best = removed_vertices
	}

	return String(best);
}

EasyGraph.problems.codejam_2014_1a_b.test = {
	
	test1: {
		input : [
			[ 2, 1 ],
			[ 1, 3 ],
		],
		output: [
			"0"
		]
	},
	test2: {
		input : [
			[4, 5],
			[4, 2],
			[1, 2],
			[3, 1],
			[6, 4],
			[3, 7]
		],
		output : [
			"2"
		]
	},
	test3: {
		input : [
			[ 1, 2 ],
			[ 2, 3 ],
			[ 3, 4 ]
		],
		output : [
			"1"
		]
	}
}