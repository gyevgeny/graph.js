EasyGraph = {

	isArray: null,
	Array: null,

	Test:null,
	Graph:null,
	GraphInspector: {
		bfs : null,
		priorityQueue : null, 
		dfs : null,
		topological : null
	},	
	Algorithms: {
		DisconnectedGraphs: null,
		StrongConnectedComponents: null,
		Dijkstra: null,
		TopologicalSort: null, //Directed Acyclic Graph
        SPFA: null,
        EulerPath: null
	}
}

EasyGraph.Array = {};
EasyGraph.Array.indexOf = function( obj, v, start ){	
 if (!Array.prototype.indexOf){
    for (var i = (start || 0), j = obj.length; i < j; i++)
        if (this[i] === v) { return i; }
    return -1;
 }else
 	return obj.indexOf(v, start || 0);
}

EasyGraph.Object = {};
EasyGraph.Object.size = function( obj ){
	if(!Object.prototype.keys){
    	var size = 0, key;
    	for (key in obj)
        	if (obj.hasOwnProperty(key)) size++;    	
    	return size;
	} else
		return Object.keys( obj ).length;
}


EasyGraph.isArray = function(value){
	return Object.prototype.toString.call(value) === '[object Array]';	
}

// ************ GraphInspector
EasyGraph.GraphInspector.topological = function( graph, rootVertex, f ){
	var enterTimes = {};
	var exitTimes = {};
	var time = 1;

	var dfs = function( v ){
		if (!enterTimes.hasOwnProperty(v)){
    		enterTimes[v] = time++;
			for(var iterationVertex in graph.node(v))
      			dfs(iterationVertex);

    		exitTimes[v] = time++;
    		f.call( graph, v, exitTimes[v] );
    	}
	}

	for(var i = 0; i < graph.vertices.length; i++)
	  if (!exitTimes.hasOwnProperty(graph.vertices[i])) 
	  	dfs( graph.vertices[i] );
};

EasyGraph.GraphInspector.dfs = function( graph, rootVertex, f, visitedVertices ){
	var visitedVertices = visitedVertices || {};

	if (typeof f == "function"){

		var queueVertices = {};
		queueVertices[rootVertex] = true;
		var lifo = [ rootVertex ];

		while( lifo.length > 0 ){

			iterationVertex = lifo.pop();
			node = graph.node(iterationVertex);

			visitedVertices[iterationVertex] = true;

			if(f.call( graph, visitedVertices, iterationVertex, node)){
				for(var v in node)
					if (!queueVertices.hasOwnProperty(v))
						if(!visitedVertices.hasOwnProperty(v)){
							queueVertices[v] = true;
							lifo.push( v );		
						}		

			}else{ return; }
		}
	} else {
		var dfs2 = function( v, parentV ){

			f.enter.call( graph, v, parentV);

			for(var iterationVertex in graph.node(v))
				if( f.possible.call(graph, v, iterationVertex) )
    				dfs2(iterationVertex, v);    	
    	
    		f.exit.call( graph, v, parentV);
		}

		dfs2( rootVertex );
	}
};

EasyGraph.GraphInspector.bfs = function( graph, rootVertex, f, visitedVertices ){
	var visitedVertices = visitedVertices || {};

	var nextSteps = [ rootVertex ];

	while( nextSteps.length > 0 ) {
		iteration = [];
		for(var i in nextSteps){
			var iterationVertex = nextSteps[i];
			var node = graph.node(iterationVertex);
			visitedVertices[iterationVertex] = true;

			if(f.call( graph, visitedVertices, iterationVertex, node))
			{
				for(var v in node)
					if (!visitedVertices.hasOwnProperty(v))
						iteration.push( v );
				

			}else{ return; }
		} 
		nextSteps = iteration;
	}
};

