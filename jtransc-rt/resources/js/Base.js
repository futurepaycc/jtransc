var _global = (typeof window !== "undefined") ? window : global;
var DEBUG_VERSION = {{ debug != false }};

if ('á'.charCodeAt(0) != 225) {
	throw new Error('Encoding must be UTF-8. Please add <META http-equiv="Content-Type" content="text/html; charset=utf-8" /> to the html');
}

// Polyfills
Array.prototype.includes = Array.prototype.includes || (function(searchElement /*, fromIndex*/ ) {
	var O = Object(this);
	var len = parseInt(O.length, 10) || 0;
	if (len === 0) return false;
	var n = parseInt(arguments[1], 10) || 0;
	var k;
	if (n >= 0) {
		k = n;
	} else {
		k = len + n;
		if (k < 0) k = 0;
	}
	for (;k < len; ++k) if (searchElement === O[k]) return true;
	return false;
});

Array.prototype.map = Array.prototype.map || (function(callback, thisArg) {
	var T, A, k;
	var O = Object(this);
	var len = O.length >>> 0;
	if (arguments.length > 1) T = thisArg;
	A = new Array(len);
	k = 0;
	while (k < len) {
		var kValue, mappedValue;
		if (k in O) {
			kValue = O[k];
			mappedValue = callback.call(T, kValue, k, O);
			A[k] = mappedValue;
		}
		++k;
	}
	return A;
});

Array.prototype.contains = Array.prototype.contains || (function(searchElement) { return this.indexOf(searchElement) >= 0; });
Map.prototype.remove = Map.prototype.remove || (function(key) { this.delete(key); });

Math.imul = Math.imul || function(a, b) {
	var ah = (a >>> 16) & 0xffff;
	var al = a & 0xffff;
	var bh = (b >>> 16) & 0xffff;
	var bl = b & 0xffff;
	return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
};

Math.clz32 = Math.clz32 || (function (x) { return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32; });
Math.fround = Math.fround || (function (array) { return function(x) { return array[0] = x, array[0]; }; })(new Float32Array(1));
//Math.fround = function(v) { return v; };

String.prototype.reverse = String.prototype.reverse || (function() { return this.split("").reverse().join(""); });

String.prototype.startsWith = String.prototype.startsWith || (function(searchString, position){
	position = position || 0;
	return this.substr(position, searchString.length) === searchString;
});

String.prototype.endsWith = String.prototype.endsWith || (function(searchString, position) {
	if (position === undefined) position = subjectString.length;
	var subjectString = this.toString();
	position -= searchString.length;
	var lastIndex = subjectString.indexOf(searchString, position);
	return lastIndex !== -1 && lastIndex === position;
});

String.prototype.replaceAll = String.prototype.replaceAll || (function(search, replacement) {
	var target = this;
	return target.split(search).join(replacement);
});

String.prototype.trim = String.prototype.trim || (function () { return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''); });
String.prototype.quote = String.prototype.quote || (function () { return JSON.stringify(this); });

