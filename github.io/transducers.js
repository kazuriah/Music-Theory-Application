function is_odd(x) { return x%2 == 1; }

function add(x, y) { return x + y; }
function mult(x, y) { return x * y; }
function inc(x, amt) { return x+(amt || 1); }
function dec(x, amt) { return x-(amt || 1); }

function gensym() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function identity(x) { return x; }

function push(arr, elt) { arr.push(elt); return arr; }
function first(arr) { return arr[0]; }
function member(item, arr) {
    for (var i = 0; i < arr.length; i++) {
	if (item == arr[i]) 
	    return true;
    }
    return false;
}
function range(length, start) {
    var start = start || 0;
    var arr = [];
    for (var i = 0; i < length; i++) {
	push(arr, i);
    }
    return arr;
}
function repeat(item, count) {
    var arr = [];
    for (var i = 0; i < count; i++) {
	arr.push(item);
    }
    return arr;
}

function compose(f1, f2) {
    return function (x) {
	f1(f2(x));
    };
}
function o() {
    var slice = Array.prototype.slice;
    var fns = slice.call(arguments, 0);
    return function (x) {
	for (var i = fns.length - 1; i >= 0; i--) {
	    x = fns[i](x);
	}
	return x;
    }
}
function pr(f) {
    var slice = Array.prototype.slice;
    var args = slice.call(arguments, 1);
    return function () {
	f.apply(null, slice.call(arguments, 0).concat(args));
    }
}
function p(f) {
    var slice = Array.prototype.slice;
    var args = slice.call(arguments, 1);
    return function () {
	return f.apply(null, args.concat(slice.call(arguments, 0)));
    }
}

function reduce(combiner, seq, initial_value) {
    if (seq.length === 0) {
	return initial_value;
    }
    var acc = combiner(initial_value, seq[0]);
    for (var i = 1; i < seq.length; i++) {
	acc = combiner(acc, seq[i]);
    }
    return acc;
}
function grouping(n) {
    var count = 0;
    var group = [];
    return function (combiner) {
	return function (type, result, input) {
	    if (type === "combine") {
		if (count < n) {
		    count++;
		    group.push(input);
		    return result;
		} else {
		    count = 1;
		    var result = combiner(type, result, group);
		    group = [];
		    group.push(input);
		    return result;
		}
	    } else {
		return combiner(type, combiner("combine", result, group));
	    }
	}
    }
}

function partitioning(f) {
    var first_val = gensym();
    var last_val = first_val;
    var group = [];
    return function (combiner) {
	return function (type, result, input) {
	    if (type === "combine") {
		var input_val = f(input);
		if (last_val === first_val ||
		    input_val === last_val) {
		    last_val = input_val;
		    push(group, input);
		    return result;
		} else {
		    var result = combiner(type, result, group);
		    last_val = input_val;
		    group = [input];
		    return result;
		}
	    } else if (group.length > 0) {
		return combiner(type, combiner("combine", result, group));
	    } else {
		return combiner(type, result);
	    }
	}
    }
}

function catting(f) {
    return function (combiner) {
	return function (type, result, input) {
	    if (type === "combine") {
		if (input.length === 0) {
		    return result;
		}
		var acc = combiner(type, result, input[0]);
		for (var i = 1; i < input.length; i++) {
		    acc = combiner(type, acc, input[i]);
		}
		return acc;
	    } else {
		return combiner(type, result);
	    }
	}
    }
}

function filtering(pred) {
    return function (combiner) {
	return function (type, result, input) {
	    if (type === "combine") {
		if (pred(input)) return combiner(type, result, input);
		else return result;
	    } else {
		return combiner(type, result);
	    }
	}
    }
}

function mapping(f) {
    return function (combiner) {
	return function (type, result, input) {
	    if (type === "combine") {
		return combiner(type, result, f(input));
	    } else {
		return combiner(type, result);
	    }
	}
    }
}

function grouping_duplicates() {
    return partitioning(identity);
}
function grouping(n) {
    var count = 0;
    return partitioning(function (input) {
	var res = Math.floor(count/n);
	count++;
	return res;
    });
}
function taking_every(n) {
    return o(grouping(n), mapping(first));
}

function mapcatting(f) {
    return o(mapping(f), catting());
}
function mapidxing(f) {
    var idx = 0;
    return mapping(function(input) {
	var res = f(input, idx);
	idx++;
	return res;
    });
}

function taking_while(pred) {
    var done = false;
    return filtering(function (input) {
	if (done || !pred(input)) {
	    done = true;
	    return false;
	} else {
	    return true;
	}
    });
}
function taking(n) {
    var count = 0;
    return taking_while(function (input) {
	count++;
	return count <= n;
    });
}

function dropping_while(pred) {
    var done = false;
    return filtering(function (input) {
	if (done || !pred(input)) {
	    done = true;
	    return true;
	} else {
	    return false;
	}
    });
}
function dropping(n) {
    var count = 0;
    return dropping_while(function (input) {
	count++;
	return count <= n;
    });
}

function uniquing() {
    var seen = [];
    return filtering(function (input) {
	if (!member(input, seen)) {
	    seen.push(input);
	    return true;
	}
	return false;
    });
}
function run_length_encoding() {
    return o(grouping_duplicates(), 
	     mapping(x => [x.length, x[0]]));
}
function deduping() {
    return o(grouping_duplicates(), mapping(first));
}

function interspersing(item) {
    return o(mapcatting(x => [item, x]),
	     dropping(1));
}

function transduce(combiner, transducer, seq, initial_value) {
    if (seq.length === 0) {
	return initial_value;
    }
    function make_combiner(combiner) {
	return function (type, result, input) {
	    if (type === "combine") {
		return combiner(result, input);
	    } else {
		return result;
	    }
	};
    }

    combiner = transducer(make_combiner(combiner));

    var acc = combiner("combine", initial_value, seq[0]);
    for (var i = 1; i < seq.length; i++) {
	acc = combiner("combine", acc, seq[i]);
    }
    return combiner("complete", acc);
}

function sum(transducer, seq) {
    return transduce(add, transducer, seq, 0);
}
function product(transducer, seq) {
    return transduce(mult, transducer, seq, 1);
}
function collect(transducer, seq) {
    return transduce(push, transducer, seq, []);
}
function collect_string(transducer, seq) {
    return collect(transducer, seq).join("");
}
function minimize(transducer, seq) {
    if (seq.length > 0) {
	return transduce(Math.min, transducer, seq.splice(1), seq[0]);
    }
}
function maximize(transducer, seq) {
    if (seq.length > 0) {
	return transduce(Math.max, transducer, seq.splice(1), seq[0]);
    }
}