EasyGraph.GraphInspector.priorityQueue = function( graph, rootVertex, f, visitedVertices ){
	var visitedVertices = visitedVertices || {};
	var costs = {};
	var previous = {};
	costs[rootVertex] = 0;

	while (true){
		var iterationVertexCost = Infinity;
		var iterationVertex = null
		for(var v in costs){
			if(!visitedVertices.hasOwnProperty(v) && iterationVertexCost > costs[v] ){
				iterationVertex = v;
				iterationVertexCost = costs[v];
			}
		}

		if(iterationVertex == null)
			break

		var node = graph.node(iterationVertex);
		visitedVertices[iterationVertex] = true;

		if(f.call( graph, visitedVertices, previous, iterationVertex, iterationVertexCost, node)){
			for(var v in node)
				if(!visitedVertices.hasOwnProperty(v))
					if(!costs.hasOwnProperty(v) || iterationVertexCost + node[v] < costs[v]){
						previous[v] = iterationVertex;
						costs[v] = node[v] + iterationVertexCost;
					}
				}
		else{ break; }
	}
}

// ************ Graph
EasyGraph.GraphInstanceMethods = {

visit : function( rootVertex, f, inspector, visitedVertices ){
	if (inspector == undefined)
		inspector = "bfs"

	EasyGraph.GraphInspector[inspector](this, rootVertex, f, visitedVertices )
},

node : function( v ){	
	if (this.edges.hasOwnProperty(v))
		return this.edges[ v ];
	else
		return undefined;
},

vertex : function( v ){
	if (!this.edges.hasOwnProperty(v)){
		this.vertices.push(v);
		this.edges[v] = {};
	}
},

vertices_going_into : function(v){
    var resp = [];
    for(var i = 0 ; i < this.vertices.length ; i++)
        if( this.edges[this.vertices[i]].hasOwnProperty(v) )
            resp.push(this.vertices[i]);

    return resp;
},

//TODO, need optimization.
delete_vertex : function( v ){
	var vSt = String(v);

	for(var i = 0 ; i < this.vertices.length ; i++)
		delete this.edges[ this.vertices[i] ][ vSt ];	

	delete this.edges[vSt];
	this.vertices.splice( EasyGraph.Array.indexOf(this.vertices, vSt), 1 );
},

weight : function( from, to ){
	if (!this.edges.hasOwnProperty(from) || !this.edges[from].hasOwnProperty(to)) return undefined;

	return this.edges[from][to];
},

// In the case if from === to. I would like to get min distance path with length > 0.
path : function( fromV, toV ){
    var from = String(fromV);
    var to = String(toV);

	var a = this.negative ? new EasyGraph.Algorithms.SPFA(this) : new EasyGraph.Algorithms.Dijkstra(this);
    if (from != to)
	   return a.path(from, to);
    else{
        var min_distance = Infinity;
        var path = null;
        var node = this.node( from );
        for( var v in node ){
            var d = a.distance(v, to);
            if (d){
                if( min_distance > d + this.weight(from, v) ){
                    min_distance = d + this.weight(from, v);
                    path = a.path(v, to);
                    path.unshift(from);
                }
            }
        }
        return min_distance == Infinity ? [] : path;
    }
},

// In the case if from === to. I would like to get distance of the non empty path.
distance : function( from, to ){
    var a = this.negative ? new EasyGraph.Algorithms.SPFA(this) : new EasyGraph.Algorithms.Dijkstra(this);
    if (from != to)
	   return a.distance(from, to);
    else{
        var min_distance = Infinity;
        var node = this.node( from );
        for( var v in node ){
            var d = a.distance(v, to);
            if (d){
                if( min_distance > d + this.weight(from, v) )
                    min_distance = d + this.weight(from, v);
            }
        }
        return min_distance == Infinity ? undefined : min_distance;
    }
},

distances : function( from ){
	var a = this.negative ? new EasyGraph.Algorithms.SPFA(this) : new EasyGraph.Algorithms.Dijkstra(this);
	return a.distances(from);
},

connectionExists : function( from, to ){
	var exists = false;
	var toS = String(to);
	this.visit( String(from), function(visitedVertices, iterationVertex, node){

		exists = iterationVertex == toS;
		return !exists;
	});

	return exists;
},

connect : function( v1, v2, w ){
	if (w < 0)
		this.negative = true;

	this.vertex( v1 );
	this.vertex( v2 );

	this.edges[v1][v2] = (this.weight(v1, v2) || 0) + (w || 0);

	if (!this.directed)
		this.edges[v2][v1] = this.edges[v1][v2];
},

disconnect : function( v1, v2 ){
	if ( this.edges.hasOwnProperty(v1) && this.edges[v1].hasOwnProperty(v2) ){
		delete this.edges[v1][v2];

	if (!this.directed)
		if ( this.edges.hasOwnProperty(v2) && this.edges[v2].hasOwnProperty(v1) )
			delete this.edges[v2][v1];
	}
},

merge : function( fromV, toV ){
	var from = String(fromV);
	var to   = String(toV);
	var node_from = this.node(from);

	for( var v in node_from)
		if (v != to && v != from)
			this.connect(to, v, node_from[v]);

	this.delete_vertex(from);
},

import : function( ar ){
	for (var i = 0; i < ar.length; i++ ){
		if( ar[i][1] === undefined )
			this.vertex( String(ar[i][0]) );
		else
			this.connect( String(ar[i][0]), String(ar[i][1]), ar[i][2] );
	}
},

export : function( list ){	
	var resp = [];

	var validVertices = {};
	if (list !== undefined){
		if (EasyGraph.isArray(list)){
			for(var i = 0; i < list.length; i++)
				validVertices[list[i]] = true;
		}else
			validVertices = list;
	}
	else
		validVertices = undefined;

	for (var i = 0; i < this.vertices.length; i++){
		if( validVertices!==undefined && !validVertices.hasOwnProperty(this.vertices[i]) ) continue;
		var node = this.node( this.vertices[i] );

		resp.push([this.vertices[i]]);	
		for (var v in node){
			if( validVertices!==undefined && !validVertices.hasOwnProperty(v) ) continue;
			resp.push( [this.vertices[i], v, node[v] || 0] );
		}
	}

	return resp;
},

clone : function(){
    var gr = new EasyGraph.Graph;
    gr.directed = this.directed;

    gr.import( this.export() );

    return gr;    
},

subgraph : function( list ){
	var gr = new EasyGraph.Graph;
	gr.directed = this.directed;

	gr.import( this.export(list) );

	return gr;
},

//disconnected, strong_connected  
separate : function(type){
	if(type == undefined)
		type = "disconnected";

	switch(type) {
    case "disconnected":
		return new EasyGraph.Algorithms.DisconnectedGraphs(this).run();
    case "strong_connected":
		return new EasyGraph.Algorithms.StrongConnectedComponents(this).run();
	}

	return undefined;
},

transpose : function(){
	if (this.directed == false)
		return this;

	var edges = this.export();
	var t_edges = [];
	for( i in edges){
		if(edges[i].length > 1){
			var el = [edges[i][1], edges[i][0]];
			if(edges[i].length == 3)
				el.push(edges[i][2]);
			t_edges.push(el);
		}
		else
			t_edges.push(edges[i]);
	}

	var g = new EasyGraph.Graph;
	g.directed = true;
	g.import( t_edges );

	return g;
},

// Instance attributes.
attr : function( toV, name, value){
    var v = String(toV);

    if (!this.edges.hasOwnProperty(v))
        return undefined;

    if(name === undefined)
        return this.attrs[v];

    if (this.attrs[v] === undefined)
        this.attrs[v] = {};

    this.attrs[v][name] = value;
}}