(function(_global) { "use strict";


//const _global = (typeof window !== "undefined") ? window : global;
const DEBUG_VERSION = {{ debug != false }};
const onBrowser = typeof window != "undefined";
const onNodeJs = typeof window == "undefined";

////////////////////////////////////////////////////////////////////////////

class Int32 {
	constructor(value) {
		this.value = value | 0;
	}

	static compare(a, b) {
		a |= 0; b |= 0;
		if (a < b) return -1;
		if (a > b) return 1;
		return 0;
	}

	static ucompare(a, b) {
		a |= 0; b |= 0;
		if (a < 0) return (b < 0) ? (~b - ~a | 0) : (1);
		return (b < 0) ? (-1) : (a - b | 0)
	}

	static mul(a, b) { return Math.imul(a, b); }
}

const Int64 = function(high, low) {
	this.high = high | 0;
	this.low = low | 0;
};

const M2P32_DBL = Math.pow(2, 32);
const supportsBigInt = typeof BigInt !== "undefined";

//if (typeof BigInt !== "undefined") {
if (false) {
	Int64.is = function(value) { return typeof value === 'bigint'; };
	Int64.make = function(high, low) {
		if (high === 0) return BigInt(low >>> 0);
		const i64 = new BigInt64Array(1);
		const i32 = new Int32Array(i64.buffer);
		i32[0] = low;
		i32[1] = high;
		return i64[0];
		//return BigInt(low);
	};

	const MAX_INT64 = Int64.make(0x7FFFFFFF, 0xFFFFFFFF);
	const MIN_INT64 = Int64.make(0x80000000, 0x00000000);

	Int64.zero = BigInt(0);
	Int64.one = BigInt(1);
	Int64.MIN_VALUE = MIN_INT64;
	Int64.MAX_VALUE = MAX_INT64;

	Int64.ofInt = function(value) { return BigInt(value); };
	Int64.ofFloat = function(f) { return BigInt(f); };

	Int64.toInt = function(a) { return Number(a) | 0; };
	Int64.toFloat = function(v) { return Number(v); };

	Int64.isNeg = function(a) { return a < BigInt(0); };
	Int64.isZero = function(a) { return a == BigInt(0); };
	Int64.isNotZero = function(a) { return a != BigInt(0); };

	// Comparisons

	Int64.compare = function(a, b) {
		if (a < b) return -1;
		if (a > b) return +1;
		return 0;
	};

	Int64.ucompare = function(a, b) { throw new Error("ucompare not implemented"); };

	Int64.eq = function(a, b) { return a == b; };
	Int64.ne = function(a, b) { return a != b; };
	Int64.neq = function(a, b) { return a != b; };
	Int64.lt = function(a, b) { return a < b; };
	Int64.le = function(a, b) { return a <= b; };
	Int64.gt = function(a, b) { return a > b; };
	Int64.ge = function(a, b) { return a >= b; };

	// Strings
	Int64.toStringStatic = function(i) { return i.toString(); }

	// Arithmetic
	Int64.neg = function(x) { return BigInt.asIntN(64, -x); };
	Int64.add = function(a, b) { return BigInt.asIntN(64, a + b); };
	Int64.sub = function(a, b) { return BigInt.asIntN(64, a - b); };
	Int64.mul = function(a, b) { return BigInt.asIntN(64, a * b); };

	Int64.div = function(a, b) { return BigInt.asIntN(64, a / b); };
	Int64.mod = function(a, b) { return BigInt.asIntN(64, a % b); };
	Int64.rem = function(a, b) { return BigInt.asIntN(64, a % b); };

	// BIT-WISE
	Int64.not = function(x) { return BigInt.asIntN(64, ~x); }
	Int64.and = function(a, b) { return BigInt.asIntN(64, a & b); }
	Int64.or = function(a, b) { return BigInt.asIntN(64, a | b); }
	Int64.xor = function(a, b) { return BigInt.asIntN(64, a ^ b); }
	Int64.shl = function(a, b) { return BigInt.asIntN(64, a << BigInt(b & 63)); }
	Int64.shr = function(a, b) { return BigInt.asIntN(64, a >> BigInt(b & 63)); }
	Int64.ushr = function(a, b) { return BigInt.asUintN(64, a >> BigInt(b & 63)); }
	Int64.sign = function(a) {
		if (a < BigInt(0)) return -1;
		if (a > BigInt(0)) return +1;
		return 0;
	};

	Int64.abs = function(a) { return (Int64.sign(a) < 0) ? Int64.neg(a) : a; };
} else {
	Int64.make_raw = function(high, low) { return new Int64(high, low); };
	Int64.low = function(v) { return v.low; }
	Int64.high = function(v) { return v.high; }

	//Int64.make_raw = function(high, low) { const out = new Int32Array(2); out[0] = low; out[1] = high; return out; };
	//Int64.low = function(v) { return v[0]; }
	//Int64.high = function(v) { return v[1]; }

	const MAX_INT64 = Int64.make_raw(0x7FFFFFFF, 0xFFFFFFFF);
	const MIN_INT64 = Int64.make_raw(0x80000000, 0x00000000);
	Int64.zero = Int64.make_raw(0, 0);
	Int64.one = Int64.make_raw(0, 1);
	Int64.MIN_VALUE = MIN_INT64;
	Int64.MAX_VALUE = MAX_INT64;
	Int64.is = function(value) { return value instanceof Int64; };
	Int64.make = function(high, low) {
		if (high === 0) {
			if (low === 0) return Int64.zero;
			if (low === 1) return Int64.one;
		}
		return Int64.make_raw(high, low);
	};
	Int64.ofInt = function(value) {
		return Int64.make(value >> 31, value | 0);
	};
	Int64.ofBigInt = function(value) {
		const i64 = new BigInt64Array(1);
		const i32 = new Int32Array(i64.buffer);
		i64[0] = value;
		return Int64.make(i32[1], i32[0]);
	};
	Int64.toBigInt = function(value) {
		const i64 = new BigInt64Array(1);
		const i32 = new Int32Array(i64.buffer);
		i32[0] = Int64.low(value);
		i32[1] = Int64.high(value);
		return i64[0];
	};

	Int64.ofFloat = function(f) {
		if (isNaN(f) || !isFinite(f)) throw "Number is NaN or Infinite";
		let noFractions = f - (f % 1);
		// 2^53-1 and -2^53: these are parseable without loss of precision
		if (noFractions > 9007199254740991) throw "Conversion overflow";
		if (noFractions < -9007199254740991) throw "Conversion underflow";

		let result = Int64.ofInt(0);
		let neg = noFractions < 0;
		let rest = neg ? -noFractions : noFractions;

		let i = 0;
		while (rest >= 1) {
			let curr = rest % 2;
			rest = rest / 2;
			if (curr >= 1) result = Int64.add(result, Int64.shl(Int64.ofInt(1), i));
			++i;
		}

		return neg ? Int64.neg(result) : result;
	};

	Int64.toInt = function(a) { return Int64.low(a); };
	Int64.toFloat = function(v) {
		if (Int64.isNeg(v)) return Int64.eq(v, MIN_INT64) ? -9223372036854775808.0 : -Int64.toFloat(Int64.neg(v));
		return Int64.low(v) + Int64.high(v) * M2P32_DBL;
	};

	Int64.isNeg = function(a) { return Int64.high(a) < 0; };
	Int64.isZero = function(a) { return Int64.high(a) === 0 && Int64.low(a) === 0; };
	Int64.isNotZero = function(a) { return Int64.high(a) !== 0 || Int64.low(a) !== 0; };

	// Comparisons

	Int64.compare = function(a, b) {
		let v = Int64.high(a) - Int64.high(b) | 0;
		if (v === 0) v = Int32.ucompare(Int64.low(a), Int64.low(b));
		return (Int64.high(a) < 0) ? ((Int64.high(b) < 0) ? v : -1) : ((Int64.high(b) >= 0) ? v : 1);
	};

	Int64.ucompare = function(a, b) {
		let v = Int32.ucompare(Int64.high(a), Int64.high(b));
		return (v !== 0) ? v : Int32.ucompare(Int64.low(a), Int64.low(b));
	};

	Int64.eq = function(a, b) { return (Int64.high(a) === Int64.high(b)) && (Int64.low(a) === Int64.low(b)); };
	Int64.ne = function(a, b) { return (Int64.high(a) !== Int64.high(b)) || (Int64.low(a) !== Int64.low(b)); };
	Int64.neq= function(a, b) { return (Int64.high(a) !== Int64.high(b)) || (Int64.low(a) !== Int64.low(b)); };
	Int64.lt = function(a, b) { return Int64.compare(a, b) < 0; };
	Int64.le = function(a, b) { return Int64.compare(a, b) <= 0; };
	Int64.gt = function(a, b) { return Int64.compare(a, b) > 0; };
	Int64.ge = function(a, b) { return Int64.compare(a, b) >= 0; };

	// Strings

	Int64.toStringStatic = function(i) {
		if (Int64.isZero(i)) return "0";

		let str = "";
		let neg = false;
		if (Int64.isNeg(i)) {
			neg = true;
		}
		let ten = Int64.ofInt(10);
		while (Int64.isNotZero(i)) {
			let r = Int64.divMod(i, ten);
			if (Int64.isNeg(r.modulus)) {
				str = Int64.low(Int64.neg(r.modulus)) + str;
				i = Int64.neg(r.quotient);
			} else {
				str = Int64.low(r.modulus) + str;
				i = r.quotient;
			}
		}
		if (neg) {
			str = "-" + str;
		}
		return str;
	}

	// Arithmetic

	Int64.divMod = function(dividend, divisor) {
		if (Int64.high(divisor) === 0 && Int64.low(divisor) === 0) throw new Error("divide by zero");
		if (Int64.high(divisor) === 0 && Int64.low(divisor) === 1) return { quotient : dividend, modulus : Int64.ofInt(0)};
		if (Int64.high(dividend) === 0 && Int64.high(divisor) === 0) return {
			quotient: Int64.ofInt(((Int64.low(divisor) >>> 0) / (Int64.low(dividend) >>> 0)) | 0),
			modulus: Int64.ofInt((Int64.low(divisor) >>> 0) % (Int64.low(dividend) >>> 0))
		};
		let divSign = Int64.isNeg(dividend) !== Int64.isNeg(divisor);
		let modulus = Int64.isNeg(dividend) ? Int64.neg(dividend) : Int64.make(Int64.high(dividend), Int64.low(dividend));
		if (Int64.isNeg(divisor)) divisor = Int64.neg(divisor);
		let quotient = Int64.ofInt(0);
		let mask = Int64.ofInt(1);
		while (!Int64.isNeg(divisor)) {
			let cmp = Int64.ucompare(divisor, modulus) >= 0;
			divisor = Int64.shl(divisor, 1);
			mask = Int64.shl(mask, 1);
			if (cmp) break;
		}
		while (Int64.neq(mask, Int64.ofInt(0))) {
			if (Int64.ucompare(modulus, divisor) >= 0) {
				quotient = Int64.or(quotient, mask);
				modulus = Int64.sub(modulus, divisor);
			}
			mask = Int64.ushr(mask, 1);
			divisor = Int64.ushr(divisor, 1);
		}
		if (divSign) quotient = Int64.neg(quotient);
		if (Int64.isNeg(dividend)) modulus = Int64.neg(modulus);
		return { quotient : quotient, modulus : modulus};
	};

	Int64.neg = function(x) {
		let high = ~Int64.high(x) | 0;
		let low = -Int64.low(x) | 0;
		if (low === 0) high = high + 1 | 0;
		return Int64.make(high, low);
	};

	Int64.add = function(a, b) {
		let high = Int64.high(a) + Int64.high(b) | 0;
		let low = Int64.low(a) + Int64.low(b) | 0;
		if (Int32.ucompare(low, Int64.low(a)) < 0) high = high + 1 | 0;
		return Int64.make(high,low);
	};

	Int64.sub = function(a, b) {
		let high = Int64.high(a) - Int64.high(b) | 0;
		let low = Int64.low(a) - Int64.low(b) | 0;
		if (Int32.ucompare(Int64.low(a), Int64.low(b)) < 0) high = high - 1 | 0;
		return Int64.make(high,low);
	};

	Int64.mul = function(a, b) {
		let al = Int64.low(a) & 65535;
		let ah = Int64.low(a) >>> 16;
		let bl = Int64.low(b) & 65535;
		let bh = Int64.low(b) >>> 16;
		let p00 = Int32.mul(al,bl);
		let p10 = Int32.mul(ah,bl);
		let p01 = Int32.mul(al,bh);
		let p11 = Int32.mul(ah,bh);
		let low = p00;
		let high = (p11 + (p01 >>> 16) | 0) + (p10 >>> 16) | 0;
		p01 = p01 << 16;
		low = p00 + p01 | 0;
		if(Int32.ucompare(low,p01) < 0) high = high + 1 | 0;
		p10 = p10 << 16;
		low = low + p10 | 0;
		if(Int32.ucompare(low,p10) < 0) high = high + 1 | 0;
		high = high + (Int32.mul(Int64.low(a), Int64.high(b)) + Int32.mul(Int64.high(a), Int64.low(b)) | 0) | 0;
		return Int64.make(high,low);
	};

	Int64.div = function(a, b) { return Int64.divMod(a, b).quotient; };
	Int64.mod = function(a, b) { return Int64.divMod(a, b).modulus; };
	Int64.rem = function(a, b) { return Int64.divMod(a, b).modulus; };

	// BIT-WISE
	Int64.not = function(x) { return Int64.make(~Int64.high(x), ~Int64.low(x)); }
	Int64.and = function(a, b) { return Int64.make(Int64.high(a) & Int64.high(b), Int64.low(a) & Int64.low(b)); }
	Int64.or = function(a, b) { return Int64.make(Int64.high(a) | Int64.high(b), Int64.low(a) | Int64.low(b)); }
	Int64.xor = function(a, b) { return Int64.make(Int64.high(a) ^ Int64.high(b), Int64.low(a) ^ Int64.low(b)); }
	Int64.shl = function(a, b) {
		b &= 63;
		if (b === 0) {
			return Int64.make(Int64.high(a), Int64.low(a));
		} else if(b < 32) {
			return Int64.make(Int64.high(a) << b | Int64.low(a) >>> 32 - b, Int64.low(a) << b);
		} else {
			return Int64.make(Int64.low(a) << b - 32,0);
		}
	}
	Int64.shr = function(a, b) {
		b &= 63;
		if (b === 0) return Int64.make(Int64.high(a), Int64.low(a));
		if (b < 32) return Int64.make(Int64.high(a) >> b, Int64.high(a) << 32 - b | Int64.low(a) >>> b);
		return Int64.make(Int64.high(a) >> 31, Int64.high(a) >> b - 32);
	}
	Int64.ushr = function(a, b) {
		b &= 63;
		if (b === 0) return Int64.make(Int64.high(a), Int64.low(a));
		if (b < 32) return Int64.make(Int64.high(a) >>> b, Int64.high(a) << 32 - b | Int64.low(a) >>> b);
		return Int64.make(0, Int64.high(a) >>> b - 32);
	}

	// Funcs

	Int64.sign = function(a) {
		if (Int64.isNeg(a)) return -1;
		if (Int64.isNotZero(a)) return +1;
		return 0;
	};
	Int64.abs = function(a) { return Int64.isNeg(a) ? Int64.neg(a) : a; };
}

////////////////////////////////////////////////////////////////////////////

//let S = [];
//let SS = [];
//
//function __buildStrings() {
//	var len = SS.length
//	S.length = len;
//	for (var n = 0; n < len; ++n) S[n] = N.str(SS[n]);
//}

let JA_0 = null;
let JA_Z = null;
let JA_B = null;
let JA_C = null;
let JA_S = null;
let JA_I = null;
let JA_J = null;
let JA_F = null;
let JA_D = null;
let JA_L = null;

function __createJavaArrayBaseType() {
	class JA_0 extends {% CLASS java.lang.Object %} {
		constructor(size, desc) {
			super();
			this.length = size;
			this.desc = desc;
		}

		getClass() {
			return N.resolveClass(this.desc);
		}

		"{% METHOD java.lang.Object:getClass %}"() {
			return N.resolveClass(this.desc);
		}

		"{% METHOD java.lang.Object:clone %}"() {
			return this.clone();
		}

		"{% METHOD java.lang.Object:getClass %}"() {
			return N.resolveClass(this.desc);
		};

		"{% METHOD java.lang.Object:toString %}"() {
			return N.str('ARRAY(' + this.desc + ')');
		};
	}

	return JA_0;
}

function __copyOfJA_0() {
	return class extends JA_0 {
		setArraySlice(startIndex, array) {
			var len = array.length;
			for (var n = 0; n < len; ++n) this.data[startIndex + n] = array[n];
		}

		checkIndex(index) {
			if (index < 0 || index >= this.data.length) {
				N.throwRuntimeException('Out of bounds ' + index + " !in [0, " + this.data.length + "]");
			}
		}

		get(index) {
			if (DEBUG_VERSION) this.checkIndex(index);
			return this.data[index];
		}

		set(index, value) {
			if (DEBUG_VERSION) this.checkIndex(index);
			this.data[index] = value;
		}
	};
}

function __createGenericArrayType(classId) {
	class ARRAY extends __copyOfJA_0() {
		constructor(size, desc) {
			super(size, desc);
			this.data = new Array(size);
			for (var n = 0; n < size; ++n) this.data[n] = null;
		}

		static copyOfRange(jarray, start, end, desc) {
			if (desc === undefined) desc = jarray.desc;
			var size = end - start;
			var out = new ARRAY(size, desc);
			var outData = out.data;
			var jarrayData = jarray.data;
			for (var n = 0; n < size; ++n) outData[n] = jarrayData[start + n];
			return out;
		}

		static fromArray(desc, array) {
			if (array == null) return null;
			var out = new JA_L(array.length, desc);
			for (var n = 0; n < out.length; ++n) out.set(n, array[n]);
			return out;
		}

		static T0(desc) { return this.fromArray(desc, []); }
        static T1(desc, a) { return this.fromArray(desc, [a]); }
        static T2(desc, a, b) { return this.fromArray(desc, [a, b]); }
        static T3(desc, a, b, c) { return this.fromArray(desc, [a, b, c]); }
        static T4(desc, a, b, c, d) { return this.fromArray(desc, [a, b, c, d]); }

		clone() {
			var out = new JA_L(this.length, this.desc);
			for (var n = 0; n < this.length; ++n) out.set(n, this.get(n));
			return out;
		}

		toArray() { return this.data; }

		//JA_0 dest, int srcPos, int destPos, int length
		copyTo(dest, srcPos, destPos, length, overlapping) {
			var srcData = this.data;
			var destData = dest.data;
			if (overlapping) {
				for (var n = length - 1; n >= 0; n--) destData[destPos + n] = srcData[srcPos + n];
			} else {
				for (var n = 0; n < length; ++n) destData[destPos + n] = srcData[srcPos + n];
			}
		};

		static createMultiSure(sizes, desc) {
			if (!desc.startsWith('[')) return null;
			if (sizes.length == 1) return JA_L.create(sizes[0], desc);
			var out = new JA_L(sizes[0], desc);
			var sizes2 = sizes.slice(1);
			var desc2 = desc.substr(1);
			for (var n = 0; n < out.length; ++n) {
				out.set(n, JA_L.createMultiSure(sizes2, desc2));
			}
			return out;
		};

		static create(size, desc) {
			switch (desc) {
				case "[Z": return new JA_Z(size);
				case "[B": return new JA_B(size);
				case "[C": return new JA_C(size);
				case "[S": return new JA_S(size);
				case "[I": return new JA_I(size);
				case "[J": return new JA_J(size);
				case "[F": return new JA_F(size);
				case "[D": return new JA_D(size);
				default: return new JA_L(size, desc);
			}
		};

		static fromArray1(items, desc) {
			if (items == null) return null;
			var out = JA_L.create(items.length, desc);
			for (var n = 0; n < items.length; ++n) out.set(n, items[n]);
			return out;
		}

		static fromArray2(items, desc) {
			if (items == null) return null;
			var out = new JA_L(items.length, desc);
			for (var n = 0; n < items.length; ++n) out.set(n, JA_L.fromArray1(items[n], desc.substr(1)));
			return out;
		};
	}

	ARRAY.prototype.__JT__CLASS_ID = ARRAY.__JT__CLASS_ID = classId;
	ARRAY.prototype.__JT__CLASS_IDS = ARRAY.__JT__CLASS_IDS = [classId];

	//ARRAY.constructor.name = "TST";

	return ARRAY;
}

function __createJavaArrayType(classId, desc, type, elementBytesSize) {
	const ELEMENT_BYTES_SIZE = elementBytesSize;
	const TYPE = type;
	const DESC = desc;
	const IS_LONG = (DESC == '[J');

	class ARRAY extends __copyOfJA_0() {
		constructor(size) {
			super(size, DESC);
			this.memorySize = size * ELEMENT_BYTES_SIZE;
			this.data = new TYPE((((this.memorySize + 7) & ~7) / ELEMENT_BYTES_SIZE)|0);

			if (IS_LONG) {
				var zero = N.lnew(0, 0);
				for (var n = 0; n < this.length; ++n) this.set(n, zero);
			}
		}

		clone() {
			var out = new ARRAY(this.length);
			if (IS_LONG) {
				for (var n = 0; n < this.length; ++n) out.set(n, this.get(n));
			} else {
				out.data.set(this.data);
			}
			return out;
		}

		static fromTypedArray(typedArray) {
			var out = new ARRAY(typedArray.length);
			out.data.set(typedArray);
			return out;
		}

		static T(typedArray) {
			return ARRAY.fromTypedArray(typedArray);
		}

		static wrapBuffer(arrayBuffer) {
			var out = new ARRAY(0);
			out.data = new type(arrayBuffer);
			out.length = out.data.length;
			return out;
		}

		getBuffer() {
			return this.data.buffer;
		}

		toArray() {
			var out = new Array(this.length);
			for (var n = 0; n < out.length; ++n) out[n] = this.get(n);
			return out;
		};

		copyTo(dest, srcPos, destPos, length, overlapping) {
			if (IS_LONG) {
				var srcData = this.data;
				var destData = dest.data;
				if (overlapping) {
					for (var n = length - 1; n >= 0; n--) destData[destPos + n] = srcData[srcPos + n];
				} else {
					for (var n = 0; n < length; ++n) destData[destPos + n] = srcData[srcPos + n];
				}
			} else {
				dest.data.set(new TYPE(this.data.buffer, srcPos * ELEMENT_BYTES_SIZE, length), destPos);
			}
		}
	};

	ARRAY.prototype.__JT__CLASS_ID = ARRAY.__JT__CLASS_ID = classId;
	ARRAY.prototype.__JT__CLASS_IDS = ARRAY.__JT__CLASS_IDS = [classId];

	//ARRAY.constructor.name = "TST";

	return ARRAY;
}

function __createJavaArrays() {
	JA_0 = __createJavaArrayBaseType();
	JA_L = class JA_L extends __createGenericArrayType(-1) {} // Generic Array
	JA_Z = class JA_Z extends __createJavaArrayType(-2, '[Z', Int8Array, 1) {}    // Bool Array
	JA_B = class JA_B extends __createJavaArrayType(-3, '[B', Int8Array, 1) {}    // Byte Array
	JA_C = class JA_C extends __createJavaArrayType(-4, '[C', Uint16Array, 2) {}  // Character Array
	JA_S = class JA_S extends __createJavaArrayType(-5, '[S', Int16Array, 2) {}  // Short Array
	JA_I = class JA_I extends __createJavaArrayType(-6, '[I', Int32Array, 4) {}   // Int Array
	JA_F = class JA_F extends __createJavaArrayType(-7, '[F', Float32Array, 4) {} // Float Array
	JA_D = class JA_D extends __createJavaArrayType(-8, '[D', Float64Array, 8) {} // Double Array
	JA_J = class JA_J extends __createJavaArrayType(-9, '[J', Array, 1) {}        // Long Array (Specially handled)
}

var __reints = (function() {
	const buffer = new ArrayBuffer(8);
	const doubleArray = new Float64Array(buffer);
	const floatArray = new Float32Array(buffer);
    const intArray = new Int32Array(buffer);
    return {
    	intBitsToFloat: function(v) {
    		intArray[0] = v;
    		return floatArray[0];
    	},
    	floatToIntBits: function(v) {
    		floatArray[0] = v;
    		return intArray[0];
    	},
    	doubleToLongBits: function(v) {
    		doubleArray[0] = v;
    		return N.lnew(intArray[1], intArray[0]);
    	},
		longBitsToDouble: function(v) {
			intArray[0] = N.llow(v);
			intArray[1] = N.lhigh(v);
			return doubleArray[0];
		},
		isLittleEndian: function() {
           return new Int16Array(new Uint8Array([1,0]).buffer)[0] == 1;
		}
    };
})();

class N {
	static monitorEnter(v) { }
	static monitorExit(v) { }

	static preInit() {
	}

	static afterInit() {
		//console.log(JA_Z);
		//console.log(JA_B);
		//console.log(JA_C);
		//console.log(JA_L);
		//console.log((new JA_Z(8)));
		//console.log((new JA_B(8)));
		//console.log((new JA_C(8)));
		//console.log((new JA_Z(8)).desc);
		//console.log((new JA_B(8)).desc);
		//console.log((new JA_C(8)).desc);
		//console.log((new JA_Z(8)) instanceof JA_Z);
		//console.log((new JA_B(8)) instanceof JA_Z);
		//console.log((new JA_C(8)) instanceof JA_Z);
		//console.log(N.is(new JA_Z(8), JA_Z));
		//console.log(N.is(new JA_B(8), JA_Z));
		//console.log(N.is(new JA_C(8), JA_Z));
	}

	static i(v) { return v | 0; }

	static z2i(v) { return v | 0; }

	///////////////////////
	// Conversions
	///////////////////////
	static i2z(v) { return v != 0; }
	static i2b(v) { return ((v << 24) >> 24); }
	static i2s(v) { return ((v << 16) >> 16); }
	static i2c(v) { return v & 0xFFFF; }
	static i2i(v) { return v | 0; }
	static i2j(v) { return Int64.ofInt(v); }
	static i2f(v) { return +v; }
	static i2d(v) { return +v; }

	static d2f(v) { return v; }
	//static d2f(v) { return Math.fround(v); }

	static d2j(v) {
		if (isFinite(v)) {
			return Int64.ofFloat(v);
		} else {
			if (isNaN(v)) {
				return Int64.zero;
			} else if (v >= 0) {
				return MAX_INT64;
			} else {
				return MIN_INT64;
			}
		}
	}
	static d2i(v) {
		if (isFinite(v)) {
			return v | 0;
		} else {
			if (isNaN(v)) {
				return 0;
			} else if (v >= 0) {
				return 2147483647;
			} else {
				return -2147483648;
			}
		}
	}

	static f2j(v) { return N.d2j(v); }
	static f2i(v) { return N.d2i(v); }

	///////////////////////
	// Integer
	///////////////////////
	static ishl(a, b) { return (a << b) | 0; };
	static ishr(a, b) { return (a >> b) | 0; };
	static iushr(a, b) { return (a >>> b) | 0; };

	static idiv(a, b) { return Math.floor(a / b) | 0; };
	static irem(a, b) { return (a % b) | 0; };

	///////////////////////
	// Long
	///////////////////////
	static lnew(high, low) { return Int64.make(high, low); };
	static lnewFloat(v) { return Int64.ofFloat(v); };
	static ltoFloat(v) { return Int64.toFloat(v); };
	static llow (v) { return Int64.low(v); }
	static lhigh(v) { return Int64.high(v); }
	static ladd (a, b) { return Int64.add(a, b); }
	static lsub (a, b) { return Int64.sub(a, b); }
	static lmul (a, b) { return Int64.mul(a, b); }
	static ldiv (a, b) { return Int64.div(a, b); }
	static lrem (a, b) { return Int64.rem(a, b); }
	static llcmp(a, b) { return Int64.compare(a, b); } // Deprecated
	static lcmp (a, b) { return Int64.compare(a, b); }
	static lxor (a, b) { return Int64.xor(a, b); }
	static land (a, b) { return Int64.and(a, b); }
	static lor  (a, b) { return Int64.or(a, b); }
	static lshl (a, b) { return Int64.shl(a, b); }
	static lshr (a, b) { return Int64.shr(a, b); }
	static lushr(a, b) { return Int64.ushr(a, b); }
	static lneg (a) { return Int64.neg(a); }
	static linv (a) { return Int64.not(a); }

	static j2i(v) { return Int64.toInt(v); }
	static j2f(v) { return Int64.toFloat(v); }
	static j2d(v) { return Int64.toFloat(v); }

	static cmp  (a, b) { return (a < b) ? -1 : ((a > b) ? 1 : 0); }
	static cmpl (a, b) { return (isNaN(a) || isNaN(b)) ? -1 : N.cmp(a, b); }
	static cmpg (a, b) { return (isNaN(a) || isNaN(b)) ? 1 : N.cmp(a, b); }

	static getTime() { return Date.now(); };
	static hrtime() {
		if (onBrowser) {
			if (typeof performance != 'undefined') {
				return N.lnewFloat(performance.now() * 1000000.0);
			} else {
				return N.lmul(N.lnewFloat(Date.now()), N.i2j(1000000));
			}
		} else if (onNodeJs) {
			var hr = process.hrtime()
			return N.ladd(N.lmul(N.i2j(hr[0]), N.i2j(1000000000)), N.i2j(hr[1]));
		} else {
			throw 'Unsupported high resolution time';
		}
	};

	static isObj(i, clazz) {
		return i instanceof clazz;
	}

	static isIfc(i, clazz) {
		if (i === null) return false;
		if (typeof i.__JT__CLASS_ID === 'undefined') return false;
		return i.__JT__CLASS_IDS.indexOf(clazz.__JT__CLASS_ID) >= 0;
	}

	// @TODO: optimize this again!
	static is(i, clazz) {
		if (N.isObj(i, clazz)) return true;
		return N.isIfc(i, clazz);
	}

	static throwInvalidConversion() {
		throw NewWrappedError({% CONSTRUCTOR java.lang.ClassCastException:(Ljava/lang/String;)V %}(N.str('Invalid conversion')));
	}

	static checkCastObj(i, clazz) {
		if (i == null) return null;
		if (clazz === null) throw new Error('Internal error N.checkCast');
		if (!N.isObj(i, clazz)) N.throwInvalidConversion();
		return i;
	}

	static checkCastIfc(i, clazz) {
		if (i == null) return null;
		if (clazz === null) throw new Error('Internal error N.checkCast');
		if (!N.isIfc(i, clazz)) N.throwInvalidConversion();
		return i;
	}

	static checkCast(i, clazz) {
		if (i == null) return null;
		if (clazz === null) throw new Error('Internal error N.checkCast');
		if (!N.is(i, clazz)) N.throwInvalidConversion();
		return i;
	};

	static isClassId(i, classId) {
		if (i == null) return false;
		if (!i.__JT__CLASS_IDS) return false;
		return i.__JT__CLASS_IDS.indexOf(classId) >= 0;
	};

	static istr(str) {
		if (str === null) return null;
		return '' + str;
	}

	static ichar(i) {
		return String.fromCharCode(i);
	}

	static str(str) {
		if (str === null) return null;
		return '' + str;
	}

	static strLit(str) {
		// Check cache!
		return N.str(str);
	};

	static strLitEscape(str) {
		// Check cache!
		return str;
	};

	static strArray(strs) {
		if (strs == null) return null;
		var out = new JA_L(strs.length, '[Ljava/lang/String;');
		for (var n = 0; n < strs.length; ++n) {
			out.set(n, N.str(strs[n]));
		}
		return out;
	};

	static strArrayOrEmpty(strs) {
		var out = N.strArray(strs);
		return out ? out : [];
	};

	static istrArray(strs) {
		if (strs == null) return null;
		return strs.data.map(function(s) { return N.istr(s); });
	};

	static iteratorToArray(it) {
		if (it == null) return null;
		var out = [];
		while (it{% IMETHOD java.util.Iterator:hasNext:()Z %}()) {
			out.push(it{% IMETHOD java.util.Iterator:next:()Ljava/lang/Object; %}());
		}
		return out;
	};

	static imap(map) {
		if (map == null) return null;
		var obj = {};
		let array = (N.iteratorToArray(map{% IMETHOD java.util.Map:entrySet %}(){% IMETHOD java.util.Set:iterator %}()))

		for (let n = 0; n < array.length; n++) {
			let item = array[n];
			var key = item{% IMETHOD java.util.Map$Entry:getKey %}();
			var value = item{% IMETHOD java.util.Map$Entry:getValue %}();
			obj[N.unbox(key)] = N.unbox(value);
		}
		return obj;
	};

	static args() {
		return onNodeJs ? process.argv.slice(2) : [];
	};

	static byteArrayToString(array, offset, length, encoding) {
		if (offset === undefined) offset = 0;
		if (length === undefined) length = array.length - offset;
		if (encoding === undefined) encoding = 'UTF-8';
		// @TODO: Handle encodings!
		var out = '';
		for (var n = offset; n < offset + length; ++n) {
			out += String.fromCharCode(array.get(n));
		}
		return out;
	};

	static intArrayToString(array, offset, length, encoding) {
		return N.byteArrayToString(array, offset, length, encoding);
	}

	static charArrayToString(array, offset, length, encoding) {
		return N.byteArrayToString(array, offset, length, encoding);
	}

	static stringToCharArray(str) {
		var out = new JA_C(str.length);
		for (var n = 0; n < str.length; ++n) out.set(n, str.charCodeAt(n));
		return out;
	};

	// @TODO: Make this sync
	static resolveClass(name) {
		return {% SMETHOD java.lang.Class:forName:(Ljava/lang/String;)Ljava/lang/Class; %}(N.str(name));
	};

	static createStackTraceElement(declaringClass, methodName, fileName, lineNumber) {
		var out = {% CONSTRUCTOR java.lang.StackTraceElement:(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V %}(
			N.str(declaringClass),
			N.str(methodName),
			N.str(fileName),
			lineNumber | 0
		);
		return out;
	};

	static getStackTrace(error, count) {
		//var traces = stackTrace()
		var traces = error.stack.split('\n').slice(count);
		var out = new JA_L(traces.length, '[Ljava/lang/StackTraceElement;');
		for (var n = 0; n < traces.length; ++n) {
			out.set(n, N.createStackTraceElement('JS', 'js', traces[n], 0));
		}
		return out;
	};

	static arraycopy(src, srcPos, dest, destPos, length) {
		//if (length < 0 || srcPos < 0 || destPos < 0 || srcPos + length > src.length || destPos + length > dest.length) N.throwRuntimeException('N.arraycopy out of bounds');
		var overlapping = src == dest && (destPos > srcPos);
		src.copyTo(dest, srcPos, destPos, length, overlapping);
	};

	static isInstanceOfClass(obj, javaClass) {
		if (obj == null) return false;
		if (javaClass == null) return false;
		var clazz = jtranscClasses[N.istr(javaClass._name)];
		if (clazz == null) return false;
		return N.is(obj, clazz);
	};

	static identityHashCode(p0) {
		return (p0 != null) ? p0.$JS$ID$ : 0;
	};

	static fillSecureRandomBytes(array) {
		var buf;

		if (onNodeJs) {
			buf = require('crypto').randomBytes(256);
		} else {
			buf = new Uint8Array(array.length);
			window.crypto.getRandomValues(buf);
		}

		for (var n = 0; n < array.length; ++n) array.set(n, buf[n]);
	};

	static boxVoid    (value) { return null; }
	static boxBool    (value) { return {% SMETHOD java.lang.Boolean:valueOf:(Z)Ljava/lang/Boolean; %}(value); }
	static boxByte    (value) { return {% SMETHOD java.lang.Byte:valueOf:(B)Ljava/lang/Byte; %}(value); }
	static boxShort   (value) { return {% SMETHOD java.lang.Short:valueOf:(S)Ljava/lang/Short; %}(value); }
	static boxChar    (value) { return {% SMETHOD java.lang.Character:valueOf:(C)Ljava/lang/Character; %}(value); }
	static boxInt     (value) { return {% SMETHOD java.lang.Integer:valueOf:(I)Ljava/lang/Integer; %}(value); }
	static boxLong    (value) { return {% SMETHOD java.lang.Long:valueOf:(J)Ljava/lang/Long; %}(value); }
	static boxFloat   (value) { return {% SMETHOD java.lang.Float:valueOf:(F)Ljava/lang/Float; %}(value); }
	static boxDouble  (value) { return {% SMETHOD java.lang.Double:valueOf:(D)Ljava/lang/Double; %}(value); }
	static boxString  (value) { return (value != null) ? N.str(value) : null; }
	static boxWrapped (value) { return N.wrap(value); }

	static unboxVoid      (value) { return null; }
	static unboxBool      (value) { return value["{% FIELD java.lang.Boolean:value:Z %}"]; }
	static unboxByte      (value) { return value["{% FIELD java.lang.Byte:value:B %}"]; }
	static unboxShort     (value) { return value["{% FIELD java.lang.Short:value:S %}"]; }
	static unboxChar      (value) { return value["{% FIELD java.lang.Character:value:C %}"]; }
	static unboxInt       (value) { return value["{% FIELD java.lang.Integer:value:I %}"]; }
	static unboxLong      (value) { return value["{% FIELD java.lang.Long:value:J %}"]; }
	static unboxFloat     (value) { return value["{% FIELD java.lang.Float:value:F %}"]; }
	static unboxDouble    (value) { return value["{% FIELD java.lang.Double:value:D %}"]; }
	static unboxString    (value) { return N.istr(value); }
	static unboxWrapped   (value) { return value._wrapped; }

	static unboxByteArray(value) {
		return value.data;
	};

	static unbox(value, throwOnInvalid) {
		if (N.isObj(value, {% CLASS java.lang.Boolean %})) return N.unboxBool(value);
		if (N.isObj(value, {% CLASS java.lang.Byte %})) return N.unboxByte(value);
		if (N.isObj(value, {% CLASS java.lang.Short %})) return N.unboxShort(value);
		if (N.isObj(value, {% CLASS java.lang.Character %})) return N.unboxChar(value);
		if (N.isObj(value, {% CLASS java.lang.Integer %})) return N.unboxInt(value);
		if (N.isObj(value, {% CLASS java.lang.Long %})) return N.unboxLong(value);
		if (N.isObj(value, {% CLASS java.lang.Float %})) return N.unboxFloat(value);
		if (N.isObj(value, {% CLASS java.lang.Double %})) return N.unboxDouble(value);
		if (N.isObj(value, {% CLASS java.lang.String %})) return N.unboxString(value);
		if (value instanceof JA_B) return N.unboxByteArray(value);
		if (N.isObj(value, {% CLASS com.jtransc.JTranscWrapped %})) return N.unboxWrapped(value);
		if (throwOnInvalid) throw 'Was not able to unbox "' + value + '"';
		return value;
	}

	static wrap(value) {
		var out = new {% CLASS com.jtransc.JTranscWrapped %}();
		out._wrapped = value;
		return out;
	}

	static createRuntimeException(msg) {
		return {% CONSTRUCTOR java.lang.RuntimeException:(Ljava/lang/String;)V %}(N.str(msg));
	};

	static throwRuntimeException(msg) {
		throw N.createRuntimeException(msg);
		//throw msg;
	};

	static boxWithType(clazz, value) {
		if (value instanceof JA_0) return value;
		if (value instanceof {% CLASS java.lang.Object %}) return value;

		var clazzName = N.istr(clazz{% IFIELD java.lang.Class:name %});

		switch (clazzName) {
			case 'void'   : return N.boxVoid();
			case 'boolean': return N.boxBool(value);
			case 'byte'   : return N.boxByte(value);
			case 'short'  : return N.boxShort(value);
			case 'char'   : return N.boxChar(value);
			case 'int'    : return N.boxInt(value);
			case 'long'   : return N.boxLong(value);
			case 'float'  : return N.boxFloat(value);
			case 'double' : return N.boxDouble(value);
		}

		console.log("WARNING: Don't know how to unbox class '" + clazzName + "' with value '" + value + "'", value);
		return value;
	};

	static unboxWithTypeWhenRequired(clazz, value) {
		var clazzName = N.istr(clazz{% IFIELD java.lang.Class:name %});

		switch (clazzName) {
			case 'void'   :
			case 'boolean':
			case 'byte'   :
			case 'short'  :
			case 'char'   :
			case 'int'    :
			case 'long'   :
			case 'float'  :
			case 'double' :
				return N.unbox(value);
		}

		return value;
	};

	static unboxArray(array) {
		return array.map(function(it) { return N.unbox(it); });
	};

	static boxArray(array) {
		return JA_L.fromArray(array.map(function(it) { return N.box(it); }));
	};

	static box(v) {
		if (v instanceof {% CLASS java.lang.Object %}) return v; // already boxed!
		if (v instanceof Int64) return N.boxLong(v);
		if (typeof v == 'string') return N.str(v);
		if ((v|0) == v) return N.boxInt(v);
		if (+(v) == v) return N.boxFloat(v);
		if ((v == null) || N.isObj(v, {% CLASS java.lang.Object %})) return v;
		return N.wrap(v);
	};

	static isNegativeZero(x) { return x === 0 && 1 / x === -Infinity; };

	//N.sort = function(array, start, end, comparator) {
	//	var slice = array.slice(start, end);
	//	if (comparator === undefined) {
	//		slice.sort();
	//	} else {
	//		throw 'Unsupported N.sort!';
	//		//slice.sort(function(a, b) {
	//		//	return comparator["{% METHOD java.util.Comparator:compare:(Ljava/lang/Object;Ljava/lang/Object;)I %}"](a, b);
	//		//});
	//	}
	//	for (var n = 0; n < slice.length; ++n) array[start + n] = slice[n];
	//};

	static getByteArray(v) {
		if (v instanceof JA_B) return v;
		var length = v.byteLength || v.length
		if (v.buffer) v = v.buffer;
		var out = new JA_B(length);
		out.data = new Int8Array(v);
		return out;
	};

	static clone(obj) {
		if (obj == null) return null;
		var temp = Object.create(obj);
		temp.$$id = 0;
		return temp;
	};

	static methodWithoutBody(name) {
		throw 'Method not implemented: native or abstract: ' + name;
	};

	static EMPTY_FUNCTION() { }

	static get MIN_INT32() { return -2147483648; }
    static get isLittleEndian() { return __reints.isLittleEndian(); }
    static get intBitsToFloat() { return __reints.intBitsToFloat; }
    static get floatToIntBits() { return __reints.floatToIntBits; }
    static get doubleToLongBits() { return __reints.doubleToLongBits; }
    static get longBitsToDouble() { return __reints.longBitsToDouble; }
} // N

function stackTrace() {
	return (new Error()).stack.split('\n').slice(3);
}

class java_lang_Object_base {
	constructor() {}
	toString() { return this ? N.istr(this{% IMETHOD java.lang.Object:toString %}()) : null; }
}

java_lang_Object_base.prototype.___id = 0;
java_lang_Object_base.prototype.__JT__CLASS_ID = java_lang_Object_base.__JT__CLASS_ID = 0;
java_lang_Object_base.prototype.__JT__CLASS_IDS = java_lang_Object_base.__JT__CLASS_IDS = [0];


function WrappedError(javaThrowable) {
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.javaThrowable = javaThrowable;
	//try {
	//	this.message = (javaThrowable != null) ? (('' + javaThrowable) || 'JavaError') : 'JavaError';
	//} catch (e) {
	this.message = 'JavaErrorWithoutValidMessage:' + javaThrowable;
	//}
}

function NewWrappedError(javaThrowable) {
	return new WrappedError(javaThrowable);
}

//process.on('uncaughtException', function (exception) { console.error(exception); });

/* ## BODY ## */

})(_global);