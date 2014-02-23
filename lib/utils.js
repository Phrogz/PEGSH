Object.defineProperty(Array.prototype,'flatten',{
	value:function(r){
		for (var a=this,i=0,r=r||[];i<a.length; ++i)
			if (a[i]!=null)
				a[i] instanceof Array ? a[i].flatten(r) : r.push(a[i]);
		return r;
	}
});

function cleanRule(r){
	return r.flatten().join('').replace(/^\s+|\s+$/g,'');
}

function maybeFlatten(o) {
	o = compact(o);
	return isArraysOfStrings(o) ? o.flatten().join('') : o;
}

function ajaxGet(url,callback){
	var xhr = new XMLHttpRequest;
	xhr.onreadystatechange=function(){
		if (xhr.readyState===4) callback(xhr.responseText);
	}
	xhr.open('GET',url,true);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.send();
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