EasyGraph.Graph = function(){ 
   this.directed = false;
   this.negative = false;

   this.vertices = [];
   this.edges = {};

   this.attrs = {};
}

EasyGraph.DirectedGraph = function(){ 
   this.directed = true;
   this.negative = false;

   this.vertices = [];
   this.edges = {};

   this.attrs = {};
}

EasyGraph.Graph.prototype = EasyGraph.GraphInstanceMethods;
EasyGraph.DirectedGraph.prototype = EasyGraph.GraphInstanceMethods;

// ************ DisconnectedGraphs
EasyGraph.Algorithms.DisconnectedGraphs = function(graph){
	this.graph = graph;
}

EasyGraph.Algorithms.DisconnectedGraphs.prototype = {

run : function(){

	if( this.graph.directed){
		var g = new EasyGraph.Graph ;
		g.import( this.graph.export() );
		var list = this.split( g );
		var resp = [];

		for( var i = 0 ; i < list.length ; i++ ){
			var dg = new EasyGraph.Graph;
			dg.directed = true;

			dg.import( this.graph.export( list[i].vertices ) );
			resp.push(dg);
		}
		return resp;
	}
	else
		return this.split( this.graph );
},

split : function( graph ){
	var visitedVertices = {};

	var resp = [];
	for (var i = 0; i < this.graph.vertices.length; i++){
		if(visitedVertices.hasOwnProperty(this.graph.vertices[i]))
			continue;

		var g = this.detect(this.graph.vertices[i]);
		resp.push( g );
	
		for( var j = 0; j < g.vertices.length; j++)
			visitedVertices[ g.vertices[j] ] = true;
	}
	return resp;
},

detect : function( v ){
	var g = new EasyGraph.Graph ;

	this.graph.visit( v, function(visitedVertices, iterationVertex, node){	
		g.vertex( iterationVertex );

		for(var v in node)
			if (!visitedVertices.hasOwnProperty(v))
				g.connect(iterationVertex, v, node[v]);
		
		return true;
	});

	return g;
}
}

