importScripts('lib/peg-0.8.0.min.js','lib/utils.js', 'lib/pegjslabeller.js');

var userPEG,parser;
self.addEventListener('message',function(evt){
	var data = evt.data, tree;
	if (!parser || data.peg!=userPEG){
		userPEG = data.peg;
		parser = generateParser();
	}
	if (parser){
		try{      tree = parser.parse(data.input)                                         }
		catch(e){ self.postMessage({error:'Error Parsing Input',details:errorDetails(e)}) }
		if (tree) self.postMessage({success:true,parseTree:tree});
	}
},false);

function generateParser(){
	var annotatingPEG, parser;
	try{
		PEG.buildParser(userPEG); // Do this just to get an error if there's a problem with the original PEG
		annotatingPEG = pegJSRuleLabeller.parse(userPEG);
	}
	catch(e){ self.postMessage({error:'Error Compiling PEG',details:errorDetails(e)}); }
	if (annotatingPEG){
		try{      parser = PEG.buildParser(annotatingPEG)                                            }
		catch(e){ self.postMessage({error:'Error Compiling Annotating PEG',details:errorDetails(e)}) }
		return parser;
	}
}

function errorDetails(e){
	return {
		summary: e+"",
		line:    e.line,
		column:  e.column,
		offset:  e.offset
	}
}