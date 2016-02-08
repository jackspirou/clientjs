(function () {
    var ctph = {};
    var isBrowser = false;
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = ctph;
    } else {//for browser
        this.ctph = ctph;
        isBrowser = true;
    }

    var HASH_PRIME = 0x01000193;
    var HASH_INIT = 0x28021967;
    var B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    //refer http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
    function toUTF8Array (str) {
        var utf8 = unescape(encodeURIComponent(str));
        var arr = [];
        for (var i = 0; i < utf8.length; i++) {
            arr.push(utf8.charCodeAt(i));
        }
        return arr;
    }

    //FNV-1 hash
    function fnv (base, b) {
        return ((base * HASH_PRIME) ^ b) >>> 0;
    }

    //Based on https://github.com/hiddentao/fast-levenshtein
    function levenshtein (str1, str2) {
        // base cases
        if (str1 === str2) return 0;
        if (str1.length === 0) return str2.length;
        if (str2.length === 0) return str1.length;

        // two rows
        var prevRow  = new Array(str2.length + 1),
            curCol, nextCol, i, j, tmp;

        // initialise previous row
        for (i=0; i<prevRow.length; ++i) {
            prevRow[i] = i;
        }

        // calculate current row distance from previous row
        for (i=0; i<str1.length; ++i) {
            nextCol = i + 1;

            for (j=0; j<str2.length; ++j) {
                curCol = nextCol;

                // substution
                nextCol = prevRow[j] + ( (str1.charAt(i) === str2.charAt(j)) ? 0 : 1 );
                // insertion
                tmp = curCol + 1;
                if (nextCol > tmp) {
                    nextCol = tmp;
                }
                // deletion
                tmp = prevRow[j + 1] + 1;
                if (nextCol > tmp) {
                    nextCol = tmp;
                }

                // copy current col value into previous (in preparation for next iteration)
                prevRow[j] = curCol;
            }

            // copy last col value into previous (in preparation for next iteration)
            prevRow[j] = nextCol;
        }
        return nextCol;
    }

    function RollHash () {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.c = 0;
        this.window = new Array(7);
    }
    RollHash.prototype.update = function (d) {
        this.y -= this.x;
        this.y += 7 * d;
        this.x += d;
        this.x -= this.window[this.c % 7] || 0;
        this.window[this.c % 7] = d;
        this.c++;
        this.z = (this.z << 5)>>>0; // `>>>0` for force unsigned
        this.z = (this.z ^ d)>>>0;
    };
    RollHash.prototype.sum = function () {
        return (this.x + this.y + this.z) >>> 0;
    };

    function piecewiseHash (bytes, triggerValue) {
        var signatures = ['',''];
        var h1 = HASH_INIT;
        var h2 = HASH_INIT;
        var rh = new RollHash();
        for (var i = 0, len = bytes.length; i < len; i++) {
            h1 = fnv(h1, bytes[i]);
            h2 = fnv(h2, bytes[i]);
            rh.update(bytes[i]);
            if (i === len - 1 || rh.sum() % triggerValue === (triggerValue - 1)) {
                signatures[0] += B64.charAt(h1&63);
                h1 = HASH_INIT;
            }
            if (i === len - 1 || rh.sum() % (triggerValue * 2) === (triggerValue * 2 - 1) ) {
                signatures[1] += B64.charAt(h2&63);
                h2 = HASH_INIT;
            }
        }
        return signatures;
    }

    //Context Triggered Piecewise Hash (CTPH)
    function digest (bytes) {
        var minb = 3;
        var bi = Math.ceil(Math.log(bytes.length/(64*minb))/Math.log(2));
        bi = Math.max(3, bi);
        var signatures = piecewiseHash(bytes, minb << bi);
        while (bi>0 && signatures[0].length < 32){
            signatures = piecewiseHash(bytes, minb << --bi);
        }
        return B64.charAt(bi) + ':' + signatures[0] + ':' + signatures[1];
    }

    function matchScore (s1, s2) {
        var e = levenshtein(s1, s2);
        var r = 1 - e/Math.max(s1.length ,s2.length);
        return r * 100;
    }

    ctph.digest = function (data) {
        if (typeof data === 'string') {
            data = isBrowser?toUTF8Array(data):new Buffer(data).toJSON();
        }
        return digest(data);
    };

    ctph.similarity = function (d1, d2) {
        var b1 = B64.indexOf(d1.charAt(0));
        var b2 = B64.indexOf(d2.charAt(0));
        if (b1 > b2) return arguments.callee(d2, d1);

        if (Math.abs(b1-b2) > 1) {
            return 0;
        } else if (b1 === b2) {
            return matchScore(d1.split(':')[1], d2.split(':')[1]);
        } else {
            return matchScore(d1.split(':')[2], d2.split(':')[1]);
        }
    };
})();