// ********** Dijkstra
EasyGraph.Algorithms.Dijkstra = function( graph ) {
	this.graph = graph;
}

EasyGraph.Algorithms.Dijkstra.prototype.distance = function( from, to ){
	var cost = undefined;
	var toS = String(to);

	this.graph.visit( String(from), function(visitedVertices, previous, iterationVertex, iterationVertexCost, node){
        if(iterationVertex != from)
		  cost = iterationVertexCost;

		return iterationVertex != toS;
	}, "priorityQueue");

	return cost;
}

EasyGraph.Algorithms.Dijkstra.prototype.distances = function( from ){
	var costs = {};

	this.graph.visit( String(from), function(visitedVertices, previous, iterationVertex, iterationVertexCost, node){
		costs[iterationVertex] = iterationVertexCost

		return true;
	}, "priorityQueue");

	return costs;
}

EasyGraph.Algorithms.Dijkstra.prototype.path = function( fromV, toV ){
	var prev = null;
	var to = String(toV);
	var from = String(fromV);

	if ( this.graph.node(from) === undefined || this.graph.node(to) === undefined )
		return [];

	this.graph.visit( from, function(visitedVertices, previous, iterationVertex, iterationVertexCost, node){
		prev = previous;

		return iterationVertex != to;
	}, "priorityQueue");

	if (prev[to] === undefined)
		return [];

	var path = [];
	while( to !== undefined){
		path.push( to );
		to = prev[to]

		if(to == from){
			path.push( to );
			break;
		}
	}

	return path.reverse();
}

// ************* Topological Sort
EasyGraph.Algorithms.TopologicalSort = function( graph ) {
	this.graph = graph;
}

EasyGraph.Algorithms.TopologicalSort.prototype.order = function(){
	var resp = [];

	this.graph.visit( null, function(iterationVertex, time){
		resp.push(iterationVertex);
	}, "topological");

  	return resp.reverse();
}

EasyGraph.Algorithms.TopologicalSort.prototype.hits = function(){
	var resp = {};

	this.graph.visit( null, function(iterationVertex, time){
		resp[iterationVertex] = time;
	}, "topological");

  	return resp;	
} 

EasyGraph.Algorithms.StrongConnectedComponents = function( graph ){
	this.graph = graph;
}

// Kosaraju's algorithm
EasyGraph.Algorithms.StrongConnectedComponents.prototype.run = function(){
	if (this.graph.directed){

		var a = new EasyGraph.Algorithms.TopologicalSort(this.graph);
		var order = a.order();

		var tg = this.graph.transpose(); 

		var resp = [];
		var visitedVertices = {};
		for( var i = 0; i < order.length; i++ ){

			var component = [];
			if( visitedVertices.hasOwnProperty( order[i])) {continue;}

			tg.visit( order[i], function(vv, iterationVertex, node){
				visitedVertices[iterationVertex] = true;
				component.push(iterationVertex);

				return true;
			}, "dfs", visitedVertices);

			var sg = new EasyGraph.Graph
			sg.directed = true
			sg.import( this.graph.export( component ) )
			resp.push(sg);
		}
		return resp;
	}else
		return [this.graph];
}

EasyGraph.Algorithms.SPFA = function( graph ){
	this.graph = graph;
}

