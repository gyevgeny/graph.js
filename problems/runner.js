EasyGraph = EasyGraph || {};
EasyGraph.problems = EasyGraph.problems || {};

EasyGraph.problems.run = function(){
	for( var name in EasyGraph.problems ){
		if( name == "run" ){continue};

		var cases = EasyGraph.problems[name].test;

		for( var test in cases ){
			var resp = EasyGraph.problems[name].call( this, cases[test].input );

			if( EasyGraph.Array.indexOf( cases[test].output, resp ) == -1 )
				console.log("Problem:", name, "case:", test, "possible outputs:", cases[test].output, "current output:", resp);
		}
	}
}
