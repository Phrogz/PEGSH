var peg = document.querySelector('#peg textarea'),
    css = document.querySelector('#css textarea'),
    inp = document.querySelector('#inp textarea'),
    out = document.querySelector('#out pre'),
    customCSS = document.querySelector('#custom');

var worker, queuedCommands;
killWorker();

updateCSS();

peg.addEventListener('change',delayedParse,false);
peg.addEventListener('input', delayedParse,false);
inp.addEventListener('change',delayedParse,false);
inp.addEventListener('input', delayedParse,false);
css.addEventListener('change',updateCSS,   false);
css.addEventListener('input', updateCSS,   false);

var userTypingTimer;
function delayedParse() {
	clearTimeout(userTypingTimer);
	userTypingTimer = setTimeout(parseInput,200);
}

var deathRowTimer;
function parseInput(){
	queuedCommands++;
	clearTimeout(deathRowTimer);
	deathRowTimer = setTimeout(killWorker,2000);
	worker.postMessage({ command:'parseInput', peg:peg.value, input:inp.value });
}

function killWorker() {
	out.innerHTML = "…parser stalled processing the input; something is bad…"
	if (worker) worker.terminate();
	worker = new Worker('parser.js');
	worker.addEventListener('message',handleWorkerResponse,false);
	queuedCommands = 0;
	delayedParse(); // Try again?
}

function handleWorkerResponse(evt) {
	if (!--queuedCommands) clearTimeout(deathRowTimer);
	var data = evt.data;
	if (data.error) logError(data.error,data.details);
	else            out.innerHTML = htmlFrom(data.parseTree);
}

function isNode(node) {return typeof(node.v)!=='undefined' && typeof(node.n)!=='undefined';}
function htmlFrom(node) {
	if (node instanceof Array) {
		return node.map(htmlFrom).join('');
	} else
	if (isNode(node)) {
		return [
			'<span class="'+node.n+'">',
			htmlFrom(node.v),
			'</span>',
		].join('');
	} else {
		return node;
	}
}
function updateCSS(){
	customCSS.innerHTML = css.value;
}

function logError(label,e){
	var messages = ["<div class='error'>"+label+"</div>"];
	if (e){
		if (e.summary)  messages.push(e.summary);
		if (e.line)     messages.push("    line: "+e.line);
		if (e.column)   messages.push("  column: "+e.column);
		if (e.offset)   messages.push("  offset: "+e.offset);
		// if (e.expected) messages.push("expected: "+e.expected.map(JSON.stringify).join("\n"));
		// if (e.found)    messages.push("   found: "+e.found);
		// if (e.message)  messages.push(" message: "+e.message);
	}
	out.innerHTML = messages.join('\n');
}

function bootstrap(){
	if (validParser===undefined){
		compileParser();
		setTimeout(bootstrap,500);
	}
}