// improvement of the Bellman–Ford algorithm
EasyGraph.Algorithms.SPFA.prototype.run = function (fromV) {
	var from = String(fromV);

  	var distance = {};
  	var previous = {};
  	var fifo = [];
  	var isInQueue = {};
  	var visitedEdges = {};  	

  	fifo.push(from);
  	distance[from] = 0;
	isInQueue[from] = true;

  	while (fifo.length != 0) {

    	var iterationVertex = fifo.pop();
    	delete isInQueue[iterationVertex];
    	var node = this.graph.node(iterationVertex);

    	if(!visitedEdges.hasOwnProperty(iterationVertex) )
			visitedEdges[iterationVertex] = {};

    	for (var v in node) {
			if( !visitedEdges[iterationVertex].hasOwnProperty(v) ){

    			visitedEdges[iterationVertex][v] = true;

      			var d = distance[iterationVertex] + this.graph.weight(iterationVertex, v);

      			if (d < (distance.hasOwnProperty(v) ? distance[v] : Infinity )) {
        			distance[v] = d;
        			previous[v] = iterationVertex;
        			if (!isInQueue.hasOwnProperty(v) ) {
          				fifo.push(v);
          				isInQueue[v] = true;
        			}
      			}
      		}
      	}
  	}

  	return {
  		prev : previous,
  		dist : distance
  	}
}

EasyGraph.Algorithms.SPFA.prototype.path = function(fromV, toV) {
	var from = String(fromV);
	var to = String(toV);

	if ( this.graph.node(from) === undefined || this.graph.node(to) === undefined )
		return [];

	var data = this.run(from);

	if (data.prev[to] === undefined)
		return [];

	var path = [];
	while( to !== undefined){
		path.push( to );
		to = data.prev[to]

		if(to == from){
			path.push( to );
			break;
		}
	}

	return path.reverse();
}

EasyGraph.Algorithms.SPFA.prototype.distance = function(fromV, toV) {
	var from = String(fromV);
	var to = String(toV);

	if ( this.graph.node(from) === undefined || this.graph.node(to) === undefined )
		return undefined;

	var data = this.run(from);

	return data.dist[to];
}

EasyGraph.Algorithms.SPFA.prototype.distances = function(fromV) {
	var from = String(fromV);

	if ( this.graph.node(from) === undefined )
		return undefined;

	var data = this.run(from);

	return data.dist;
}

EasyGraph.Algorithms.EulerPath = function( graph ){
	this.graph = graph;
}

EasyGraph.Algorithms.EulerPath.prototype.run = function(){
	var self = this;

	var list = this.graph.separate();
	if( list.length > 1 )
		return undefined;

	var points = this.startPoints();
	if(points == undefined) return undefined;

	visited = new EasyGraph.Graph;
	visited.directed = this.graph.directed;

	visited.import( this.graph.vertices.map(function(v){return [v]}) );
	path = []

	this.graph.visit( points.start, {
		enter : function(v, parentV) {
			if (parentV != undefined) visited.connect( v, parentV ); 
		},
		possible : function(v, iterationVertex){
			return visited.node(v)[iterationVertex] === undefined;
		},
		exit : function(v, parentV){
			path.push(v);
		}
	}, "dfs");

	return path;
}

EasyGraph.Algorithms.EulerPath.prototype.startPoints = function(){
	var rank = {};

	for(var i = 0 ; i < this.graph.vertices.length ; i++)
		rank[this.graph.vertices[i]] = 0;

	for(i = 0; i < this.graph.vertices.length ; i++){
		var v = this.graph.vertices[i];
		var node = this.graph.node(v);

		if(this.graph.directed){
			rank[v] += EasyGraph.Object.size(node);
			for( vv in node)
				rank[vv] -= 1;
		}else
			rank[v] = EasyGraph.Object.size(node) % 2;
	}

	var start, finish;
	for( v in rank ){
		if(rank[v] != 1 && rank[v] != 0 && rank[v] != -1)
			return undefined;

		if(rank[v] == 1){
			if( start === undefined)
				start = v;
			else 
				if ( finish === undefined )
					finish = v;
				else
					return undefined
		}

		if(rank[v] == -1){
			if ( finish === undefined )
				finish = v;
			else
				return undefined;
		}
	}

	if( start === undefined ){
		start = this.graph.vertices[0]; 
		finish = start;
	}

	return {
		start : start,
		finish : finish
	}

} 