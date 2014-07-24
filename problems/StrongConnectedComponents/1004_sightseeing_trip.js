/*
http://acm.timus.ru/problem.aspx?space=1&num=1004 (modification)

There is a travel agency in Adelton town on Zanzibar island. It has decided to offer its clients, 
besides many other attractions, sightseeing the town. To earn as much as possible from this attraction, 
the agency has accepted a shrewd decision: it is necessary to find the shortest route 
which begins and ends at the same place.

Two crossing points can be connected by multiple roads, but no road connects a crossing point with itself.
so paths 1 -> 2 -> 1 AND 1 -> 1 is not possible.

*/

EasyGraph = EasyGraph || {};
EasyGraph.problems = EasyGraph.problems || {};
/*
EasyGraph.problems.pr1004 = function( input ){

}
*/

// Instead of 2 ways road we will use 1 way road.
// People can move to back direction if such direction exists.
EasyGraph.problems.pr1004_directed = function( input ){
	
	var gr = new EasyGraph.DirectedGraph;
	gr.import( input );

	var list = gr.separate("strong_connected");

	var minPath = null;
	var minDistance = Infinity;

	for (var i = 0; i < list.length; i++){
		if( list[1].vertices.length == 1 ) continue;

		var firstVertex = list[i].vertices[0];
		var d = list[i].distance( firstVertex, firstVertex );
		if( d < minDistance){
			minDistance = d;
			minPath = list[i].path( firstVertex, firstVertex );		
		}
	}

	if (minPath !== null ){minPath.pop();}

	return minPath === null ? "No solution." : minPath.join();
}

EasyGraph.problems.pr1004_directed.test = {
	
	test1: {
		input : [
			[ 4, 1, 1 ],
			[ 3, 1, 300 ],
			[ 1, 3, 10 ],
			[ 2, 1, 16 ],
			[ 3, 2, 100 ],
			[ 5, 2, 15 ],
			[ 3, 5, 20 ]
		],
		output: [
			"1,3,5,2",
			"3,5,2,1",
			"5,2,1,3",
			"2,1,3,5"
		]
	},
	test2: {
		input : [
			[2,1,10],
			[3,1,20],
			[4,1,30]
		],
		output : [
			"No solution."
		]
	},
	test3: {
		input : [
			[ 5, 1, 1 ],
			[ 5, 3, 100 ],
			[ 4, 3, 2 ],
			[ 4, 2, 1 ],
			[ 5, 4, 10 ],
			[ 2, 1, 1 ]
		],
		output : [
			"No solution."
		]
	},
	test4: {
		input : [
			[ 2, 1, 1 ],
			[ 3, 2, 1 ],
			[ 2, 3, 1 ],
			[ 1, 2, 1 ],
			[ 5, 4, 2 ],
			[ 6, 5, 2 ],
			[ 4, 6, 2 ]
		],
		output: [
			"1,2",
			"2,1",
			"2,3",
			"3,2"
		]
	}
}