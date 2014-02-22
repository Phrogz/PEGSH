Object.defineProperty(Array.prototype,'flatten',{
	value:function(r){
		for (var a=this,i=0,r=r||[];i<a.length; ++i)
			if (a[i]!=null)
				a[i] instanceof Array ? a[i].flatten(r) : r.push(a[i]);
		return r;
	}
});

var $peg = $('#peg textarea'),
    $css = $('#css textarea'),
    $inp = $('#inp textarea'),
    $out = $('#out pre');

var pegJSRuleLabeller,inputParser;
$.get('pegjslabeller.peg',function(peg){
	pegJSRuleLabeller = PEG.buildParser(peg);
	updateCSS();
	compileParser();
},'text');

$peg.bind('change input',compileParser);
$css.bind('change input',updateCSS);
$inp.bind('change input',parseInput);

function compileParser(){
	try{
		var annotatingPEG = pegJSRuleLabeller.parse($peg.val());
		inputParser       = PEG.buildParser(annotatingPEG);
		parseInput();
	}catch(e){ logError(e,'Error Compiling PEG') }
}

function parseInput(){
	try{
		var tree = inputParser.parse($inp.val());
		$out.html(htmlFrom(tree));
	}catch(e){ logError(e,'Error Parsing Input') }
}

function htmlFrom(node){
	if (node instanceof Array){
		return $.map(node,htmlFrom).join('');		
	}else{
		var html = ['<span class="'+node.n+'">'];
		if (node.v instanceof Array){
			html.push($.map(node.v,htmlFrom).join(''));
		}else if (typeof node.v == 'string'){
			html.push(node.v);
		}
		html.push('</span>');
		return html.join('');
	}
}

function updateCSS(){
	$('#custom').html($css.val());
}

function cleanRule(r){
	return r.flatten().join('').replace(/^\s+|\s+$/g,'');
}

function maybeFlatten(o) {
	o = compact(o);
	return isArraysOfStrings(o) ? o.flatten().join('') : o;
}

function isArraysOfStrings(a) {
	if (a instanceof Array){
		for(var i=a.length;i--;){
			if (a[i] instanceof Array){
				if (!isArraysOfStrings(a[i])) return false;
			}else if (typeof a[i] !== 'string') return false;
		}
		return true;
	}
}

function compact(a){
	if (a instanceof Array){
		for(var i=a.length;i--;){
			if (a[i] == null) a.splice(i,1);
			else if (typeof a[i] === 'object') compact(a[i]);
		}
	}else if (a instanceof Object){
		for(var k in a) if (a[k]==null) delete a[k];
	}
	return a;
}

function logError(e,scope){
	var messages = ["<div class='error'>"+scope+"</div>",e];
	if (e.line)     messages.push("    line: "+e.line);
	if (e.column)   messages.push("  column: "+e.column);
	if (e.offset)   messages.push("  offset: "+e.offset);
	// if (e.expected) messages.push("expected: "+$.map(e.expected,JSON.stringify).join("\n"));
	// if (e.found)    messages.push("   found: "+e.found);
	// if (e.message)  messages.push(" message: "+e.message);
	$out.html(messages.join('\n'));
	// console.dir(e);
}
