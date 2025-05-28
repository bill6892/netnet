/*! For license information please see inpage.js.LICENSE.txt */
( () => {
    var t = {
        "../../../node_modules/@solana/buffer-layout/lib/Layout.js": (t, e, n) => {
            "use strict";
            e._O = e.Jq = e.KB = e.u8 = e.cv = void 0,
            e.Ik = e.A9 = e.n_ = e.gM = void 0;
            const r = n("../../../node_modules/buffer/index.js");
            function i(t) {
                if (!(t instanceof Uint8Array))
                    throw new TypeError("b must be a Uint8Array")
            }
            function o(t) {
                return i(t),
                r.Buffer.from(t.buffer, t.byteOffset, t.length)
            }
            class s {
                constructor(t, e) {
                    if (!Number.isInteger(t))
                        throw new TypeError("span must be an integer");
                    this.span = t,
                    this.property = e
                }
                makeDestinationObject() {
                    return {}
                }
                getSpan(t, e) {
                    if (0 > this.span)
                        throw new RangeError("indeterminate span");
                    return this.span
                }
                replicate(t) {
                    const e = Object.create(this.constructor.prototype);
                    return Object.assign(e, this),
                    e.property = t,
                    e
                }
                fromArray(t) {}
            }
            function a(t, e) {
                return e.property ? t + "[" + e.property + "]" : t
            }
            class u extends s {
                isCount() {
                    throw new Error("ExternalLayout is abstract")
                }
            }
            class c extends u {
                constructor(t, e=0, n) {
                    if (!(t instanceof s))
                        throw new TypeError("layout must be a Layout");
                    if (!Number.isInteger(e))
                        throw new TypeError("offset must be integer or undefined");
                    super(t.span, n || t.property),
                    this.layout = t,
                    this.offset = e
                }
                isCount() {
                    return this.layout instanceof l || this.layout instanceof f
                }
                decode(t, e=0) {
                    return this.layout.decode(t, e + this.offset)
                }
                encode(t, e, n=0) {
                    return this.layout.encode(t, e, n + this.offset)
                }
            }
            class l extends s {
                constructor(t, e) {
                    if (super(t, e),
                    6 < this.span)
                        throw new RangeError("span must not exceed 6 bytes")
                }
                decode(t, e=0) {
                    return o(t).readUIntLE(e, this.span)
                }
                encode(t, e, n=0) {
                    return o(e).writeUIntLE(t, n, this.span),
                    this.span
                }
            }
            class f extends s {
                constructor(t, e) {
                    if (super(t, e),
                    6 < this.span)
                        throw new RangeError("span must not exceed 6 bytes")
                }
                decode(t, e=0) {
                    return o(t).readUIntBE(e, this.span)
                }
                encode(t, e, n=0) {
                    return o(e).writeUIntBE(t, n, this.span),
                    this.span
                }
            }
            const h = Math.pow(2, 32);
            function d(t) {
                const e = Math.floor(t / h);
                return {
                    hi32: e,
                    lo32: t - e * h
                }
            }
            function p(t, e) {
                return t * h + e
            }
            class y extends s {
                constructor(t) {
                    super(8, t)
                }
                decode(t, e=0) {
                    const n = o(t)
                      , r = n.readUInt32LE(e);
                    return p(n.readUInt32LE(e + 4), r)
                }
                encode(t, e, n=0) {
                    const r = d(t)
                      , i = o(e);
                    return i.writeUInt32LE(r.lo32, n),
                    i.writeUInt32LE(r.hi32, n + 4),
                    8
                }
            }
            class g extends s {
                constructor(t) {
                    super(8, t)
                }
                decode(t, e=0) {
                    const n = o(t)
                      , r = n.readUInt32LE(e);
                    return p(n.readInt32LE(e + 4), r)
                }
                encode(t, e, n=0) {
                    const r = d(t)
                      , i = o(e);
                    return i.writeUInt32LE(r.lo32, n),
                    i.writeInt32LE(r.hi32, n + 4),
                    8
                }
            }
            class m extends s {
                constructor(t, e, n) {
                    if (!(t instanceof s))
                        throw new TypeError("elementLayout must be a Layout");
                    if (!(e instanceof u && e.isCount() || Number.isInteger(e) && 0 <= e))
                        throw new TypeError("count must be non-negative integer or an unsigned integer ExternalLayout");
                    let r = -1;
                    !(e instanceof u) && 0 < t.span && (r = e * t.span),
                    super(r, n),
                    this.elementLayout = t,
                    this.count = e
                }
                getSpan(t, e=0) {
                    if (0 <= this.span)
                        return this.span;
                    let n = 0
                      , r = this.count;
                    if (r instanceof u && (r = r.decode(t, e)),
                    0 < this.elementLayout.span)
                        n = r * this.elementLayout.span;
                    else {
                        let i = 0;
                        for (; i < r; )
                            n += this.elementLayout.getSpan(t, e + n),
                            ++i
                    }
                    return n
                }
                decode(t, e=0) {
                    const n = [];
                    let r = 0
                      , i = this.count;
                    for (i instanceof u && (i = i.decode(t, e)); r < i; )
                        n.push(this.elementLayout.decode(t, e)),
                        e += this.elementLayout.getSpan(t, e),
                        r += 1;
                    return n
                }
                encode(t, e, n=0) {
                    const r = this.elementLayout
                      , i = t.reduce(( (t, i) => t + r.encode(i, e, n + t)), 0);
                    return this.count instanceof u && this.count.encode(t.length, e, n),
                    i
                }
            }
            class b extends s {
                constructor(t, e, n) {
                    if (!Array.isArray(t) || !t.reduce(( (t, e) => t && e instanceof s), !0))
                        throw new TypeError("fields must be array of Layout instances");
                    "boolean" == typeof e && void 0 === n && (n = e,
                    e = void 0);
                    for (const e of t)
                        if (0 > e.span && void 0 === e.property)
                            throw new Error("fields cannot contain unnamed variable-length layout");
                    let r = -1;
                    try {
                        r = t.reduce(( (t, e) => t + e.getSpan()), 0)
                    } catch (t) {}
                    super(r, e),
                    this.fields = t,
                    this.decodePrefixes = !!n
                }
                getSpan(t, e=0) {
                    if (0 <= this.span)
                        return this.span;
                    let n = 0;
                    try {
                        n = this.fields.reduce(( (n, r) => {
                            const i = r.getSpan(t, e);
                            return e += i,
                            n + i
                        }
                        ), 0)
                    } catch (t) {
                        throw new RangeError("indeterminate span")
                    }
                    return n
                }
                decode(t, e=0) {
                    i(t);
                    const n = this.makeDestinationObject();
                    for (const r of this.fields)
                        if (void 0 !== r.property && (n[r.property] = r.decode(t, e)),
                        e += r.getSpan(t, e),
                        this.decodePrefixes && t.length === e)
                            break;
                    return n
                }
                encode(t, e, n=0) {
                    const r = n;
                    let i = 0
                      , o = 0;
                    for (const r of this.fields) {
                        let s = r.span;
                        if (o = 0 < s ? s : 0,
                        void 0 !== r.property) {
                            const i = t[r.property];
                            void 0 !== i && (o = r.encode(i, e, n),
                            0 > s && (s = r.getSpan(e, n)))
                        }
                        i = n,
                        n += s
                    }
                    return i + o - r
                }
                fromArray(t) {
                    const e = this.makeDestinationObject();
                    for (const n of this.fields)
                        void 0 !== n.property && 0 < t.length && (e[n.property] = t.shift());
                    return e
                }
                layoutFor(t) {
                    if ("string" != typeof t)
                        throw new TypeError("property must be string");
                    for (const e of this.fields)
                        if (e.property === t)
                            return e
                }
                offsetOf(t) {
                    if ("string" != typeof t)
                        throw new TypeError("property must be string");
                    let e = 0;
                    for (const n of this.fields) {
                        if (n.property === t)
                            return e;
                        0 > n.span ? e = -1 : 0 <= e && (e += n.span)
                    }
                }
            }
            class w extends s {
                constructor(t, e) {
                    if (!(t instanceof u && t.isCount() || Number.isInteger(t) && 0 <= t))
                        throw new TypeError("length must be positive integer or an unsigned integer ExternalLayout");
                    let n = -1;
                    t instanceof u || (n = t),
                    super(n, e),
                    this.length = t
                }
                getSpan(t, e) {
                    let n = this.span;
                    return 0 > n && (n = this.length.decode(t, e)),
                    n
                }
                decode(t, e=0) {
                    let n = this.span;
                    return 0 > n && (n = this.length.decode(t, e)),
                    o(t).slice(e, e + n)
                }
                encode(t, e, n) {
                    let r = this.length;
                    if (this.length instanceof u && (r = t.length),
                    !(t instanceof Uint8Array && r === t.length))
                        throw new TypeError(a("Blob.encode", this) + " requires (length " + r + ") Uint8Array as src");
                    if (n + r > e.length)
                        throw new RangeError("encoding overruns Uint8Array");
                    const i = o(t);
                    return o(e).write(i.toString("hex"), n, r, "hex"),
                    this.length instanceof u && this.length.encode(r, e, n),
                    r
                }
            }
            e.cv = (t, e, n) => new c(t,e,n),
            e.u8 = t => new l(1,t),
            e.KB = t => new l(2,t),
            e.Jq = t => new l(4,t),
            e._O = t => new y(t),
            e.gM = t => new g(t),
            e.n_ = (t, e, n) => new b(t,e,n),
            e.A9 = (t, e, n) => new m(t,e,n),
            e.Ik = (t, e) => new w(t,e)
        }
        ,
        "../../../node_modules/assert/build/assert.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/process/browser.js")
              , i = n("../../../node_modules/console-browserify/index.js");
            function o(t) {
                return o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                o(t)
            }
            var s, a, u = n("../../../node_modules/assert/build/internal/errors.js").codes, c = u.ERR_AMBIGUOUS_ARGUMENT, l = u.ERR_INVALID_ARG_TYPE, f = u.ERR_INVALID_ARG_VALUE, h = u.ERR_INVALID_RETURN_VALUE, d = u.ERR_MISSING_ARGS, p = n("../../../node_modules/assert/build/internal/assert/assertion_error.js"), y = n("../../../node_modules/util/util.js").inspect, g = n("../../../node_modules/util/util.js").types, m = g.isPromise, b = g.isRegExp, w = Object.assign ? Object.assign : n("../../../node_modules/es6-object-assign/index.js").assign, v = Object.is ? Object.is : n("../../../node_modules/object-is/index.js");
            function x() {
                var t = n("../../../node_modules/assert/build/internal/util/comparisons.js");
                s = t.isDeepEqual,
                a = t.isDeepStrictEqual
            }
            new Map;
            var S = !1
              , k = t.exports = M
              , E = {};
            function A(t) {
                if (t.message instanceof Error)
                    throw t.message;
                throw new p(t)
            }
            function I(t, e, n, r) {
                if (!n) {
                    var i = !1;
                    if (0 === e)
                        i = !0,
                        r = "No value argument passed to `assert.ok()`";
                    else if (r instanceof Error)
                        throw r;
                    var o = new p({
                        actual: n,
                        expected: !0,
                        message: r,
                        operator: "==",
                        stackStartFn: t
                    });
                    throw o.generatedMessage = i,
                    o
                }
            }
            function M() {
                for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
                    e[n] = arguments[n];
                I.apply(void 0, [M, e.length].concat(e))
            }
            k.fail = function t(e, n, o, s, a) {
                var u, c = arguments.length;
                if (0 === c ? u = "Failed" : 1 === c ? (o = e,
                e = void 0) : (!1 === S && (S = !0,
                (r.emitWarning ? r.emitWarning : i.warn.bind(i))("assert.fail() with more than one argument is deprecated. Please use assert.strictEqual() instead or only pass a message.", "DeprecationWarning", "DEP0094")),
                2 === c && (s = "!=")),
                o instanceof Error)
                    throw o;
                var l = {
                    actual: e,
                    expected: n,
                    operator: void 0 === s ? "fail" : s,
                    stackStartFn: a || t
                };
                void 0 !== o && (l.message = o);
                var f = new p(l);
                throw u && (f.message = u,
                f.generatedMessage = !0),
                f
            }
            ,
            k.AssertionError = p,
            k.ok = M,
            k.equal = function t(e, n, r) {
                if (arguments.length < 2)
                    throw new d("actual","expected");
                e != n && A({
                    actual: e,
                    expected: n,
                    message: r,
                    operator: "==",
                    stackStartFn: t
                })
            }
            ,
            k.notEqual = function t(e, n, r) {
                if (arguments.length < 2)
                    throw new d("actual","expected");
                e == n && A({
                    actual: e,
                    expected: n,
                    message: r,
                    operator: "!=",
                    stackStartFn: t
                })
            }
            ,
            k.deepEqual = function t(e, n, r) {
                if (arguments.length < 2)
                    throw new d("actual","expected");
                void 0 === s && x(),
                s(e, n) || A({
                    actual: e,
                    expected: n,
                    message: r,
                    operator: "deepEqual",
                    stackStartFn: t
                })
            }
            ,
            k.notDeepEqual = function t(e, n, r) {
                if (arguments.length < 2)
                    throw new d("actual","expected");
                void 0 === s && x(),
                s(e, n) && A({
                    actual: e,
                    expected: n,
                    message: r,
                    operator: "notDeepEqual",
                    stackStartFn: t
                })
            }
            ,
            k.deepStrictEqual = function t(e, n, r) {
                if (arguments.length < 2)
                    throw new d("actual","expected");
                void 0 === s && x(),
                a(e, n) || A({
                    actual: e,
                    expected: n,
                    message: r,
                    operator: "deepStrictEqual",
                    stackStartFn: t
                })
            }
            ,
            k.notDeepStrictEqual = function t(e, n, r) {
                if (arguments.length < 2)
                    throw new d("actual","expected");
                void 0 === s && x(),
                a(e, n) && A({
                    actual: e,
                    expected: n,
                    message: r,
                    operator: "notDeepStrictEqual",
                    stackStartFn: t
                })
            }
            ,
            k.strictEqual = function t(e, n, r) {
                if (arguments.length < 2)
                    throw new d("actual","expected");
                v(e, n) || A({
                    actual: e,
                    expected: n,
                    message: r,
                    operator: "strictEqual",
                    stackStartFn: t
                })
            }
            ,
            k.notStrictEqual = function t(e, n, r) {
                if (arguments.length < 2)
                    throw new d("actual","expected");
                v(e, n) && A({
                    actual: e,
                    expected: n,
                    message: r,
                    operator: "notStrictEqual",
                    stackStartFn: t
                })
            }
            ;
            var _ = function t(e, n, r) {
                var i = this;
                !function(t, e) {
                    if (!(t instanceof e))
                        throw new TypeError("Cannot call a class as a function")
                }(this, t),
                n.forEach((function(t) {
                    t in e && (void 0 !== r && "string" == typeof r[t] && b(e[t]) && e[t].test(r[t]) ? i[t] = r[t] : i[t] = e[t])
                }
                ))
            };
            function B(t, e, n, r) {
                if ("function" != typeof e) {
                    if (b(e))
                        return e.test(t);
                    if (2 === arguments.length)
                        throw new l("expected",["Function", "RegExp"],e);
                    if ("object" !== o(t) || null === t) {
                        var i = new p({
                            actual: t,
                            expected: e,
                            message: n,
                            operator: "deepStrictEqual",
                            stackStartFn: r
                        });
                        throw i.operator = r.name,
                        i
                    }
                    var u = Object.keys(e);
                    if (e instanceof Error)
                        u.push("name", "message");
                    else if (0 === u.length)
                        throw new f("error",e,"may not be an empty object");
                    return void 0 === s && x(),
                    u.forEach((function(i) {
                        "string" == typeof t[i] && b(e[i]) && e[i].test(t[i]) || function(t, e, n, r, i, o) {
                            if (!(n in t) || !a(t[n], e[n])) {
                                if (!r) {
                                    var s = new _(t,i)
                                      , u = new _(e,i,t)
                                      , c = new p({
                                        actual: s,
                                        expected: u,
                                        operator: "deepStrictEqual",
                                        stackStartFn: o
                                    });
                                    throw c.actual = t,
                                    c.expected = e,
                                    c.operator = o.name,
                                    c
                                }
                                A({
                                    actual: t,
                                    expected: e,
                                    message: r,
                                    operator: o.name,
                                    stackStartFn: o
                                })
                            }
                        }(t, e, i, n, u, r)
                    }
                    )),
                    !0
                }
                return void 0 !== e.prototype && t instanceof e || !Error.isPrototypeOf(e) && !0 === e.call({}, t)
            }
            function j(t) {
                if ("function" != typeof t)
                    throw new l("fn","Function",t);
                try {
                    t()
                } catch (t) {
                    return t
                }
                return E
            }
            function O(t) {
                return m(t) || null !== t && "object" === o(t) && "function" == typeof t.then && "function" == typeof t.catch
            }
            function P(t) {
                return Promise.resolve().then((function() {
                    var e;
                    if ("function" == typeof t) {
                        if (!O(e = t()))
                            throw new h("instance of Promise","promiseFn",e)
                    } else {
                        if (!O(t))
                            throw new l("promiseFn",["Function", "Promise"],t);
                        e = t
                    }
                    return Promise.resolve().then((function() {
                        return e
                    }
                    )).then((function() {
                        return E
                    }
                    )).catch((function(t) {
                        return t
                    }
                    ))
                }
                ))
            }
            function T(t, e, n, r) {
                if ("string" == typeof n) {
                    if (4 === arguments.length)
                        throw new l("error",["Object", "Error", "Function", "RegExp"],n);
                    if ("object" === o(e) && null !== e) {
                        if (e.message === n)
                            throw new c("error/message",'The error message "'.concat(e.message, '" is identical to the message.'))
                    } else if (e === n)
                        throw new c("error/message",'The error "'.concat(e, '" is identical to the message.'));
                    r = n,
                    n = void 0
                } else if (null != n && "object" !== o(n) && "function" != typeof n)
                    throw new l("error",["Object", "Error", "Function", "RegExp"],n);
                if (e === E) {
                    var i = "";
                    n && n.name && (i += " (".concat(n.name, ")")),
                    i += r ? ": ".concat(r) : ".";
                    var s = "rejects" === t.name ? "rejection" : "exception";
                    A({
                        actual: void 0,
                        expected: n,
                        operator: t.name,
                        message: "Missing expected ".concat(s).concat(i),
                        stackStartFn: t
                    })
                }
                if (n && !B(e, n, r, t))
                    throw e
            }
            function L(t, e, n, r) {
                if (e !== E) {
                    if ("string" == typeof n && (r = n,
                    n = void 0),
                    !n || B(e, n)) {
                        var i = r ? ": ".concat(r) : "."
                          , o = "doesNotReject" === t.name ? "rejection" : "exception";
                        A({
                            actual: e,
                            expected: n,
                            operator: t.name,
                            message: "Got unwanted ".concat(o).concat(i, "\n") + 'Actual message: "'.concat(e && e.message, '"'),
                            stackStartFn: t
                        })
                    }
                    throw e
                }
            }
            function R() {
                for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
                    e[n] = arguments[n];
                I.apply(void 0, [R, e.length].concat(e))
            }
            k.throws = function t(e) {
                for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++)
                    r[i - 1] = arguments[i];
                T.apply(void 0, [t, j(e)].concat(r))
            }
            ,
            k.rejects = function t(e) {
                for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++)
                    r[i - 1] = arguments[i];
                return P(e).then((function(e) {
                    return T.apply(void 0, [t, e].concat(r))
                }
                ))
            }
            ,
            k.doesNotThrow = function t(e) {
                for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++)
                    r[i - 1] = arguments[i];
                L.apply(void 0, [t, j(e)].concat(r))
            }
            ,
            k.doesNotReject = function t(e) {
                for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++)
                    r[i - 1] = arguments[i];
                return P(e).then((function(e) {
                    return L.apply(void 0, [t, e].concat(r))
                }
                ))
            }
            ,
            k.ifError = function t(e) {
                if (null != e) {
                    var n = "ifError got unwanted exception: ";
                    "object" === o(e) && "string" == typeof e.message ? 0 === e.message.length && e.constructor ? n += e.constructor.name : n += e.message : n += y(e);
                    var r = new p({
                        actual: e,
                        expected: null,
                        operator: "ifError",
                        message: n,
                        stackStartFn: t
                    })
                      , i = e.stack;
                    if ("string" == typeof i) {
                        var s = i.split("\n");
                        s.shift();
                        for (var a = r.stack.split("\n"), u = 0; u < s.length; u++) {
                            var c = a.indexOf(s[u]);
                            if (-1 !== c) {
                                a = a.slice(0, c);
                                break
                            }
                        }
                        r.stack = "".concat(a.join("\n"), "\n").concat(s.join("\n"))
                    }
                    throw r
                }
            }
            ,
            k.strict = w(R, k, {
                equal: k.strictEqual,
                deepEqual: k.deepStrictEqual,
                notEqual: k.notStrictEqual,
                notDeepEqual: k.notDeepStrictEqual
            }),
            k.strict.strict = k.strict
        }
        ,
        "../../../node_modules/assert/build/internal/assert/assertion_error.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/process/browser.js");
            function i(t, e, n) {
                return e in t ? Object.defineProperty(t, e, {
                    value: n,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : t[e] = n,
                t
            }
            function o(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var r = e[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(t, r.key, r)
                }
            }
            function s(t, e) {
                return !e || "object" !== h(e) && "function" != typeof e ? a(t) : e
            }
            function a(t) {
                if (void 0 === t)
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return t
            }
            function u(t) {
                var e = "function" == typeof Map ? new Map : void 0;
                return u = function(t) {
                    if (null === t || (n = t,
                    -1 === Function.toString.call(n).indexOf("[native code]")))
                        return t;
                    var n;
                    if ("function" != typeof t)
                        throw new TypeError("Super expression must either be null or a function");
                    if (void 0 !== e) {
                        if (e.has(t))
                            return e.get(t);
                        e.set(t, r)
                    }
                    function r() {
                        return c(t, arguments, f(this).constructor)
                    }
                    return r.prototype = Object.create(t.prototype, {
                        constructor: {
                            value: r,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }),
                    l(r, t)
                }
                ,
                u(t)
            }
            function c(t, e, n) {
                return c = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct)
                        return !1;
                    if (Reflect.construct.sham)
                        return !1;
                    if ("function" == typeof Proxy)
                        return !0;
                    try {
                        return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}
                        ))),
                        !0
                    } catch (t) {
                        return !1
                    }
                }() ? Reflect.construct : function(t, e, n) {
                    var r = [null];
                    r.push.apply(r, e);
                    var i = new (Function.bind.apply(t, r));
                    return n && l(i, n.prototype),
                    i
                }
                ,
                c.apply(null, arguments)
            }
            function l(t, e) {
                return l = Object.setPrototypeOf || function(t, e) {
                    return t.__proto__ = e,
                    t
                }
                ,
                l(t, e)
            }
            function f(t) {
                return f = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
                    return t.__proto__ || Object.getPrototypeOf(t)
                }
                ,
                f(t)
            }
            function h(t) {
                return h = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                h(t)
            }
            var d = n("../../../node_modules/util/util.js").inspect
              , p = n("../../../node_modules/assert/build/internal/errors.js").codes.ERR_INVALID_ARG_TYPE;
            function y(t, e, n) {
                return (void 0 === n || n > t.length) && (n = t.length),
                t.substring(n - e.length, n) === e
            }
            var g = ""
              , m = ""
              , b = ""
              , w = ""
              , v = {
                deepStrictEqual: "Expected values to be strictly deep-equal:",
                strictEqual: "Expected values to be strictly equal:",
                strictEqualObject: 'Expected "actual" to be reference-equal to "expected":',
                deepEqual: "Expected values to be loosely deep-equal:",
                equal: "Expected values to be loosely equal:",
                notDeepStrictEqual: 'Expected "actual" not to be strictly deep-equal to:',
                notStrictEqual: 'Expected "actual" to be strictly unequal to:',
                notStrictEqualObject: 'Expected "actual" not to be reference-equal to "expected":',
                notDeepEqual: 'Expected "actual" not to be loosely deep-equal to:',
                notEqual: 'Expected "actual" to be loosely unequal to:',
                notIdentical: "Values identical but not reference-equal:"
            };
            function x(t) {
                var e = Object.keys(t)
                  , n = Object.create(Object.getPrototypeOf(t));
                return e.forEach((function(e) {
                    n[e] = t[e]
                }
                )),
                Object.defineProperty(n, "message", {
                    value: t.message
                }),
                n
            }
            function S(t) {
                return d(t, {
                    compact: !1,
                    customInspect: !1,
                    depth: 1e3,
                    maxArrayLength: 1 / 0,
                    showHidden: !1,
                    breakLength: 1 / 0,
                    showProxy: !1,
                    sorted: !0,
                    getters: !0
                })
            }
            var k = function(t) {
                function e(t) {
                    var n;
                    if (function(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError("Cannot call a class as a function")
                    }(this, e),
                    "object" !== h(t) || null === t)
                        throw new p("options","Object",t);
                    var i = t.message
                      , o = t.operator
                      , u = t.stackStartFn
                      , c = t.actual
                      , l = t.expected
                      , d = Error.stackTraceLimit;
                    if (Error.stackTraceLimit = 0,
                    null != i)
                        n = s(this, f(e).call(this, String(i)));
                    else if (r.stderr && r.stderr.isTTY && (r.stderr && r.stderr.getColorDepth && 1 !== r.stderr.getColorDepth() ? (g = "[34m",
                    m = "[32m",
                    w = "[39m",
                    b = "[31m") : (g = "",
                    m = "",
                    w = "",
                    b = "")),
                    "object" === h(c) && null !== c && "object" === h(l) && null !== l && "stack"in c && c instanceof Error && "stack"in l && l instanceof Error && (c = x(c),
                    l = x(l)),
                    "deepStrictEqual" === o || "strictEqual" === o)
                        n = s(this, f(e).call(this, function(t, e, n) {
                            var i = ""
                              , o = ""
                              , s = 0
                              , a = ""
                              , u = !1
                              , c = S(t)
                              , l = c.split("\n")
                              , f = S(e).split("\n")
                              , d = 0
                              , p = "";
                            if ("strictEqual" === n && "object" === h(t) && "object" === h(e) && null !== t && null !== e && (n = "strictEqualObject"),
                            1 === l.length && 1 === f.length && l[0] !== f[0]) {
                                var x = l[0].length + f[0].length;
                                if (x <= 10) {
                                    if (!("object" === h(t) && null !== t || "object" === h(e) && null !== e || 0 === t && 0 === e))
                                        return "".concat(v[n], "\n\n") + "".concat(l[0], " !== ").concat(f[0], "\n")
                                } else if ("strictEqualObject" !== n && x < (r.stderr && r.stderr.isTTY ? r.stderr.columns : 80)) {
                                    for (; l[0][d] === f[0][d]; )
                                        d++;
                                    d > 2 && (p = "\n  ".concat(function(t, e) {
                                        if (e = Math.floor(e),
                                        0 == t.length || 0 == e)
                                            return "";
                                        var n = t.length * e;
                                        for (e = Math.floor(Math.log(e) / Math.log(2)); e; )
                                            t += t,
                                            e--;
                                        return t + t.substring(0, n - t.length)
                                    }(" ", d), "^"),
                                    d = 0)
                                }
                            }
                            for (var k = l[l.length - 1], E = f[f.length - 1]; k === E && (d++ < 2 ? a = "\n  ".concat(k).concat(a) : i = k,
                            l.pop(),
                            f.pop(),
                            0 !== l.length && 0 !== f.length); )
                                k = l[l.length - 1],
                                E = f[f.length - 1];
                            var A = Math.max(l.length, f.length);
                            if (0 === A) {
                                var I = c.split("\n");
                                if (I.length > 30)
                                    for (I[26] = "".concat(g, "...").concat(w); I.length > 27; )
                                        I.pop();
                                return "".concat(v.notIdentical, "\n\n").concat(I.join("\n"), "\n")
                            }
                            d > 3 && (a = "\n".concat(g, "...").concat(w).concat(a),
                            u = !0),
                            "" !== i && (a = "\n  ".concat(i).concat(a),
                            i = "");
                            var M = 0
                              , _ = v[n] + "\n".concat(m, "+ actual").concat(w, " ").concat(b, "- expected").concat(w)
                              , B = " ".concat(g, "...").concat(w, " Lines skipped");
                            for (d = 0; d < A; d++) {
                                var j = d - s;
                                if (l.length < d + 1)
                                    j > 1 && d > 2 && (j > 4 ? (o += "\n".concat(g, "...").concat(w),
                                    u = !0) : j > 3 && (o += "\n  ".concat(f[d - 2]),
                                    M++),
                                    o += "\n  ".concat(f[d - 1]),
                                    M++),
                                    s = d,
                                    i += "\n".concat(b, "-").concat(w, " ").concat(f[d]),
                                    M++;
                                else if (f.length < d + 1)
                                    j > 1 && d > 2 && (j > 4 ? (o += "\n".concat(g, "...").concat(w),
                                    u = !0) : j > 3 && (o += "\n  ".concat(l[d - 2]),
                                    M++),
                                    o += "\n  ".concat(l[d - 1]),
                                    M++),
                                    s = d,
                                    o += "\n".concat(m, "+").concat(w, " ").concat(l[d]),
                                    M++;
                                else {
                                    var O = f[d]
                                      , P = l[d]
                                      , T = P !== O && (!y(P, ",") || P.slice(0, -1) !== O);
                                    T && y(O, ",") && O.slice(0, -1) === P && (T = !1,
                                    P += ","),
                                    T ? (j > 1 && d > 2 && (j > 4 ? (o += "\n".concat(g, "...").concat(w),
                                    u = !0) : j > 3 && (o += "\n  ".concat(l[d - 2]),
                                    M++),
                                    o += "\n  ".concat(l[d - 1]),
                                    M++),
                                    s = d,
                                    o += "\n".concat(m, "+").concat(w, " ").concat(P),
                                    i += "\n".concat(b, "-").concat(w, " ").concat(O),
                                    M += 2) : (o += i,
                                    i = "",
                                    1 !== j && 0 !== d || (o += "\n  ".concat(P),
                                    M++))
                                }
                                if (M > 20 && d < A - 2)
                                    return "".concat(_).concat(B, "\n").concat(o, "\n").concat(g, "...").concat(w).concat(i, "\n") + "".concat(g, "...").concat(w)
                            }
                            return "".concat(_).concat(u ? B : "", "\n").concat(o).concat(i).concat(a).concat(p)
                        }(c, l, o)));
                    else if ("notDeepStrictEqual" === o || "notStrictEqual" === o) {
                        var k = v[o]
                          , E = S(c).split("\n");
                        if ("notStrictEqual" === o && "object" === h(c) && null !== c && (k = v.notStrictEqualObject),
                        E.length > 30)
                            for (E[26] = "".concat(g, "...").concat(w); E.length > 27; )
                                E.pop();
                        n = 1 === E.length ? s(this, f(e).call(this, "".concat(k, " ").concat(E[0]))) : s(this, f(e).call(this, "".concat(k, "\n\n").concat(E.join("\n"), "\n")))
                    } else {
                        var A = S(c)
                          , I = ""
                          , M = v[o];
                        "notDeepEqual" === o || "notEqual" === o ? (A = "".concat(v[o], "\n\n").concat(A)).length > 1024 && (A = "".concat(A.slice(0, 1021), "...")) : (I = "".concat(S(l)),
                        A.length > 512 && (A = "".concat(A.slice(0, 509), "...")),
                        I.length > 512 && (I = "".concat(I.slice(0, 509), "...")),
                        "deepEqual" === o || "equal" === o ? A = "".concat(M, "\n\n").concat(A, "\n\nshould equal\n\n") : I = " ".concat(o, " ").concat(I)),
                        n = s(this, f(e).call(this, "".concat(A).concat(I)))
                    }
                    return Error.stackTraceLimit = d,
                    n.generatedMessage = !i,
                    Object.defineProperty(a(n), "name", {
                        value: "AssertionError [ERR_ASSERTION]",
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }),
                    n.code = "ERR_ASSERTION",
                    n.actual = c,
                    n.expected = l,
                    n.operator = o,
                    Error.captureStackTrace && Error.captureStackTrace(a(n), u),
                    n.stack,
                    n.name = "AssertionError",
                    s(n)
                }
                var n, u;
                return function(t, e) {
                    if ("function" != typeof e && null !== e)
                        throw new TypeError("Super expression must either be null or a function");
                    t.prototype = Object.create(e && e.prototype, {
                        constructor: {
                            value: t,
                            writable: !0,
                            configurable: !0
                        }
                    }),
                    e && l(t, e)
                }(e, t),
                n = e,
                u = [{
                    key: "toString",
                    value: function() {
                        return "".concat(this.name, " [").concat(this.code, "]: ").concat(this.message)
                    }
                }, {
                    key: d.custom,
                    value: function(t, e) {
                        return d(this, function(t) {
                            for (var e = 1; e < arguments.length; e++) {
                                var n = null != arguments[e] ? arguments[e] : {}
                                  , r = Object.keys(n);
                                "function" == typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(n).filter((function(t) {
                                    return Object.getOwnPropertyDescriptor(n, t).enumerable
                                }
                                )))),
                                r.forEach((function(e) {
                                    i(t, e, n[e])
                                }
                                ))
                            }
                            return t
                        }({}, e, {
                            customInspect: !1,
                            depth: 0
                        }))
                    }
                }],
                u && o(n.prototype, u),
                e
            }(u(Error));
            t.exports = k
        }
        ,
        "../../../node_modules/assert/build/internal/errors.js": (t, e, n) => {
            "use strict";
            function r(t) {
                return r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                r(t)
            }
            function i(t) {
                return i = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
                    return t.__proto__ || Object.getPrototypeOf(t)
                }
                ,
                i(t)
            }
            function o(t, e) {
                return o = Object.setPrototypeOf || function(t, e) {
                    return t.__proto__ = e,
                    t
                }
                ,
                o(t, e)
            }
            var s, a, u = {};
            function c(t, e, n) {
                n || (n = Error);
                var s = function(n) {
                    function s(n, o, a) {
                        var u, c, l;
                        return function(t, e) {
                            if (!(t instanceof e))
                                throw new TypeError("Cannot call a class as a function")
                        }(this, s),
                        c = this,
                        l = i(s).call(this, function(t, n, r) {
                            return "string" == typeof e ? e : e(t, n, r)
                        }(n, o, a)),
                        u = !l || "object" !== r(l) && "function" != typeof l ? function(t) {
                            if (void 0 === t)
                                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return t
                        }(c) : l,
                        u.code = t,
                        u
                    }
                    return function(t, e) {
                        if ("function" != typeof e && null !== e)
                            throw new TypeError("Super expression must either be null or a function");
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                writable: !0,
                                configurable: !0
                            }
                        }),
                        e && o(t, e)
                    }(s, n),
                    s
                }(n);
                u[t] = s
            }
            function l(t, e) {
                if (Array.isArray(t)) {
                    var n = t.length;
                    return t = t.map((function(t) {
                        return String(t)
                    }
                    )),
                    n > 2 ? "one of ".concat(e, " ").concat(t.slice(0, n - 1).join(", "), ", or ") + t[n - 1] : 2 === n ? "one of ".concat(e, " ").concat(t[0], " or ").concat(t[1]) : "of ".concat(e, " ").concat(t[0])
                }
                return "of ".concat(e, " ").concat(String(t))
            }
            c("ERR_AMBIGUOUS_ARGUMENT", 'The "%s" argument is ambiguous. %s', TypeError),
            c("ERR_INVALID_ARG_TYPE", (function(t, e, i) {
                var o, a, u, c, f;
                if (void 0 === s && (s = n("../../../node_modules/assert/build/assert.js")),
                s("string" == typeof t, "'name' must be a string"),
                "string" == typeof e && (a = "not ",
                e.substr(0, 4) === a) ? (o = "must not be",
                e = e.replace(/^not /, "")) : o = "must be",
                function(t, e, n) {
                    return (void 0 === n || n > t.length) && (n = t.length),
                    t.substring(n - 9, n) === e
                }(t, " argument"))
                    u = "The ".concat(t, " ").concat(o, " ").concat(l(e, "type"));
                else {
                    var h = ("number" != typeof f && (f = 0),
                    f + 1 > (c = t).length || -1 === c.indexOf(".", f) ? "argument" : "property");
                    u = 'The "'.concat(t, '" ').concat(h, " ").concat(o, " ").concat(l(e, "type"))
                }
                return u + ". Received type ".concat(r(i))
            }
            ), TypeError),
            c("ERR_INVALID_ARG_VALUE", (function(t, e) {
                var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "is invalid";
                void 0 === a && (a = n("../../../node_modules/util/util.js"));
                var i = a.inspect(e);
                return i.length > 128 && (i = "".concat(i.slice(0, 128), "...")),
                "The argument '".concat(t, "' ").concat(r, ". Received ").concat(i)
            }
            ), TypeError, RangeError),
            c("ERR_INVALID_RETURN_VALUE", (function(t, e, n) {
                var i;
                return i = n && n.constructor && n.constructor.name ? "instance of ".concat(n.constructor.name) : "type ".concat(r(n)),
                "Expected ".concat(t, ' to be returned from the "').concat(e, '"') + " function but got ".concat(i, ".")
            }
            ), TypeError),
            c("ERR_MISSING_ARGS", (function() {
                for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++)
                    e[r] = arguments[r];
                void 0 === s && (s = n("../../../node_modules/assert/build/assert.js")),
                s(e.length > 0, "At least one arg needs to be specified");
                var i = "The "
                  , o = e.length;
                switch (e = e.map((function(t) {
                    return '"'.concat(t, '"')
                }
                )),
                o) {
                case 1:
                    i += "".concat(e[0], " argument");
                    break;
                case 2:
                    i += "".concat(e[0], " and ").concat(e[1], " arguments");
                    break;
                default:
                    i += e.slice(0, o - 1).join(", "),
                    i += ", and ".concat(e[o - 1], " arguments")
                }
                return "".concat(i, " must be specified")
            }
            ), TypeError),
            t.exports.codes = u
        }
        ,
        "../../../node_modules/assert/build/internal/util/comparisons.js": (t, e, n) => {
            "use strict";
            function r(t, e) {
                return function(t) {
                    if (Array.isArray(t))
                        return t
                }(t) || function(t, e) {
                    var n = []
                      , r = !0
                      , i = !1
                      , o = void 0;
                    try {
                        for (var s, a = t[Symbol.iterator](); !(r = (s = a.next()).done) && (n.push(s.value),
                        !e || n.length !== e); r = !0)
                            ;
                    } catch (t) {
                        i = !0,
                        o = t
                    } finally {
                        try {
                            r || null == a.return || a.return()
                        } finally {
                            if (i)
                                throw o
                        }
                    }
                    return n
                }(t, e) || function() {
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }()
            }
            function i(t) {
                return i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                i(t)
            }
            var o = void 0 !== /a/g.flags
              , s = function(t) {
                var e = [];
                return t.forEach((function(t) {
                    return e.push(t)
                }
                )),
                e
            }
              , a = function(t) {
                var e = [];
                return t.forEach((function(t, n) {
                    return e.push([n, t])
                }
                )),
                e
            }
              , u = Object.is ? Object.is : n("../../../node_modules/object-is/index.js")
              , c = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols : function() {
                return []
            }
              , l = Number.isNaN ? Number.isNaN : n("../../../node_modules/is-nan/index.js");
            function f(t) {
                return t.call.bind(t)
            }
            var h = f(Object.prototype.hasOwnProperty)
              , d = f(Object.prototype.propertyIsEnumerable)
              , p = f(Object.prototype.toString)
              , y = n("../../../node_modules/util/util.js").types
              , g = y.isAnyArrayBuffer
              , m = y.isArrayBufferView
              , b = y.isDate
              , w = y.isMap
              , v = y.isRegExp
              , x = y.isSet
              , S = y.isNativeError
              , k = y.isBoxedPrimitive
              , E = y.isNumberObject
              , A = y.isStringObject
              , I = y.isBooleanObject
              , M = y.isBigIntObject
              , _ = y.isSymbolObject
              , B = y.isFloat32Array
              , j = y.isFloat64Array;
            function O(t) {
                if (0 === t.length || t.length > 10)
                    return !0;
                for (var e = 0; e < t.length; e++) {
                    var n = t.charCodeAt(e);
                    if (n < 48 || n > 57)
                        return !0
                }
                return 10 === t.length && t >= Math.pow(2, 32)
            }
            function P(t) {
                return Object.keys(t).filter(O).concat(c(t).filter(Object.prototype.propertyIsEnumerable.bind(t)))
            }
            function T(t, e) {
                if (t === e)
                    return 0;
                for (var n = t.length, r = e.length, i = 0, o = Math.min(n, r); i < o; ++i)
                    if (t[i] !== e[i]) {
                        n = t[i],
                        r = e[i];
                        break
                    }
                return n < r ? -1 : r < n ? 1 : 0
            }
            var L = 0
              , R = 1
              , U = 2
              , N = 3;
            function z(t, e, n, r) {
                if (t === e)
                    return 0 !== t || !n || u(t, e);
                if (n) {
                    if ("object" !== i(t))
                        return "number" == typeof t && l(t) && l(e);
                    if ("object" !== i(e) || null === t || null === e)
                        return !1;
                    if (Object.getPrototypeOf(t) !== Object.getPrototypeOf(e))
                        return !1
                } else {
                    if (null === t || "object" !== i(t))
                        return (null === e || "object" !== i(e)) && t == e;
                    if (null === e || "object" !== i(e))
                        return !1
                }
                var s, a, c, f, h = p(t);
                if (h !== p(e))
                    return !1;
                if (Array.isArray(t)) {
                    if (t.length !== e.length)
                        return !1;
                    var d = P(t)
                      , y = P(e);
                    return d.length === y.length && W(t, e, n, r, R, d)
                }
                if ("[object Object]" === h && (!w(t) && w(e) || !x(t) && x(e)))
                    return !1;
                if (b(t)) {
                    if (!b(e) || Date.prototype.getTime.call(t) !== Date.prototype.getTime.call(e))
                        return !1
                } else if (v(t)) {
                    if (!v(e) || (c = t,
                    f = e,
                    !(o ? c.source === f.source && c.flags === f.flags : RegExp.prototype.toString.call(c) === RegExp.prototype.toString.call(f))))
                        return !1
                } else if (S(t) || t instanceof Error) {
                    if (t.message !== e.message || t.name !== e.name)
                        return !1
                } else {
                    if (m(t)) {
                        if (n || !B(t) && !j(t)) {
                            if (!function(t, e) {
                                return t.byteLength === e.byteLength && 0 === T(new Uint8Array(t.buffer,t.byteOffset,t.byteLength), new Uint8Array(e.buffer,e.byteOffset,e.byteLength))
                            }(t, e))
                                return !1
                        } else if (!function(t, e) {
                            if (t.byteLength !== e.byteLength)
                                return !1;
                            for (var n = 0; n < t.byteLength; n++)
                                if (t[n] !== e[n])
                                    return !1;
                            return !0
                        }(t, e))
                            return !1;
                        var O = P(t)
                          , z = P(e);
                        return O.length === z.length && W(t, e, n, r, L, O)
                    }
                    if (x(t))
                        return !(!x(e) || t.size !== e.size) && W(t, e, n, r, U);
                    if (w(t))
                        return !(!w(e) || t.size !== e.size) && W(t, e, n, r, N);
                    if (g(t)) {
                        if (a = e,
                        (s = t).byteLength !== a.byteLength || 0 !== T(new Uint8Array(s), new Uint8Array(a)))
                            return !1
                    } else if (k(t) && !function(t, e) {
                        return E(t) ? E(e) && u(Number.prototype.valueOf.call(t), Number.prototype.valueOf.call(e)) : A(t) ? A(e) && String.prototype.valueOf.call(t) === String.prototype.valueOf.call(e) : I(t) ? I(e) && Boolean.prototype.valueOf.call(t) === Boolean.prototype.valueOf.call(e) : M(t) ? M(e) && BigInt.prototype.valueOf.call(t) === BigInt.prototype.valueOf.call(e) : _(e) && Symbol.prototype.valueOf.call(t) === Symbol.prototype.valueOf.call(e)
                    }(t, e))
                        return !1
                }
                return W(t, e, n, r, L)
            }
            function q(t, e) {
                return e.filter((function(e) {
                    return d(t, e)
                }
                ))
            }
            function W(t, e, n, o, u, l) {
                if (5 === arguments.length) {
                    l = Object.keys(t);
                    var f = Object.keys(e);
                    if (l.length !== f.length)
                        return !1
                }
                for (var p = 0; p < l.length; p++)
                    if (!h(e, l[p]))
                        return !1;
                if (n && 5 === arguments.length) {
                    var y = c(t);
                    if (0 !== y.length) {
                        var g = 0;
                        for (p = 0; p < y.length; p++) {
                            var m = y[p];
                            if (d(t, m)) {
                                if (!d(e, m))
                                    return !1;
                                l.push(m),
                                g++
                            } else if (d(e, m))
                                return !1
                        }
                        var b = c(e);
                        if (y.length !== b.length && q(e, b).length !== g)
                            return !1
                    } else {
                        var w = c(e);
                        if (0 !== w.length && 0 !== q(e, w).length)
                            return !1
                    }
                }
                if (0 === l.length && (u === L || u === R && 0 === t.length || 0 === t.size))
                    return !0;
                if (void 0 === o)
                    o = {
                        val1: new Map,
                        val2: new Map,
                        position: 0
                    };
                else {
                    var v = o.val1.get(t);
                    if (void 0 !== v) {
                        var x = o.val2.get(e);
                        if (void 0 !== x)
                            return v === x
                    }
                    o.position++
                }
                o.val1.set(t, o.position),
                o.val2.set(e, o.position);
                var S = function(t, e, n, o, u, c) {
                    var l = 0;
                    if (c === U) {
                        if (!function(t, e, n, r) {
                            for (var o = null, a = s(t), u = 0; u < a.length; u++) {
                                var c = a[u];
                                if ("object" === i(c) && null !== c)
                                    null === o && (o = new Set),
                                    o.add(c);
                                else if (!e.has(c)) {
                                    if (n)
                                        return !1;
                                    if (!K(t, e, c))
                                        return !1;
                                    null === o && (o = new Set),
                                    o.add(c)
                                }
                            }
                            if (null !== o) {
                                for (var l = s(e), f = 0; f < l.length; f++) {
                                    var h = l[f];
                                    if ("object" === i(h) && null !== h) {
                                        if (!C(o, h, n, r))
                                            return !1
                                    } else if (!n && !t.has(h) && !C(o, h, n, r))
                                        return !1
                                }
                                return 0 === o.size
                            }
                            return !0
                        }(t, e, n, u))
                            return !1
                    } else if (c === N) {
                        if (!function(t, e, n, o) {
                            for (var s = null, u = a(t), c = 0; c < u.length; c++) {
                                var l = r(u[c], 2)
                                  , f = l[0]
                                  , h = l[1];
                                if ("object" === i(f) && null !== f)
                                    null === s && (s = new Set),
                                    s.add(f);
                                else {
                                    var d = e.get(f);
                                    if (void 0 === d && !e.has(f) || !z(h, d, n, o)) {
                                        if (n)
                                            return !1;
                                        if (!D(t, e, f, h, o))
                                            return !1;
                                        null === s && (s = new Set),
                                        s.add(f)
                                    }
                                }
                            }
                            if (null !== s) {
                                for (var p = a(e), y = 0; y < p.length; y++) {
                                    var g = r(p[y], 2)
                                      , m = (f = g[0],
                                    g[1]);
                                    if ("object" === i(f) && null !== f) {
                                        if (!$(s, t, f, m, n, o))
                                            return !1
                                    } else if (!(n || t.has(f) && z(t.get(f), m, !1, o) || $(s, t, f, m, !1, o)))
                                        return !1
                                }
                                return 0 === s.size
                            }
                            return !0
                        }(t, e, n, u))
                            return !1
                    } else if (c === R)
                        for (; l < t.length; l++) {
                            if (!h(t, l)) {
                                if (h(e, l))
                                    return !1;
                                for (var f = Object.keys(t); l < f.length; l++) {
                                    var d = f[l];
                                    if (!h(e, d) || !z(t[d], e[d], n, u))
                                        return !1
                                }
                                return f.length === Object.keys(e).length
                            }
                            if (!h(e, l) || !z(t[l], e[l], n, u))
                                return !1
                        }
                    for (l = 0; l < o.length; l++) {
                        var p = o[l];
                        if (!z(t[p], e[p], n, u))
                            return !1
                    }
                    return !0
                }(t, e, n, l, o, u);
                return o.val1.delete(t),
                o.val2.delete(e),
                S
            }
            function C(t, e, n, r) {
                for (var i = s(t), o = 0; o < i.length; o++) {
                    var a = i[o];
                    if (z(e, a, n, r))
                        return t.delete(a),
                        !0
                }
                return !1
            }
            function F(t) {
                switch (i(t)) {
                case "undefined":
                    return null;
                case "object":
                    return;
                case "symbol":
                    return !1;
                case "string":
                    t = +t;
                case "number":
                    if (l(t))
                        return !1
                }
                return !0
            }
            function K(t, e, n) {
                var r = F(n);
                return null != r ? r : e.has(r) && !t.has(r)
            }
            function D(t, e, n, r, i) {
                var o = F(n);
                if (null != o)
                    return o;
                var s = e.get(o);
                return !(void 0 === s && !e.has(o) || !z(r, s, !1, i)) && !t.has(o) && z(r, s, !1, i)
            }
            function $(t, e, n, r, i, o) {
                for (var a = s(t), u = 0; u < a.length; u++) {
                    var c = a[u];
                    if (z(n, c, i, o) && z(r, e.get(c), i, o))
                        return t.delete(c),
                        !0
                }
                return !1
            }
            t.exports = {
                isDeepEqual: function(t, e) {
                    return z(t, e, !1)
                },
                isDeepStrictEqual: function(t, e) {
                    return z(t, e, !0)
                }
            }
        }
        ,
        "../../../node_modules/base64-js/index.js": (t, e) => {
            "use strict";
            e.byteLength = function(t) {
                var e = a(t)
                  , n = e[0]
                  , r = e[1];
                return 3 * (n + r) / 4 - r
            }
            ,
            e.toByteArray = function(t) {
                var e, n, o = a(t), s = o[0], u = o[1], c = new i(function(t, e, n) {
                    return 3 * (e + n) / 4 - n
                }(0, s, u)), l = 0, f = u > 0 ? s - 4 : s;
                for (n = 0; n < f; n += 4)
                    e = r[t.charCodeAt(n)] << 18 | r[t.charCodeAt(n + 1)] << 12 | r[t.charCodeAt(n + 2)] << 6 | r[t.charCodeAt(n + 3)],
                    c[l++] = e >> 16 & 255,
                    c[l++] = e >> 8 & 255,
                    c[l++] = 255 & e;
                return 2 === u && (e = r[t.charCodeAt(n)] << 2 | r[t.charCodeAt(n + 1)] >> 4,
                c[l++] = 255 & e),
                1 === u && (e = r[t.charCodeAt(n)] << 10 | r[t.charCodeAt(n + 1)] << 4 | r[t.charCodeAt(n + 2)] >> 2,
                c[l++] = e >> 8 & 255,
                c[l++] = 255 & e),
                c
            }
            ,
            e.fromByteArray = function(t) {
                for (var e, r = t.length, i = r % 3, o = [], s = 16383, a = 0, c = r - i; a < c; a += s)
                    o.push(u(t, a, a + s > c ? c : a + s));
                return 1 === i ? (e = t[r - 1],
                o.push(n[e >> 2] + n[e << 4 & 63] + "==")) : 2 === i && (e = (t[r - 2] << 8) + t[r - 1],
                o.push(n[e >> 10] + n[e >> 4 & 63] + n[e << 2 & 63] + "=")),
                o.join("")
            }
            ;
            for (var n = [], r = [], i = "undefined" != typeof Uint8Array ? Uint8Array : Array, o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = 0; s < 64; ++s)
                n[s] = o[s],
                r[o.charCodeAt(s)] = s;
            function a(t) {
                var e = t.length;
                if (e % 4 > 0)
                    throw new Error("Invalid string. Length must be a multiple of 4");
                var n = t.indexOf("=");
                return -1 === n && (n = e),
                [n, n === e ? 0 : 4 - n % 4]
            }
            function u(t, e, r) {
                for (var i, o, s = [], a = e; a < r; a += 3)
                    i = (t[a] << 16 & 16711680) + (t[a + 1] << 8 & 65280) + (255 & t[a + 2]),
                    s.push(n[(o = i) >> 18 & 63] + n[o >> 12 & 63] + n[o >> 6 & 63] + n[63 & o]);
                return s.join("")
            }
            r["-".charCodeAt(0)] = 62,
            r["_".charCodeAt(0)] = 63
        }
        ,
        "../../../node_modules/bigint-buffer/dist/browser.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/buffer/index.js").Buffer;
            e.oU = function(t) {
                {
                    const e = r.from(t);
                    e.reverse();
                    const n = e.toString("hex");
                    return 0 === n.length ? BigInt(0) : BigInt(`0x${n}`)
                }
            }
            ,
            e.k$ = function(t, e) {
                {
                    const n = t.toString(16)
                      , i = r.from(n.padStart(2 * e, "0").slice(0, 2 * e), "hex");
                    return i.reverse(),
                    i
                }
            }
        }
        ,
        "../../../node_modules/bn.js/lib/bn.js": function(t, e, n) {
            !function(t, e) {
                "use strict";
                function r(t, e) {
                    if (!t)
                        throw new Error(e || "Assertion failed")
                }
                function i(t, e) {
                    t.super_ = e;
                    var n = function() {};
                    n.prototype = e.prototype,
                    t.prototype = new n,
                    t.prototype.constructor = t
                }
                function o(t, e, n) {
                    if (o.isBN(t))
                        return t;
                    this.negative = 0,
                    this.words = null,
                    this.length = 0,
                    this.red = null,
                    null !== t && ("le" !== e && "be" !== e || (n = e,
                    e = 10),
                    this._init(t || 0, e || 10, n || "be"))
                }
                var s;
                "object" == typeof t ? t.exports = o : e.BN = o,
                o.BN = o,
                o.wordSize = 26;
                try {
                    s = "undefined" != typeof window && void 0 !== window.Buffer ? window.Buffer : n("?6876").Buffer
                } catch (t) {}
                function a(t, e) {
                    var n = t.charCodeAt(e);
                    return n >= 48 && n <= 57 ? n - 48 : n >= 65 && n <= 70 ? n - 55 : n >= 97 && n <= 102 ? n - 87 : void r(!1, "Invalid character in " + t)
                }
                function u(t, e, n) {
                    var r = a(t, n);
                    return n - 1 >= e && (r |= a(t, n - 1) << 4),
                    r
                }
                function c(t, e, n, i) {
                    for (var o = 0, s = 0, a = Math.min(t.length, n), u = e; u < a; u++) {
                        var c = t.charCodeAt(u) - 48;
                        o *= i,
                        s = c >= 49 ? c - 49 + 10 : c >= 17 ? c - 17 + 10 : c,
                        r(c >= 0 && s < i, "Invalid character"),
                        o += s
                    }
                    return o
                }
                function l(t, e) {
                    t.words = e.words,
                    t.length = e.length,
                    t.negative = e.negative,
                    t.red = e.red
                }
                if (o.isBN = function(t) {
                    return t instanceof o || null !== t && "object" == typeof t && t.constructor.wordSize === o.wordSize && Array.isArray(t.words)
                }
                ,
                o.max = function(t, e) {
                    return t.cmp(e) > 0 ? t : e
                }
                ,
                o.min = function(t, e) {
                    return t.cmp(e) < 0 ? t : e
                }
                ,
                o.prototype._init = function(t, e, n) {
                    if ("number" == typeof t)
                        return this._initNumber(t, e, n);
                    if ("object" == typeof t)
                        return this._initArray(t, e, n);
                    "hex" === e && (e = 16),
                    r(e === (0 | e) && e >= 2 && e <= 36);
                    var i = 0;
                    "-" === (t = t.toString().replace(/\s+/g, ""))[0] && (i++,
                    this.negative = 1),
                    i < t.length && (16 === e ? this._parseHex(t, i, n) : (this._parseBase(t, e, i),
                    "le" === n && this._initArray(this.toArray(), e, n)))
                }
                ,
                o.prototype._initNumber = function(t, e, n) {
                    t < 0 && (this.negative = 1,
                    t = -t),
                    t < 67108864 ? (this.words = [67108863 & t],
                    this.length = 1) : t < 4503599627370496 ? (this.words = [67108863 & t, t / 67108864 & 67108863],
                    this.length = 2) : (r(t < 9007199254740992),
                    this.words = [67108863 & t, t / 67108864 & 67108863, 1],
                    this.length = 3),
                    "le" === n && this._initArray(this.toArray(), e, n)
                }
                ,
                o.prototype._initArray = function(t, e, n) {
                    if (r("number" == typeof t.length),
                    t.length <= 0)
                        return this.words = [0],
                        this.length = 1,
                        this;
                    this.length = Math.ceil(t.length / 3),
                    this.words = new Array(this.length);
                    for (var i = 0; i < this.length; i++)
                        this.words[i] = 0;
                    var o, s, a = 0;
                    if ("be" === n)
                        for (i = t.length - 1,
                        o = 0; i >= 0; i -= 3)
                            s = t[i] | t[i - 1] << 8 | t[i - 2] << 16,
                            this.words[o] |= s << a & 67108863,
                            this.words[o + 1] = s >>> 26 - a & 67108863,
                            (a += 24) >= 26 && (a -= 26,
                            o++);
                    else if ("le" === n)
                        for (i = 0,
                        o = 0; i < t.length; i += 3)
                            s = t[i] | t[i + 1] << 8 | t[i + 2] << 16,
                            this.words[o] |= s << a & 67108863,
                            this.words[o + 1] = s >>> 26 - a & 67108863,
                            (a += 24) >= 26 && (a -= 26,
                            o++);
                    return this._strip()
                }
                ,
                o.prototype._parseHex = function(t, e, n) {
                    this.length = Math.ceil((t.length - e) / 6),
                    this.words = new Array(this.length);
                    for (var r = 0; r < this.length; r++)
                        this.words[r] = 0;
                    var i, o = 0, s = 0;
                    if ("be" === n)
                        for (r = t.length - 1; r >= e; r -= 2)
                            i = u(t, e, r) << o,
                            this.words[s] |= 67108863 & i,
                            o >= 18 ? (o -= 18,
                            s += 1,
                            this.words[s] |= i >>> 26) : o += 8;
                    else
                        for (r = (t.length - e) % 2 == 0 ? e + 1 : e; r < t.length; r += 2)
                            i = u(t, e, r) << o,
                            this.words[s] |= 67108863 & i,
                            o >= 18 ? (o -= 18,
                            s += 1,
                            this.words[s] |= i >>> 26) : o += 8;
                    this._strip()
                }
                ,
                o.prototype._parseBase = function(t, e, n) {
                    this.words = [0],
                    this.length = 1;
                    for (var r = 0, i = 1; i <= 67108863; i *= e)
                        r++;
                    r--,
                    i = i / e | 0;
                    for (var o = t.length - n, s = o % r, a = Math.min(o, o - s) + n, u = 0, l = n; l < a; l += r)
                        u = c(t, l, l + r, e),
                        this.imuln(i),
                        this.words[0] + u < 67108864 ? this.words[0] += u : this._iaddn(u);
                    if (0 !== s) {
                        var f = 1;
                        for (u = c(t, l, t.length, e),
                        l = 0; l < s; l++)
                            f *= e;
                        this.imuln(f),
                        this.words[0] + u < 67108864 ? this.words[0] += u : this._iaddn(u)
                    }
                    this._strip()
                }
                ,
                o.prototype.copy = function(t) {
                    t.words = new Array(this.length);
                    for (var e = 0; e < this.length; e++)
                        t.words[e] = this.words[e];
                    t.length = this.length,
                    t.negative = this.negative,
                    t.red = this.red
                }
                ,
                o.prototype._move = function(t) {
                    l(t, this)
                }
                ,
                o.prototype.clone = function() {
                    var t = new o(null);
                    return this.copy(t),
                    t
                }
                ,
                o.prototype._expand = function(t) {
                    for (; this.length < t; )
                        this.words[this.length++] = 0;
                    return this
                }
                ,
                o.prototype._strip = function() {
                    for (; this.length > 1 && 0 === this.words[this.length - 1]; )
                        this.length--;
                    return this._normSign()
                }
                ,
                o.prototype._normSign = function() {
                    return 1 === this.length && 0 === this.words[0] && (this.negative = 0),
                    this
                }
                ,
                "undefined" != typeof Symbol && "function" == typeof Symbol.for)
                    try {
                        o.prototype[Symbol.for("nodejs.util.inspect.custom")] = f
                    } catch (t) {
                        o.prototype.inspect = f
                    }
                else
                    o.prototype.inspect = f;
                function f() {
                    return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">"
                }
                var h = ["", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000", "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000", "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000"]
                  , d = [0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
                  , p = [0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176];
                function y(t, e, n) {
                    n.negative = e.negative ^ t.negative;
                    var r = t.length + e.length | 0;
                    n.length = r,
                    r = r - 1 | 0;
                    var i = 0 | t.words[0]
                      , o = 0 | e.words[0]
                      , s = i * o
                      , a = 67108863 & s
                      , u = s / 67108864 | 0;
                    n.words[0] = a;
                    for (var c = 1; c < r; c++) {
                        for (var l = u >>> 26, f = 67108863 & u, h = Math.min(c, e.length - 1), d = Math.max(0, c - t.length + 1); d <= h; d++) {
                            var p = c - d | 0;
                            l += (s = (i = 0 | t.words[p]) * (o = 0 | e.words[d]) + f) / 67108864 | 0,
                            f = 67108863 & s
                        }
                        n.words[c] = 0 | f,
                        u = 0 | l
                    }
                    return 0 !== u ? n.words[c] = 0 | u : n.length--,
                    n._strip()
                }
                o.prototype.toString = function(t, e) {
                    var n;
                    if (e = 0 | e || 1,
                    16 === (t = t || 10) || "hex" === t) {
                        n = "";
                        for (var i = 0, o = 0, s = 0; s < this.length; s++) {
                            var a = this.words[s]
                              , u = (16777215 & (a << i | o)).toString(16);
                            o = a >>> 24 - i & 16777215,
                            (i += 2) >= 26 && (i -= 26,
                            s--),
                            n = 0 !== o || s !== this.length - 1 ? h[6 - u.length] + u + n : u + n
                        }
                        for (0 !== o && (n = o.toString(16) + n); n.length % e != 0; )
                            n = "0" + n;
                        return 0 !== this.negative && (n = "-" + n),
                        n
                    }
                    if (t === (0 | t) && t >= 2 && t <= 36) {
                        var c = d[t]
                          , l = p[t];
                        n = "";
                        var f = this.clone();
                        for (f.negative = 0; !f.isZero(); ) {
                            var y = f.modrn(l).toString(t);
                            n = (f = f.idivn(l)).isZero() ? y + n : h[c - y.length] + y + n
                        }
                        for (this.isZero() && (n = "0" + n); n.length % e != 0; )
                            n = "0" + n;
                        return 0 !== this.negative && (n = "-" + n),
                        n
                    }
                    r(!1, "Base should be between 2 and 36")
                }
                ,
                o.prototype.toNumber = function() {
                    var t = this.words[0];
                    return 2 === this.length ? t += 67108864 * this.words[1] : 3 === this.length && 1 === this.words[2] ? t += 4503599627370496 + 67108864 * this.words[1] : this.length > 2 && r(!1, "Number can only safely store up to 53 bits"),
                    0 !== this.negative ? -t : t
                }
                ,
                o.prototype.toJSON = function() {
                    return this.toString(16, 2)
                }
                ,
                s && (o.prototype.toBuffer = function(t, e) {
                    return this.toArrayLike(s, t, e)
                }
                ),
                o.prototype.toArray = function(t, e) {
                    return this.toArrayLike(Array, t, e)
                }
                ,
                o.prototype.toArrayLike = function(t, e, n) {
                    this._strip();
                    var i = this.byteLength()
                      , o = n || Math.max(1, i);
                    r(i <= o, "byte array longer than desired length"),
                    r(o > 0, "Requested array length <= 0");
                    var s = function(t, e) {
                        return t.allocUnsafe ? t.allocUnsafe(e) : new t(e)
                    }(t, o);
                    return this["_toArrayLike" + ("le" === e ? "LE" : "BE")](s, i),
                    s
                }
                ,
                o.prototype._toArrayLikeLE = function(t, e) {
                    for (var n = 0, r = 0, i = 0, o = 0; i < this.length; i++) {
                        var s = this.words[i] << o | r;
                        t[n++] = 255 & s,
                        n < t.length && (t[n++] = s >> 8 & 255),
                        n < t.length && (t[n++] = s >> 16 & 255),
                        6 === o ? (n < t.length && (t[n++] = s >> 24 & 255),
                        r = 0,
                        o = 0) : (r = s >>> 24,
                        o += 2)
                    }
                    if (n < t.length)
                        for (t[n++] = r; n < t.length; )
                            t[n++] = 0
                }
                ,
                o.prototype._toArrayLikeBE = function(t, e) {
                    for (var n = t.length - 1, r = 0, i = 0, o = 0; i < this.length; i++) {
                        var s = this.words[i] << o | r;
                        t[n--] = 255 & s,
                        n >= 0 && (t[n--] = s >> 8 & 255),
                        n >= 0 && (t[n--] = s >> 16 & 255),
                        6 === o ? (n >= 0 && (t[n--] = s >> 24 & 255),
                        r = 0,
                        o = 0) : (r = s >>> 24,
                        o += 2)
                    }
                    if (n >= 0)
                        for (t[n--] = r; n >= 0; )
                            t[n--] = 0
                }
                ,
                Math.clz32 ? o.prototype._countBits = function(t) {
                    return 32 - Math.clz32(t)
                }
                : o.prototype._countBits = function(t) {
                    var e = t
                      , n = 0;
                    return e >= 4096 && (n += 13,
                    e >>>= 13),
                    e >= 64 && (n += 7,
                    e >>>= 7),
                    e >= 8 && (n += 4,
                    e >>>= 4),
                    e >= 2 && (n += 2,
                    e >>>= 2),
                    n + e
                }
                ,
                o.prototype._zeroBits = function(t) {
                    if (0 === t)
                        return 26;
                    var e = t
                      , n = 0;
                    return 8191 & e || (n += 13,
                    e >>>= 13),
                    127 & e || (n += 7,
                    e >>>= 7),
                    15 & e || (n += 4,
                    e >>>= 4),
                    3 & e || (n += 2,
                    e >>>= 2),
                    1 & e || n++,
                    n
                }
                ,
                o.prototype.bitLength = function() {
                    var t = this.words[this.length - 1]
                      , e = this._countBits(t);
                    return 26 * (this.length - 1) + e
                }
                ,
                o.prototype.zeroBits = function() {
                    if (this.isZero())
                        return 0;
                    for (var t = 0, e = 0; e < this.length; e++) {
                        var n = this._zeroBits(this.words[e]);
                        if (t += n,
                        26 !== n)
                            break
                    }
                    return t
                }
                ,
                o.prototype.byteLength = function() {
                    return Math.ceil(this.bitLength() / 8)
                }
                ,
                o.prototype.toTwos = function(t) {
                    return 0 !== this.negative ? this.abs().inotn(t).iaddn(1) : this.clone()
                }
                ,
                o.prototype.fromTwos = function(t) {
                    return this.testn(t - 1) ? this.notn(t).iaddn(1).ineg() : this.clone()
                }
                ,
                o.prototype.isNeg = function() {
                    return 0 !== this.negative
                }
                ,
                o.prototype.neg = function() {
                    return this.clone().ineg()
                }
                ,
                o.prototype.ineg = function() {
                    return this.isZero() || (this.negative ^= 1),
                    this
                }
                ,
                o.prototype.iuor = function(t) {
                    for (; this.length < t.length; )
                        this.words[this.length++] = 0;
                    for (var e = 0; e < t.length; e++)
                        this.words[e] = this.words[e] | t.words[e];
                    return this._strip()
                }
                ,
                o.prototype.ior = function(t) {
                    return r(!(this.negative | t.negative)),
                    this.iuor(t)
                }
                ,
                o.prototype.or = function(t) {
                    return this.length > t.length ? this.clone().ior(t) : t.clone().ior(this)
                }
                ,
                o.prototype.uor = function(t) {
                    return this.length > t.length ? this.clone().iuor(t) : t.clone().iuor(this)
                }
                ,
                o.prototype.iuand = function(t) {
                    var e;
                    e = this.length > t.length ? t : this;
                    for (var n = 0; n < e.length; n++)
                        this.words[n] = this.words[n] & t.words[n];
                    return this.length = e.length,
                    this._strip()
                }
                ,
                o.prototype.iand = function(t) {
                    return r(!(this.negative | t.negative)),
                    this.iuand(t)
                }
                ,
                o.prototype.and = function(t) {
                    return this.length > t.length ? this.clone().iand(t) : t.clone().iand(this)
                }
                ,
                o.prototype.uand = function(t) {
                    return this.length > t.length ? this.clone().iuand(t) : t.clone().iuand(this)
                }
                ,
                o.prototype.iuxor = function(t) {
                    var e, n;
                    this.length > t.length ? (e = this,
                    n = t) : (e = t,
                    n = this);
                    for (var r = 0; r < n.length; r++)
                        this.words[r] = e.words[r] ^ n.words[r];
                    if (this !== e)
                        for (; r < e.length; r++)
                            this.words[r] = e.words[r];
                    return this.length = e.length,
                    this._strip()
                }
                ,
                o.prototype.ixor = function(t) {
                    return r(!(this.negative | t.negative)),
                    this.iuxor(t)
                }
                ,
                o.prototype.xor = function(t) {
                    return this.length > t.length ? this.clone().ixor(t) : t.clone().ixor(this)
                }
                ,
                o.prototype.uxor = function(t) {
                    return this.length > t.length ? this.clone().iuxor(t) : t.clone().iuxor(this)
                }
                ,
                o.prototype.inotn = function(t) {
                    r("number" == typeof t && t >= 0);
                    var e = 0 | Math.ceil(t / 26)
                      , n = t % 26;
                    this._expand(e),
                    n > 0 && e--;
                    for (var i = 0; i < e; i++)
                        this.words[i] = 67108863 & ~this.words[i];
                    return n > 0 && (this.words[i] = ~this.words[i] & 67108863 >> 26 - n),
                    this._strip()
                }
                ,
                o.prototype.notn = function(t) {
                    return this.clone().inotn(t)
                }
                ,
                o.prototype.setn = function(t, e) {
                    r("number" == typeof t && t >= 0);
                    var n = t / 26 | 0
                      , i = t % 26;
                    return this._expand(n + 1),
                    this.words[n] = e ? this.words[n] | 1 << i : this.words[n] & ~(1 << i),
                    this._strip()
                }
                ,
                o.prototype.iadd = function(t) {
                    var e, n, r;
                    if (0 !== this.negative && 0 === t.negative)
                        return this.negative = 0,
                        e = this.isub(t),
                        this.negative ^= 1,
                        this._normSign();
                    if (0 === this.negative && 0 !== t.negative)
                        return t.negative = 0,
                        e = this.isub(t),
                        t.negative = 1,
                        e._normSign();
                    this.length > t.length ? (n = this,
                    r = t) : (n = t,
                    r = this);
                    for (var i = 0, o = 0; o < r.length; o++)
                        e = (0 | n.words[o]) + (0 | r.words[o]) + i,
                        this.words[o] = 67108863 & e,
                        i = e >>> 26;
                    for (; 0 !== i && o < n.length; o++)
                        e = (0 | n.words[o]) + i,
                        this.words[o] = 67108863 & e,
                        i = e >>> 26;
                    if (this.length = n.length,
                    0 !== i)
                        this.words[this.length] = i,
                        this.length++;
                    else if (n !== this)
                        for (; o < n.length; o++)
                            this.words[o] = n.words[o];
                    return this
                }
                ,
                o.prototype.add = function(t) {
                    var e;
                    return 0 !== t.negative && 0 === this.negative ? (t.negative = 0,
                    e = this.sub(t),
                    t.negative ^= 1,
                    e) : 0 === t.negative && 0 !== this.negative ? (this.negative = 0,
                    e = t.sub(this),
                    this.negative = 1,
                    e) : this.length > t.length ? this.clone().iadd(t) : t.clone().iadd(this)
                }
                ,
                o.prototype.isub = function(t) {
                    if (0 !== t.negative) {
                        t.negative = 0;
                        var e = this.iadd(t);
                        return t.negative = 1,
                        e._normSign()
                    }
                    if (0 !== this.negative)
                        return this.negative = 0,
                        this.iadd(t),
                        this.negative = 1,
                        this._normSign();
                    var n, r, i = this.cmp(t);
                    if (0 === i)
                        return this.negative = 0,
                        this.length = 1,
                        this.words[0] = 0,
                        this;
                    i > 0 ? (n = this,
                    r = t) : (n = t,
                    r = this);
                    for (var o = 0, s = 0; s < r.length; s++)
                        o = (e = (0 | n.words[s]) - (0 | r.words[s]) + o) >> 26,
                        this.words[s] = 67108863 & e;
                    for (; 0 !== o && s < n.length; s++)
                        o = (e = (0 | n.words[s]) + o) >> 26,
                        this.words[s] = 67108863 & e;
                    if (0 === o && s < n.length && n !== this)
                        for (; s < n.length; s++)
                            this.words[s] = n.words[s];
                    return this.length = Math.max(this.length, s),
                    n !== this && (this.negative = 1),
                    this._strip()
                }
                ,
                o.prototype.sub = function(t) {
                    return this.clone().isub(t)
                }
                ;
                var g = function(t, e, n) {
                    var r, i, o, s = t.words, a = e.words, u = n.words, c = 0, l = 0 | s[0], f = 8191 & l, h = l >>> 13, d = 0 | s[1], p = 8191 & d, y = d >>> 13, g = 0 | s[2], m = 8191 & g, b = g >>> 13, w = 0 | s[3], v = 8191 & w, x = w >>> 13, S = 0 | s[4], k = 8191 & S, E = S >>> 13, A = 0 | s[5], I = 8191 & A, M = A >>> 13, _ = 0 | s[6], B = 8191 & _, j = _ >>> 13, O = 0 | s[7], P = 8191 & O, T = O >>> 13, L = 0 | s[8], R = 8191 & L, U = L >>> 13, N = 0 | s[9], z = 8191 & N, q = N >>> 13, W = 0 | a[0], C = 8191 & W, F = W >>> 13, K = 0 | a[1], D = 8191 & K, $ = K >>> 13, H = 0 | a[2], V = 8191 & H, J = H >>> 13, G = 0 | a[3], Z = 8191 & G, Y = G >>> 13, Q = 0 | a[4], X = 8191 & Q, tt = Q >>> 13, et = 0 | a[5], nt = 8191 & et, rt = et >>> 13, it = 0 | a[6], ot = 8191 & it, st = it >>> 13, at = 0 | a[7], ut = 8191 & at, ct = at >>> 13, lt = 0 | a[8], ft = 8191 & lt, ht = lt >>> 13, dt = 0 | a[9], pt = 8191 & dt, yt = dt >>> 13;
                    n.negative = t.negative ^ e.negative,
                    n.length = 19;
                    var gt = (c + (r = Math.imul(f, C)) | 0) + ((8191 & (i = (i = Math.imul(f, F)) + Math.imul(h, C) | 0)) << 13) | 0;
                    c = ((o = Math.imul(h, F)) + (i >>> 13) | 0) + (gt >>> 26) | 0,
                    gt &= 67108863,
                    r = Math.imul(p, C),
                    i = (i = Math.imul(p, F)) + Math.imul(y, C) | 0,
                    o = Math.imul(y, F);
                    var mt = (c + (r = r + Math.imul(f, D) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(f, $) | 0) + Math.imul(h, D) | 0)) << 13) | 0;
                    c = ((o = o + Math.imul(h, $) | 0) + (i >>> 13) | 0) + (mt >>> 26) | 0,
                    mt &= 67108863,
                    r = Math.imul(m, C),
                    i = (i = Math.imul(m, F)) + Math.imul(b, C) | 0,
                    o = Math.imul(b, F),
                    r = r + Math.imul(p, D) | 0,
                    i = (i = i + Math.imul(p, $) | 0) + Math.imul(y, D) | 0,
                    o = o + Math.imul(y, $) | 0;
                    var bt = (c + (r = r + Math.imul(f, V) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(f, J) | 0) + Math.imul(h, V) | 0)) << 13) | 0;
                    c = ((o = o + Math.imul(h, J) | 0) + (i >>> 13) | 0) + (bt >>> 26) | 0,
                    bt &= 67108863,
                    r = Math.imul(v, C),
                    i = (i = Math.imul(v, F)) + Math.imul(x, C) | 0,
                    o = Math.imul(x, F),
                    r = r + Math.imul(m, D) | 0,
                    i = (i = i + Math.imul(m, $) | 0) + Math.imul(b, D) | 0,
                    o = o + Math.imul(b, $) | 0,
                    r = r + Math.imul(p, V) | 0,
                    i = (i = i + Math.imul(p, J) | 0) + Math.imul(y, V) | 0,
                    o = o + Math.imul(y, J) | 0;
                    var wt = (c + (r = r + Math.imul(f, Z) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(f, Y) | 0) + Math.imul(h, Z) | 0)) << 13) | 0;
                    c = ((o = o + Math.imul(h, Y) | 0) + (i >>> 13) | 0) + (wt >>> 26) | 0,
                    wt &= 67108863,
                    r = Math.imul(k, C),
                    i = (i = Math.imul(k, F)) + Math.imul(E, C) | 0,
                    o = Math.imul(E, F),
                    r = r + Math.imul(v, D) | 0,
                    i = (i = i + Math.imul(v, $) | 0) + Math.imul(x, D) | 0,
                    o = o + Math.imul(x, $) | 0,
                    r = r + Math.imul(m, V) | 0,
                    i = (i = i + Math.imul(m, J) | 0) + Math.imul(b, V) | 0,
                    o = o + Math.imul(b, J) | 0,
                    r = r + Math.imul(p, Z) | 0,
                    i = (i = i + Math.imul(p, Y) | 0) + Math.imul(y, Z) | 0,
                    o = o + Math.imul(y, Y) | 0;
                    var vt = (c + (r = r + Math.imul(f, X) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(f, tt) | 0) + Math.imul(h, X) | 0)) << 13) | 0;
                    c = ((o = o + Math.imul(h, tt) | 0) + (i >>> 13) | 0) + (vt >>> 26) | 0,
                    vt &= 67108863,
                    r = Math.imul(I, C),
                    i = (i = Math.imul(I, F)) + Math.imul(M, C) | 0,
                    o = Math.imul(M, F),
                    r = r + Math.imul(k, D) | 0,
                    i = (i = i + Math.imul(k, $) | 0) + Math.imul(E, D) | 0,
                    o = o + Math.imul(E, $) | 0,
                    r = r + Math.imul(v, V) | 0,
                    i = (i = i + Math.imul(v, J) | 0) + Math.imul(x, V) | 0,
                    o = o + Math.imul(x, J) | 0,
                    r = r + Math.imul(m, Z) | 0,
                    i = (i = i + Math.imul(m, Y) | 0) + Math.imul(b, Z) | 0,
                    o = o + Math.imul(b, Y) | 0,
                    r = r + Math.imul(p, X) | 0,
                    i = (i = i + Math.imul(p, tt) | 0) + Math.imul(y, X) | 0,
                    o = o + Math.imul(y, tt) | 0;
                    var xt = (c + (r = r + Math.imul(f, nt) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(f, rt) | 0) + Math.imul(h, nt) | 0)) << 13) | 0;
                    c = ((o = o + Math.imul(h, rt) | 0) + (i >>> 13) | 0) + (xt >>> 26) | 0,
                    xt &= 67108863,
                    r = Math.imul(B, C),
                    i = (i = Math.imul(B, F)) + Math.imul(j, C) | 0,
                    o = Math.imul(j, F),
                    r = r + Math.imul(I, D) | 0,
                    i = (i = i + Math.imul(I, $) | 0) + Math.imul(M, D) | 0,
                    o = o + Math.imul(M, $) | 0,
                    r = r + Math.imul(k, V) | 0,
                    i = (i = i + Math.imul(k, J) | 0) + Math.imul(E, V) | 0,
                    o = o + Math.imul(E, J) | 0,
                    r = r + Math.imul(v, Z) | 0,
                    i = (i = i + Math.imul(v, Y) | 0) + Math.imul(x, Z) | 0,
                    o = o + Math.imul(x, Y) | 0,
                    r = r + Math.imul(m, X) | 0,
                    i = (i = i + Math.imul(m, tt) | 0) + Math.imul(b, X) | 0,
                    o = o + Math.imul(b, tt) | 0,
                    r = r + Math.imul(p, nt) | 0,
                    i = (i = i + Math.imul(p, rt) | 0) + Math.imul(y, nt) | 0,
                    o = o + Math.imul(y, rt) | 0;
                    var St = (c + (r = r + Math.imul(f, ot) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(f, st) | 0) + Math.imul(h, ot) | 0)) << 13) | 0;
                    c = ((o = o + Math.imul(h, st) | 0) + (i >>> 13) | 0) + (St >>> 26) | 0,
                    St &= 67108863,
                    r = Math.imul(P, C),
                    i = (i = Math.imul(P, F)) + Math.imul(T, C) | 0,
                    o = Math.imul(T, F),
                    r = r + Math.imul(B, D) | 0,
                    i = (i = i + Math.imul(B, $) | 0) + Math.imul(j, D) | 0,
                    o = o + Math.imul(j, $) | 0,
                    r = r + Math.imul(I, V) | 0,
                    i = (i = i + Math.imul(I, J) | 0) + Math.imul(M, V) | 0,
                    o = o + Math.imul(M, J) | 0,
                    r = r + Math.imul(k, Z) | 0,
                    i = (i = i + Math.imul(k, Y) | 0) + Math.imul(E, Z) | 0,
                    o = o + Math.imul(E, Y) | 0,
                    r = r + Math.imul(v, X) | 0,
                    i = (i = i + Math.imul(v, tt) | 0) + Math.imul(x, X) | 0,
                    o = o + Math.imul(x, tt) | 0,
                    r = r + Math.imul(m, nt) | 0,
                    i = (i = i + Math.imul(m, rt) | 0) + Math.imul(b, nt) | 0,
                    o = o + Math.imul(b, rt) | 0,
                    r = r + Math.imul(p, ot) | 0,
                    i = (i = i + Math.imul(p, st) | 0) + Math.imul(y, ot) | 0,
                    o = o + Math.imul(y, st) | 0;
                    var kt = (c + (r = r + Math.imul(f, ut) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(f, ct) | 0) + Math.imul(h, ut) | 0)) << 13) | 0;
                    c = ((o = o + Math.imul(h, ct) | 0) + (i >>> 13) | 0) + (kt >>> 26) | 0,
                    kt &= 67108863,
                    r = Math.imul(R, C),
                    i = (i = Math.imul(R, F)) + Math.imul(U, C) | 0,
                    o = Math.imul(U, F),
                    r = r + Math.imul(P, D) | 0,
                    i = (i = i + Math.imul(P, $) | 0) + Math.imul(T, D) | 0,
                    o = o + Math.imul(T, $) | 0,
                    r = r + Math.imul(B, V) | 0,
                    i = (i = i + Math.imul(B, J) | 0) + Math.imul(j, V) | 0,
                    o = o + Math.imul(j, J) | 0,
                    r = r + Math.imul(I, Z) | 0,
                    i = (i = i + Math.imul(I, Y) | 0) + Math.imul(M, Z) | 0,
                    o = o + Math.imul(M, Y) | 0,
                    r = r + Math.imul(k, X) | 0,
                    i = (i = i + Math.imul(k, tt) | 0) + Math.imul(E, X) | 0,
                    o = o + Math.imul(E, tt) | 0,
                    r = r + Math.imul(v, nt) | 0,
                    i = (i = i + Math.imul(v, rt) | 0) + Math.imul(x, nt) | 0,
                    o = o + Math.imul(x, rt) | 0,
                    r = r + Math.imul(m, ot) | 0,
                    i = (i = i + Math.imul(m, st) | 0) + Math.imul(b, ot) | 0,
                    o = o + Math.imul(b, st) | 0,
                    r = r + Math.imul(p, ut) | 0,
                    i = (i = i + Math.imul(p, ct) | 0) + Math.imul(y, ut) | 0,
                    o = o + Math.imul(y, ct) | 0;
                    var Et = (c + (r = r + Math.imul(f, ft) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(f, ht) | 0) + Math.imul(h, ft) | 0)) << 13) | 0;
                    c = ((o = o + Math.imul(h, ht) | 0) + (i >>> 13) | 0) + (Et >>> 26) | 0,
                    Et &= 67108863,
                    r = Math.imul(z, C),
                    i = (i = Math.imul(z, F)) + Math.imul(q, C) | 0,
                    o = Math.imul(q, F),
                    r = r + Math.imul(R, D) | 0,
                    i = (i = i + Math.imul(R, $) | 0) + Math.imul(U, D) | 0,
                    o = o + Math.imul(U, $) | 0,
                    r = r + Math.imul(P, V) | 0,
                    i = (i = i + Math.imul(P, J) | 0) + Math.imul(T, V) | 0,
                    o = o + Math.imul(T, J) | 0,
                    r = r + Math.imul(B, Z) | 0,
                    i = (i = i + Math.imul(B, Y) | 0) + Math.imul(j, Z) | 0,
                    o = o + Math.imul(j, Y) | 0,
                    r = r + Math.imul(I, X) | 0,
                    i = (i = i + Math.imul(I, tt) | 0) + Math.imul(M, X) | 0,
                    o = o + Math.imul(M, tt) | 0,
                    r = r + Math.imul(k, nt) | 0,
                    i = (i = i + Math.imul(k, rt) | 0) + Math.imul(E, nt) | 0,
                    o = o + Math.imul(E, rt) | 0,
                    r = r + Math.imul(v, ot) | 0,
                    i = (i = i + Math.imul(v, st) | 0) + Math.imul(x, ot) | 0,
                    o = o + Math.imul(x, st) | 0,
                    r = r + Math.imul(m, ut) | 0,
                    i = (i = i + Math.imul(m, ct) | 0) + Math.imul(b, ut) | 0,
                    o = o + Math.imul(b, ct) | 0,
                    r = r + Math.imul(p, ft) | 0,
                    i = (i = i + Math.imul(p, ht) | 0) + Math.imul(y, ft) | 0,
                    o = o + Math.imul(y, ht) | 0;
                    var At = (c + (r = r + Math.imul(f, pt) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(f, yt) | 0) + Math.imul(h, pt) | 0)) << 13) | 0;
                    c = ((o = o + Math.imul(h, yt) | 0) + (i >>> 13) | 0) + (At >>> 26) | 0,
                    At &= 67108863,
                    r = Math.imul(z, D),
                    i = (i = Math.imul(z, $)) + Math.imul(q, D) | 0,
                    o = Math.imul(q, $),
                    r = r + Math.imul(R, V) | 0,
                    i = (i = i + Math.imul(R, J) | 0) + Math.imul(U, V) | 0,
                    o = o + Math.imul(U, J) | 0,
                    r = r + Math.imul(P, Z) | 0,
                    i = (i = i + Math.imul(P, Y) | 0) + Math.imul(T, Z) | 0,
                    o = o + Math.imul(T, Y) | 0,
                    r = r + Math.imul(B, X) | 0,
                    i = (i = i + Math.imul(B, tt) | 0) + Math.imul(j, X) | 0,
                    o = o + Math.imul(j, tt) | 0,
                    r = r + Math.imul(I, nt) | 0,
                    i = (i = i + Math.imul(I, rt) | 0) + Math.imul(M, nt) | 0,
                    o = o + Math.imul(M, rt) | 0,
                    r = r + Math.imul(k, ot) | 0,
                    i = (i = i + Math.imul(k, st) | 0) + Math.imul(E, ot) | 0,
                    o = o + Math.imul(E, st) | 0,
                    r = r + Math.imul(v, ut) | 0,
                    i = (i = i + Math.imul(v, ct) | 0) + Math.imul(x, ut) | 0,
                    o = o + Math.imul(x, ct) | 0,
                    r = r + Math.imul(m, ft) | 0,
                    i = (i = i + Math.imul(m, ht) | 0) + Math.imul(b, ft) | 0,
                    o = o + Math.imul(b, ht) | 0;
                    var It = (c + (r = r + Math.imul(p, pt) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(p, yt) | 0) + Math.imul(y, pt) | 0)) << 13) | 0;
                    c = ((o = o + Math.imul(y, yt) | 0) + (i >>> 13) | 0) + (It >>> 26) | 0,
                    It &= 67108863,
                    r = Math.imul(z, V),
                    i = (i = Math.imul(z, J)) + Math.imul(q, V) | 0,
                    o = Math.imul(q, J),
                    r = r + Math.imul(R, Z) | 0,
                    i = (i = i + Math.imul(R, Y) | 0) + Math.imul(U, Z) | 0,
                    o = o + Math.imul(U, Y) | 0,
                    r = r + Math.imul(P, X) | 0,
                    i = (i = i + Math.imul(P, tt) | 0) + Math.imul(T, X) | 0,
                    o = o + Math.imul(T, tt) | 0,
                    r = r + Math.imul(B, nt) | 0,
                    i = (i = i + Math.imul(B, rt) | 0) + Math.imul(j, nt) | 0,
                    o = o + Math.imul(j, rt) | 0,
                    r = r + Math.imul(I, ot) | 0,
                    i = (i = i + Math.imul(I, st) | 0) + Math.imul(M, ot) | 0,
                    o = o + Math.imul(M, st) | 0,
                    r = r + Math.imul(k, ut) | 0,
                    i = (i = i + Math.imul(k, ct) | 0) + Math.imul(E, ut) | 0,
                    o = o + Math.imul(E, ct) | 0,
                    r = r + Math.imul(v, ft) | 0,
                    i = (i = i + Math.imul(v, ht) | 0) + Math.imul(x, ft) | 0,
                    o = o + Math.imul(x, ht) | 0;
                    var Mt = (c + (r = r + Math.imul(m, pt) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(m, yt) | 0) + Math.imul(b, pt) | 0)) << 13) | 0;
                    c = ((o = o + Math.imul(b, yt) | 0) + (i >>> 13) | 0) + (Mt >>> 26) | 0,
                    Mt &= 67108863,
                    r = Math.imul(z, Z),
                    i = (i = Math.imul(z, Y)) + Math.imul(q, Z) | 0,
                    o = Math.imul(q, Y),
                    r = r + Math.imul(R, X) | 0,
                    i = (i = i + Math.imul(R, tt) | 0) + Math.imul(U, X) | 0,
                    o = o + Math.imul(U, tt) | 0,
                    r = r + Math.imul(P, nt) | 0,
                    i = (i = i + Math.imul(P, rt) | 0) + Math.imul(T, nt) | 0,
                    o = o + Math.imul(T, rt) | 0,
                    r = r + Math.imul(B, ot) | 0,
                    i = (i = i + Math.imul(B, st) | 0) + Math.imul(j, ot) | 0,
                    o = o + Math.imul(j, st) | 0,
                    r = r + Math.imul(I, ut) | 0,
                    i = (i = i + Math.imul(I, ct) | 0) + Math.imul(M, ut) | 0,
                    o = o + Math.imul(M, ct) | 0,
                    r = r + Math.imul(k, ft) | 0,
                    i = (i = i + Math.imul(k, ht) | 0) + Math.imul(E, ft) | 0,
                    o = o + Math.imul(E, ht) | 0;
                    var _t = (c + (r = r + Math.imul(v, pt) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(v, yt) | 0) + Math.imul(x, pt) | 0)) << 13) | 0;
                    c = ((o = o + Math.imul(x, yt) | 0) + (i >>> 13) | 0) + (_t >>> 26) | 0,
                    _t &= 67108863,
                    r = Math.imul(z, X),
                    i = (i = Math.imul(z, tt)) + Math.imul(q, X) | 0,
                    o = Math.imul(q, tt),
                    r = r + Math.imul(R, nt) | 0,
                    i = (i = i + Math.imul(R, rt) | 0) + Math.imul(U, nt) | 0,
                    o = o + Math.imul(U, rt) | 0,
                    r = r + Math.imul(P, ot) | 0,
                    i = (i = i + Math.imul(P, st) | 0) + Math.imul(T, ot) | 0,
                    o = o + Math.imul(T, st) | 0,
                    r = r + Math.imul(B, ut) | 0,
                    i = (i = i + Math.imul(B, ct) | 0) + Math.imul(j, ut) | 0,
                    o = o + Math.imul(j, ct) | 0,
                    r = r + Math.imul(I, ft) | 0,
                    i = (i = i + Math.imul(I, ht) | 0) + Math.imul(M, ft) | 0,
                    o = o + Math.imul(M, ht) | 0;
                    var Bt = (c + (r = r + Math.imul(k, pt) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(k, yt) | 0) + Math.imul(E, pt) | 0)) << 13) | 0;
                    c = ((o = o + Math.imul(E, yt) | 0) + (i >>> 13) | 0) + (Bt >>> 26) | 0,
                    Bt &= 67108863,
                    r = Math.imul(z, nt),
                    i = (i = Math.imul(z, rt)) + Math.imul(q, nt) | 0,
                    o = Math.imul(q, rt),
                    r = r + Math.imul(R, ot) | 0,
                    i = (i = i + Math.imul(R, st) | 0) + Math.imul(U, ot) | 0,
                    o = o + Math.imul(U, st) | 0,
                    r = r + Math.imul(P, ut) | 0,
                    i = (i = i + Math.imul(P, ct) | 0) + Math.imul(T, ut) | 0,
                    o = o + Math.imul(T, ct) | 0,
                    r = r + Math.imul(B, ft) | 0,
                    i = (i = i + Math.imul(B, ht) | 0) + Math.imul(j, ft) | 0,
                    o = o + Math.imul(j, ht) | 0;
                    var jt = (c + (r = r + Math.imul(I, pt) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(I, yt) | 0) + Math.imul(M, pt) | 0)) << 13) | 0;
                    c = ((o = o + Math.imul(M, yt) | 0) + (i >>> 13) | 0) + (jt >>> 26) | 0,
                    jt &= 67108863,
                    r = Math.imul(z, ot),
                    i = (i = Math.imul(z, st)) + Math.imul(q, ot) | 0,
                    o = Math.imul(q, st),
                    r = r + Math.imul(R, ut) | 0,
                    i = (i = i + Math.imul(R, ct) | 0) + Math.imul(U, ut) | 0,
                    o = o + Math.imul(U, ct) | 0,
                    r = r + Math.imul(P, ft) | 0,
                    i = (i = i + Math.imul(P, ht) | 0) + Math.imul(T, ft) | 0,
                    o = o + Math.imul(T, ht) | 0;
                    var Ot = (c + (r = r + Math.imul(B, pt) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(B, yt) | 0) + Math.imul(j, pt) | 0)) << 13) | 0;
                    c = ((o = o + Math.imul(j, yt) | 0) + (i >>> 13) | 0) + (Ot >>> 26) | 0,
                    Ot &= 67108863,
                    r = Math.imul(z, ut),
                    i = (i = Math.imul(z, ct)) + Math.imul(q, ut) | 0,
                    o = Math.imul(q, ct),
                    r = r + Math.imul(R, ft) | 0,
                    i = (i = i + Math.imul(R, ht) | 0) + Math.imul(U, ft) | 0,
                    o = o + Math.imul(U, ht) | 0;
                    var Pt = (c + (r = r + Math.imul(P, pt) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(P, yt) | 0) + Math.imul(T, pt) | 0)) << 13) | 0;
                    c = ((o = o + Math.imul(T, yt) | 0) + (i >>> 13) | 0) + (Pt >>> 26) | 0,
                    Pt &= 67108863,
                    r = Math.imul(z, ft),
                    i = (i = Math.imul(z, ht)) + Math.imul(q, ft) | 0,
                    o = Math.imul(q, ht);
                    var Tt = (c + (r = r + Math.imul(R, pt) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(R, yt) | 0) + Math.imul(U, pt) | 0)) << 13) | 0;
                    c = ((o = o + Math.imul(U, yt) | 0) + (i >>> 13) | 0) + (Tt >>> 26) | 0,
                    Tt &= 67108863;
                    var Lt = (c + (r = Math.imul(z, pt)) | 0) + ((8191 & (i = (i = Math.imul(z, yt)) + Math.imul(q, pt) | 0)) << 13) | 0;
                    return c = ((o = Math.imul(q, yt)) + (i >>> 13) | 0) + (Lt >>> 26) | 0,
                    Lt &= 67108863,
                    u[0] = gt,
                    u[1] = mt,
                    u[2] = bt,
                    u[3] = wt,
                    u[4] = vt,
                    u[5] = xt,
                    u[6] = St,
                    u[7] = kt,
                    u[8] = Et,
                    u[9] = At,
                    u[10] = It,
                    u[11] = Mt,
                    u[12] = _t,
                    u[13] = Bt,
                    u[14] = jt,
                    u[15] = Ot,
                    u[16] = Pt,
                    u[17] = Tt,
                    u[18] = Lt,
                    0 !== c && (u[19] = c,
                    n.length++),
                    n
                };
                function m(t, e, n) {
                    n.negative = e.negative ^ t.negative,
                    n.length = t.length + e.length;
                    for (var r = 0, i = 0, o = 0; o < n.length - 1; o++) {
                        var s = i;
                        i = 0;
                        for (var a = 67108863 & r, u = Math.min(o, e.length - 1), c = Math.max(0, o - t.length + 1); c <= u; c++) {
                            var l = o - c
                              , f = (0 | t.words[l]) * (0 | e.words[c])
                              , h = 67108863 & f;
                            a = 67108863 & (h = h + a | 0),
                            i += (s = (s = s + (f / 67108864 | 0) | 0) + (h >>> 26) | 0) >>> 26,
                            s &= 67108863
                        }
                        n.words[o] = a,
                        r = s,
                        s = i
                    }
                    return 0 !== r ? n.words[o] = r : n.length--,
                    n._strip()
                }
                function b(t, e, n) {
                    return m(t, e, n)
                }
                function w(t, e) {
                    this.x = t,
                    this.y = e
                }
                Math.imul || (g = y),
                o.prototype.mulTo = function(t, e) {
                    var n = this.length + t.length;
                    return 10 === this.length && 10 === t.length ? g(this, t, e) : n < 63 ? y(this, t, e) : n < 1024 ? m(this, t, e) : b(this, t, e)
                }
                ,
                w.prototype.makeRBT = function(t) {
                    for (var e = new Array(t), n = o.prototype._countBits(t) - 1, r = 0; r < t; r++)
                        e[r] = this.revBin(r, n, t);
                    return e
                }
                ,
                w.prototype.revBin = function(t, e, n) {
                    if (0 === t || t === n - 1)
                        return t;
                    for (var r = 0, i = 0; i < e; i++)
                        r |= (1 & t) << e - i - 1,
                        t >>= 1;
                    return r
                }
                ,
                w.prototype.permute = function(t, e, n, r, i, o) {
                    for (var s = 0; s < o; s++)
                        r[s] = e[t[s]],
                        i[s] = n[t[s]]
                }
                ,
                w.prototype.transform = function(t, e, n, r, i, o) {
                    this.permute(o, t, e, n, r, i);
                    for (var s = 1; s < i; s <<= 1)
                        for (var a = s << 1, u = Math.cos(2 * Math.PI / a), c = Math.sin(2 * Math.PI / a), l = 0; l < i; l += a)
                            for (var f = u, h = c, d = 0; d < s; d++) {
                                var p = n[l + d]
                                  , y = r[l + d]
                                  , g = n[l + d + s]
                                  , m = r[l + d + s]
                                  , b = f * g - h * m;
                                m = f * m + h * g,
                                g = b,
                                n[l + d] = p + g,
                                r[l + d] = y + m,
                                n[l + d + s] = p - g,
                                r[l + d + s] = y - m,
                                d !== a && (b = u * f - c * h,
                                h = u * h + c * f,
                                f = b)
                            }
                }
                ,
                w.prototype.guessLen13b = function(t, e) {
                    var n = 1 | Math.max(e, t)
                      , r = 1 & n
                      , i = 0;
                    for (n = n / 2 | 0; n; n >>>= 1)
                        i++;
                    return 1 << i + 1 + r
                }
                ,
                w.prototype.conjugate = function(t, e, n) {
                    if (!(n <= 1))
                        for (var r = 0; r < n / 2; r++) {
                            var i = t[r];
                            t[r] = t[n - r - 1],
                            t[n - r - 1] = i,
                            i = e[r],
                            e[r] = -e[n - r - 1],
                            e[n - r - 1] = -i
                        }
                }
                ,
                w.prototype.normalize13b = function(t, e) {
                    for (var n = 0, r = 0; r < e / 2; r++) {
                        var i = 8192 * Math.round(t[2 * r + 1] / e) + Math.round(t[2 * r] / e) + n;
                        t[r] = 67108863 & i,
                        n = i < 67108864 ? 0 : i / 67108864 | 0
                    }
                    return t
                }
                ,
                w.prototype.convert13b = function(t, e, n, i) {
                    for (var o = 0, s = 0; s < e; s++)
                        o += 0 | t[s],
                        n[2 * s] = 8191 & o,
                        o >>>= 13,
                        n[2 * s + 1] = 8191 & o,
                        o >>>= 13;
                    for (s = 2 * e; s < i; ++s)
                        n[s] = 0;
                    r(0 === o),
                    r(!(-8192 & o))
                }
                ,
                w.prototype.stub = function(t) {
                    for (var e = new Array(t), n = 0; n < t; n++)
                        e[n] = 0;
                    return e
                }
                ,
                w.prototype.mulp = function(t, e, n) {
                    var r = 2 * this.guessLen13b(t.length, e.length)
                      , i = this.makeRBT(r)
                      , o = this.stub(r)
                      , s = new Array(r)
                      , a = new Array(r)
                      , u = new Array(r)
                      , c = new Array(r)
                      , l = new Array(r)
                      , f = new Array(r)
                      , h = n.words;
                    h.length = r,
                    this.convert13b(t.words, t.length, s, r),
                    this.convert13b(e.words, e.length, c, r),
                    this.transform(s, o, a, u, r, i),
                    this.transform(c, o, l, f, r, i);
                    for (var d = 0; d < r; d++) {
                        var p = a[d] * l[d] - u[d] * f[d];
                        u[d] = a[d] * f[d] + u[d] * l[d],
                        a[d] = p
                    }
                    return this.conjugate(a, u, r),
                    this.transform(a, u, h, o, r, i),
                    this.conjugate(h, o, r),
                    this.normalize13b(h, r),
                    n.negative = t.negative ^ e.negative,
                    n.length = t.length + e.length,
                    n._strip()
                }
                ,
                o.prototype.mul = function(t) {
                    var e = new o(null);
                    return e.words = new Array(this.length + t.length),
                    this.mulTo(t, e)
                }
                ,
                o.prototype.mulf = function(t) {
                    var e = new o(null);
                    return e.words = new Array(this.length + t.length),
                    b(this, t, e)
                }
                ,
                o.prototype.imul = function(t) {
                    return this.clone().mulTo(t, this)
                }
                ,
                o.prototype.imuln = function(t) {
                    var e = t < 0;
                    e && (t = -t),
                    r("number" == typeof t),
                    r(t < 67108864);
                    for (var n = 0, i = 0; i < this.length; i++) {
                        var o = (0 | this.words[i]) * t
                          , s = (67108863 & o) + (67108863 & n);
                        n >>= 26,
                        n += o / 67108864 | 0,
                        n += s >>> 26,
                        this.words[i] = 67108863 & s
                    }
                    return 0 !== n && (this.words[i] = n,
                    this.length++),
                    e ? this.ineg() : this
                }
                ,
                o.prototype.muln = function(t) {
                    return this.clone().imuln(t)
                }
                ,
                o.prototype.sqr = function() {
                    return this.mul(this)
                }
                ,
                o.prototype.isqr = function() {
                    return this.imul(this.clone())
                }
                ,
                o.prototype.pow = function(t) {
                    var e = function(t) {
                        for (var e = new Array(t.bitLength()), n = 0; n < e.length; n++) {
                            var r = n / 26 | 0
                              , i = n % 26;
                            e[n] = t.words[r] >>> i & 1
                        }
                        return e
                    }(t);
                    if (0 === e.length)
                        return new o(1);
                    for (var n = this, r = 0; r < e.length && 0 === e[r]; r++,
                    n = n.sqr())
                        ;
                    if (++r < e.length)
                        for (var i = n.sqr(); r < e.length; r++,
                        i = i.sqr())
                            0 !== e[r] && (n = n.mul(i));
                    return n
                }
                ,
                o.prototype.iushln = function(t) {
                    r("number" == typeof t && t >= 0);
                    var e, n = t % 26, i = (t - n) / 26, o = 67108863 >>> 26 - n << 26 - n;
                    if (0 !== n) {
                        var s = 0;
                        for (e = 0; e < this.length; e++) {
                            var a = this.words[e] & o
                              , u = (0 | this.words[e]) - a << n;
                            this.words[e] = u | s,
                            s = a >>> 26 - n
                        }
                        s && (this.words[e] = s,
                        this.length++)
                    }
                    if (0 !== i) {
                        for (e = this.length - 1; e >= 0; e--)
                            this.words[e + i] = this.words[e];
                        for (e = 0; e < i; e++)
                            this.words[e] = 0;
                        this.length += i
                    }
                    return this._strip()
                }
                ,
                o.prototype.ishln = function(t) {
                    return r(0 === this.negative),
                    this.iushln(t)
                }
                ,
                o.prototype.iushrn = function(t, e, n) {
                    var i;
                    r("number" == typeof t && t >= 0),
                    i = e ? (e - e % 26) / 26 : 0;
                    var o = t % 26
                      , s = Math.min((t - o) / 26, this.length)
                      , a = 67108863 ^ 67108863 >>> o << o
                      , u = n;
                    if (i -= s,
                    i = Math.max(0, i),
                    u) {
                        for (var c = 0; c < s; c++)
                            u.words[c] = this.words[c];
                        u.length = s
                    }
                    if (0 === s)
                        ;
                    else if (this.length > s)
                        for (this.length -= s,
                        c = 0; c < this.length; c++)
                            this.words[c] = this.words[c + s];
                    else
                        this.words[0] = 0,
                        this.length = 1;
                    var l = 0;
                    for (c = this.length - 1; c >= 0 && (0 !== l || c >= i); c--) {
                        var f = 0 | this.words[c];
                        this.words[c] = l << 26 - o | f >>> o,
                        l = f & a
                    }
                    return u && 0 !== l && (u.words[u.length++] = l),
                    0 === this.length && (this.words[0] = 0,
                    this.length = 1),
                    this._strip()
                }
                ,
                o.prototype.ishrn = function(t, e, n) {
                    return r(0 === this.negative),
                    this.iushrn(t, e, n)
                }
                ,
                o.prototype.shln = function(t) {
                    return this.clone().ishln(t)
                }
                ,
                o.prototype.ushln = function(t) {
                    return this.clone().iushln(t)
                }
                ,
                o.prototype.shrn = function(t) {
                    return this.clone().ishrn(t)
                }
                ,
                o.prototype.ushrn = function(t) {
                    return this.clone().iushrn(t)
                }
                ,
                o.prototype.testn = function(t) {
                    r("number" == typeof t && t >= 0);
                    var e = t % 26
                      , n = (t - e) / 26
                      , i = 1 << e;
                    return !(this.length <= n || !(this.words[n] & i))
                }
                ,
                o.prototype.imaskn = function(t) {
                    r("number" == typeof t && t >= 0);
                    var e = t % 26
                      , n = (t - e) / 26;
                    if (r(0 === this.negative, "imaskn works only with positive numbers"),
                    this.length <= n)
                        return this;
                    if (0 !== e && n++,
                    this.length = Math.min(n, this.length),
                    0 !== e) {
                        var i = 67108863 ^ 67108863 >>> e << e;
                        this.words[this.length - 1] &= i
                    }
                    return this._strip()
                }
                ,
                o.prototype.maskn = function(t) {
                    return this.clone().imaskn(t)
                }
                ,
                o.prototype.iaddn = function(t) {
                    return r("number" == typeof t),
                    r(t < 67108864),
                    t < 0 ? this.isubn(-t) : 0 !== this.negative ? 1 === this.length && (0 | this.words[0]) <= t ? (this.words[0] = t - (0 | this.words[0]),
                    this.negative = 0,
                    this) : (this.negative = 0,
                    this.isubn(t),
                    this.negative = 1,
                    this) : this._iaddn(t)
                }
                ,
                o.prototype._iaddn = function(t) {
                    this.words[0] += t;
                    for (var e = 0; e < this.length && this.words[e] >= 67108864; e++)
                        this.words[e] -= 67108864,
                        e === this.length - 1 ? this.words[e + 1] = 1 : this.words[e + 1]++;
                    return this.length = Math.max(this.length, e + 1),
                    this
                }
                ,
                o.prototype.isubn = function(t) {
                    if (r("number" == typeof t),
                    r(t < 67108864),
                    t < 0)
                        return this.iaddn(-t);
                    if (0 !== this.negative)
                        return this.negative = 0,
                        this.iaddn(t),
                        this.negative = 1,
                        this;
                    if (this.words[0] -= t,
                    1 === this.length && this.words[0] < 0)
                        this.words[0] = -this.words[0],
                        this.negative = 1;
                    else
                        for (var e = 0; e < this.length && this.words[e] < 0; e++)
                            this.words[e] += 67108864,
                            this.words[e + 1] -= 1;
                    return this._strip()
                }
                ,
                o.prototype.addn = function(t) {
                    return this.clone().iaddn(t)
                }
                ,
                o.prototype.subn = function(t) {
                    return this.clone().isubn(t)
                }
                ,
                o.prototype.iabs = function() {
                    return this.negative = 0,
                    this
                }
                ,
                o.prototype.abs = function() {
                    return this.clone().iabs()
                }
                ,
                o.prototype._ishlnsubmul = function(t, e, n) {
                    var i, o, s = t.length + n;
                    this._expand(s);
                    var a = 0;
                    for (i = 0; i < t.length; i++) {
                        o = (0 | this.words[i + n]) + a;
                        var u = (0 | t.words[i]) * e;
                        a = ((o -= 67108863 & u) >> 26) - (u / 67108864 | 0),
                        this.words[i + n] = 67108863 & o
                    }
                    for (; i < this.length - n; i++)
                        a = (o = (0 | this.words[i + n]) + a) >> 26,
                        this.words[i + n] = 67108863 & o;
                    if (0 === a)
                        return this._strip();
                    for (r(-1 === a),
                    a = 0,
                    i = 0; i < this.length; i++)
                        a = (o = -(0 | this.words[i]) + a) >> 26,
                        this.words[i] = 67108863 & o;
                    return this.negative = 1,
                    this._strip()
                }
                ,
                o.prototype._wordDiv = function(t, e) {
                    var n = (this.length,
                    t.length)
                      , r = this.clone()
                      , i = t
                      , s = 0 | i.words[i.length - 1];
                    0 != (n = 26 - this._countBits(s)) && (i = i.ushln(n),
                    r.iushln(n),
                    s = 0 | i.words[i.length - 1]);
                    var a, u = r.length - i.length;
                    if ("mod" !== e) {
                        (a = new o(null)).length = u + 1,
                        a.words = new Array(a.length);
                        for (var c = 0; c < a.length; c++)
                            a.words[c] = 0
                    }
                    var l = r.clone()._ishlnsubmul(i, 1, u);
                    0 === l.negative && (r = l,
                    a && (a.words[u] = 1));
                    for (var f = u - 1; f >= 0; f--) {
                        var h = 67108864 * (0 | r.words[i.length + f]) + (0 | r.words[i.length + f - 1]);
                        for (h = Math.min(h / s | 0, 67108863),
                        r._ishlnsubmul(i, h, f); 0 !== r.negative; )
                            h--,
                            r.negative = 0,
                            r._ishlnsubmul(i, 1, f),
                            r.isZero() || (r.negative ^= 1);
                        a && (a.words[f] = h)
                    }
                    return a && a._strip(),
                    r._strip(),
                    "div" !== e && 0 !== n && r.iushrn(n),
                    {
                        div: a || null,
                        mod: r
                    }
                }
                ,
                o.prototype.divmod = function(t, e, n) {
                    return r(!t.isZero()),
                    this.isZero() ? {
                        div: new o(0),
                        mod: new o(0)
                    } : 0 !== this.negative && 0 === t.negative ? (a = this.neg().divmod(t, e),
                    "mod" !== e && (i = a.div.neg()),
                    "div" !== e && (s = a.mod.neg(),
                    n && 0 !== s.negative && s.iadd(t)),
                    {
                        div: i,
                        mod: s
                    }) : 0 === this.negative && 0 !== t.negative ? (a = this.divmod(t.neg(), e),
                    "mod" !== e && (i = a.div.neg()),
                    {
                        div: i,
                        mod: a.mod
                    }) : this.negative & t.negative ? (a = this.neg().divmod(t.neg(), e),
                    "div" !== e && (s = a.mod.neg(),
                    n && 0 !== s.negative && s.isub(t)),
                    {
                        div: a.div,
                        mod: s
                    }) : t.length > this.length || this.cmp(t) < 0 ? {
                        div: new o(0),
                        mod: this
                    } : 1 === t.length ? "div" === e ? {
                        div: this.divn(t.words[0]),
                        mod: null
                    } : "mod" === e ? {
                        div: null,
                        mod: new o(this.modrn(t.words[0]))
                    } : {
                        div: this.divn(t.words[0]),
                        mod: new o(this.modrn(t.words[0]))
                    } : this._wordDiv(t, e);
                    var i, s, a
                }
                ,
                o.prototype.div = function(t) {
                    return this.divmod(t, "div", !1).div
                }
                ,
                o.prototype.mod = function(t) {
                    return this.divmod(t, "mod", !1).mod
                }
                ,
                o.prototype.umod = function(t) {
                    return this.divmod(t, "mod", !0).mod
                }
                ,
                o.prototype.divRound = function(t) {
                    var e = this.divmod(t);
                    if (e.mod.isZero())
                        return e.div;
                    var n = 0 !== e.div.negative ? e.mod.isub(t) : e.mod
                      , r = t.ushrn(1)
                      , i = t.andln(1)
                      , o = n.cmp(r);
                    return o < 0 || 1 === i && 0 === o ? e.div : 0 !== e.div.negative ? e.div.isubn(1) : e.div.iaddn(1)
                }
                ,
                o.prototype.modrn = function(t) {
                    var e = t < 0;
                    e && (t = -t),
                    r(t <= 67108863);
                    for (var n = (1 << 26) % t, i = 0, o = this.length - 1; o >= 0; o--)
                        i = (n * i + (0 | this.words[o])) % t;
                    return e ? -i : i
                }
                ,
                o.prototype.modn = function(t) {
                    return this.modrn(t)
                }
                ,
                o.prototype.idivn = function(t) {
                    var e = t < 0;
                    e && (t = -t),
                    r(t <= 67108863);
                    for (var n = 0, i = this.length - 1; i >= 0; i--) {
                        var o = (0 | this.words[i]) + 67108864 * n;
                        this.words[i] = o / t | 0,
                        n = o % t
                    }
                    return this._strip(),
                    e ? this.ineg() : this
                }
                ,
                o.prototype.divn = function(t) {
                    return this.clone().idivn(t)
                }
                ,
                o.prototype.egcd = function(t) {
                    r(0 === t.negative),
                    r(!t.isZero());
                    var e = this
                      , n = t.clone();
                    e = 0 !== e.negative ? e.umod(t) : e.clone();
                    for (var i = new o(1), s = new o(0), a = new o(0), u = new o(1), c = 0; e.isEven() && n.isEven(); )
                        e.iushrn(1),
                        n.iushrn(1),
                        ++c;
                    for (var l = n.clone(), f = e.clone(); !e.isZero(); ) {
                        for (var h = 0, d = 1; !(e.words[0] & d) && h < 26; ++h,
                        d <<= 1)
                            ;
                        if (h > 0)
                            for (e.iushrn(h); h-- > 0; )
                                (i.isOdd() || s.isOdd()) && (i.iadd(l),
                                s.isub(f)),
                                i.iushrn(1),
                                s.iushrn(1);
                        for (var p = 0, y = 1; !(n.words[0] & y) && p < 26; ++p,
                        y <<= 1)
                            ;
                        if (p > 0)
                            for (n.iushrn(p); p-- > 0; )
                                (a.isOdd() || u.isOdd()) && (a.iadd(l),
                                u.isub(f)),
                                a.iushrn(1),
                                u.iushrn(1);
                        e.cmp(n) >= 0 ? (e.isub(n),
                        i.isub(a),
                        s.isub(u)) : (n.isub(e),
                        a.isub(i),
                        u.isub(s))
                    }
                    return {
                        a,
                        b: u,
                        gcd: n.iushln(c)
                    }
                }
                ,
                o.prototype._invmp = function(t) {
                    r(0 === t.negative),
                    r(!t.isZero());
                    var e = this
                      , n = t.clone();
                    e = 0 !== e.negative ? e.umod(t) : e.clone();
                    for (var i, s = new o(1), a = new o(0), u = n.clone(); e.cmpn(1) > 0 && n.cmpn(1) > 0; ) {
                        for (var c = 0, l = 1; !(e.words[0] & l) && c < 26; ++c,
                        l <<= 1)
                            ;
                        if (c > 0)
                            for (e.iushrn(c); c-- > 0; )
                                s.isOdd() && s.iadd(u),
                                s.iushrn(1);
                        for (var f = 0, h = 1; !(n.words[0] & h) && f < 26; ++f,
                        h <<= 1)
                            ;
                        if (f > 0)
                            for (n.iushrn(f); f-- > 0; )
                                a.isOdd() && a.iadd(u),
                                a.iushrn(1);
                        e.cmp(n) >= 0 ? (e.isub(n),
                        s.isub(a)) : (n.isub(e),
                        a.isub(s))
                    }
                    return (i = 0 === e.cmpn(1) ? s : a).cmpn(0) < 0 && i.iadd(t),
                    i
                }
                ,
                o.prototype.gcd = function(t) {
                    if (this.isZero())
                        return t.abs();
                    if (t.isZero())
                        return this.abs();
                    var e = this.clone()
                      , n = t.clone();
                    e.negative = 0,
                    n.negative = 0;
                    for (var r = 0; e.isEven() && n.isEven(); r++)
                        e.iushrn(1),
                        n.iushrn(1);
                    for (; ; ) {
                        for (; e.isEven(); )
                            e.iushrn(1);
                        for (; n.isEven(); )
                            n.iushrn(1);
                        var i = e.cmp(n);
                        if (i < 0) {
                            var o = e;
                            e = n,
                            n = o
                        } else if (0 === i || 0 === n.cmpn(1))
                            break;
                        e.isub(n)
                    }
                    return n.iushln(r)
                }
                ,
                o.prototype.invm = function(t) {
                    return this.egcd(t).a.umod(t)
                }
                ,
                o.prototype.isEven = function() {
                    return !(1 & this.words[0])
                }
                ,
                o.prototype.isOdd = function() {
                    return !(1 & ~this.words[0])
                }
                ,
                o.prototype.andln = function(t) {
                    return this.words[0] & t
                }
                ,
                o.prototype.bincn = function(t) {
                    r("number" == typeof t);
                    var e = t % 26
                      , n = (t - e) / 26
                      , i = 1 << e;
                    if (this.length <= n)
                        return this._expand(n + 1),
                        this.words[n] |= i,
                        this;
                    for (var o = i, s = n; 0 !== o && s < this.length; s++) {
                        var a = 0 | this.words[s];
                        o = (a += o) >>> 26,
                        a &= 67108863,
                        this.words[s] = a
                    }
                    return 0 !== o && (this.words[s] = o,
                    this.length++),
                    this
                }
                ,
                o.prototype.isZero = function() {
                    return 1 === this.length && 0 === this.words[0]
                }
                ,
                o.prototype.cmpn = function(t) {
                    var e, n = t < 0;
                    if (0 !== this.negative && !n)
                        return -1;
                    if (0 === this.negative && n)
                        return 1;
                    if (this._strip(),
                    this.length > 1)
                        e = 1;
                    else {
                        n && (t = -t),
                        r(t <= 67108863, "Number is too big");
                        var i = 0 | this.words[0];
                        e = i === t ? 0 : i < t ? -1 : 1
                    }
                    return 0 !== this.negative ? 0 | -e : e
                }
                ,
                o.prototype.cmp = function(t) {
                    if (0 !== this.negative && 0 === t.negative)
                        return -1;
                    if (0 === this.negative && 0 !== t.negative)
                        return 1;
                    var e = this.ucmp(t);
                    return 0 !== this.negative ? 0 | -e : e
                }
                ,
                o.prototype.ucmp = function(t) {
                    if (this.length > t.length)
                        return 1;
                    if (this.length < t.length)
                        return -1;
                    for (var e = 0, n = this.length - 1; n >= 0; n--) {
                        var r = 0 | this.words[n]
                          , i = 0 | t.words[n];
                        if (r !== i) {
                            r < i ? e = -1 : r > i && (e = 1);
                            break
                        }
                    }
                    return e
                }
                ,
                o.prototype.gtn = function(t) {
                    return 1 === this.cmpn(t)
                }
                ,
                o.prototype.gt = function(t) {
                    return 1 === this.cmp(t)
                }
                ,
                o.prototype.gten = function(t) {
                    return this.cmpn(t) >= 0
                }
                ,
                o.prototype.gte = function(t) {
                    return this.cmp(t) >= 0
                }
                ,
                o.prototype.ltn = function(t) {
                    return -1 === this.cmpn(t)
                }
                ,
                o.prototype.lt = function(t) {
                    return -1 === this.cmp(t)
                }
                ,
                o.prototype.lten = function(t) {
                    return this.cmpn(t) <= 0
                }
                ,
                o.prototype.lte = function(t) {
                    return this.cmp(t) <= 0
                }
                ,
                o.prototype.eqn = function(t) {
                    return 0 === this.cmpn(t)
                }
                ,
                o.prototype.eq = function(t) {
                    return 0 === this.cmp(t)
                }
                ,
                o.red = function(t) {
                    return new I(t)
                }
                ,
                o.prototype.toRed = function(t) {
                    return r(!this.red, "Already a number in reduction context"),
                    r(0 === this.negative, "red works only with positives"),
                    t.convertTo(this)._forceRed(t)
                }
                ,
                o.prototype.fromRed = function() {
                    return r(this.red, "fromRed works only with numbers in reduction context"),
                    this.red.convertFrom(this)
                }
                ,
                o.prototype._forceRed = function(t) {
                    return this.red = t,
                    this
                }
                ,
                o.prototype.forceRed = function(t) {
                    return r(!this.red, "Already a number in reduction context"),
                    this._forceRed(t)
                }
                ,
                o.prototype.redAdd = function(t) {
                    return r(this.red, "redAdd works only with red numbers"),
                    this.red.add(this, t)
                }
                ,
                o.prototype.redIAdd = function(t) {
                    return r(this.red, "redIAdd works only with red numbers"),
                    this.red.iadd(this, t)
                }
                ,
                o.prototype.redSub = function(t) {
                    return r(this.red, "redSub works only with red numbers"),
                    this.red.sub(this, t)
                }
                ,
                o.prototype.redISub = function(t) {
                    return r(this.red, "redISub works only with red numbers"),
                    this.red.isub(this, t)
                }
                ,
                o.prototype.redShl = function(t) {
                    return r(this.red, "redShl works only with red numbers"),
                    this.red.shl(this, t)
                }
                ,
                o.prototype.redMul = function(t) {
                    return r(this.red, "redMul works only with red numbers"),
                    this.red._verify2(this, t),
                    this.red.mul(this, t)
                }
                ,
                o.prototype.redIMul = function(t) {
                    return r(this.red, "redMul works only with red numbers"),
                    this.red._verify2(this, t),
                    this.red.imul(this, t)
                }
                ,
                o.prototype.redSqr = function() {
                    return r(this.red, "redSqr works only with red numbers"),
                    this.red._verify1(this),
                    this.red.sqr(this)
                }
                ,
                o.prototype.redISqr = function() {
                    return r(this.red, "redISqr works only with red numbers"),
                    this.red._verify1(this),
                    this.red.isqr(this)
                }
                ,
                o.prototype.redSqrt = function() {
                    return r(this.red, "redSqrt works only with red numbers"),
                    this.red._verify1(this),
                    this.red.sqrt(this)
                }
                ,
                o.prototype.redInvm = function() {
                    return r(this.red, "redInvm works only with red numbers"),
                    this.red._verify1(this),
                    this.red.invm(this)
                }
                ,
                o.prototype.redNeg = function() {
                    return r(this.red, "redNeg works only with red numbers"),
                    this.red._verify1(this),
                    this.red.neg(this)
                }
                ,
                o.prototype.redPow = function(t) {
                    return r(this.red && !t.red, "redPow(normalNum)"),
                    this.red._verify1(this),
                    this.red.pow(this, t)
                }
                ;
                var v = {
                    k256: null,
                    p224: null,
                    p192: null,
                    p25519: null
                };
                function x(t, e) {
                    this.name = t,
                    this.p = new o(e,16),
                    this.n = this.p.bitLength(),
                    this.k = new o(1).iushln(this.n).isub(this.p),
                    this.tmp = this._tmp()
                }
                function S() {
                    x.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f")
                }
                function k() {
                    x.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001")
                }
                function E() {
                    x.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff")
                }
                function A() {
                    x.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed")
                }
                function I(t) {
                    if ("string" == typeof t) {
                        var e = o._prime(t);
                        this.m = e.p,
                        this.prime = e
                    } else
                        r(t.gtn(1), "modulus must be greater than 1"),
                        this.m = t,
                        this.prime = null
                }
                function M(t) {
                    I.call(this, t),
                    this.shift = this.m.bitLength(),
                    this.shift % 26 != 0 && (this.shift += 26 - this.shift % 26),
                    this.r = new o(1).iushln(this.shift),
                    this.r2 = this.imod(this.r.sqr()),
                    this.rinv = this.r._invmp(this.m),
                    this.minv = this.rinv.mul(this.r).isubn(1).div(this.m),
                    this.minv = this.minv.umod(this.r),
                    this.minv = this.r.sub(this.minv)
                }
                x.prototype._tmp = function() {
                    var t = new o(null);
                    return t.words = new Array(Math.ceil(this.n / 13)),
                    t
                }
                ,
                x.prototype.ireduce = function(t) {
                    var e, n = t;
                    do {
                        this.split(n, this.tmp),
                        e = (n = (n = this.imulK(n)).iadd(this.tmp)).bitLength()
                    } while (e > this.n);
                    var r = e < this.n ? -1 : n.ucmp(this.p);
                    return 0 === r ? (n.words[0] = 0,
                    n.length = 1) : r > 0 ? n.isub(this.p) : void 0 !== n.strip ? n.strip() : n._strip(),
                    n
                }
                ,
                x.prototype.split = function(t, e) {
                    t.iushrn(this.n, 0, e)
                }
                ,
                x.prototype.imulK = function(t) {
                    return t.imul(this.k)
                }
                ,
                i(S, x),
                S.prototype.split = function(t, e) {
                    for (var n = 4194303, r = Math.min(t.length, 9), i = 0; i < r; i++)
                        e.words[i] = t.words[i];
                    if (e.length = r,
                    t.length <= 9)
                        return t.words[0] = 0,
                        void (t.length = 1);
                    var o = t.words[9];
                    for (e.words[e.length++] = o & n,
                    i = 10; i < t.length; i++) {
                        var s = 0 | t.words[i];
                        t.words[i - 10] = (s & n) << 4 | o >>> 22,
                        o = s
                    }
                    o >>>= 22,
                    t.words[i - 10] = o,
                    0 === o && t.length > 10 ? t.length -= 10 : t.length -= 9
                }
                ,
                S.prototype.imulK = function(t) {
                    t.words[t.length] = 0,
                    t.words[t.length + 1] = 0,
                    t.length += 2;
                    for (var e = 0, n = 0; n < t.length; n++) {
                        var r = 0 | t.words[n];
                        e += 977 * r,
                        t.words[n] = 67108863 & e,
                        e = 64 * r + (e / 67108864 | 0)
                    }
                    return 0 === t.words[t.length - 1] && (t.length--,
                    0 === t.words[t.length - 1] && t.length--),
                    t
                }
                ,
                i(k, x),
                i(E, x),
                i(A, x),
                A.prototype.imulK = function(t) {
                    for (var e = 0, n = 0; n < t.length; n++) {
                        var r = 19 * (0 | t.words[n]) + e
                          , i = 67108863 & r;
                        r >>>= 26,
                        t.words[n] = i,
                        e = r
                    }
                    return 0 !== e && (t.words[t.length++] = e),
                    t
                }
                ,
                o._prime = function(t) {
                    if (v[t])
                        return v[t];
                    var e;
                    if ("k256" === t)
                        e = new S;
                    else if ("p224" === t)
                        e = new k;
                    else if ("p192" === t)
                        e = new E;
                    else {
                        if ("p25519" !== t)
                            throw new Error("Unknown prime " + t);
                        e = new A
                    }
                    return v[t] = e,
                    e
                }
                ,
                I.prototype._verify1 = function(t) {
                    r(0 === t.negative, "red works only with positives"),
                    r(t.red, "red works only with red numbers")
                }
                ,
                I.prototype._verify2 = function(t, e) {
                    r(!(t.negative | e.negative), "red works only with positives"),
                    r(t.red && t.red === e.red, "red works only with red numbers")
                }
                ,
                I.prototype.imod = function(t) {
                    return this.prime ? this.prime.ireduce(t)._forceRed(this) : (l(t, t.umod(this.m)._forceRed(this)),
                    t)
                }
                ,
                I.prototype.neg = function(t) {
                    return t.isZero() ? t.clone() : this.m.sub(t)._forceRed(this)
                }
                ,
                I.prototype.add = function(t, e) {
                    this._verify2(t, e);
                    var n = t.add(e);
                    return n.cmp(this.m) >= 0 && n.isub(this.m),
                    n._forceRed(this)
                }
                ,
                I.prototype.iadd = function(t, e) {
                    this._verify2(t, e);
                    var n = t.iadd(e);
                    return n.cmp(this.m) >= 0 && n.isub(this.m),
                    n
                }
                ,
                I.prototype.sub = function(t, e) {
                    this._verify2(t, e);
                    var n = t.sub(e);
                    return n.cmpn(0) < 0 && n.iadd(this.m),
                    n._forceRed(this)
                }
                ,
                I.prototype.isub = function(t, e) {
                    this._verify2(t, e);
                    var n = t.isub(e);
                    return n.cmpn(0) < 0 && n.iadd(this.m),
                    n
                }
                ,
                I.prototype.shl = function(t, e) {
                    return this._verify1(t),
                    this.imod(t.ushln(e))
                }
                ,
                I.prototype.imul = function(t, e) {
                    return this._verify2(t, e),
                    this.imod(t.imul(e))
                }
                ,
                I.prototype.mul = function(t, e) {
                    return this._verify2(t, e),
                    this.imod(t.mul(e))
                }
                ,
                I.prototype.isqr = function(t) {
                    return this.imul(t, t.clone())
                }
                ,
                I.prototype.sqr = function(t) {
                    return this.mul(t, t)
                }
                ,
                I.prototype.sqrt = function(t) {
                    if (t.isZero())
                        return t.clone();
                    var e = this.m.andln(3);
                    if (r(e % 2 == 1),
                    3 === e) {
                        var n = this.m.add(new o(1)).iushrn(2);
                        return this.pow(t, n)
                    }
                    for (var i = this.m.subn(1), s = 0; !i.isZero() && 0 === i.andln(1); )
                        s++,
                        i.iushrn(1);
                    r(!i.isZero());
                    var a = new o(1).toRed(this)
                      , u = a.redNeg()
                      , c = this.m.subn(1).iushrn(1)
                      , l = this.m.bitLength();
                    for (l = new o(2 * l * l).toRed(this); 0 !== this.pow(l, c).cmp(u); )
                        l.redIAdd(u);
                    for (var f = this.pow(l, i), h = this.pow(t, i.addn(1).iushrn(1)), d = this.pow(t, i), p = s; 0 !== d.cmp(a); ) {
                        for (var y = d, g = 0; 0 !== y.cmp(a); g++)
                            y = y.redSqr();
                        r(g < p);
                        var m = this.pow(f, new o(1).iushln(p - g - 1));
                        h = h.redMul(m),
                        f = m.redSqr(),
                        d = d.redMul(f),
                        p = g
                    }
                    return h
                }
                ,
                I.prototype.invm = function(t) {
                    var e = t._invmp(this.m);
                    return 0 !== e.negative ? (e.negative = 0,
                    this.imod(e).redNeg()) : this.imod(e)
                }
                ,
                I.prototype.pow = function(t, e) {
                    if (e.isZero())
                        return new o(1).toRed(this);
                    if (0 === e.cmpn(1))
                        return t.clone();
                    var n = new Array(16);
                    n[0] = new o(1).toRed(this),
                    n[1] = t;
                    for (var r = 2; r < n.length; r++)
                        n[r] = this.mul(n[r - 1], t);
                    var i = n[0]
                      , s = 0
                      , a = 0
                      , u = e.bitLength() % 26;
                    for (0 === u && (u = 26),
                    r = e.length - 1; r >= 0; r--) {
                        for (var c = e.words[r], l = u - 1; l >= 0; l--) {
                            var f = c >> l & 1;
                            i !== n[0] && (i = this.sqr(i)),
                            0 !== f || 0 !== s ? (s <<= 1,
                            s |= f,
                            (4 == ++a || 0 === r && 0 === l) && (i = this.mul(i, n[s]),
                            a = 0,
                            s = 0)) : a = 0
                        }
                        u = 26
                    }
                    return i
                }
                ,
                I.prototype.convertTo = function(t) {
                    var e = t.umod(this.m);
                    return e === t ? e.clone() : e
                }
                ,
                I.prototype.convertFrom = function(t) {
                    var e = t.clone();
                    return e.red = null,
                    e
                }
                ,
                o.mont = function(t) {
                    return new M(t)
                }
                ,
                i(M, I),
                M.prototype.convertTo = function(t) {
                    return this.imod(t.ushln(this.shift))
                }
                ,
                M.prototype.convertFrom = function(t) {
                    var e = this.imod(t.mul(this.rinv));
                    return e.red = null,
                    e
                }
                ,
                M.prototype.imul = function(t, e) {
                    if (t.isZero() || e.isZero())
                        return t.words[0] = 0,
                        t.length = 1,
                        t;
                    var n = t.imul(e)
                      , r = n.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m)
                      , i = n.isub(r).iushrn(this.shift)
                      , o = i;
                    return i.cmp(this.m) >= 0 ? o = i.isub(this.m) : i.cmpn(0) < 0 && (o = i.iadd(this.m)),
                    o._forceRed(this)
                }
                ,
                M.prototype.mul = function(t, e) {
                    if (t.isZero() || e.isZero())
                        return new o(0)._forceRed(this);
                    var n = t.mul(e)
                      , r = n.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m)
                      , i = n.isub(r).iushrn(this.shift)
                      , s = i;
                    return i.cmp(this.m) >= 0 ? s = i.isub(this.m) : i.cmpn(0) < 0 && (s = i.iadd(this.m)),
                    s._forceRed(this)
                }
                ,
                M.prototype.invm = function(t) {
                    return this.imod(t._invmp(this.m).mul(this.r2))._forceRed(this)
                }
            }(t = n.nmd(t), this)
        },
        "../../../node_modules/borsh/lib/index.js": function(t, e, n) {
            "use strict";
            var r = n("../../../node_modules/buffer/index.js").Buffer
              , i = this && this.__createBinding || (Object.create ? function(t, e, n, r) {
                void 0 === r && (r = n),
                Object.defineProperty(t, r, {
                    enumerable: !0,
                    get: function() {
                        return e[n]
                    }
                })
            }
            : function(t, e, n, r) {
                void 0 === r && (r = n),
                t[r] = e[n]
            }
            )
              , o = this && this.__setModuleDefault || (Object.create ? function(t, e) {
                Object.defineProperty(t, "default", {
                    enumerable: !0,
                    value: e
                })
            }
            : function(t, e) {
                t.default = e
            }
            )
              , s = this && this.__decorate || function(t, e, n, r) {
                var i, o = arguments.length, s = o < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, n) : r;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    s = Reflect.decorate(t, e, n, r);
                else
                    for (var a = t.length - 1; a >= 0; a--)
                        (i = t[a]) && (s = (o < 3 ? i(s) : o > 3 ? i(e, n, s) : i(e, n)) || s);
                return o > 3 && s && Object.defineProperty(e, n, s),
                s
            }
              , a = this && this.__importStar || function(t) {
                if (t && t.__esModule)
                    return t;
                var e = {};
                if (null != t)
                    for (var n in t)
                        "default" !== n && Object.hasOwnProperty.call(t, n) && i(e, t, n);
                return o(e, t),
                e
            }
              , u = this && this.__importDefault || function(t) {
                return t && t.__esModule ? t : {
                    default: t
                }
            }
            ;
            Object.defineProperty(e, "__esModule", {
                value: !0
            }),
            e.deserializeUnchecked = e.deserialize = e.serialize = e.BinaryReader = e.BinaryWriter = e.BorshError = e.baseDecode = e.baseEncode = void 0;
            const c = u(n("../../../node_modules/bn.js/lib/bn.js"))
              , l = u(n("../../../node_modules/bs58/index.js"))
              , f = a(n("../../../node_modules/text-encoding-utf-8/lib/encoding.lib.js"))
              , h = new ("function" != typeof TextDecoder ? f.TextDecoder : TextDecoder)("utf-8",{
                fatal: !0
            });
            e.baseEncode = function(t) {
                return "string" == typeof t && (t = r.from(t, "utf8")),
                l.default.encode(r.from(t))
            }
            ,
            e.baseDecode = function(t) {
                return r.from(l.default.decode(t))
            }
            ;
            const d = 1024;
            class p extends Error {
                constructor(t) {
                    super(t),
                    this.fieldPath = [],
                    this.originalMessage = t
                }
                addToFieldPath(t) {
                    this.fieldPath.splice(0, 0, t),
                    this.message = this.originalMessage + ": " + this.fieldPath.join(".")
                }
            }
            e.BorshError = p;
            class y {
                constructor() {
                    this.buf = r.alloc(d),
                    this.length = 0
                }
                maybeResize() {
                    this.buf.length < 16 + this.length && (this.buf = r.concat([this.buf, r.alloc(d)]))
                }
                writeU8(t) {
                    this.maybeResize(),
                    this.buf.writeUInt8(t, this.length),
                    this.length += 1
                }
                writeU16(t) {
                    this.maybeResize(),
                    this.buf.writeUInt16LE(t, this.length),
                    this.length += 2
                }
                writeU32(t) {
                    this.maybeResize(),
                    this.buf.writeUInt32LE(t, this.length),
                    this.length += 4
                }
                writeU64(t) {
                    this.maybeResize(),
                    this.writeBuffer(r.from(new c.default(t).toArray("le", 8)))
                }
                writeU128(t) {
                    this.maybeResize(),
                    this.writeBuffer(r.from(new c.default(t).toArray("le", 16)))
                }
                writeU256(t) {
                    this.maybeResize(),
                    this.writeBuffer(r.from(new c.default(t).toArray("le", 32)))
                }
                writeU512(t) {
                    this.maybeResize(),
                    this.writeBuffer(r.from(new c.default(t).toArray("le", 64)))
                }
                writeBuffer(t) {
                    this.buf = r.concat([r.from(this.buf.subarray(0, this.length)), t, r.alloc(d)]),
                    this.length += t.length
                }
                writeString(t) {
                    this.maybeResize();
                    const e = r.from(t, "utf8");
                    this.writeU32(e.length),
                    this.writeBuffer(e)
                }
                writeFixedArray(t) {
                    this.writeBuffer(r.from(t))
                }
                writeArray(t, e) {
                    this.maybeResize(),
                    this.writeU32(t.length);
                    for (const n of t)
                        this.maybeResize(),
                        e(n)
                }
                toArray() {
                    return this.buf.subarray(0, this.length)
                }
            }
            function g(t, e, n) {
                const r = n.value;
                n.value = function(...t) {
                    try {
                        return r.apply(this, t)
                    } catch (t) {
                        if (t instanceof RangeError) {
                            const e = t.code;
                            if (["ERR_BUFFER_OUT_OF_BOUNDS", "ERR_OUT_OF_RANGE"].indexOf(e) >= 0)
                                throw new p("Reached the end of buffer when deserializing")
                        }
                        throw t
                    }
                }
            }
            e.BinaryWriter = y;
            class m {
                constructor(t) {
                    this.buf = t,
                    this.offset = 0
                }
                readU8() {
                    const t = this.buf.readUInt8(this.offset);
                    return this.offset += 1,
                    t
                }
                readU16() {
                    const t = this.buf.readUInt16LE(this.offset);
                    return this.offset += 2,
                    t
                }
                readU32() {
                    const t = this.buf.readUInt32LE(this.offset);
                    return this.offset += 4,
                    t
                }
                readU64() {
                    const t = this.readBuffer(8);
                    return new c.default(t,"le")
                }
                readU128() {
                    const t = this.readBuffer(16);
                    return new c.default(t,"le")
                }
                readU256() {
                    const t = this.readBuffer(32);
                    return new c.default(t,"le")
                }
                readU512() {
                    const t = this.readBuffer(64);
                    return new c.default(t,"le")
                }
                readBuffer(t) {
                    if (this.offset + t > this.buf.length)
                        throw new p(`Expected buffer length ${t} isn't within bounds`);
                    const e = this.buf.slice(this.offset, this.offset + t);
                    return this.offset += t,
                    e
                }
                readString() {
                    const t = this.readU32()
                      , e = this.readBuffer(t);
                    try {
                        return h.decode(e)
                    } catch (t) {
                        throw new p(`Error decoding UTF-8 string: ${t}`)
                    }
                }
                readFixedArray(t) {
                    return new Uint8Array(this.readBuffer(t))
                }
                readArray(t) {
                    const e = this.readU32()
                      , n = Array();
                    for (let r = 0; r < e; ++r)
                        n.push(t());
                    return n
                }
            }
            function b(t) {
                return t.charAt(0).toUpperCase() + t.slice(1)
            }
            function w(t, e, n, r, i) {
                try {
                    if ("string" == typeof r)
                        i[`write${b(r)}`](n);
                    else if (r instanceof Array)
                        if ("number" == typeof r[0]) {
                            if (n.length !== r[0])
                                throw new p(`Expecting byte array of length ${r[0]}, but got ${n.length} bytes`);
                            i.writeFixedArray(n)
                        } else if (2 === r.length && "number" == typeof r[1]) {
                            if (n.length !== r[1])
                                throw new p(`Expecting byte array of length ${r[1]}, but got ${n.length} bytes`);
                            for (let e = 0; e < r[1]; e++)
                                w(t, null, n[e], r[0], i)
                        } else
                            i.writeArray(n, (n => {
                                w(t, e, n, r[0], i)
                            }
                            ));
                    else if (void 0 !== r.kind)
                        switch (r.kind) {
                        case "option":
                            null == n ? i.writeU8(0) : (i.writeU8(1),
                            w(t, e, n, r.type, i));
                            break;
                        case "map":
                            i.writeU32(n.size),
                            n.forEach(( (n, o) => {
                                w(t, e, o, r.key, i),
                                w(t, e, n, r.value, i)
                            }
                            ));
                            break;
                        default:
                            throw new p(`FieldType ${r} unrecognized`)
                        }
                    else
                        v(t, n, i)
                } catch (t) {
                    throw t instanceof p && t.addToFieldPath(e),
                    t
                }
            }
            function v(t, e, n) {
                if ("function" == typeof e.borshSerialize)
                    return void e.borshSerialize(n);
                const r = t.get(e.constructor);
                if (!r)
                    throw new p(`Class ${e.constructor.name} is missing in schema`);
                if ("struct" === r.kind)
                    r.fields.map(( ([r,i]) => {
                        w(t, r, e[r], i, n)
                    }
                    ));
                else {
                    if ("enum" !== r.kind)
                        throw new p(`Unexpected schema kind: ${r.kind} for ${e.constructor.name}`);
                    {
                        const i = e[r.field];
                        for (let o = 0; o < r.values.length; ++o) {
                            const [s,a] = r.values[o];
                            if (s === i) {
                                n.writeU8(o),
                                w(t, s, e[s], a, n);
                                break
                            }
                        }
                    }
                }
            }
            function x(t, e, n, r) {
                try {
                    if ("string" == typeof n)
                        return r[`read${b(n)}`]();
                    if (n instanceof Array) {
                        if ("number" == typeof n[0])
                            return r.readFixedArray(n[0]);
                        if ("number" == typeof n[1]) {
                            const e = [];
                            for (let i = 0; i < n[1]; i++)
                                e.push(x(t, null, n[0], r));
                            return e
                        }
                        return r.readArray(( () => x(t, e, n[0], r)))
                    }
                    if ("option" === n.kind)
                        return r.readU8() ? x(t, e, n.type, r) : void 0;
                    if ("map" === n.kind) {
                        let i = new Map;
                        const o = r.readU32();
                        for (let s = 0; s < o; s++) {
                            const o = x(t, e, n.key, r)
                              , s = x(t, e, n.value, r);
                            i.set(o, s)
                        }
                        return i
                    }
                    return S(t, n, r)
                } catch (t) {
                    throw t instanceof p && t.addToFieldPath(e),
                    t
                }
            }
            function S(t, e, n) {
                if ("function" == typeof e.borshDeserialize)
                    return e.borshDeserialize(n);
                const r = t.get(e);
                if (!r)
                    throw new p(`Class ${e.name} is missing in schema`);
                if ("struct" === r.kind) {
                    const r = {};
                    for (const [i,o] of t.get(e).fields)
                        r[i] = x(t, i, o, n);
                    return new e(r)
                }
                if ("enum" === r.kind) {
                    const i = n.readU8();
                    if (i >= r.values.length)
                        throw new p(`Enum index: ${i} is out of range`);
                    const [o,s] = r.values[i]
                      , a = x(t, o, s, n);
                    return new e({
                        [o]: a
                    })
                }
                throw new p(`Unexpected schema kind: ${r.kind} for ${e.constructor.name}`)
            }
            s([g], m.prototype, "readU8", null),
            s([g], m.prototype, "readU16", null),
            s([g], m.prototype, "readU32", null),
            s([g], m.prototype, "readU64", null),
            s([g], m.prototype, "readU128", null),
            s([g], m.prototype, "readU256", null),
            s([g], m.prototype, "readU512", null),
            s([g], m.prototype, "readString", null),
            s([g], m.prototype, "readFixedArray", null),
            s([g], m.prototype, "readArray", null),
            e.BinaryReader = m,
            e.serialize = function(t, e, n=y) {
                const r = new n;
                return v(t, e, r),
                r.toArray()
            }
            ,
            e.deserialize = function(t, e, n, r=m) {
                const i = new r(n)
                  , o = S(t, e, i);
                if (i.offset < n.length)
                    throw new p(`Unexpected ${n.length - i.offset} bytes after deserialized data`);
                return o
            }
            ,
            e.deserializeUnchecked = function(t, e, n, r=m) {
                return S(t, e, new r(n))
            }
        },
        "../../../node_modules/bs58/index.js": (t, e, n) => {
            var r = n("../../../node_modules/bs58/node_modules/base-x/src/index.js");
            t.exports = r("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
        }
        ,
        "../../../node_modules/bs58/node_modules/base-x/src/index.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/safe-buffer/index.js").Buffer;
            t.exports = function(t) {
                if (t.length >= 255)
                    throw new TypeError("Alphabet too long");
                for (var e = new Uint8Array(256), n = 0; n < e.length; n++)
                    e[n] = 255;
                for (var i = 0; i < t.length; i++) {
                    var o = t.charAt(i)
                      , s = o.charCodeAt(0);
                    if (255 !== e[s])
                        throw new TypeError(o + " is ambiguous");
                    e[s] = i
                }
                var a = t.length
                  , u = t.charAt(0)
                  , c = Math.log(a) / Math.log(256)
                  , l = Math.log(256) / Math.log(a);
                function f(t) {
                    if ("string" != typeof t)
                        throw new TypeError("Expected String");
                    if (0 === t.length)
                        return r.alloc(0);
                    for (var n = 0, i = 0, o = 0; t[n] === u; )
                        i++,
                        n++;
                    for (var s = (t.length - n) * c + 1 >>> 0, l = new Uint8Array(s); n < t.length; ) {
                        var f = t.charCodeAt(n);
                        if (f > 255)
                            return;
                        var h = e[f];
                        if (255 === h)
                            return;
                        for (var d = 0, p = s - 1; (0 !== h || d < o) && -1 !== p; p--,
                        d++)
                            h += a * l[p] >>> 0,
                            l[p] = h % 256 >>> 0,
                            h = h / 256 >>> 0;
                        if (0 !== h)
                            throw new Error("Non-zero carry");
                        o = d,
                        n++
                    }
                    for (var y = s - o; y !== s && 0 === l[y]; )
                        y++;
                    var g = r.allocUnsafe(i + (s - y));
                    g.fill(0, 0, i);
                    for (var m = i; y !== s; )
                        g[m++] = l[y++];
                    return g
                }
                return {
                    encode: function(e) {
                        if ((Array.isArray(e) || e instanceof Uint8Array) && (e = r.from(e)),
                        !r.isBuffer(e))
                            throw new TypeError("Expected Buffer");
                        if (0 === e.length)
                            return "";
                        for (var n = 0, i = 0, o = 0, s = e.length; o !== s && 0 === e[o]; )
                            o++,
                            n++;
                        for (var c = (s - o) * l + 1 >>> 0, f = new Uint8Array(c); o !== s; ) {
                            for (var h = e[o], d = 0, p = c - 1; (0 !== h || d < i) && -1 !== p; p--,
                            d++)
                                h += 256 * f[p] >>> 0,
                                f[p] = h % a >>> 0,
                                h = h / a >>> 0;
                            if (0 !== h)
                                throw new Error("Non-zero carry");
                            i = d,
                            o++
                        }
                        for (var y = c - i; y !== c && 0 === f[y]; )
                            y++;
                        for (var g = u.repeat(n); y < c; ++y)
                            g += t.charAt(f[y]);
                        return g
                    },
                    decodeUnsafe: f,
                    decode: function(t) {
                        var e = f(t);
                        if (e)
                            return e;
                        throw new Error("Non-base" + a + " character")
                    }
                }
            }
        }
        ,
        "../../../node_modules/buffer/index.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/console-browserify/index.js");
            const i = n("../../../node_modules/base64-js/index.js")
              , o = n("../../../node_modules/ieee754/index.js")
              , s = "function" == typeof Symbol && "function" == typeof Symbol.for ? Symbol.for("nodejs.util.inspect.custom") : null;
            e.Buffer = c,
            e.SlowBuffer = function(t) {
                return +t != t && (t = 0),
                c.alloc(+t)
            }
            ,
            e.INSPECT_MAX_BYTES = 50;
            const a = 2147483647;
            function u(t) {
                if (t > a)
                    throw new RangeError('The value "' + t + '" is invalid for option "size"');
                const e = new Uint8Array(t);
                return Object.setPrototypeOf(e, c.prototype),
                e
            }
            function c(t, e, n) {
                if ("number" == typeof t) {
                    if ("string" == typeof e)
                        throw new TypeError('The "string" argument must be of type string. Received type number');
                    return h(t)
                }
                return l(t, e, n)
            }
            function l(t, e, n) {
                if ("string" == typeof t)
                    return function(t, e) {
                        if ("string" == typeof e && "" !== e || (e = "utf8"),
                        !c.isEncoding(e))
                            throw new TypeError("Unknown encoding: " + e);
                        const n = 0 | g(t, e);
                        let r = u(n);
                        const i = r.write(t, e);
                        return i !== n && (r = r.slice(0, i)),
                        r
                    }(t, e);
                if (ArrayBuffer.isView(t))
                    return function(t) {
                        if (Z(t, Uint8Array)) {
                            const e = new Uint8Array(t);
                            return p(e.buffer, e.byteOffset, e.byteLength)
                        }
                        return d(t)
                    }(t);
                if (null == t)
                    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t);
                if (Z(t, ArrayBuffer) || t && Z(t.buffer, ArrayBuffer))
                    return p(t, e, n);
                if ("undefined" != typeof SharedArrayBuffer && (Z(t, SharedArrayBuffer) || t && Z(t.buffer, SharedArrayBuffer)))
                    return p(t, e, n);
                if ("number" == typeof t)
                    throw new TypeError('The "value" argument must not be of type number. Received type number');
                const r = t.valueOf && t.valueOf();
                if (null != r && r !== t)
                    return c.from(r, e, n);
                const i = function(t) {
                    if (c.isBuffer(t)) {
                        const e = 0 | y(t.length)
                          , n = u(e);
                        return 0 === n.length || t.copy(n, 0, 0, e),
                        n
                    }
                    return void 0 !== t.length ? "number" != typeof t.length || Y(t.length) ? u(0) : d(t) : "Buffer" === t.type && Array.isArray(t.data) ? d(t.data) : void 0
                }(t);
                if (i)
                    return i;
                if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof t[Symbol.toPrimitive])
                    return c.from(t[Symbol.toPrimitive]("string"), e, n);
                throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t)
            }
            function f(t) {
                if ("number" != typeof t)
                    throw new TypeError('"size" argument must be of type number');
                if (t < 0)
                    throw new RangeError('The value "' + t + '" is invalid for option "size"')
            }
            function h(t) {
                return f(t),
                u(t < 0 ? 0 : 0 | y(t))
            }
            function d(t) {
                const e = t.length < 0 ? 0 : 0 | y(t.length)
                  , n = u(e);
                for (let r = 0; r < e; r += 1)
                    n[r] = 255 & t[r];
                return n
            }
            function p(t, e, n) {
                if (e < 0 || t.byteLength < e)
                    throw new RangeError('"offset" is outside of buffer bounds');
                if (t.byteLength < e + (n || 0))
                    throw new RangeError('"length" is outside of buffer bounds');
                let r;
                return r = void 0 === e && void 0 === n ? new Uint8Array(t) : void 0 === n ? new Uint8Array(t,e) : new Uint8Array(t,e,n),
                Object.setPrototypeOf(r, c.prototype),
                r
            }
            function y(t) {
                if (t >= a)
                    throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + a.toString(16) + " bytes");
                return 0 | t
            }
            function g(t, e) {
                if (c.isBuffer(t))
                    return t.length;
                if (ArrayBuffer.isView(t) || Z(t, ArrayBuffer))
                    return t.byteLength;
                if ("string" != typeof t)
                    throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof t);
                const n = t.length
                  , r = arguments.length > 2 && !0 === arguments[2];
                if (!r && 0 === n)
                    return 0;
                let i = !1;
                for (; ; )
                    switch (e) {
                    case "ascii":
                    case "latin1":
                    case "binary":
                        return n;
                    case "utf8":
                    case "utf-8":
                        return V(t).length;
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return 2 * n;
                    case "hex":
                        return n >>> 1;
                    case "base64":
                        return J(t).length;
                    default:
                        if (i)
                            return r ? -1 : V(t).length;
                        e = ("" + e).toLowerCase(),
                        i = !0
                    }
            }
            function m(t, e, n) {
                let r = !1;
                if ((void 0 === e || e < 0) && (e = 0),
                e > this.length)
                    return "";
                if ((void 0 === n || n > this.length) && (n = this.length),
                n <= 0)
                    return "";
                if ((n >>>= 0) <= (e >>>= 0))
                    return "";
                for (t || (t = "utf8"); ; )
                    switch (t) {
                    case "hex":
                        return O(this, e, n);
                    case "utf8":
                    case "utf-8":
                        return M(this, e, n);
                    case "ascii":
                        return B(this, e, n);
                    case "latin1":
                    case "binary":
                        return j(this, e, n);
                    case "base64":
                        return I(this, e, n);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return P(this, e, n);
                    default:
                        if (r)
                            throw new TypeError("Unknown encoding: " + t);
                        t = (t + "").toLowerCase(),
                        r = !0
                    }
            }
            function b(t, e, n) {
                const r = t[e];
                t[e] = t[n],
                t[n] = r
            }
            function w(t, e, n, r, i) {
                if (0 === t.length)
                    return -1;
                if ("string" == typeof n ? (r = n,
                n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648),
                Y(n = +n) && (n = i ? 0 : t.length - 1),
                n < 0 && (n = t.length + n),
                n >= t.length) {
                    if (i)
                        return -1;
                    n = t.length - 1
                } else if (n < 0) {
                    if (!i)
                        return -1;
                    n = 0
                }
                if ("string" == typeof e && (e = c.from(e, r)),
                c.isBuffer(e))
                    return 0 === e.length ? -1 : v(t, e, n, r, i);
                if ("number" == typeof e)
                    return e &= 255,
                    "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(t, e, n) : Uint8Array.prototype.lastIndexOf.call(t, e, n) : v(t, [e], n, r, i);
                throw new TypeError("val must be string, number or Buffer")
            }
            function v(t, e, n, r, i) {
                let o, s = 1, a = t.length, u = e.length;
                if (void 0 !== r && ("ucs2" === (r = String(r).toLowerCase()) || "ucs-2" === r || "utf16le" === r || "utf-16le" === r)) {
                    if (t.length < 2 || e.length < 2)
                        return -1;
                    s = 2,
                    a /= 2,
                    u /= 2,
                    n /= 2
                }
                function c(t, e) {
                    return 1 === s ? t[e] : t.readUInt16BE(e * s)
                }
                if (i) {
                    let r = -1;
                    for (o = n; o < a; o++)
                        if (c(t, o) === c(e, -1 === r ? 0 : o - r)) {
                            if (-1 === r && (r = o),
                            o - r + 1 === u)
                                return r * s
                        } else
                            -1 !== r && (o -= o - r),
                            r = -1
                } else
                    for (n + u > a && (n = a - u),
                    o = n; o >= 0; o--) {
                        let n = !0;
                        for (let r = 0; r < u; r++)
                            if (c(t, o + r) !== c(e, r)) {
                                n = !1;
                                break
                            }
                        if (n)
                            return o
                    }
                return -1
            }
            function x(t, e, n, r) {
                n = Number(n) || 0;
                const i = t.length - n;
                r ? (r = Number(r)) > i && (r = i) : r = i;
                const o = e.length;
                let s;
                for (r > o / 2 && (r = o / 2),
                s = 0; s < r; ++s) {
                    const r = parseInt(e.substr(2 * s, 2), 16);
                    if (Y(r))
                        return s;
                    t[n + s] = r
                }
                return s
            }
            function S(t, e, n, r) {
                return G(V(e, t.length - n), t, n, r)
            }
            function k(t, e, n, r) {
                return G(function(t) {
                    const e = [];
                    for (let n = 0; n < t.length; ++n)
                        e.push(255 & t.charCodeAt(n));
                    return e
                }(e), t, n, r)
            }
            function E(t, e, n, r) {
                return G(J(e), t, n, r)
            }
            function A(t, e, n, r) {
                return G(function(t, e) {
                    let n, r, i;
                    const o = [];
                    for (let s = 0; s < t.length && !((e -= 2) < 0); ++s)
                        n = t.charCodeAt(s),
                        r = n >> 8,
                        i = n % 256,
                        o.push(i),
                        o.push(r);
                    return o
                }(e, t.length - n), t, n, r)
            }
            function I(t, e, n) {
                return 0 === e && n === t.length ? i.fromByteArray(t) : i.fromByteArray(t.slice(e, n))
            }
            function M(t, e, n) {
                n = Math.min(t.length, n);
                const r = [];
                let i = e;
                for (; i < n; ) {
                    const e = t[i];
                    let o = null
                      , s = e > 239 ? 4 : e > 223 ? 3 : e > 191 ? 2 : 1;
                    if (i + s <= n) {
                        let n, r, a, u;
                        switch (s) {
                        case 1:
                            e < 128 && (o = e);
                            break;
                        case 2:
                            n = t[i + 1],
                            128 == (192 & n) && (u = (31 & e) << 6 | 63 & n,
                            u > 127 && (o = u));
                            break;
                        case 3:
                            n = t[i + 1],
                            r = t[i + 2],
                            128 == (192 & n) && 128 == (192 & r) && (u = (15 & e) << 12 | (63 & n) << 6 | 63 & r,
                            u > 2047 && (u < 55296 || u > 57343) && (o = u));
                            break;
                        case 4:
                            n = t[i + 1],
                            r = t[i + 2],
                            a = t[i + 3],
                            128 == (192 & n) && 128 == (192 & r) && 128 == (192 & a) && (u = (15 & e) << 18 | (63 & n) << 12 | (63 & r) << 6 | 63 & a,
                            u > 65535 && u < 1114112 && (o = u))
                        }
                    }
                    null === o ? (o = 65533,
                    s = 1) : o > 65535 && (o -= 65536,
                    r.push(o >>> 10 & 1023 | 55296),
                    o = 56320 | 1023 & o),
                    r.push(o),
                    i += s
                }
                return function(t) {
                    const e = t.length;
                    if (e <= _)
                        return String.fromCharCode.apply(String, t);
                    let n = ""
                      , r = 0;
                    for (; r < e; )
                        n += String.fromCharCode.apply(String, t.slice(r, r += _));
                    return n
                }(r)
            }
            e.kMaxLength = a,
            c.TYPED_ARRAY_SUPPORT = function() {
                try {
                    const t = new Uint8Array(1)
                      , e = {
                        foo: function() {
                            return 42
                        }
                    };
                    return Object.setPrototypeOf(e, Uint8Array.prototype),
                    Object.setPrototypeOf(t, e),
                    42 === t.foo()
                } catch (t) {
                    return !1
                }
            }(),
            c.TYPED_ARRAY_SUPPORT || void 0 === r || "function" != typeof r.error || r.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),
            Object.defineProperty(c.prototype, "parent", {
                enumerable: !0,
                get: function() {
                    if (c.isBuffer(this))
                        return this.buffer
                }
            }),
            Object.defineProperty(c.prototype, "offset", {
                enumerable: !0,
                get: function() {
                    if (c.isBuffer(this))
                        return this.byteOffset
                }
            }),
            c.poolSize = 8192,
            c.from = function(t, e, n) {
                return l(t, e, n)
            }
            ,
            Object.setPrototypeOf(c.prototype, Uint8Array.prototype),
            Object.setPrototypeOf(c, Uint8Array),
            c.alloc = function(t, e, n) {
                return function(t, e, n) {
                    return f(t),
                    t <= 0 ? u(t) : void 0 !== e ? "string" == typeof n ? u(t).fill(e, n) : u(t).fill(e) : u(t)
                }(t, e, n)
            }
            ,
            c.allocUnsafe = function(t) {
                return h(t)
            }
            ,
            c.allocUnsafeSlow = function(t) {
                return h(t)
            }
            ,
            c.isBuffer = function(t) {
                return null != t && !0 === t._isBuffer && t !== c.prototype
            }
            ,
            c.compare = function(t, e) {
                if (Z(t, Uint8Array) && (t = c.from(t, t.offset, t.byteLength)),
                Z(e, Uint8Array) && (e = c.from(e, e.offset, e.byteLength)),
                !c.isBuffer(t) || !c.isBuffer(e))
                    throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                if (t === e)
                    return 0;
                let n = t.length
                  , r = e.length;
                for (let i = 0, o = Math.min(n, r); i < o; ++i)
                    if (t[i] !== e[i]) {
                        n = t[i],
                        r = e[i];
                        break
                    }
                return n < r ? -1 : r < n ? 1 : 0
            }
            ,
            c.isEncoding = function(t) {
                switch (String(t).toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "latin1":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return !0;
                default:
                    return !1
                }
            }
            ,
            c.concat = function(t, e) {
                if (!Array.isArray(t))
                    throw new TypeError('"list" argument must be an Array of Buffers');
                if (0 === t.length)
                    return c.alloc(0);
                let n;
                if (void 0 === e)
                    for (e = 0,
                    n = 0; n < t.length; ++n)
                        e += t[n].length;
                const r = c.allocUnsafe(e);
                let i = 0;
                for (n = 0; n < t.length; ++n) {
                    let e = t[n];
                    if (Z(e, Uint8Array))
                        i + e.length > r.length ? (c.isBuffer(e) || (e = c.from(e)),
                        e.copy(r, i)) : Uint8Array.prototype.set.call(r, e, i);
                    else {
                        if (!c.isBuffer(e))
                            throw new TypeError('"list" argument must be an Array of Buffers');
                        e.copy(r, i)
                    }
                    i += e.length
                }
                return r
            }
            ,
            c.byteLength = g,
            c.prototype._isBuffer = !0,
            c.prototype.swap16 = function() {
                const t = this.length;
                if (t % 2 != 0)
                    throw new RangeError("Buffer size must be a multiple of 16-bits");
                for (let e = 0; e < t; e += 2)
                    b(this, e, e + 1);
                return this
            }
            ,
            c.prototype.swap32 = function() {
                const t = this.length;
                if (t % 4 != 0)
                    throw new RangeError("Buffer size must be a multiple of 32-bits");
                for (let e = 0; e < t; e += 4)
                    b(this, e, e + 3),
                    b(this, e + 1, e + 2);
                return this
            }
            ,
            c.prototype.swap64 = function() {
                const t = this.length;
                if (t % 8 != 0)
                    throw new RangeError("Buffer size must be a multiple of 64-bits");
                for (let e = 0; e < t; e += 8)
                    b(this, e, e + 7),
                    b(this, e + 1, e + 6),
                    b(this, e + 2, e + 5),
                    b(this, e + 3, e + 4);
                return this
            }
            ,
            c.prototype.toString = function() {
                const t = this.length;
                return 0 === t ? "" : 0 === arguments.length ? M(this, 0, t) : m.apply(this, arguments)
            }
            ,
            c.prototype.toLocaleString = c.prototype.toString,
            c.prototype.equals = function(t) {
                if (!c.isBuffer(t))
                    throw new TypeError("Argument must be a Buffer");
                return this === t || 0 === c.compare(this, t)
            }
            ,
            c.prototype.inspect = function() {
                let t = "";
                const n = e.INSPECT_MAX_BYTES;
                return t = this.toString("hex", 0, n).replace(/(.{2})/g, "$1 ").trim(),
                this.length > n && (t += " ... "),
                "<Buffer " + t + ">"
            }
            ,
            s && (c.prototype[s] = c.prototype.inspect),
            c.prototype.compare = function(t, e, n, r, i) {
                if (Z(t, Uint8Array) && (t = c.from(t, t.offset, t.byteLength)),
                !c.isBuffer(t))
                    throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof t);
                if (void 0 === e && (e = 0),
                void 0 === n && (n = t ? t.length : 0),
                void 0 === r && (r = 0),
                void 0 === i && (i = this.length),
                e < 0 || n > t.length || r < 0 || i > this.length)
                    throw new RangeError("out of range index");
                if (r >= i && e >= n)
                    return 0;
                if (r >= i)
                    return -1;
                if (e >= n)
                    return 1;
                if (this === t)
                    return 0;
                let o = (i >>>= 0) - (r >>>= 0)
                  , s = (n >>>= 0) - (e >>>= 0);
                const a = Math.min(o, s)
                  , u = this.slice(r, i)
                  , l = t.slice(e, n);
                for (let t = 0; t < a; ++t)
                    if (u[t] !== l[t]) {
                        o = u[t],
                        s = l[t];
                        break
                    }
                return o < s ? -1 : s < o ? 1 : 0
            }
            ,
            c.prototype.includes = function(t, e, n) {
                return -1 !== this.indexOf(t, e, n)
            }
            ,
            c.prototype.indexOf = function(t, e, n) {
                return w(this, t, e, n, !0)
            }
            ,
            c.prototype.lastIndexOf = function(t, e, n) {
                return w(this, t, e, n, !1)
            }
            ,
            c.prototype.write = function(t, e, n, r) {
                if (void 0 === e)
                    r = "utf8",
                    n = this.length,
                    e = 0;
                else if (void 0 === n && "string" == typeof e)
                    r = e,
                    n = this.length,
                    e = 0;
                else {
                    if (!isFinite(e))
                        throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                    e >>>= 0,
                    isFinite(n) ? (n >>>= 0,
                    void 0 === r && (r = "utf8")) : (r = n,
                    n = void 0)
                }
                const i = this.length - e;
                if ((void 0 === n || n > i) && (n = i),
                t.length > 0 && (n < 0 || e < 0) || e > this.length)
                    throw new RangeError("Attempt to write outside buffer bounds");
                r || (r = "utf8");
                let o = !1;
                for (; ; )
                    switch (r) {
                    case "hex":
                        return x(this, t, e, n);
                    case "utf8":
                    case "utf-8":
                        return S(this, t, e, n);
                    case "ascii":
                    case "latin1":
                    case "binary":
                        return k(this, t, e, n);
                    case "base64":
                        return E(this, t, e, n);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return A(this, t, e, n);
                    default:
                        if (o)
                            throw new TypeError("Unknown encoding: " + r);
                        r = ("" + r).toLowerCase(),
                        o = !0
                    }
            }
            ,
            c.prototype.toJSON = function() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                }
            }
            ;
            const _ = 4096;
            function B(t, e, n) {
                let r = "";
                n = Math.min(t.length, n);
                for (let i = e; i < n; ++i)
                    r += String.fromCharCode(127 & t[i]);
                return r
            }
            function j(t, e, n) {
                let r = "";
                n = Math.min(t.length, n);
                for (let i = e; i < n; ++i)
                    r += String.fromCharCode(t[i]);
                return r
            }
            function O(t, e, n) {
                const r = t.length;
                (!e || e < 0) && (e = 0),
                (!n || n < 0 || n > r) && (n = r);
                let i = "";
                for (let r = e; r < n; ++r)
                    i += Q[t[r]];
                return i
            }
            function P(t, e, n) {
                const r = t.slice(e, n);
                let i = "";
                for (let t = 0; t < r.length - 1; t += 2)
                    i += String.fromCharCode(r[t] + 256 * r[t + 1]);
                return i
            }
            function T(t, e, n) {
                if (t % 1 != 0 || t < 0)
                    throw new RangeError("offset is not uint");
                if (t + e > n)
                    throw new RangeError("Trying to access beyond buffer length")
            }
            function L(t, e, n, r, i, o) {
                if (!c.isBuffer(t))
                    throw new TypeError('"buffer" argument must be a Buffer instance');
                if (e > i || e < o)
                    throw new RangeError('"value" argument is out of bounds');
                if (n + r > t.length)
                    throw new RangeError("Index out of range")
            }
            function R(t, e, n, r, i) {
                K(e, r, i, t, n, 7);
                let o = Number(e & BigInt(4294967295));
                t[n++] = o,
                o >>= 8,
                t[n++] = o,
                o >>= 8,
                t[n++] = o,
                o >>= 8,
                t[n++] = o;
                let s = Number(e >> BigInt(32) & BigInt(4294967295));
                return t[n++] = s,
                s >>= 8,
                t[n++] = s,
                s >>= 8,
                t[n++] = s,
                s >>= 8,
                t[n++] = s,
                n
            }
            function U(t, e, n, r, i) {
                K(e, r, i, t, n, 7);
                let o = Number(e & BigInt(4294967295));
                t[n + 7] = o,
                o >>= 8,
                t[n + 6] = o,
                o >>= 8,
                t[n + 5] = o,
                o >>= 8,
                t[n + 4] = o;
                let s = Number(e >> BigInt(32) & BigInt(4294967295));
                return t[n + 3] = s,
                s >>= 8,
                t[n + 2] = s,
                s >>= 8,
                t[n + 1] = s,
                s >>= 8,
                t[n] = s,
                n + 8
            }
            function N(t, e, n, r, i, o) {
                if (n + r > t.length)
                    throw new RangeError("Index out of range");
                if (n < 0)
                    throw new RangeError("Index out of range")
            }
            function z(t, e, n, r, i) {
                return e = +e,
                n >>>= 0,
                i || N(t, 0, n, 4),
                o.write(t, e, n, r, 23, 4),
                n + 4
            }
            function q(t, e, n, r, i) {
                return e = +e,
                n >>>= 0,
                i || N(t, 0, n, 8),
                o.write(t, e, n, r, 52, 8),
                n + 8
            }
            c.prototype.slice = function(t, e) {
                const n = this.length;
                (t = ~~t) < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n),
                (e = void 0 === e ? n : ~~e) < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n),
                e < t && (e = t);
                const r = this.subarray(t, e);
                return Object.setPrototypeOf(r, c.prototype),
                r
            }
            ,
            c.prototype.readUintLE = c.prototype.readUIntLE = function(t, e, n) {
                t >>>= 0,
                e >>>= 0,
                n || T(t, e, this.length);
                let r = this[t]
                  , i = 1
                  , o = 0;
                for (; ++o < e && (i *= 256); )
                    r += this[t + o] * i;
                return r
            }
            ,
            c.prototype.readUintBE = c.prototype.readUIntBE = function(t, e, n) {
                t >>>= 0,
                e >>>= 0,
                n || T(t, e, this.length);
                let r = this[t + --e]
                  , i = 1;
                for (; e > 0 && (i *= 256); )
                    r += this[t + --e] * i;
                return r
            }
            ,
            c.prototype.readUint8 = c.prototype.readUInt8 = function(t, e) {
                return t >>>= 0,
                e || T(t, 1, this.length),
                this[t]
            }
            ,
            c.prototype.readUint16LE = c.prototype.readUInt16LE = function(t, e) {
                return t >>>= 0,
                e || T(t, 2, this.length),
                this[t] | this[t + 1] << 8
            }
            ,
            c.prototype.readUint16BE = c.prototype.readUInt16BE = function(t, e) {
                return t >>>= 0,
                e || T(t, 2, this.length),
                this[t] << 8 | this[t + 1]
            }
            ,
            c.prototype.readUint32LE = c.prototype.readUInt32LE = function(t, e) {
                return t >>>= 0,
                e || T(t, 4, this.length),
                (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3]
            }
            ,
            c.prototype.readUint32BE = c.prototype.readUInt32BE = function(t, e) {
                return t >>>= 0,
                e || T(t, 4, this.length),
                16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3])
            }
            ,
            c.prototype.readBigUInt64LE = X((function(t) {
                D(t >>>= 0, "offset");
                const e = this[t]
                  , n = this[t + 7];
                void 0 !== e && void 0 !== n || $(t, this.length - 8);
                const r = e + 256 * this[++t] + 65536 * this[++t] + this[++t] * 2 ** 24
                  , i = this[++t] + 256 * this[++t] + 65536 * this[++t] + n * 2 ** 24;
                return BigInt(r) + (BigInt(i) << BigInt(32))
            }
            )),
            c.prototype.readBigUInt64BE = X((function(t) {
                D(t >>>= 0, "offset");
                const e = this[t]
                  , n = this[t + 7];
                void 0 !== e && void 0 !== n || $(t, this.length - 8);
                const r = e * 2 ** 24 + 65536 * this[++t] + 256 * this[++t] + this[++t]
                  , i = this[++t] * 2 ** 24 + 65536 * this[++t] + 256 * this[++t] + n;
                return (BigInt(r) << BigInt(32)) + BigInt(i)
            }
            )),
            c.prototype.readIntLE = function(t, e, n) {
                t >>>= 0,
                e >>>= 0,
                n || T(t, e, this.length);
                let r = this[t]
                  , i = 1
                  , o = 0;
                for (; ++o < e && (i *= 256); )
                    r += this[t + o] * i;
                return i *= 128,
                r >= i && (r -= Math.pow(2, 8 * e)),
                r
            }
            ,
            c.prototype.readIntBE = function(t, e, n) {
                t >>>= 0,
                e >>>= 0,
                n || T(t, e, this.length);
                let r = e
                  , i = 1
                  , o = this[t + --r];
                for (; r > 0 && (i *= 256); )
                    o += this[t + --r] * i;
                return i *= 128,
                o >= i && (o -= Math.pow(2, 8 * e)),
                o
            }
            ,
            c.prototype.readInt8 = function(t, e) {
                return t >>>= 0,
                e || T(t, 1, this.length),
                128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
            }
            ,
            c.prototype.readInt16LE = function(t, e) {
                t >>>= 0,
                e || T(t, 2, this.length);
                const n = this[t] | this[t + 1] << 8;
                return 32768 & n ? 4294901760 | n : n
            }
            ,
            c.prototype.readInt16BE = function(t, e) {
                t >>>= 0,
                e || T(t, 2, this.length);
                const n = this[t + 1] | this[t] << 8;
                return 32768 & n ? 4294901760 | n : n
            }
            ,
            c.prototype.readInt32LE = function(t, e) {
                return t >>>= 0,
                e || T(t, 4, this.length),
                this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24
            }
            ,
            c.prototype.readInt32BE = function(t, e) {
                return t >>>= 0,
                e || T(t, 4, this.length),
                this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]
            }
            ,
            c.prototype.readBigInt64LE = X((function(t) {
                D(t >>>= 0, "offset");
                const e = this[t]
                  , n = this[t + 7];
                void 0 !== e && void 0 !== n || $(t, this.length - 8);
                const r = this[t + 4] + 256 * this[t + 5] + 65536 * this[t + 6] + (n << 24);
                return (BigInt(r) << BigInt(32)) + BigInt(e + 256 * this[++t] + 65536 * this[++t] + this[++t] * 2 ** 24)
            }
            )),
            c.prototype.readBigInt64BE = X((function(t) {
                D(t >>>= 0, "offset");
                const e = this[t]
                  , n = this[t + 7];
                void 0 !== e && void 0 !== n || $(t, this.length - 8);
                const r = (e << 24) + 65536 * this[++t] + 256 * this[++t] + this[++t];
                return (BigInt(r) << BigInt(32)) + BigInt(this[++t] * 2 ** 24 + 65536 * this[++t] + 256 * this[++t] + n)
            }
            )),
            c.prototype.readFloatLE = function(t, e) {
                return t >>>= 0,
                e || T(t, 4, this.length),
                o.read(this, t, !0, 23, 4)
            }
            ,
            c.prototype.readFloatBE = function(t, e) {
                return t >>>= 0,
                e || T(t, 4, this.length),
                o.read(this, t, !1, 23, 4)
            }
            ,
            c.prototype.readDoubleLE = function(t, e) {
                return t >>>= 0,
                e || T(t, 8, this.length),
                o.read(this, t, !0, 52, 8)
            }
            ,
            c.prototype.readDoubleBE = function(t, e) {
                return t >>>= 0,
                e || T(t, 8, this.length),
                o.read(this, t, !1, 52, 8)
            }
            ,
            c.prototype.writeUintLE = c.prototype.writeUIntLE = function(t, e, n, r) {
                t = +t,
                e >>>= 0,
                n >>>= 0,
                r || L(this, t, e, n, Math.pow(2, 8 * n) - 1, 0);
                let i = 1
                  , o = 0;
                for (this[e] = 255 & t; ++o < n && (i *= 256); )
                    this[e + o] = t / i & 255;
                return e + n
            }
            ,
            c.prototype.writeUintBE = c.prototype.writeUIntBE = function(t, e, n, r) {
                t = +t,
                e >>>= 0,
                n >>>= 0,
                r || L(this, t, e, n, Math.pow(2, 8 * n) - 1, 0);
                let i = n - 1
                  , o = 1;
                for (this[e + i] = 255 & t; --i >= 0 && (o *= 256); )
                    this[e + i] = t / o & 255;
                return e + n
            }
            ,
            c.prototype.writeUint8 = c.prototype.writeUInt8 = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || L(this, t, e, 1, 255, 0),
                this[e] = 255 & t,
                e + 1
            }
            ,
            c.prototype.writeUint16LE = c.prototype.writeUInt16LE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || L(this, t, e, 2, 65535, 0),
                this[e] = 255 & t,
                this[e + 1] = t >>> 8,
                e + 2
            }
            ,
            c.prototype.writeUint16BE = c.prototype.writeUInt16BE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || L(this, t, e, 2, 65535, 0),
                this[e] = t >>> 8,
                this[e + 1] = 255 & t,
                e + 2
            }
            ,
            c.prototype.writeUint32LE = c.prototype.writeUInt32LE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || L(this, t, e, 4, 4294967295, 0),
                this[e + 3] = t >>> 24,
                this[e + 2] = t >>> 16,
                this[e + 1] = t >>> 8,
                this[e] = 255 & t,
                e + 4
            }
            ,
            c.prototype.writeUint32BE = c.prototype.writeUInt32BE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || L(this, t, e, 4, 4294967295, 0),
                this[e] = t >>> 24,
                this[e + 1] = t >>> 16,
                this[e + 2] = t >>> 8,
                this[e + 3] = 255 & t,
                e + 4
            }
            ,
            c.prototype.writeBigUInt64LE = X((function(t, e=0) {
                return R(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"))
            }
            )),
            c.prototype.writeBigUInt64BE = X((function(t, e=0) {
                return U(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"))
            }
            )),
            c.prototype.writeIntLE = function(t, e, n, r) {
                if (t = +t,
                e >>>= 0,
                !r) {
                    const r = Math.pow(2, 8 * n - 1);
                    L(this, t, e, n, r - 1, -r)
                }
                let i = 0
                  , o = 1
                  , s = 0;
                for (this[e] = 255 & t; ++i < n && (o *= 256); )
                    t < 0 && 0 === s && 0 !== this[e + i - 1] && (s = 1),
                    this[e + i] = (t / o | 0) - s & 255;
                return e + n
            }
            ,
            c.prototype.writeIntBE = function(t, e, n, r) {
                if (t = +t,
                e >>>= 0,
                !r) {
                    const r = Math.pow(2, 8 * n - 1);
                    L(this, t, e, n, r - 1, -r)
                }
                let i = n - 1
                  , o = 1
                  , s = 0;
                for (this[e + i] = 255 & t; --i >= 0 && (o *= 256); )
                    t < 0 && 0 === s && 0 !== this[e + i + 1] && (s = 1),
                    this[e + i] = (t / o | 0) - s & 255;
                return e + n
            }
            ,
            c.prototype.writeInt8 = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || L(this, t, e, 1, 127, -128),
                t < 0 && (t = 255 + t + 1),
                this[e] = 255 & t,
                e + 1
            }
            ,
            c.prototype.writeInt16LE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || L(this, t, e, 2, 32767, -32768),
                this[e] = 255 & t,
                this[e + 1] = t >>> 8,
                e + 2
            }
            ,
            c.prototype.writeInt16BE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || L(this, t, e, 2, 32767, -32768),
                this[e] = t >>> 8,
                this[e + 1] = 255 & t,
                e + 2
            }
            ,
            c.prototype.writeInt32LE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || L(this, t, e, 4, 2147483647, -2147483648),
                this[e] = 255 & t,
                this[e + 1] = t >>> 8,
                this[e + 2] = t >>> 16,
                this[e + 3] = t >>> 24,
                e + 4
            }
            ,
            c.prototype.writeInt32BE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || L(this, t, e, 4, 2147483647, -2147483648),
                t < 0 && (t = 4294967295 + t + 1),
                this[e] = t >>> 24,
                this[e + 1] = t >>> 16,
                this[e + 2] = t >>> 8,
                this[e + 3] = 255 & t,
                e + 4
            }
            ,
            c.prototype.writeBigInt64LE = X((function(t, e=0) {
                return R(this, t, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"))
            }
            )),
            c.prototype.writeBigInt64BE = X((function(t, e=0) {
                return U(this, t, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"))
            }
            )),
            c.prototype.writeFloatLE = function(t, e, n) {
                return z(this, t, e, !0, n)
            }
            ,
            c.prototype.writeFloatBE = function(t, e, n) {
                return z(this, t, e, !1, n)
            }
            ,
            c.prototype.writeDoubleLE = function(t, e, n) {
                return q(this, t, e, !0, n)
            }
            ,
            c.prototype.writeDoubleBE = function(t, e, n) {
                return q(this, t, e, !1, n)
            }
            ,
            c.prototype.copy = function(t, e, n, r) {
                if (!c.isBuffer(t))
                    throw new TypeError("argument should be a Buffer");
                if (n || (n = 0),
                r || 0 === r || (r = this.length),
                e >= t.length && (e = t.length),
                e || (e = 0),
                r > 0 && r < n && (r = n),
                r === n)
                    return 0;
                if (0 === t.length || 0 === this.length)
                    return 0;
                if (e < 0)
                    throw new RangeError("targetStart out of bounds");
                if (n < 0 || n >= this.length)
                    throw new RangeError("Index out of range");
                if (r < 0)
                    throw new RangeError("sourceEnd out of bounds");
                r > this.length && (r = this.length),
                t.length - e < r - n && (r = t.length - e + n);
                const i = r - n;
                return this === t && "function" == typeof Uint8Array.prototype.copyWithin ? this.copyWithin(e, n, r) : Uint8Array.prototype.set.call(t, this.subarray(n, r), e),
                i
            }
            ,
            c.prototype.fill = function(t, e, n, r) {
                if ("string" == typeof t) {
                    if ("string" == typeof e ? (r = e,
                    e = 0,
                    n = this.length) : "string" == typeof n && (r = n,
                    n = this.length),
                    void 0 !== r && "string" != typeof r)
                        throw new TypeError("encoding must be a string");
                    if ("string" == typeof r && !c.isEncoding(r))
                        throw new TypeError("Unknown encoding: " + r);
                    if (1 === t.length) {
                        const e = t.charCodeAt(0);
                        ("utf8" === r && e < 128 || "latin1" === r) && (t = e)
                    }
                } else
                    "number" == typeof t ? t &= 255 : "boolean" == typeof t && (t = Number(t));
                if (e < 0 || this.length < e || this.length < n)
                    throw new RangeError("Out of range index");
                if (n <= e)
                    return this;
                let i;
                if (e >>>= 0,
                n = void 0 === n ? this.length : n >>> 0,
                t || (t = 0),
                "number" == typeof t)
                    for (i = e; i < n; ++i)
                        this[i] = t;
                else {
                    const o = c.isBuffer(t) ? t : c.from(t, r)
                      , s = o.length;
                    if (0 === s)
                        throw new TypeError('The value "' + t + '" is invalid for argument "value"');
                    for (i = 0; i < n - e; ++i)
                        this[i + e] = o[i % s]
                }
                return this
            }
            ;
            const W = {};
            function C(t, e, n) {
                W[t] = class extends n {
                    constructor() {
                        super(),
                        Object.defineProperty(this, "message", {
                            value: e.apply(this, arguments),
                            writable: !0,
                            configurable: !0
                        }),
                        this.name = `${this.name} [${t}]`,
                        this.stack,
                        delete this.name
                    }
                    get code() {
                        return t
                    }
                    set code(t) {
                        Object.defineProperty(this, "code", {
                            configurable: !0,
                            enumerable: !0,
                            value: t,
                            writable: !0
                        })
                    }
                    toString() {
                        return `${this.name} [${t}]: ${this.message}`
                    }
                }
            }
            function F(t) {
                let e = ""
                  , n = t.length;
                const r = "-" === t[0] ? 1 : 0;
                for (; n >= r + 4; n -= 3)
                    e = `_${t.slice(n - 3, n)}${e}`;
                return `${t.slice(0, n)}${e}`
            }
            function K(t, e, n, r, i, o) {
                if (t > n || t < e) {
                    const r = "bigint" == typeof e ? "n" : "";
                    let i;
                    throw i = o > 3 ? 0 === e || e === BigInt(0) ? `>= 0${r} and < 2${r} ** ${8 * (o + 1)}${r}` : `>= -(2${r} ** ${8 * (o + 1) - 1}${r}) and < 2 ** ${8 * (o + 1) - 1}${r}` : `>= ${e}${r} and <= ${n}${r}`,
                    new W.ERR_OUT_OF_RANGE("value",i,t)
                }
                !function(t, e, n) {
                    D(e, "offset"),
                    void 0 !== t[e] && void 0 !== t[e + n] || $(e, t.length - (n + 1))
                }(r, i, o)
            }
            function D(t, e) {
                if ("number" != typeof t)
                    throw new W.ERR_INVALID_ARG_TYPE(e,"number",t)
            }
            function $(t, e, n) {
                if (Math.floor(t) !== t)
                    throw D(t, n),
                    new W.ERR_OUT_OF_RANGE(n || "offset","an integer",t);
                if (e < 0)
                    throw new W.ERR_BUFFER_OUT_OF_BOUNDS;
                throw new W.ERR_OUT_OF_RANGE(n || "offset",`>= ${n ? 1 : 0} and <= ${e}`,t)
            }
            C("ERR_BUFFER_OUT_OF_BOUNDS", (function(t) {
                return t ? `${t} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds"
            }
            ), RangeError),
            C("ERR_INVALID_ARG_TYPE", (function(t, e) {
                return `The "${t}" argument must be of type number. Received type ${typeof e}`
            }
            ), TypeError),
            C("ERR_OUT_OF_RANGE", (function(t, e, n) {
                let r = `The value of "${t}" is out of range.`
                  , i = n;
                return Number.isInteger(n) && Math.abs(n) > 2 ** 32 ? i = F(String(n)) : "bigint" == typeof n && (i = String(n),
                (n > BigInt(2) ** BigInt(32) || n < -(BigInt(2) ** BigInt(32))) && (i = F(i)),
                i += "n"),
                r += ` It must be ${e}. Received ${i}`,
                r
            }
            ), RangeError);
            const H = /[^+/0-9A-Za-z-_]/g;
            function V(t, e) {
                let n;
                e = e || 1 / 0;
                const r = t.length;
                let i = null;
                const o = [];
                for (let s = 0; s < r; ++s) {
                    if (n = t.charCodeAt(s),
                    n > 55295 && n < 57344) {
                        if (!i) {
                            if (n > 56319) {
                                (e -= 3) > -1 && o.push(239, 191, 189);
                                continue
                            }
                            if (s + 1 === r) {
                                (e -= 3) > -1 && o.push(239, 191, 189);
                                continue
                            }
                            i = n;
                            continue
                        }
                        if (n < 56320) {
                            (e -= 3) > -1 && o.push(239, 191, 189),
                            i = n;
                            continue
                        }
                        n = 65536 + (i - 55296 << 10 | n - 56320)
                    } else
                        i && (e -= 3) > -1 && o.push(239, 191, 189);
                    if (i = null,
                    n < 128) {
                        if ((e -= 1) < 0)
                            break;
                        o.push(n)
                    } else if (n < 2048) {
                        if ((e -= 2) < 0)
                            break;
                        o.push(n >> 6 | 192, 63 & n | 128)
                    } else if (n < 65536) {
                        if ((e -= 3) < 0)
                            break;
                        o.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128)
                    } else {
                        if (!(n < 1114112))
                            throw new Error("Invalid code point");
                        if ((e -= 4) < 0)
                            break;
                        o.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128)
                    }
                }
                return o
            }
            function J(t) {
                return i.toByteArray(function(t) {
                    if ((t = (t = t.split("=")[0]).trim().replace(H, "")).length < 2)
                        return "";
                    for (; t.length % 4 != 0; )
                        t += "=";
                    return t
                }(t))
            }
            function G(t, e, n, r) {
                let i;
                for (i = 0; i < r && !(i + n >= e.length || i >= t.length); ++i)
                    e[i + n] = t[i];
                return i
            }
            function Z(t, e) {
                return t instanceof e || null != t && null != t.constructor && null != t.constructor.name && t.constructor.name === e.name
            }
            function Y(t) {
                return t != t
            }
            const Q = function() {
                const t = "0123456789abcdef"
                  , e = new Array(256);
                for (let n = 0; n < 16; ++n) {
                    const r = 16 * n;
                    for (let i = 0; i < 16; ++i)
                        e[r + i] = t[n] + t[i]
                }
                return e
            }();
            function X(t) {
                return "undefined" == typeof BigInt ? tt : t
            }
            function tt() {
                throw new Error("BigInt not supported")
            }
        }
        ,
        "../../../node_modules/call-bind/callBound.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/get-intrinsic/index.js")
              , i = n("../../../node_modules/call-bind/index.js")
              , o = i(r("String.prototype.indexOf"));
            t.exports = function(t, e) {
                var n = r(t, !!e);
                return "function" == typeof n && o(t, ".prototype.") > -1 ? i(n) : n
            }
        }
        ,
        "../../../node_modules/call-bind/index.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/function-bind/index.js")
              , i = n("../../../node_modules/get-intrinsic/index.js")
              , o = n("../../../node_modules/set-function-length/index.js")
              , s = n("../../../node_modules/es-errors/type.js")
              , a = i("%Function.prototype.apply%")
              , u = i("%Function.prototype.call%")
              , c = i("%Reflect.apply%", !0) || r.call(u, a)
              , l = n("../../../node_modules/es-define-property/index.js")
              , f = i("%Math.max%");
            t.exports = function(t) {
                if ("function" != typeof t)
                    throw new s("a function is required");
                var e = c(r, u, arguments);
                return o(e, 1 + f(0, t.length - (arguments.length - 1)), !0)
            }
            ;
            var h = function() {
                return c(r, a, arguments)
            };
            l ? l(t.exports, "apply", {
                value: h
            }) : t.exports.apply = h
        }
        ,
        "../../../node_modules/console-browserify/index.js": (t, e, n) => {
            var r = n("../../../node_modules/util/util.js")
              , i = n("../../../node_modules/assert/build/assert.js");
            function o() {
                return (new Date).getTime()
            }
            var s, a = Array.prototype.slice, u = {};
            s = void 0 !== n.g && n.g.console ? n.g.console : "undefined" != typeof window && window.console ? window.console : {};
            for (var c = [[function() {}
            , "log"], [function() {
                s.log.apply(s, arguments)
            }
            , "info"], [function() {
                s.log.apply(s, arguments)
            }
            , "warn"], [function() {
                s.warn.apply(s, arguments)
            }
            , "error"], [function(t) {
                u[t] = o()
            }
            , "time"], [function(t) {
                var e = u[t];
                if (!e)
                    throw new Error("No such label: " + t);
                delete u[t];
                var n = o() - e;
                s.log(t + ": " + n + "ms")
            }
            , "timeEnd"], [function() {
                var t = new Error;
                t.name = "Trace",
                t.message = r.format.apply(null, arguments),
                s.error(t.stack)
            }
            , "trace"], [function(t) {
                s.log(r.inspect(t) + "\n")
            }
            , "dir"], [function(t) {
                if (!t) {
                    var e = a.call(arguments, 1);
                    i.ok(!1, r.format.apply(null, e))
                }
            }
            , "assert"]], l = 0; l < c.length; l++) {
                var f = c[l]
                  , h = f[0]
                  , d = f[1];
                s[d] || (s[d] = h)
            }
            t.exports = s
        }
        ,
        "../../../node_modules/define-data-property/index.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/es-define-property/index.js")
              , i = n("../../../node_modules/es-errors/syntax.js")
              , o = n("../../../node_modules/es-errors/type.js")
              , s = n("../../../node_modules/gopd/index.js");
            t.exports = function(t, e, n) {
                if (!t || "object" != typeof t && "function" != typeof t)
                    throw new o("`obj` must be an object or a function`");
                if ("string" != typeof e && "symbol" != typeof e)
                    throw new o("`property` must be a string or a symbol`");
                if (arguments.length > 3 && "boolean" != typeof arguments[3] && null !== arguments[3])
                    throw new o("`nonEnumerable`, if provided, must be a boolean or null");
                if (arguments.length > 4 && "boolean" != typeof arguments[4] && null !== arguments[4])
                    throw new o("`nonWritable`, if provided, must be a boolean or null");
                if (arguments.length > 5 && "boolean" != typeof arguments[5] && null !== arguments[5])
                    throw new o("`nonConfigurable`, if provided, must be a boolean or null");
                if (arguments.length > 6 && "boolean" != typeof arguments[6])
                    throw new o("`loose`, if provided, must be a boolean");
                var a = arguments.length > 3 ? arguments[3] : null
                  , u = arguments.length > 4 ? arguments[4] : null
                  , c = arguments.length > 5 ? arguments[5] : null
                  , l = arguments.length > 6 && arguments[6]
                  , f = !!s && s(t, e);
                if (r)
                    r(t, e, {
                        configurable: null === c && f ? f.configurable : !c,
                        enumerable: null === a && f ? f.enumerable : !a,
                        value: n,
                        writable: null === u && f ? f.writable : !u
                    });
                else {
                    if (!l && (a || u || c))
                        throw new i("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
                    t[e] = n
                }
            }
        }
        ,
        "../../../node_modules/define-properties/index.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/object-keys/index.js")
              , i = "function" == typeof Symbol && "symbol" == typeof Symbol("foo")
              , o = Object.prototype.toString
              , s = Array.prototype.concat
              , a = n("../../../node_modules/define-data-property/index.js")
              , u = n("../../../node_modules/has-property-descriptors/index.js")()
              , c = function(t, e, n, r) {
                if (e in t)
                    if (!0 === r) {
                        if (t[e] === n)
                            return
                    } else if ("function" != typeof (i = r) || "[object Function]" !== o.call(i) || !r())
                        return;
                var i;
                u ? a(t, e, n, !0) : a(t, e, n)
            }
              , l = function(t, e) {
                var n = arguments.length > 2 ? arguments[2] : {}
                  , o = r(e);
                i && (o = s.call(o, Object.getOwnPropertySymbols(e)));
                for (var a = 0; a < o.length; a += 1)
                    c(t, o[a], e[o[a]], n[o[a]])
            };
            l.supportsDescriptors = !!u,
            t.exports = l
        }
        ,
        "../../../node_modules/es-define-property/index.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/get-intrinsic/index.js")("%Object.defineProperty%", !0) || !1;
            if (r)
                try {
                    r({}, "a", {
                        value: 1
                    })
                } catch (t) {
                    r = !1
                }
            t.exports = r
        }
        ,
        "../../../node_modules/es-errors/eval.js": t => {
            "use strict";
            t.exports = EvalError
        }
        ,
        "../../../node_modules/es-errors/index.js": t => {
            "use strict";
            t.exports = Error
        }
        ,
        "../../../node_modules/es-errors/range.js": t => {
            "use strict";
            t.exports = RangeError
        }
        ,
        "../../../node_modules/es-errors/ref.js": t => {
            "use strict";
            t.exports = ReferenceError
        }
        ,
        "../../../node_modules/es-errors/syntax.js": t => {
            "use strict";
            t.exports = SyntaxError
        }
        ,
        "../../../node_modules/es-errors/type.js": t => {
            "use strict";
            t.exports = TypeError
        }
        ,
        "../../../node_modules/es-errors/uri.js": t => {
            "use strict";
            t.exports = URIError
        }
        ,
        "../../../node_modules/es6-object-assign/index.js": t => {
            "use strict";
            function e(t, e) {
                if (null == t)
                    throw new TypeError("Cannot convert first argument to object");
                for (var n = Object(t), r = 1; r < arguments.length; r++) {
                    var i = arguments[r];
                    if (null != i)
                        for (var o = Object.keys(Object(i)), s = 0, a = o.length; s < a; s++) {
                            var u = o[s]
                              , c = Object.getOwnPropertyDescriptor(i, u);
                            void 0 !== c && c.enumerable && (n[u] = i[u])
                        }
                }
                return n
            }
            t.exports = {
                assign: e,
                polyfill: function() {
                    Object.assign || Object.defineProperty(Object, "assign", {
                        enumerable: !1,
                        configurable: !0,
                        writable: !0,
                        value: e
                    })
                }
            }
        }
        ,
        "../../../node_modules/eventemitter3/index.js": t => {
            "use strict";
            var e = Object.prototype.hasOwnProperty
              , n = "~";
            function r() {}
            function i(t, e, n) {
                this.fn = t,
                this.context = e,
                this.once = n || !1
            }
            function o(t, e, r, o, s) {
                if ("function" != typeof r)
                    throw new TypeError("The listener must be a function");
                var a = new i(r,o || t,s)
                  , u = n ? n + e : e;
                return t._events[u] ? t._events[u].fn ? t._events[u] = [t._events[u], a] : t._events[u].push(a) : (t._events[u] = a,
                t._eventsCount++),
                t
            }
            function s(t, e) {
                0 == --t._eventsCount ? t._events = new r : delete t._events[e]
            }
            function a() {
                this._events = new r,
                this._eventsCount = 0
            }
            Object.create && (r.prototype = Object.create(null),
            (new r).__proto__ || (n = !1)),
            a.prototype.eventNames = function() {
                var t, r, i = [];
                if (0 === this._eventsCount)
                    return i;
                for (r in t = this._events)
                    e.call(t, r) && i.push(n ? r.slice(1) : r);
                return Object.getOwnPropertySymbols ? i.concat(Object.getOwnPropertySymbols(t)) : i
            }
            ,
            a.prototype.listeners = function(t) {
                var e = n ? n + t : t
                  , r = this._events[e];
                if (!r)
                    return [];
                if (r.fn)
                    return [r.fn];
                for (var i = 0, o = r.length, s = new Array(o); i < o; i++)
                    s[i] = r[i].fn;
                return s
            }
            ,
            a.prototype.listenerCount = function(t) {
                var e = n ? n + t : t
                  , r = this._events[e];
                return r ? r.fn ? 1 : r.length : 0
            }
            ,
            a.prototype.emit = function(t, e, r, i, o, s) {
                var a = n ? n + t : t;
                if (!this._events[a])
                    return !1;
                var u, c, l = this._events[a], f = arguments.length;
                if (l.fn) {
                    switch (l.once && this.removeListener(t, l.fn, void 0, !0),
                    f) {
                    case 1:
                        return l.fn.call(l.context),
                        !0;
                    case 2:
                        return l.fn.call(l.context, e),
                        !0;
                    case 3:
                        return l.fn.call(l.context, e, r),
                        !0;
                    case 4:
                        return l.fn.call(l.context, e, r, i),
                        !0;
                    case 5:
                        return l.fn.call(l.context, e, r, i, o),
                        !0;
                    case 6:
                        return l.fn.call(l.context, e, r, i, o, s),
                        !0
                    }
                    for (c = 1,
                    u = new Array(f - 1); c < f; c++)
                        u[c - 1] = arguments[c];
                    l.fn.apply(l.context, u)
                } else {
                    var h, d = l.length;
                    for (c = 0; c < d; c++)
                        switch (l[c].once && this.removeListener(t, l[c].fn, void 0, !0),
                        f) {
                        case 1:
                            l[c].fn.call(l[c].context);
                            break;
                        case 2:
                            l[c].fn.call(l[c].context, e);
                            break;
                        case 3:
                            l[c].fn.call(l[c].context, e, r);
                            break;
                        case 4:
                            l[c].fn.call(l[c].context, e, r, i);
                            break;
                        default:
                            if (!u)
                                for (h = 1,
                                u = new Array(f - 1); h < f; h++)
                                    u[h - 1] = arguments[h];
                            l[c].fn.apply(l[c].context, u)
                        }
                }
                return !0
            }
            ,
            a.prototype.on = function(t, e, n) {
                return o(this, t, e, n, !1)
            }
            ,
            a.prototype.once = function(t, e, n) {
                return o(this, t, e, n, !0)
            }
            ,
            a.prototype.removeListener = function(t, e, r, i) {
                var o = n ? n + t : t;
                if (!this._events[o])
                    return this;
                if (!e)
                    return s(this, o),
                    this;
                var a = this._events[o];
                if (a.fn)
                    a.fn !== e || i && !a.once || r && a.context !== r || s(this, o);
                else {
                    for (var u = 0, c = [], l = a.length; u < l; u++)
                        (a[u].fn !== e || i && !a[u].once || r && a[u].context !== r) && c.push(a[u]);
                    c.length ? this._events[o] = 1 === c.length ? c[0] : c : s(this, o)
                }
                return this
            }
            ,
            a.prototype.removeAllListeners = function(t) {
                var e;
                return t ? (e = n ? n + t : t,
                this._events[e] && s(this, e)) : (this._events = new r,
                this._eventsCount = 0),
                this
            }
            ,
            a.prototype.off = a.prototype.removeListener,
            a.prototype.addListener = a.prototype.on,
            a.prefixed = n,
            a.EventEmitter = a,
            t.exports = a
        }
        ,
        "../../../node_modules/for-each/index.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/is-callable/index.js")
              , i = Object.prototype.toString
              , o = Object.prototype.hasOwnProperty;
            t.exports = function(t, e, n) {
                if (!r(e))
                    throw new TypeError("iterator must be a function");
                var s;
                arguments.length >= 3 && (s = n),
                "[object Array]" === i.call(t) ? function(t, e, n) {
                    for (var r = 0, i = t.length; r < i; r++)
                        o.call(t, r) && (null == n ? e(t[r], r, t) : e.call(n, t[r], r, t))
                }(t, e, s) : "string" == typeof t ? function(t, e, n) {
                    for (var r = 0, i = t.length; r < i; r++)
                        null == n ? e(t.charAt(r), r, t) : e.call(n, t.charAt(r), r, t)
                }(t, e, s) : function(t, e, n) {
                    for (var r in t)
                        o.call(t, r) && (null == n ? e(t[r], r, t) : e.call(n, t[r], r, t))
                }(t, e, s)
            }
        }
        ,
        "../../../node_modules/function-bind/implementation.js": t => {
            "use strict";
            var e = Object.prototype.toString
              , n = Math.max
              , r = function(t, e) {
                for (var n = [], r = 0; r < t.length; r += 1)
                    n[r] = t[r];
                for (var i = 0; i < e.length; i += 1)
                    n[i + t.length] = e[i];
                return n
            };
            t.exports = function(t) {
                var i = this;
                if ("function" != typeof i || "[object Function]" !== e.apply(i))
                    throw new TypeError("Function.prototype.bind called on incompatible " + i);
                for (var o, s = function(t, e) {
                    for (var n = [], r = 1, i = 0; r < t.length; r += 1,
                    i += 1)
                        n[i] = t[r];
                    return n
                }(arguments), a = n(0, i.length - s.length), u = [], c = 0; c < a; c++)
                    u[c] = "$" + c;
                if (o = Function("binder", "return function (" + function(t, e) {
                    for (var n = "", r = 0; r < t.length; r += 1)
                        n += t[r],
                        r + 1 < t.length && (n += ",");
                    return n
                }(u) + "){ return binder.apply(this,arguments); }")((function() {
                    if (this instanceof o) {
                        var e = i.apply(this, r(s, arguments));
                        return Object(e) === e ? e : this
                    }
                    return i.apply(t, r(s, arguments))
                }
                )),
                i.prototype) {
                    var l = function() {};
                    l.prototype = i.prototype,
                    o.prototype = new l,
                    l.prototype = null
                }
                return o
            }
        }
        ,
        "../../../node_modules/function-bind/index.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/function-bind/implementation.js");
            t.exports = Function.prototype.bind || r
        }
        ,
        "../../../node_modules/get-intrinsic/index.js": (t, e, n) => {
            "use strict";
            var r, i = n("../../../node_modules/es-errors/index.js"), o = n("../../../node_modules/es-errors/eval.js"), s = n("../../../node_modules/es-errors/range.js"), a = n("../../../node_modules/es-errors/ref.js"), u = n("../../../node_modules/es-errors/syntax.js"), c = n("../../../node_modules/es-errors/type.js"), l = n("../../../node_modules/es-errors/uri.js"), f = Function, h = function(t) {
                try {
                    return f('"use strict"; return (' + t + ").constructor;")()
                } catch (t) {}
            }, d = Object.getOwnPropertyDescriptor;
            if (d)
                try {
                    d({}, "")
                } catch (t) {
                    d = null
                }
            var p = function() {
                throw new c
            }
              , y = d ? function() {
                try {
                    return p
                } catch (t) {
                    try {
                        return d(arguments, "callee").get
                    } catch (t) {
                        return p
                    }
                }
            }() : p
              , g = n("../../../node_modules/has-symbols/index.js")()
              , m = n("../../../node_modules/has-proto/index.js")()
              , b = Object.getPrototypeOf || (m ? function(t) {
                return t.__proto__
            }
            : null)
              , w = {}
              , v = "undefined" != typeof Uint8Array && b ? b(Uint8Array) : r
              , x = {
                __proto__: null,
                "%AggregateError%": "undefined" == typeof AggregateError ? r : AggregateError,
                "%Array%": Array,
                "%ArrayBuffer%": "undefined" == typeof ArrayBuffer ? r : ArrayBuffer,
                "%ArrayIteratorPrototype%": g && b ? b([][Symbol.iterator]()) : r,
                "%AsyncFromSyncIteratorPrototype%": r,
                "%AsyncFunction%": w,
                "%AsyncGenerator%": w,
                "%AsyncGeneratorFunction%": w,
                "%AsyncIteratorPrototype%": w,
                "%Atomics%": "undefined" == typeof Atomics ? r : Atomics,
                "%BigInt%": "undefined" == typeof BigInt ? r : BigInt,
                "%BigInt64Array%": "undefined" == typeof BigInt64Array ? r : BigInt64Array,
                "%BigUint64Array%": "undefined" == typeof BigUint64Array ? r : BigUint64Array,
                "%Boolean%": Boolean,
                "%DataView%": "undefined" == typeof DataView ? r : DataView,
                "%Date%": Date,
                "%decodeURI%": decodeURI,
                "%decodeURIComponent%": decodeURIComponent,
                "%encodeURI%": encodeURI,
                "%encodeURIComponent%": encodeURIComponent,
                "%Error%": i,
                "%eval%": eval,
                "%EvalError%": o,
                "%Float32Array%": "undefined" == typeof Float32Array ? r : Float32Array,
                "%Float64Array%": "undefined" == typeof Float64Array ? r : Float64Array,
                "%FinalizationRegistry%": "undefined" == typeof FinalizationRegistry ? r : FinalizationRegistry,
                "%Function%": f,
                "%GeneratorFunction%": w,
                "%Int8Array%": "undefined" == typeof Int8Array ? r : Int8Array,
                "%Int16Array%": "undefined" == typeof Int16Array ? r : Int16Array,
                "%Int32Array%": "undefined" == typeof Int32Array ? r : Int32Array,
                "%isFinite%": isFinite,
                "%isNaN%": isNaN,
                "%IteratorPrototype%": g && b ? b(b([][Symbol.iterator]())) : r,
                "%JSON%": "object" == typeof JSON ? JSON : r,
                "%Map%": "undefined" == typeof Map ? r : Map,
                "%MapIteratorPrototype%": "undefined" != typeof Map && g && b ? b((new Map)[Symbol.iterator]()) : r,
                "%Math%": Math,
                "%Number%": Number,
                "%Object%": Object,
                "%parseFloat%": parseFloat,
                "%parseInt%": parseInt,
                "%Promise%": "undefined" == typeof Promise ? r : Promise,
                "%Proxy%": "undefined" == typeof Proxy ? r : Proxy,
                "%RangeError%": s,
                "%ReferenceError%": a,
                "%Reflect%": "undefined" == typeof Reflect ? r : Reflect,
                "%RegExp%": RegExp,
                "%Set%": "undefined" == typeof Set ? r : Set,
                "%SetIteratorPrototype%": "undefined" != typeof Set && g && b ? b((new Set)[Symbol.iterator]()) : r,
                "%SharedArrayBuffer%": "undefined" == typeof SharedArrayBuffer ? r : SharedArrayBuffer,
                "%String%": String,
                "%StringIteratorPrototype%": g && b ? b(""[Symbol.iterator]()) : r,
                "%Symbol%": g ? Symbol : r,
                "%SyntaxError%": u,
                "%ThrowTypeError%": y,
                "%TypedArray%": v,
                "%TypeError%": c,
                "%Uint8Array%": "undefined" == typeof Uint8Array ? r : Uint8Array,
                "%Uint8ClampedArray%": "undefined" == typeof Uint8ClampedArray ? r : Uint8ClampedArray,
                "%Uint16Array%": "undefined" == typeof Uint16Array ? r : Uint16Array,
                "%Uint32Array%": "undefined" == typeof Uint32Array ? r : Uint32Array,
                "%URIError%": l,
                "%WeakMap%": "undefined" == typeof WeakMap ? r : WeakMap,
                "%WeakRef%": "undefined" == typeof WeakRef ? r : WeakRef,
                "%WeakSet%": "undefined" == typeof WeakSet ? r : WeakSet
            };
            if (b)
                try {
                    null.error
                } catch (t) {
                    var S = b(b(t));
                    x["%Error.prototype%"] = S
                }
            var k = function t(e) {
                var n;
                if ("%AsyncFunction%" === e)
                    n = h("async function () {}");
                else if ("%GeneratorFunction%" === e)
                    n = h("function* () {}");
                else if ("%AsyncGeneratorFunction%" === e)
                    n = h("async function* () {}");
                else if ("%AsyncGenerator%" === e) {
                    var r = t("%AsyncGeneratorFunction%");
                    r && (n = r.prototype)
                } else if ("%AsyncIteratorPrototype%" === e) {
                    var i = t("%AsyncGenerator%");
                    i && b && (n = b(i.prototype))
                }
                return x[e] = n,
                n
            }
              , E = {
                __proto__: null,
                "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
                "%ArrayPrototype%": ["Array", "prototype"],
                "%ArrayProto_entries%": ["Array", "prototype", "entries"],
                "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
                "%ArrayProto_keys%": ["Array", "prototype", "keys"],
                "%ArrayProto_values%": ["Array", "prototype", "values"],
                "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
                "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
                "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
                "%BooleanPrototype%": ["Boolean", "prototype"],
                "%DataViewPrototype%": ["DataView", "prototype"],
                "%DatePrototype%": ["Date", "prototype"],
                "%ErrorPrototype%": ["Error", "prototype"],
                "%EvalErrorPrototype%": ["EvalError", "prototype"],
                "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
                "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
                "%FunctionPrototype%": ["Function", "prototype"],
                "%Generator%": ["GeneratorFunction", "prototype"],
                "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
                "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
                "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
                "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
                "%JSONParse%": ["JSON", "parse"],
                "%JSONStringify%": ["JSON", "stringify"],
                "%MapPrototype%": ["Map", "prototype"],
                "%NumberPrototype%": ["Number", "prototype"],
                "%ObjectPrototype%": ["Object", "prototype"],
                "%ObjProto_toString%": ["Object", "prototype", "toString"],
                "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
                "%PromisePrototype%": ["Promise", "prototype"],
                "%PromiseProto_then%": ["Promise", "prototype", "then"],
                "%Promise_all%": ["Promise", "all"],
                "%Promise_reject%": ["Promise", "reject"],
                "%Promise_resolve%": ["Promise", "resolve"],
                "%RangeErrorPrototype%": ["RangeError", "prototype"],
                "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
                "%RegExpPrototype%": ["RegExp", "prototype"],
                "%SetPrototype%": ["Set", "prototype"],
                "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
                "%StringPrototype%": ["String", "prototype"],
                "%SymbolPrototype%": ["Symbol", "prototype"],
                "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
                "%TypedArrayPrototype%": ["TypedArray", "prototype"],
                "%TypeErrorPrototype%": ["TypeError", "prototype"],
                "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
                "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
                "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
                "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
                "%URIErrorPrototype%": ["URIError", "prototype"],
                "%WeakMapPrototype%": ["WeakMap", "prototype"],
                "%WeakSetPrototype%": ["WeakSet", "prototype"]
            }
              , A = n("../../../node_modules/function-bind/index.js")
              , I = n("../../../node_modules/hasown/index.js")
              , M = A.call(Function.call, Array.prototype.concat)
              , _ = A.call(Function.apply, Array.prototype.splice)
              , B = A.call(Function.call, String.prototype.replace)
              , j = A.call(Function.call, String.prototype.slice)
              , O = A.call(Function.call, RegExp.prototype.exec)
              , P = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g
              , T = /\\(\\)?/g
              , L = function(t, e) {
                var n, r = t;
                if (I(E, r) && (r = "%" + (n = E[r])[0] + "%"),
                I(x, r)) {
                    var i = x[r];
                    if (i === w && (i = k(r)),
                    void 0 === i && !e)
                        throw new c("intrinsic " + t + " exists, but is not available. Please file an issue!");
                    return {
                        alias: n,
                        name: r,
                        value: i
                    }
                }
                throw new u("intrinsic " + t + " does not exist!")
            };
            t.exports = function(t, e) {
                if ("string" != typeof t || 0 === t.length)
                    throw new c("intrinsic name must be a non-empty string");
                if (arguments.length > 1 && "boolean" != typeof e)
                    throw new c('"allowMissing" argument must be a boolean');
                if (null === O(/^%?[^%]*%?$/, t))
                    throw new u("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
                var n = function(t) {
                    var e = j(t, 0, 1)
                      , n = j(t, -1);
                    if ("%" === e && "%" !== n)
                        throw new u("invalid intrinsic syntax, expected closing `%`");
                    if ("%" === n && "%" !== e)
                        throw new u("invalid intrinsic syntax, expected opening `%`");
                    var r = [];
                    return B(t, P, (function(t, e, n, i) {
                        r[r.length] = n ? B(i, T, "$1") : e || t
                    }
                    )),
                    r
                }(t)
                  , r = n.length > 0 ? n[0] : ""
                  , i = L("%" + r + "%", e)
                  , o = i.name
                  , s = i.value
                  , a = !1
                  , l = i.alias;
                l && (r = l[0],
                _(n, M([0, 1], l)));
                for (var f = 1, h = !0; f < n.length; f += 1) {
                    var p = n[f]
                      , y = j(p, 0, 1)
                      , g = j(p, -1);
                    if (('"' === y || "'" === y || "`" === y || '"' === g || "'" === g || "`" === g) && y !== g)
                        throw new u("property names with quotes must have matching quotes");
                    if ("constructor" !== p && h || (a = !0),
                    I(x, o = "%" + (r += "." + p) + "%"))
                        s = x[o];
                    else if (null != s) {
                        if (!(p in s)) {
                            if (!e)
                                throw new c("base intrinsic for " + t + " exists, but the property is not available.");
                            return
                        }
                        if (d && f + 1 >= n.length) {
                            var m = d(s, p);
                            s = (h = !!m) && "get"in m && !("originalValue"in m.get) ? m.get : s[p]
                        } else
                            h = I(s, p),
                            s = s[p];
                        h && !a && (x[o] = s)
                    }
                }
                return s
            }
        }
        ,
        "../../../node_modules/gopd/index.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/get-intrinsic/index.js")("%Object.getOwnPropertyDescriptor%", !0);
            if (r)
                try {
                    r([], "length")
                } catch (t) {
                    r = null
                }
            t.exports = r
        }
        ,
        "../../../node_modules/has-property-descriptors/index.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/es-define-property/index.js")
              , i = function() {
                return !!r
            };
            i.hasArrayLengthDefineBug = function() {
                if (!r)
                    return null;
                try {
                    return 1 !== r([], "length", {
                        value: 1
                    }).length
                } catch (t) {
                    return !0
                }
            }
            ,
            t.exports = i
        }
        ,
        "../../../node_modules/has-proto/index.js": t => {
            "use strict";
            var e = {
                __proto__: null,
                foo: {}
            }
              , n = Object;
            t.exports = function() {
                return {
                    __proto__: e
                }.foo === e.foo && !(e instanceof n)
            }
        }
        ,
        "../../../node_modules/has-symbols/index.js": (t, e, n) => {
            "use strict";
            var r = "undefined" != typeof Symbol && Symbol
              , i = n("../../../node_modules/has-symbols/shams.js");
            t.exports = function() {
                return "function" == typeof r && "function" == typeof Symbol && "symbol" == typeof r("foo") && "symbol" == typeof Symbol("bar") && i()
            }
        }
        ,
        "../../../node_modules/has-symbols/shams.js": t => {
            "use strict";
            t.exports = function() {
                if ("function" != typeof Symbol || "function" != typeof Object.getOwnPropertySymbols)
                    return !1;
                if ("symbol" == typeof Symbol.iterator)
                    return !0;
                var t = {}
                  , e = Symbol("test")
                  , n = Object(e);
                if ("string" == typeof e)
                    return !1;
                if ("[object Symbol]" !== Object.prototype.toString.call(e))
                    return !1;
                if ("[object Symbol]" !== Object.prototype.toString.call(n))
                    return !1;
                for (e in t[e] = 42,
                t)
                    return !1;
                if ("function" == typeof Object.keys && 0 !== Object.keys(t).length)
                    return !1;
                if ("function" == typeof Object.getOwnPropertyNames && 0 !== Object.getOwnPropertyNames(t).length)
                    return !1;
                var r = Object.getOwnPropertySymbols(t);
                if (1 !== r.length || r[0] !== e)
                    return !1;
                if (!Object.prototype.propertyIsEnumerable.call(t, e))
                    return !1;
                if ("function" == typeof Object.getOwnPropertyDescriptor) {
                    var i = Object.getOwnPropertyDescriptor(t, e);
                    if (42 !== i.value || !0 !== i.enumerable)
                        return !1
                }
                return !0
            }
        }
        ,
        "../../../node_modules/has-tostringtag/shams.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/has-symbols/shams.js");
            t.exports = function() {
                return r() && !!Symbol.toStringTag
            }
        }
        ,
        "../../../node_modules/hasown/index.js": (t, e, n) => {
            "use strict";
            var r = Function.prototype.call
              , i = Object.prototype.hasOwnProperty
              , o = n("../../../node_modules/function-bind/index.js");
            t.exports = o.call(r, i)
        }
        ,
        "../../../node_modules/ieee754/index.js": (t, e) => {
            e.read = function(t, e, n, r, i) {
                var o, s, a = 8 * i - r - 1, u = (1 << a) - 1, c = u >> 1, l = -7, f = n ? i - 1 : 0, h = n ? -1 : 1, d = t[e + f];
                for (f += h,
                o = d & (1 << -l) - 1,
                d >>= -l,
                l += a; l > 0; o = 256 * o + t[e + f],
                f += h,
                l -= 8)
                    ;
                for (s = o & (1 << -l) - 1,
                o >>= -l,
                l += r; l > 0; s = 256 * s + t[e + f],
                f += h,
                l -= 8)
                    ;
                if (0 === o)
                    o = 1 - c;
                else {
                    if (o === u)
                        return s ? NaN : 1 / 0 * (d ? -1 : 1);
                    s += Math.pow(2, r),
                    o -= c
                }
                return (d ? -1 : 1) * s * Math.pow(2, o - r)
            }
            ,
            e.write = function(t, e, n, r, i, o) {
                var s, a, u, c = 8 * o - i - 1, l = (1 << c) - 1, f = l >> 1, h = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0, d = r ? 0 : o - 1, p = r ? 1 : -1, y = e < 0 || 0 === e && 1 / e < 0 ? 1 : 0;
                for (e = Math.abs(e),
                isNaN(e) || e === 1 / 0 ? (a = isNaN(e) ? 1 : 0,
                s = l) : (s = Math.floor(Math.log(e) / Math.LN2),
                e * (u = Math.pow(2, -s)) < 1 && (s--,
                u *= 2),
                (e += s + f >= 1 ? h / u : h * Math.pow(2, 1 - f)) * u >= 2 && (s++,
                u /= 2),
                s + f >= l ? (a = 0,
                s = l) : s + f >= 1 ? (a = (e * u - 1) * Math.pow(2, i),
                s += f) : (a = e * Math.pow(2, f - 1) * Math.pow(2, i),
                s = 0)); i >= 8; t[n + d] = 255 & a,
                d += p,
                a /= 256,
                i -= 8)
                    ;
                for (s = s << i | a,
                c += i; c > 0; t[n + d] = 255 & s,
                d += p,
                s /= 256,
                c -= 8)
                    ;
                t[n + d - p] |= 128 * y
            }
        }
        ,
        "../../../node_modules/inherits/inherits_browser.js": t => {
            "function" == typeof Object.create ? t.exports = function(t, e) {
                e && (t.super_ = e,
                t.prototype = Object.create(e.prototype, {
                    constructor: {
                        value: t,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }))
            }
            : t.exports = function(t, e) {
                if (e) {
                    t.super_ = e;
                    var n = function() {};
                    n.prototype = e.prototype,
                    t.prototype = new n,
                    t.prototype.constructor = t
                }
            }
        }
        ,
        "../../../node_modules/is-arguments/index.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/has-tostringtag/shams.js")()
              , i = n("../../../node_modules/call-bind/callBound.js")("Object.prototype.toString")
              , o = function(t) {
                return !(r && t && "object" == typeof t && Symbol.toStringTag in t) && "[object Arguments]" === i(t)
            }
              , s = function(t) {
                return !!o(t) || null !== t && "object" == typeof t && "number" == typeof t.length && t.length >= 0 && "[object Array]" !== i(t) && "[object Function]" === i(t.callee)
            }
              , a = function() {
                return o(arguments)
            }();
            o.isLegacyArguments = s,
            t.exports = a ? o : s
        }
        ,
        "../../../node_modules/is-callable/index.js": t => {
            "use strict";
            var e, n, r = Function.prototype.toString, i = "object" == typeof Reflect && null !== Reflect && Reflect.apply;
            if ("function" == typeof i && "function" == typeof Object.defineProperty)
                try {
                    e = Object.defineProperty({}, "length", {
                        get: function() {
                            throw n
                        }
                    }),
                    n = {},
                    i((function() {
                        throw 42
                    }
                    ), null, e)
                } catch (t) {
                    t !== n && (i = null)
                }
            else
                i = null;
            var o = /^\s*class\b/
              , s = function(t) {
                try {
                    var e = r.call(t);
                    return o.test(e)
                } catch (t) {
                    return !1
                }
            }
              , a = function(t) {
                try {
                    return !s(t) && (r.call(t),
                    !0)
                } catch (t) {
                    return !1
                }
            }
              , u = Object.prototype.toString
              , c = "function" == typeof Symbol && !!Symbol.toStringTag
              , l = !(0 in [, ])
              , f = function() {
                return !1
            };
            if ("object" == typeof document) {
                var h = document.all;
                u.call(h) === u.call(document.all) && (f = function(t) {
                    if ((l || !t) && (void 0 === t || "object" == typeof t))
                        try {
                            var e = u.call(t);
                            return ("[object HTMLAllCollection]" === e || "[object HTML document.all class]" === e || "[object HTMLCollection]" === e || "[object Object]" === e) && null == t("")
                        } catch (t) {}
                    return !1
                }
                )
            }
            t.exports = i ? function(t) {
                if (f(t))
                    return !0;
                if (!t)
                    return !1;
                if ("function" != typeof t && "object" != typeof t)
                    return !1;
                try {
                    i(t, null, e)
                } catch (t) {
                    if (t !== n)
                        return !1
                }
                return !s(t) && a(t)
            }
            : function(t) {
                if (f(t))
                    return !0;
                if (!t)
                    return !1;
                if ("function" != typeof t && "object" != typeof t)
                    return !1;
                if (c)
                    return a(t);
                if (s(t))
                    return !1;
                var e = u.call(t);
                return !("[object Function]" !== e && "[object GeneratorFunction]" !== e && !/^\[object HTML/.test(e)) && a(t)
            }
        }
        ,
        "../../../node_modules/is-generator-function/index.js": (t, e, n) => {
            "use strict";
            var r, i = Object.prototype.toString, o = Function.prototype.toString, s = /^\s*(?:function)?\*/, a = n("../../../node_modules/has-tostringtag/shams.js")(), u = Object.getPrototypeOf;
            t.exports = function(t) {
                if ("function" != typeof t)
                    return !1;
                if (s.test(o.call(t)))
                    return !0;
                if (!a)
                    return "[object GeneratorFunction]" === i.call(t);
                if (!u)
                    return !1;
                if (void 0 === r) {
                    var e = function() {
                        if (!a)
                            return !1;
                        try {
                            return Function("return function*() {}")()
                        } catch (t) {}
                    }();
                    r = !!e && u(e)
                }
                return u(t) === r
            }
        }
        ,
        "../../../node_modules/is-nan/implementation.js": t => {
            "use strict";
            t.exports = function(t) {
                return t != t
            }
        }
        ,
        "../../../node_modules/is-nan/index.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/call-bind/index.js")
              , i = n("../../../node_modules/define-properties/index.js")
              , o = n("../../../node_modules/is-nan/implementation.js")
              , s = n("../../../node_modules/is-nan/polyfill.js")
              , a = n("../../../node_modules/is-nan/shim.js")
              , u = r(s(), Number);
            i(u, {
                getPolyfill: s,
                implementation: o,
                shim: a
            }),
            t.exports = u
        }
        ,
        "../../../node_modules/is-nan/polyfill.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/is-nan/implementation.js");
            t.exports = function() {
                return Number.isNaN && Number.isNaN(NaN) && !Number.isNaN("a") ? Number.isNaN : r
            }
        }
        ,
        "../../../node_modules/is-nan/shim.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/define-properties/index.js")
              , i = n("../../../node_modules/is-nan/polyfill.js");
            t.exports = function() {
                var t = i();
                return r(Number, {
                    isNaN: t
                }, {
                    isNaN: function() {
                        return Number.isNaN !== t
                    }
                }),
                t
            }
        }
        ,
        "../../../node_modules/is-typed-array/index.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/which-typed-array/index.js");
            t.exports = function(t) {
                return !!r(t)
            }
        }
        ,
        "../../../node_modules/jayson/lib/client/browser/index.js": (t, e, n) => {
            "use strict";
            const r = n("../../../node_modules/uuid/dist/esm-browser/index.js").v4
              , i = n("../../../node_modules/jayson/lib/generateRequest.js")
              , o = function(t, e) {
                if (!(this instanceof o))
                    return new o(t,e);
                e || (e = {}),
                this.options = {
                    reviver: void 0 !== e.reviver ? e.reviver : null,
                    replacer: void 0 !== e.replacer ? e.replacer : null,
                    generator: void 0 !== e.generator ? e.generator : function() {
                        return r()
                    }
                    ,
                    version: void 0 !== e.version ? e.version : 2,
                    notificationIdNull: "boolean" == typeof e.notificationIdNull && e.notificationIdNull
                },
                this.callServer = t
            };
            t.exports = o,
            o.prototype.request = function(t, e, n, r) {
                const o = this;
                let s = null;
                const a = Array.isArray(t) && "function" == typeof e;
                if (1 === this.options.version && a)
                    throw new TypeError("JSON-RPC 1.0 does not support batching");
                if (a || !a && t && "object" == typeof t && "function" == typeof e)
                    r = e,
                    s = t;
                else {
                    "function" == typeof n && (r = n,
                    n = void 0);
                    const o = "function" == typeof r;
                    try {
                        s = i(t, e, n, {
                            generator: this.options.generator,
                            version: this.options.version,
                            notificationIdNull: this.options.notificationIdNull
                        })
                    } catch (t) {
                        if (o)
                            return r(t);
                        throw t
                    }
                    if (!o)
                        return s
                }
                let u;
                try {
                    u = JSON.stringify(s, this.options.replacer)
                } catch (t) {
                    return r(t)
                }
                return this.callServer(u, (function(t, e) {
                    o._parseResponse(t, e, r)
                }
                )),
                s
            }
            ,
            o.prototype._parseResponse = function(t, e, n) {
                if (t)
                    return void n(t);
                if (!e)
                    return n();
                let r;
                try {
                    r = JSON.parse(e, this.options.reviver)
                } catch (t) {
                    return n(t)
                }
                if (3 === n.length) {
                    if (Array.isArray(r)) {
                        const t = function(t) {
                            return void 0 !== t.error
                        }
                          , e = function(e) {
                            return !t(e)
                        };
                        return n(null, r.filter(t), r.filter(e))
                    }
                    return n(null, r.error, r.result)
                }
                n(null, r)
            }
        }
        ,
        "../../../node_modules/jayson/lib/generateRequest.js": (t, e, n) => {
            "use strict";
            const r = n("../../../node_modules/uuid/dist/esm-browser/index.js").v4;
            t.exports = function(t, e, n, i) {
                if ("string" != typeof t)
                    throw new TypeError(t + " must be a string");
                const o = "number" == typeof (i = i || {}).version ? i.version : 2;
                if (1 !== o && 2 !== o)
                    throw new TypeError(o + " must be 1 or 2");
                const s = {
                    method: t
                };
                if (2 === o && (s.jsonrpc = "2.0"),
                e) {
                    if ("object" != typeof e && !Array.isArray(e))
                        throw new TypeError(e + " must be an object, array or omitted");
                    s.params = e
                }
                if (void 0 === n) {
                    const t = "function" == typeof i.generator ? i.generator : function() {
                        return r()
                    }
                    ;
                    s.id = t(s, i)
                } else
                    2 === o && null === n ? i.notificationIdNull && (s.id = null) : s.id = n;
                return s
            }
        }
        ,
        "../../../node_modules/object-is/implementation.js": t => {
            "use strict";
            var e = function(t) {
                return t != t
            };
            t.exports = function(t, n) {
                return 0 === t && 0 === n ? 1 / t == 1 / n : t === n || !(!e(t) || !e(n))
            }
        }
        ,
        "../../../node_modules/object-is/index.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/define-properties/index.js")
              , i = n("../../../node_modules/call-bind/index.js")
              , o = n("../../../node_modules/object-is/implementation.js")
              , s = n("../../../node_modules/object-is/polyfill.js")
              , a = n("../../../node_modules/object-is/shim.js")
              , u = i(s(), Object);
            r(u, {
                getPolyfill: s,
                implementation: o,
                shim: a
            }),
            t.exports = u
        }
        ,
        "../../../node_modules/object-is/polyfill.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/object-is/implementation.js");
            t.exports = function() {
                return "function" == typeof Object.is ? Object.is : r
            }
        }
        ,
        "../../../node_modules/object-is/shim.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/object-is/polyfill.js")
              , i = n("../../../node_modules/define-properties/index.js");
            t.exports = function() {
                var t = r();
                return i(Object, {
                    is: t
                }, {
                    is: function() {
                        return Object.is !== t
                    }
                }),
                t
            }
        }
        ,
        "../../../node_modules/object-keys/implementation.js": (t, e, n) => {
            "use strict";
            var r;
            if (!Object.keys) {
                var i = Object.prototype.hasOwnProperty
                  , o = Object.prototype.toString
                  , s = n("../../../node_modules/object-keys/isArguments.js")
                  , a = Object.prototype.propertyIsEnumerable
                  , u = !a.call({
                    toString: null
                }, "toString")
                  , c = a.call((function() {}
                ), "prototype")
                  , l = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"]
                  , f = function(t) {
                    var e = t.constructor;
                    return e && e.prototype === t
                }
                  , h = {
                    $applicationCache: !0,
                    $console: !0,
                    $external: !0,
                    $frame: !0,
                    $frameElement: !0,
                    $frames: !0,
                    $innerHeight: !0,
                    $innerWidth: !0,
                    $onmozfullscreenchange: !0,
                    $onmozfullscreenerror: !0,
                    $outerHeight: !0,
                    $outerWidth: !0,
                    $pageXOffset: !0,
                    $pageYOffset: !0,
                    $parent: !0,
                    $scrollLeft: !0,
                    $scrollTop: !0,
                    $scrollX: !0,
                    $scrollY: !0,
                    $self: !0,
                    $webkitIndexedDB: !0,
                    $webkitStorageInfo: !0,
                    $window: !0
                }
                  , d = function() {
                    if ("undefined" == typeof window)
                        return !1;
                    for (var t in window)
                        try {
                            if (!h["$" + t] && i.call(window, t) && null !== window[t] && "object" == typeof window[t])
                                try {
                                    f(window[t])
                                } catch (t) {
                                    return !0
                                }
                        } catch (t) {
                            return !0
                        }
                    return !1
                }();
                r = function(t) {
                    var e = null !== t && "object" == typeof t
                      , n = "[object Function]" === o.call(t)
                      , r = s(t)
                      , a = e && "[object String]" === o.call(t)
                      , h = [];
                    if (!e && !n && !r)
                        throw new TypeError("Object.keys called on a non-object");
                    var p = c && n;
                    if (a && t.length > 0 && !i.call(t, 0))
                        for (var y = 0; y < t.length; ++y)
                            h.push(String(y));
                    if (r && t.length > 0)
                        for (var g = 0; g < t.length; ++g)
                            h.push(String(g));
                    else
                        for (var m in t)
                            p && "prototype" === m || !i.call(t, m) || h.push(String(m));
                    if (u)
                        for (var b = function(t) {
                            if ("undefined" == typeof window || !d)
                                return f(t);
                            try {
                                return f(t)
                            } catch (t) {
                                return !1
                            }
                        }(t), w = 0; w < l.length; ++w)
                            b && "constructor" === l[w] || !i.call(t, l[w]) || h.push(l[w]);
                    return h
                }
            }
            t.exports = r
        }
        ,
        "../../../node_modules/object-keys/index.js": (t, e, n) => {
            "use strict";
            var r = Array.prototype.slice
              , i = n("../../../node_modules/object-keys/isArguments.js")
              , o = Object.keys
              , s = o ? function(t) {
                return o(t)
            }
            : n("../../../node_modules/object-keys/implementation.js")
              , a = Object.keys;
            s.shim = function() {
                if (Object.keys) {
                    var t = function() {
                        var t = Object.keys(arguments);
                        return t && t.length === arguments.length
                    }(1, 2);
                    t || (Object.keys = function(t) {
                        return i(t) ? a(r.call(t)) : a(t)
                    }
                    )
                } else
                    Object.keys = s;
                return Object.keys || s
            }
            ,
            t.exports = s
        }
        ,
        "../../../node_modules/object-keys/isArguments.js": t => {
            "use strict";
            var e = Object.prototype.toString;
            t.exports = function(t) {
                var n = e.call(t)
                  , r = "[object Arguments]" === n;
                return r || (r = "[object Array]" !== n && null !== t && "object" == typeof t && "number" == typeof t.length && t.length >= 0 && "[object Function]" === e.call(t.callee)),
                r
            }
        }
        ,
        "../../../node_modules/possible-typed-array-names/index.js": t => {
            "use strict";
            t.exports = ["Float32Array", "Float64Array", "Int8Array", "Int16Array", "Int32Array", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "BigInt64Array", "BigUint64Array"]
        }
        ,
        "../../../node_modules/process/browser.js": t => {
            var e, n, r = t.exports = {};
            function i() {
                throw new Error("setTimeout has not been defined")
            }
            function o() {
                throw new Error("clearTimeout has not been defined")
            }
            function s(t) {
                if (e === setTimeout)
                    return setTimeout(t, 0);
                if ((e === i || !e) && setTimeout)
                    return e = setTimeout,
                    setTimeout(t, 0);
                try {
                    return e(t, 0)
                } catch (n) {
                    try {
                        return e.call(null, t, 0)
                    } catch (n) {
                        return e.call(this, t, 0)
                    }
                }
            }
            !function() {
                try {
                    e = "function" == typeof setTimeout ? setTimeout : i
                } catch (t) {
                    e = i
                }
                try {
                    n = "function" == typeof clearTimeout ? clearTimeout : o
                } catch (t) {
                    n = o
                }
            }();
            var a, u = [], c = !1, l = -1;
            function f() {
                c && a && (c = !1,
                a.length ? u = a.concat(u) : l = -1,
                u.length && h())
            }
            function h() {
                if (!c) {
                    var t = s(f);
                    c = !0;
                    for (var e = u.length; e; ) {
                        for (a = u,
                        u = []; ++l < e; )
                            a && a[l].run();
                        l = -1,
                        e = u.length
                    }
                    a = null,
                    c = !1,
                    function(t) {
                        if (n === clearTimeout)
                            return clearTimeout(t);
                        if ((n === o || !n) && clearTimeout)
                            return n = clearTimeout,
                            clearTimeout(t);
                        try {
                            return n(t)
                        } catch (e) {
                            try {
                                return n.call(null, t)
                            } catch (e) {
                                return n.call(this, t)
                            }
                        }
                    }(t)
                }
            }
            function d(t, e) {
                this.fun = t,
                this.array = e
            }
            function p() {}
            r.nextTick = function(t) {
                var e = new Array(arguments.length - 1);
                if (arguments.length > 1)
                    for (var n = 1; n < arguments.length; n++)
                        e[n - 1] = arguments[n];
                u.push(new d(t,e)),
                1 !== u.length || c || s(h)
            }
            ,
            d.prototype.run = function() {
                this.fun.apply(null, this.array)
            }
            ,
            r.title = "browser",
            r.browser = !0,
            r.env = {},
            r.argv = [],
            r.version = "",
            r.versions = {},
            r.on = p,
            r.addListener = p,
            r.once = p,
            r.off = p,
            r.removeListener = p,
            r.removeAllListeners = p,
            r.emit = p,
            r.prependListener = p,
            r.prependOnceListener = p,
            r.listeners = function(t) {
                return []
            }
            ,
            r.binding = function(t) {
                throw new Error("process.binding is not supported")
            }
            ,
            r.cwd = function() {
                return "/"
            }
            ,
            r.chdir = function(t) {
                throw new Error("process.chdir is not supported")
            }
            ,
            r.umask = function() {
                return 0
            }
        }
        ,
        "../../../node_modules/regenerator-runtime/runtime.js": t => {
            var e = function(t) {
                "use strict";
                var e, n = Object.prototype, r = n.hasOwnProperty, i = "function" == typeof Symbol ? Symbol : {}, o = i.iterator || "@@iterator", s = i.asyncIterator || "@@asyncIterator", a = i.toStringTag || "@@toStringTag";
                function u(t, e, n) {
                    return Object.defineProperty(t, e, {
                        value: n,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }),
                    t[e]
                }
                try {
                    u({}, "")
                } catch (t) {
                    u = function(t, e, n) {
                        return t[e] = n
                    }
                }
                function c(t, e, n, r) {
                    var i = e && e.prototype instanceof g ? e : g
                      , o = Object.create(i.prototype)
                      , s = new _(r || []);
                    return o._invoke = function(t, e, n) {
                        var r = f;
                        return function(i, o) {
                            if (r === d)
                                throw new Error("Generator is already running");
                            if (r === p) {
                                if ("throw" === i)
                                    throw o;
                                return j()
                            }
                            for (n.method = i,
                            n.arg = o; ; ) {
                                var s = n.delegate;
                                if (s) {
                                    var a = A(s, n);
                                    if (a) {
                                        if (a === y)
                                            continue;
                                        return a
                                    }
                                }
                                if ("next" === n.method)
                                    n.sent = n._sent = n.arg;
                                else if ("throw" === n.method) {
                                    if (r === f)
                                        throw r = p,
                                        n.arg;
                                    n.dispatchException(n.arg)
                                } else
                                    "return" === n.method && n.abrupt("return", n.arg);
                                r = d;
                                var u = l(t, e, n);
                                if ("normal" === u.type) {
                                    if (r = n.done ? p : h,
                                    u.arg === y)
                                        continue;
                                    return {
                                        value: u.arg,
                                        done: n.done
                                    }
                                }
                                "throw" === u.type && (r = p,
                                n.method = "throw",
                                n.arg = u.arg)
                            }
                        }
                    }(t, n, s),
                    o
                }
                function l(t, e, n) {
                    try {
                        return {
                            type: "normal",
                            arg: t.call(e, n)
                        }
                    } catch (t) {
                        return {
                            type: "throw",
                            arg: t
                        }
                    }
                }
                t.wrap = c;
                var f = "suspendedStart"
                  , h = "suspendedYield"
                  , d = "executing"
                  , p = "completed"
                  , y = {};
                function g() {}
                function m() {}
                function b() {}
                var w = {};
                u(w, o, (function() {
                    return this
                }
                ));
                var v = Object.getPrototypeOf
                  , x = v && v(v(B([])));
                x && x !== n && r.call(x, o) && (w = x);
                var S = b.prototype = g.prototype = Object.create(w);
                function k(t) {
                    ["next", "throw", "return"].forEach((function(e) {
                        u(t, e, (function(t) {
                            return this._invoke(e, t)
                        }
                        ))
                    }
                    ))
                }
                function E(t, e) {
                    function n(i, o, s, a) {
                        var u = l(t[i], t, o);
                        if ("throw" !== u.type) {
                            var c = u.arg
                              , f = c.value;
                            return f && "object" == typeof f && r.call(f, "__await") ? e.resolve(f.__await).then((function(t) {
                                n("next", t, s, a)
                            }
                            ), (function(t) {
                                n("throw", t, s, a)
                            }
                            )) : e.resolve(f).then((function(t) {
                                c.value = t,
                                s(c)
                            }
                            ), (function(t) {
                                return n("throw", t, s, a)
                            }
                            ))
                        }
                        a(u.arg)
                    }
                    var i;
                    this._invoke = function(t, r) {
                        function o() {
                            return new e((function(e, i) {
                                n(t, r, e, i)
                            }
                            ))
                        }
                        return i = i ? i.then(o, o) : o()
                    }
                }
                function A(t, n) {
                    var r = t.iterator[n.method];
                    if (r === e) {
                        if (n.delegate = null,
                        "throw" === n.method) {
                            if (t.iterator.return && (n.method = "return",
                            n.arg = e,
                            A(t, n),
                            "throw" === n.method))
                                return y;
                            n.method = "throw",
                            n.arg = new TypeError("The iterator does not provide a 'throw' method")
                        }
                        return y
                    }
                    var i = l(r, t.iterator, n.arg);
                    if ("throw" === i.type)
                        return n.method = "throw",
                        n.arg = i.arg,
                        n.delegate = null,
                        y;
                    var o = i.arg;
                    return o ? o.done ? (n[t.resultName] = o.value,
                    n.next = t.nextLoc,
                    "return" !== n.method && (n.method = "next",
                    n.arg = e),
                    n.delegate = null,
                    y) : o : (n.method = "throw",
                    n.arg = new TypeError("iterator result is not an object"),
                    n.delegate = null,
                    y)
                }
                function I(t) {
                    var e = {
                        tryLoc: t[0]
                    };
                    1 in t && (e.catchLoc = t[1]),
                    2 in t && (e.finallyLoc = t[2],
                    e.afterLoc = t[3]),
                    this.tryEntries.push(e)
                }
                function M(t) {
                    var e = t.completion || {};
                    e.type = "normal",
                    delete e.arg,
                    t.completion = e
                }
                function _(t) {
                    this.tryEntries = [{
                        tryLoc: "root"
                    }],
                    t.forEach(I, this),
                    this.reset(!0)
                }
                function B(t) {
                    if (t) {
                        var n = t[o];
                        if (n)
                            return n.call(t);
                        if ("function" == typeof t.next)
                            return t;
                        if (!isNaN(t.length)) {
                            var i = -1
                              , s = function n() {
                                for (; ++i < t.length; )
                                    if (r.call(t, i))
                                        return n.value = t[i],
                                        n.done = !1,
                                        n;
                                return n.value = e,
                                n.done = !0,
                                n
                            };
                            return s.next = s
                        }
                    }
                    return {
                        next: j
                    }
                }
                function j() {
                    return {
                        value: e,
                        done: !0
                    }
                }
                return m.prototype = b,
                u(S, "constructor", b),
                u(b, "constructor", m),
                m.displayName = u(b, a, "GeneratorFunction"),
                t.isGeneratorFunction = function(t) {
                    var e = "function" == typeof t && t.constructor;
                    return !!e && (e === m || "GeneratorFunction" === (e.displayName || e.name))
                }
                ,
                t.mark = function(t) {
                    return Object.setPrototypeOf ? Object.setPrototypeOf(t, b) : (t.__proto__ = b,
                    u(t, a, "GeneratorFunction")),
                    t.prototype = Object.create(S),
                    t
                }
                ,
                t.awrap = function(t) {
                    return {
                        __await: t
                    }
                }
                ,
                k(E.prototype),
                u(E.prototype, s, (function() {
                    return this
                }
                )),
                t.AsyncIterator = E,
                t.async = function(e, n, r, i, o) {
                    void 0 === o && (o = Promise);
                    var s = new E(c(e, n, r, i),o);
                    return t.isGeneratorFunction(n) ? s : s.next().then((function(t) {
                        return t.done ? t.value : s.next()
                    }
                    ))
                }
                ,
                k(S),
                u(S, a, "Generator"),
                u(S, o, (function() {
                    return this
                }
                )),
                u(S, "toString", (function() {
                    return "[object Generator]"
                }
                )),
                t.keys = function(t) {
                    var e = [];
                    for (var n in t)
                        e.push(n);
                    return e.reverse(),
                    function n() {
                        for (; e.length; ) {
                            var r = e.pop();
                            if (r in t)
                                return n.value = r,
                                n.done = !1,
                                n
                        }
                        return n.done = !0,
                        n
                    }
                }
                ,
                t.values = B,
                _.prototype = {
                    constructor: _,
                    reset: function(t) {
                        if (this.prev = 0,
                        this.next = 0,
                        this.sent = this._sent = e,
                        this.done = !1,
                        this.delegate = null,
                        this.method = "next",
                        this.arg = e,
                        this.tryEntries.forEach(M),
                        !t)
                            for (var n in this)
                                "t" === n.charAt(0) && r.call(this, n) && !isNaN(+n.slice(1)) && (this[n] = e)
                    },
                    stop: function() {
                        this.done = !0;
                        var t = this.tryEntries[0].completion;
                        if ("throw" === t.type)
                            throw t.arg;
                        return this.rval
                    },
                    dispatchException: function(t) {
                        if (this.done)
                            throw t;
                        var n = this;
                        function i(r, i) {
                            return a.type = "throw",
                            a.arg = t,
                            n.next = r,
                            i && (n.method = "next",
                            n.arg = e),
                            !!i
                        }
                        for (var o = this.tryEntries.length - 1; o >= 0; --o) {
                            var s = this.tryEntries[o]
                              , a = s.completion;
                            if ("root" === s.tryLoc)
                                return i("end");
                            if (s.tryLoc <= this.prev) {
                                var u = r.call(s, "catchLoc")
                                  , c = r.call(s, "finallyLoc");
                                if (u && c) {
                                    if (this.prev < s.catchLoc)
                                        return i(s.catchLoc, !0);
                                    if (this.prev < s.finallyLoc)
                                        return i(s.finallyLoc)
                                } else if (u) {
                                    if (this.prev < s.catchLoc)
                                        return i(s.catchLoc, !0)
                                } else {
                                    if (!c)
                                        throw new Error("try statement without catch or finally");
                                    if (this.prev < s.finallyLoc)
                                        return i(s.finallyLoc)
                                }
                            }
                        }
                    },
                    abrupt: function(t, e) {
                        for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                            var i = this.tryEntries[n];
                            if (i.tryLoc <= this.prev && r.call(i, "finallyLoc") && this.prev < i.finallyLoc) {
                                var o = i;
                                break
                            }
                        }
                        o && ("break" === t || "continue" === t) && o.tryLoc <= e && e <= o.finallyLoc && (o = null);
                        var s = o ? o.completion : {};
                        return s.type = t,
                        s.arg = e,
                        o ? (this.method = "next",
                        this.next = o.finallyLoc,
                        y) : this.complete(s)
                    },
                    complete: function(t, e) {
                        if ("throw" === t.type)
                            throw t.arg;
                        return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg,
                        this.method = "return",
                        this.next = "end") : "normal" === t.type && e && (this.next = e),
                        y
                    },
                    finish: function(t) {
                        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                            var n = this.tryEntries[e];
                            if (n.finallyLoc === t)
                                return this.complete(n.completion, n.afterLoc),
                                M(n),
                                y
                        }
                    },
                    catch: function(t) {
                        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                            var n = this.tryEntries[e];
                            if (n.tryLoc === t) {
                                var r = n.completion;
                                if ("throw" === r.type) {
                                    var i = r.arg;
                                    M(n)
                                }
                                return i
                            }
                        }
                        throw new Error("illegal catch attempt")
                    },
                    delegateYield: function(t, n, r) {
                        return this.delegate = {
                            iterator: B(t),
                            resultName: n,
                            nextLoc: r
                        },
                        "next" === this.method && (this.arg = e),
                        y
                    }
                },
                t
            }(t.exports);
            try {
                regeneratorRuntime = e
            } catch (t) {
                "object" == typeof globalThis ? globalThis.regeneratorRuntime = e : Function("r", "regeneratorRuntime = r")(e)
            }
        }
        ,
        "../../../node_modules/rpc-websockets/node_modules/eventemitter3/index.js": t => {
            "use strict";
            var e = Object.prototype.hasOwnProperty
              , n = "~";
            function r() {}
            function i(t, e, n) {
                this.fn = t,
                this.context = e,
                this.once = n || !1
            }
            function o(t, e, r, o, s) {
                if ("function" != typeof r)
                    throw new TypeError("The listener must be a function");
                var a = new i(r,o || t,s)
                  , u = n ? n + e : e;
                return t._events[u] ? t._events[u].fn ? t._events[u] = [t._events[u], a] : t._events[u].push(a) : (t._events[u] = a,
                t._eventsCount++),
                t
            }
            function s(t, e) {
                0 == --t._eventsCount ? t._events = new r : delete t._events[e]
            }
            function a() {
                this._events = new r,
                this._eventsCount = 0
            }
            Object.create && (r.prototype = Object.create(null),
            (new r).__proto__ || (n = !1)),
            a.prototype.eventNames = function() {
                var t, r, i = [];
                if (0 === this._eventsCount)
                    return i;
                for (r in t = this._events)
                    e.call(t, r) && i.push(n ? r.slice(1) : r);
                return Object.getOwnPropertySymbols ? i.concat(Object.getOwnPropertySymbols(t)) : i
            }
            ,
            a.prototype.listeners = function(t) {
                var e = n ? n + t : t
                  , r = this._events[e];
                if (!r)
                    return [];
                if (r.fn)
                    return [r.fn];
                for (var i = 0, o = r.length, s = new Array(o); i < o; i++)
                    s[i] = r[i].fn;
                return s
            }
            ,
            a.prototype.listenerCount = function(t) {
                var e = n ? n + t : t
                  , r = this._events[e];
                return r ? r.fn ? 1 : r.length : 0
            }
            ,
            a.prototype.emit = function(t, e, r, i, o, s) {
                var a = n ? n + t : t;
                if (!this._events[a])
                    return !1;
                var u, c, l = this._events[a], f = arguments.length;
                if (l.fn) {
                    switch (l.once && this.removeListener(t, l.fn, void 0, !0),
                    f) {
                    case 1:
                        return l.fn.call(l.context),
                        !0;
                    case 2:
                        return l.fn.call(l.context, e),
                        !0;
                    case 3:
                        return l.fn.call(l.context, e, r),
                        !0;
                    case 4:
                        return l.fn.call(l.context, e, r, i),
                        !0;
                    case 5:
                        return l.fn.call(l.context, e, r, i, o),
                        !0;
                    case 6:
                        return l.fn.call(l.context, e, r, i, o, s),
                        !0
                    }
                    for (c = 1,
                    u = new Array(f - 1); c < f; c++)
                        u[c - 1] = arguments[c];
                    l.fn.apply(l.context, u)
                } else {
                    var h, d = l.length;
                    for (c = 0; c < d; c++)
                        switch (l[c].once && this.removeListener(t, l[c].fn, void 0, !0),
                        f) {
                        case 1:
                            l[c].fn.call(l[c].context);
                            break;
                        case 2:
                            l[c].fn.call(l[c].context, e);
                            break;
                        case 3:
                            l[c].fn.call(l[c].context, e, r);
                            break;
                        case 4:
                            l[c].fn.call(l[c].context, e, r, i);
                            break;
                        default:
                            if (!u)
                                for (h = 1,
                                u = new Array(f - 1); h < f; h++)
                                    u[h - 1] = arguments[h];
                            l[c].fn.apply(l[c].context, u)
                        }
                }
                return !0
            }
            ,
            a.prototype.on = function(t, e, n) {
                return o(this, t, e, n, !1)
            }
            ,
            a.prototype.once = function(t, e, n) {
                return o(this, t, e, n, !0)
            }
            ,
            a.prototype.removeListener = function(t, e, r, i) {
                var o = n ? n + t : t;
                if (!this._events[o])
                    return this;
                if (!e)
                    return s(this, o),
                    this;
                var a = this._events[o];
                if (a.fn)
                    a.fn !== e || i && !a.once || r && a.context !== r || s(this, o);
                else {
                    for (var u = 0, c = [], l = a.length; u < l; u++)
                        (a[u].fn !== e || i && !a[u].once || r && a[u].context !== r) && c.push(a[u]);
                    c.length ? this._events[o] = 1 === c.length ? c[0] : c : s(this, o)
                }
                return this
            }
            ,
            a.prototype.removeAllListeners = function(t) {
                var e;
                return t ? (e = n ? n + t : t,
                this._events[e] && s(this, e)) : (this._events = new r,
                this._eventsCount = 0),
                this
            }
            ,
            a.prototype.off = a.prototype.removeListener,
            a.prototype.addListener = a.prototype.on,
            a.prefixed = n,
            a.EventEmitter = a,
            t.exports = a
        }
        ,
        "../../../node_modules/safe-buffer/index.js": (t, e, n) => {
            var r = n("../../../node_modules/buffer/index.js")
              , i = r.Buffer;
            function o(t, e) {
                for (var n in t)
                    e[n] = t[n]
            }
            function s(t, e, n) {
                return i(t, e, n)
            }
            i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow ? t.exports = r : (o(r, e),
            e.Buffer = s),
            o(i, s),
            s.from = function(t, e, n) {
                if ("number" == typeof t)
                    throw new TypeError("Argument must not be a number");
                return i(t, e, n)
            }
            ,
            s.alloc = function(t, e, n) {
                if ("number" != typeof t)
                    throw new TypeError("Argument must be a number");
                var r = i(t);
                return void 0 !== e ? "string" == typeof n ? r.fill(e, n) : r.fill(e) : r.fill(0),
                r
            }
            ,
            s.allocUnsafe = function(t) {
                if ("number" != typeof t)
                    throw new TypeError("Argument must be a number");
                return i(t)
            }
            ,
            s.allocUnsafeSlow = function(t) {
                if ("number" != typeof t)
                    throw new TypeError("Argument must be a number");
                return r.SlowBuffer(t)
            }
        }
        ,
        "../../../node_modules/set-function-length/index.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/get-intrinsic/index.js")
              , i = n("../../../node_modules/define-data-property/index.js")
              , o = n("../../../node_modules/has-property-descriptors/index.js")()
              , s = n("../../../node_modules/gopd/index.js")
              , a = n("../../../node_modules/es-errors/type.js")
              , u = r("%Math.floor%");
            t.exports = function(t, e) {
                if ("function" != typeof t)
                    throw new a("`fn` is not a function");
                if ("number" != typeof e || e < 0 || e > 4294967295 || u(e) !== e)
                    throw new a("`length` must be a positive 32-bit integer");
                var n = arguments.length > 2 && !!arguments[2]
                  , r = !0
                  , c = !0;
                if ("length"in t && s) {
                    var l = s(t, "length");
                    l && !l.configurable && (r = !1),
                    l && !l.writable && (c = !1)
                }
                return (r || c || !n) && (o ? i(t, "length", e, !0, !0) : i(t, "length", e)),
                t
            }
        }
        ,
        "../../../node_modules/text-encoding-utf-8/lib/encoding.lib.js": (t, e) => {
            "use strict";
            function n(t, e, n) {
                return e <= t && t <= n
            }
            function r(t) {
                if (void 0 === t)
                    return {};
                if (t === Object(t))
                    return t;
                throw TypeError("Could not convert argument to dictionary")
            }
            function i(t) {
                this.tokens = [].slice.call(t)
            }
            i.prototype = {
                endOfStream: function() {
                    return !this.tokens.length
                },
                read: function() {
                    return this.tokens.length ? this.tokens.shift() : -1
                },
                prepend: function(t) {
                    if (Array.isArray(t))
                        for (var e = t; e.length; )
                            this.tokens.unshift(e.pop());
                    else
                        this.tokens.unshift(t)
                },
                push: function(t) {
                    if (Array.isArray(t))
                        for (var e = t; e.length; )
                            this.tokens.push(e.shift());
                    else
                        this.tokens.push(t)
                }
            };
            var o = -1;
            function s(t, e) {
                if (t)
                    throw TypeError("Decoder error");
                return e || 65533
            }
            var a = "utf-8";
            function u(t, e) {
                if (!(this instanceof u))
                    return new u(t,e);
                if ((t = void 0 !== t ? String(t).toLowerCase() : a) !== a)
                    throw new Error("Encoding not supported. Only utf-8 is supported");
                e = r(e),
                this._streaming = !1,
                this._BOMseen = !1,
                this._decoder = null,
                this._fatal = Boolean(e.fatal),
                this._ignoreBOM = Boolean(e.ignoreBOM),
                Object.defineProperty(this, "encoding", {
                    value: "utf-8"
                }),
                Object.defineProperty(this, "fatal", {
                    value: this._fatal
                }),
                Object.defineProperty(this, "ignoreBOM", {
                    value: this._ignoreBOM
                })
            }
            function c(t, e) {
                if (!(this instanceof c))
                    return new c(t,e);
                if ((t = void 0 !== t ? String(t).toLowerCase() : a) !== a)
                    throw new Error("Encoding not supported. Only utf-8 is supported");
                e = r(e),
                this._streaming = !1,
                this._encoder = null,
                this._options = {
                    fatal: Boolean(e.fatal)
                },
                Object.defineProperty(this, "encoding", {
                    value: "utf-8"
                })
            }
            function l(t) {
                var e = t.fatal
                  , r = 0
                  , i = 0
                  , a = 0
                  , u = 128
                  , c = 191;
                this.handler = function(t, l) {
                    if (-1 === l && 0 !== a)
                        return a = 0,
                        s(e);
                    if (-1 === l)
                        return o;
                    if (0 === a) {
                        if (n(l, 0, 127))
                            return l;
                        if (n(l, 194, 223))
                            a = 1,
                            r = l - 192;
                        else if (n(l, 224, 239))
                            224 === l && (u = 160),
                            237 === l && (c = 159),
                            a = 2,
                            r = l - 224;
                        else {
                            if (!n(l, 240, 244))
                                return s(e);
                            240 === l && (u = 144),
                            244 === l && (c = 143),
                            a = 3,
                            r = l - 240
                        }
                        return r <<= 6 * a,
                        null
                    }
                    if (!n(l, u, c))
                        return r = a = i = 0,
                        u = 128,
                        c = 191,
                        t.prepend(l),
                        s(e);
                    if (u = 128,
                    c = 191,
                    r += l - 128 << 6 * (a - (i += 1)),
                    i !== a)
                        return null;
                    var f = r;
                    return r = a = i = 0,
                    f
                }
            }
            function f(t) {
                t.fatal,
                this.handler = function(t, e) {
                    if (-1 === e)
                        return o;
                    if (n(e, 0, 127))
                        return e;
                    var r, i;
                    n(e, 128, 2047) ? (r = 1,
                    i = 192) : n(e, 2048, 65535) ? (r = 2,
                    i = 224) : n(e, 65536, 1114111) && (r = 3,
                    i = 240);
                    for (var s = [(e >> 6 * r) + i]; r > 0; ) {
                        var a = e >> 6 * (r - 1);
                        s.push(128 | 63 & a),
                        r -= 1
                    }
                    return s
                }
            }
            u.prototype = {
                decode: function(t, e) {
                    var n;
                    n = "object" == typeof t && t instanceof ArrayBuffer ? new Uint8Array(t) : "object" == typeof t && "buffer"in t && t.buffer instanceof ArrayBuffer ? new Uint8Array(t.buffer,t.byteOffset,t.byteLength) : new Uint8Array(0),
                    e = r(e),
                    this._streaming || (this._decoder = new l({
                        fatal: this._fatal
                    }),
                    this._BOMseen = !1),
                    this._streaming = Boolean(e.stream);
                    for (var s, a = new i(n), u = []; !a.endOfStream() && (s = this._decoder.handler(a, a.read())) !== o; )
                        null !== s && (Array.isArray(s) ? u.push.apply(u, s) : u.push(s));
                    if (!this._streaming) {
                        do {
                            if ((s = this._decoder.handler(a, a.read())) === o)
                                break;
                            null !== s && (Array.isArray(s) ? u.push.apply(u, s) : u.push(s))
                        } while (!a.endOfStream());
                        this._decoder = null
                    }
                    return u.length && (-1 === ["utf-8"].indexOf(this.encoding) || this._ignoreBOM || this._BOMseen || (65279 === u[0] ? (this._BOMseen = !0,
                    u.shift()) : this._BOMseen = !0)),
                    function(t) {
                        for (var e = "", n = 0; n < t.length; ++n) {
                            var r = t[n];
                            r <= 65535 ? e += String.fromCharCode(r) : (r -= 65536,
                            e += String.fromCharCode(55296 + (r >> 10), 56320 + (1023 & r)))
                        }
                        return e
                    }(u)
                }
            },
            c.prototype = {
                encode: function(t, e) {
                    t = t ? String(t) : "",
                    e = r(e),
                    this._streaming || (this._encoder = new f(this._options)),
                    this._streaming = Boolean(e.stream);
                    for (var n, s = [], a = new i(function(t) {
                        for (var e = String(t), n = e.length, r = 0, i = []; r < n; ) {
                            var o = e.charCodeAt(r);
                            if (o < 55296 || o > 57343)
                                i.push(o);
                            else if (56320 <= o && o <= 57343)
                                i.push(65533);
                            else if (55296 <= o && o <= 56319)
                                if (r === n - 1)
                                    i.push(65533);
                                else {
                                    var s = t.charCodeAt(r + 1);
                                    if (56320 <= s && s <= 57343) {
                                        var a = 1023 & o
                                          , u = 1023 & s;
                                        i.push(65536 + (a << 10) + u),
                                        r += 1
                                    } else
                                        i.push(65533)
                                }
                            r += 1
                        }
                        return i
                    }(t)); !a.endOfStream() && (n = this._encoder.handler(a, a.read())) !== o; )
                        Array.isArray(n) ? s.push.apply(s, n) : s.push(n);
                    if (!this._streaming) {
                        for (; (n = this._encoder.handler(a, a.read())) !== o; )
                            Array.isArray(n) ? s.push.apply(s, n) : s.push(n);
                        this._encoder = null
                    }
                    return new Uint8Array(s)
                }
            },
            e.TextEncoder = c,
            e.TextDecoder = u
        }
        ,
        "./src/scripts/inpage.ts": (t, e, n) => {
            "use strict";
            var r = {};
            n.r(r),
            n.d(r, {
                aInRange: () => Xt,
                abool: () => Lt,
                abytes: () => Tt,
                bitGet: () => ee,
                bitLen: () => te,
                bitMask: () => re,
                bitSet: () => ne,
                bytesToHex: () => Ut,
                bytesToNumberBE: () => Ft,
                bytesToNumberLE: () => Kt,
                concatBytes: () => Jt,
                createHmacDrbg: () => se,
                ensureBytes: () => Vt,
                equalBytes: () => Gt,
                hexToBytes: () => Ct,
                hexToNumber: () => zt,
                inRange: () => Qt,
                isBytes: () => Pt,
                memoized: () => le,
                notImplemented: () => ce,
                numberToBytesBE: () => Dt,
                numberToBytesLE: () => $t,
                numberToHexUnpadded: () => Nt,
                numberToVarBytesBE: () => Ht,
                utf8ToBytes: () => Zt,
                validateObject: () => ue
            });
            var i, o = n("../../../node_modules/console-browserify/index.js");
            class s extends Event {
                constructor(t) {
                    super("wallet-standard:register-wallet", {
                        bubbles: !1,
                        cancelable: !1,
                        composed: !1
                    }),
                    i.set(this, void 0),
                    function(t, e, n, r, i) {
                        if ("m" === r)
                            throw new TypeError("Private method is not writable");
                        if ("a" === r && !i)
                            throw new TypeError("Private accessor was defined without a setter");
                        if ("function" == typeof e ? t !== e || !i : !e.has(t))
                            throw new TypeError("Cannot write private member to an object whose class did not declare it");
                        "a" === r ? i.call(t, n) : i ? i.value = n : e.set(t, n)
                    }(this, i, t, "f")
                }
                get detail() {
                    return function(t, e, n, r) {
                        if ("a" === n && !r)
                            throw new TypeError("Private accessor was defined without a getter");
                        if ("function" == typeof e ? t !== e || !r : !e.has(t))
                            throw new TypeError("Cannot read private member from an object whose class did not declare it");
                        return "m" === n ? r : "a" === n ? r.call(t) : r ? r.value : e.get(t)
                    }(this, i, "f")
                }
                get type() {
                    return "wallet-standard:register-wallet"
                }
                preventDefault() {
                    throw new Error("preventDefault cannot be called")
                }
                stopImmediatePropagation() {
                    throw new Error("stopImmediatePropagation cannot be called")
                }
                stopPropagation() {
                    throw new Error("stopPropagation cannot be called")
                }
            }
            i = new WeakMap;
            const a = "standard:connect"
              , u = "standard:disconnect"
              , c = "standard:events"
              , l = "solana:mainnet"
              , f = "solana:devnet"
              , h = "solana:testnet"
              , d = [l, f, h, "solana:localnet"];
            function p(t) {
                return d.includes(t)
            }
            const y = "solana:signAndSendTransaction"
              , g = "solana:signTransaction"
              , m = "solana:signMessage";
            var b, w, v, x, S, k, E = n("../../../node_modules/bs58/index.js"), A = n.n(E), I = function(t, e, n, r) {
                if ("a" === n && !r)
                    throw new TypeError("Private accessor was defined without a getter");
                if ("function" == typeof e ? t !== e || !r : !e.has(t))
                    throw new TypeError("Cannot read private member from an object whose class did not declare it");
                return "m" === n ? r : "a" === n ? r.call(t) : r ? r.value : e.get(t)
            }, M = function(t, e, n, r, i) {
                if ("m" === r)
                    throw new TypeError("Private method is not writable");
                if ("a" === r && !i)
                    throw new TypeError("Private accessor was defined without a setter");
                if ("function" == typeof e ? t !== e || !i : !e.has(t))
                    throw new TypeError("Cannot write private member to an object whose class did not declare it");
                return "a" === r ? i.call(t, n) : i ? i.value = n : e.set(t, n),
                n
            };
            class _ {
                get address() {
                    return I(this, b, "f")
                }
                get publicKey() {
                    return I(this, w, "f").slice()
                }
                get chains() {
                    return I(this, v, "f").slice()
                }
                get features() {
                    return I(this, x, "f").slice()
                }
                get label() {
                    return I(this, S, "f")
                }
                get icon() {
                    return I(this, k, "f")
                }
                constructor({address: t, publicKey: e, label: n, icon: r, chains: i, features: o}) {
                    b.set(this, void 0),
                    w.set(this, void 0),
                    v.set(this, void 0),
                    x.set(this, void 0),
                    S.set(this, void 0),
                    k.set(this, void 0),
                    new.target === _ && Object.freeze(this),
                    M(this, b, t, "f"),
                    M(this, w, e, "f"),
                    M(this, v, i, "f"),
                    M(this, x, o, "f"),
                    M(this, S, n, "f"),
                    M(this, k, r, "f")
                }
            }
            b = new WeakMap,
            w = new WeakMap,
            v = new WeakMap,
            x = new WeakMap,
            S = new WeakMap,
            k = new WeakMap;
            var B, j, O, P, T, L, R, U, N, z, q, W, C, F, K, D, $, H, V, J, G = function(t, e, n, r) {
                return new (n || (n = Promise))((function(i, o) {
                    function s(t) {
                        try {
                            u(r.next(t))
                        } catch (t) {
                            o(t)
                        }
                    }
                    function a(t) {
                        try {
                            u(r.throw(t))
                        } catch (t) {
                            o(t)
                        }
                    }
                    function u(t) {
                        var e;
                        t.done ? i(t.value) : (e = t.value,
                        e instanceof n ? e : new n((function(t) {
                            t(e)
                        }
                        ))).then(s, a)
                    }
                    u((r = r.apply(t, e || [])).next())
                }
                ))
            }, Z = function(t, e, n, r) {
                if ("a" === n && !r)
                    throw new TypeError("Private accessor was defined without a getter");
                if ("function" == typeof e ? t !== e || !r : !e.has(t))
                    throw new TypeError("Cannot read private member from an object whose class did not declare it");
                return "m" === n ? r : "a" === n ? r.call(t) : r ? r.value : e.get(t)
            }, Y = function(t, e, n, r, i) {
                if ("m" === r)
                    throw new TypeError("Private method is not writable");
                if ("a" === r && !i)
                    throw new TypeError("Private accessor was defined without a setter");
                if ("function" == typeof e ? t !== e || !i : !e.has(t))
                    throw new TypeError("Cannot write private member to an object whose class did not declare it");
                return "a" === r ? i.call(t, n) : i ? i.value = n : e.set(t, n),
                n
            };
            j = new WeakMap,
            O = new WeakMap,
            P = new WeakMap,
            T = new WeakMap,
            L = new WeakMap,
            R = new WeakMap,
            U = new WeakMap,
            N = new WeakMap,
            W = new WeakMap,
            C = new WeakMap,
            F = new WeakMap,
            K = new WeakMap,
            D = new WeakMap,
            $ = new WeakMap,
            H = new WeakMap,
            V = new WeakMap,
            J = new WeakMap,
            B = new WeakSet,
            z = function(t, ...e) {
                var n;
                null === (n = Z(this, P, "f")[t]) || void 0 === n || n.forEach((t => t.apply(null, e)))
            }
            ,
            q = function(t, e) {
                var n;
                Z(this, P, "f")[t] = null === (n = Z(this, P, "f")[t]) || void 0 === n ? void 0 : n.filter((t => e !== t))
            }
            ;
            var Q = n("../../../node_modules/buffer/index.js");
            function X(t) {
                if (!Number.isSafeInteger(t) || t < 0)
                    throw new Error(`positive integer expected, not ${t}`)
            }
            function tt(t, ...e) {
                if (!((n = t)instanceof Uint8Array || null != n && "object" == typeof n && "Uint8Array" === n.constructor.name))
                    throw new Error("Uint8Array expected");
                var n;
                if (e.length > 0 && !e.includes(t.length))
                    throw new Error(`Uint8Array expected of length ${e}, not of length=${t.length}`)
            }
            function et(t, e=!0) {
                if (t.destroyed)
                    throw new Error("Hash instance has been destroyed");
                if (e && t.finished)
                    throw new Error("Hash#digest() has already been called")
            }
            function nt(t, e) {
                tt(t);
                const n = e.outputLen;
                if (t.length < n)
                    throw new Error(`digestInto() expects output buffer of length at least ${n}`)
            }
            const rt = "object" == typeof globalThis && "crypto"in globalThis ? globalThis.crypto : void 0
              , it = t => new DataView(t.buffer,t.byteOffset,t.byteLength)
              , ot = (t, e) => t << 32 - e | t >>> e
              , st = 68 === new Uint8Array(new Uint32Array([287454020]).buffer)[0];
            function at(t) {
                for (let n = 0; n < t.length; n++)
                    t[n] = (e = t[n]) << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
                var e
            }
            function ut(t) {
                return "string" == typeof t && (t = function(t) {
                    if ("string" != typeof t)
                        throw new Error("utf8ToBytes expected string, got " + typeof t);
                    return new Uint8Array((new TextEncoder).encode(t))
                }(t)),
                tt(t),
                t
            }
            class ct {
                clone() {
                    return this._cloneInto()
                }
            }
            function lt(t) {
                const e = e => t().update(ut(e)).digest()
                  , n = t();
                return e.outputLen = n.outputLen,
                e.blockLen = n.blockLen,
                e.create = () => t(),
                e
            }
            function ft(t=32) {
                if (rt && "function" == typeof rt.getRandomValues)
                    return rt.getRandomValues(new Uint8Array(t));
                if (rt && "function" == typeof rt.randomBytes)
                    return rt.randomBytes(t);
                throw new Error("crypto.getRandomValues must be defined")
            }
            const ht = (t, e, n) => t & e ^ t & n ^ e & n;
            class dt extends ct {
                constructor(t, e, n, r) {
                    super(),
                    this.blockLen = t,
                    this.outputLen = e,
                    this.padOffset = n,
                    this.isLE = r,
                    this.finished = !1,
                    this.length = 0,
                    this.pos = 0,
                    this.destroyed = !1,
                    this.buffer = new Uint8Array(t),
                    this.view = it(this.buffer)
                }
                update(t) {
                    et(this);
                    const {view: e, buffer: n, blockLen: r} = this
                      , i = (t = ut(t)).length;
                    for (let o = 0; o < i; ) {
                        const s = Math.min(r - this.pos, i - o);
                        if (s !== r)
                            n.set(t.subarray(o, o + s), this.pos),
                            this.pos += s,
                            o += s,
                            this.pos === r && (this.process(e, 0),
                            this.pos = 0);
                        else {
                            const e = it(t);
                            for (; r <= i - o; o += r)
                                this.process(e, o)
                        }
                    }
                    return this.length += t.length,
                    this.roundClean(),
                    this
                }
                digestInto(t) {
                    et(this),
                    nt(t, this),
                    this.finished = !0;
                    const {buffer: e, view: n, blockLen: r, isLE: i} = this;
                    let {pos: o} = this;
                    e[o++] = 128,
                    this.buffer.subarray(o).fill(0),
                    this.padOffset > r - o && (this.process(n, 0),
                    o = 0);
                    for (let t = o; t < r; t++)
                        e[t] = 0;
                    !function(t, e, n, r) {
                        if ("function" == typeof t.setBigUint64)
                            return t.setBigUint64(e, n, r);
                        const i = BigInt(32)
                          , o = BigInt(4294967295)
                          , s = Number(n >> i & o)
                          , a = Number(n & o)
                          , u = r ? 4 : 0
                          , c = r ? 0 : 4;
                        t.setUint32(e + u, s, r),
                        t.setUint32(e + c, a, r)
                    }(n, r - 8, BigInt(8 * this.length), i),
                    this.process(n, 0);
                    const s = it(t)
                      , a = this.outputLen;
                    if (a % 4)
                        throw new Error("_sha2: outputLen should be aligned to 32bit");
                    const u = a / 4
                      , c = this.get();
                    if (u > c.length)
                        throw new Error("_sha2: outputLen bigger than state");
                    for (let t = 0; t < u; t++)
                        s.setUint32(4 * t, c[t], i)
                }
                digest() {
                    const {buffer: t, outputLen: e} = this;
                    this.digestInto(t);
                    const n = t.slice(0, e);
                    return this.destroy(),
                    n
                }
                _cloneInto(t) {
                    t || (t = new this.constructor),
                    t.set(...this.get());
                    const {blockLen: e, buffer: n, length: r, finished: i, destroyed: o, pos: s} = this;
                    return t.length = r,
                    t.pos = s,
                    t.finished = i,
                    t.destroyed = o,
                    r % e && t.buffer.set(n),
                    t
                }
            }
            const pt = BigInt(2 ** 32 - 1)
              , yt = BigInt(32);
            function gt(t, e=!1) {
                return e ? {
                    h: Number(t & pt),
                    l: Number(t >> yt & pt)
                } : {
                    h: 0 | Number(t >> yt & pt),
                    l: 0 | Number(t & pt)
                }
            }
            function mt(t, e=!1) {
                let n = new Uint32Array(t.length)
                  , r = new Uint32Array(t.length);
                for (let i = 0; i < t.length; i++) {
                    const {h: o, l: s} = gt(t[i], e);
                    [n[i],r[i]] = [o, s]
                }
                return [n, r]
            }
            const bt = (t, e, n) => t << n | e >>> 32 - n
              , wt = (t, e, n) => e << n | t >>> 32 - n
              , vt = (t, e, n) => e << n - 32 | t >>> 64 - n
              , xt = (t, e, n) => t << n - 32 | e >>> 64 - n
              , St = {
                fromBig: gt,
                split: mt,
                toBig: (t, e) => BigInt(t >>> 0) << yt | BigInt(e >>> 0),
                shrSH: (t, e, n) => t >>> n,
                shrSL: (t, e, n) => t << 32 - n | e >>> n,
                rotrSH: (t, e, n) => t >>> n | e << 32 - n,
                rotrSL: (t, e, n) => t << 32 - n | e >>> n,
                rotrBH: (t, e, n) => t << 64 - n | e >>> n - 32,
                rotrBL: (t, e, n) => t >>> n - 32 | e << 64 - n,
                rotr32H: (t, e) => e,
                rotr32L: (t, e) => t,
                rotlSH: bt,
                rotlSL: wt,
                rotlBH: vt,
                rotlBL: xt,
                add: function(t, e, n, r) {
                    const i = (e >>> 0) + (r >>> 0);
                    return {
                        h: t + n + (i / 2 ** 32 | 0) | 0,
                        l: 0 | i
                    }
                },
                add3L: (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0),
                add3H: (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0,
                add4L: (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0),
                add4H: (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0,
                add5H: (t, e, n, r, i, o) => e + n + r + i + o + (t / 2 ** 32 | 0) | 0,
                add5L: (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0)
            }
              , [kt,Et] = ( () => St.split(["0x428a2f98d728ae22", "0x7137449123ef65cd", "0xb5c0fbcfec4d3b2f", "0xe9b5dba58189dbbc", "0x3956c25bf348b538", "0x59f111f1b605d019", "0x923f82a4af194f9b", "0xab1c5ed5da6d8118", "0xd807aa98a3030242", "0x12835b0145706fbe", "0x243185be4ee4b28c", "0x550c7dc3d5ffb4e2", "0x72be5d74f27b896f", "0x80deb1fe3b1696b1", "0x9bdc06a725c71235", "0xc19bf174cf692694", "0xe49b69c19ef14ad2", "0xefbe4786384f25e3", "0x0fc19dc68b8cd5b5", "0x240ca1cc77ac9c65", "0x2de92c6f592b0275", "0x4a7484aa6ea6e483", "0x5cb0a9dcbd41fbd4", "0x76f988da831153b5", "0x983e5152ee66dfab", "0xa831c66d2db43210", "0xb00327c898fb213f", "0xbf597fc7beef0ee4", "0xc6e00bf33da88fc2", "0xd5a79147930aa725", "0x06ca6351e003826f", "0x142929670a0e6e70", "0x27b70a8546d22ffc", "0x2e1b21385c26c926", "0x4d2c6dfc5ac42aed", "0x53380d139d95b3df", "0x650a73548baf63de", "0x766a0abb3c77b2a8", "0x81c2c92e47edaee6", "0x92722c851482353b", "0xa2bfe8a14cf10364", "0xa81a664bbc423001", "0xc24b8b70d0f89791", "0xc76c51a30654be30", "0xd192e819d6ef5218", "0xd69906245565a910", "0xf40e35855771202a", "0x106aa07032bbd1b8", "0x19a4c116b8d2d0c8", "0x1e376c085141ab53", "0x2748774cdf8eeb99", "0x34b0bcb5e19b48a8", "0x391c0cb3c5c95a63", "0x4ed8aa4ae3418acb", "0x5b9cca4f7763e373", "0x682e6ff3d6b2b8a3", "0x748f82ee5defb2fc", "0x78a5636f43172f60", "0x84c87814a1f0ab72", "0x8cc702081a6439ec", "0x90befffa23631e28", "0xa4506cebde82bde9", "0xbef9a3f7b2c67915", "0xc67178f2e372532b", "0xca273eceea26619c", "0xd186b8c721c0c207", "0xeada7dd6cde0eb1e", "0xf57d4f7fee6ed178", "0x06f067aa72176fba", "0x0a637dc5a2c898a6", "0x113f9804bef90dae", "0x1b710b35131c471b", "0x28db77f523047d84", "0x32caab7b40c72493", "0x3c9ebe0a15c9bebc", "0x431d67c49c100d4c", "0x4cc5d4becb3e42b6", "0x597f299cfc657e2a", "0x5fcb6fab3ad6faec", "0x6c44198c4a475817"].map((t => BigInt(t)))))()
              , At = new Uint32Array(80)
              , It = new Uint32Array(80);
            class Mt extends dt {
                constructor() {
                    super(128, 64, 16, !1),
                    this.Ah = 1779033703,
                    this.Al = -205731576,
                    this.Bh = -1150833019,
                    this.Bl = -2067093701,
                    this.Ch = 1013904242,
                    this.Cl = -23791573,
                    this.Dh = -1521486534,
                    this.Dl = 1595750129,
                    this.Eh = 1359893119,
                    this.El = -1377402159,
                    this.Fh = -1694144372,
                    this.Fl = 725511199,
                    this.Gh = 528734635,
                    this.Gl = -79577749,
                    this.Hh = 1541459225,
                    this.Hl = 327033209
                }
                get() {
                    const {Ah: t, Al: e, Bh: n, Bl: r, Ch: i, Cl: o, Dh: s, Dl: a, Eh: u, El: c, Fh: l, Fl: f, Gh: h, Gl: d, Hh: p, Hl: y} = this;
                    return [t, e, n, r, i, o, s, a, u, c, l, f, h, d, p, y]
                }
                set(t, e, n, r, i, o, s, a, u, c, l, f, h, d, p, y) {
                    this.Ah = 0 | t,
                    this.Al = 0 | e,
                    this.Bh = 0 | n,
                    this.Bl = 0 | r,
                    this.Ch = 0 | i,
                    this.Cl = 0 | o,
                    this.Dh = 0 | s,
                    this.Dl = 0 | a,
                    this.Eh = 0 | u,
                    this.El = 0 | c,
                    this.Fh = 0 | l,
                    this.Fl = 0 | f,
                    this.Gh = 0 | h,
                    this.Gl = 0 | d,
                    this.Hh = 0 | p,
                    this.Hl = 0 | y
                }
                process(t, e) {
                    for (let n = 0; n < 16; n++,
                    e += 4)
                        At[n] = t.getUint32(e),
                        It[n] = t.getUint32(e += 4);
                    for (let t = 16; t < 80; t++) {
                        const e = 0 | At[t - 15]
                          , n = 0 | It[t - 15]
                          , r = St.rotrSH(e, n, 1) ^ St.rotrSH(e, n, 8) ^ St.shrSH(e, n, 7)
                          , i = St.rotrSL(e, n, 1) ^ St.rotrSL(e, n, 8) ^ St.shrSL(e, n, 7)
                          , o = 0 | At[t - 2]
                          , s = 0 | It[t - 2]
                          , a = St.rotrSH(o, s, 19) ^ St.rotrBH(o, s, 61) ^ St.shrSH(o, s, 6)
                          , u = St.rotrSL(o, s, 19) ^ St.rotrBL(o, s, 61) ^ St.shrSL(o, s, 6)
                          , c = St.add4L(i, u, It[t - 7], It[t - 16])
                          , l = St.add4H(c, r, a, At[t - 7], At[t - 16]);
                        At[t] = 0 | l,
                        It[t] = 0 | c
                    }
                    let {Ah: n, Al: r, Bh: i, Bl: o, Ch: s, Cl: a, Dh: u, Dl: c, Eh: l, El: f, Fh: h, Fl: d, Gh: p, Gl: y, Hh: g, Hl: m} = this;
                    for (let t = 0; t < 80; t++) {
                        const e = St.rotrSH(l, f, 14) ^ St.rotrSH(l, f, 18) ^ St.rotrBH(l, f, 41)
                          , b = St.rotrSL(l, f, 14) ^ St.rotrSL(l, f, 18) ^ St.rotrBL(l, f, 41)
                          , w = l & h ^ ~l & p
                          , v = f & d ^ ~f & y
                          , x = St.add5L(m, b, v, Et[t], It[t])
                          , S = St.add5H(x, g, e, w, kt[t], At[t])
                          , k = 0 | x
                          , E = St.rotrSH(n, r, 28) ^ St.rotrBH(n, r, 34) ^ St.rotrBH(n, r, 39)
                          , A = St.rotrSL(n, r, 28) ^ St.rotrBL(n, r, 34) ^ St.rotrBL(n, r, 39)
                          , I = n & i ^ n & s ^ i & s
                          , M = r & o ^ r & a ^ o & a;
                        g = 0 | p,
                        m = 0 | y,
                        p = 0 | h,
                        y = 0 | d,
                        h = 0 | l,
                        d = 0 | f,
                        ({h: l, l: f} = St.add(0 | u, 0 | c, 0 | S, 0 | k)),
                        u = 0 | s,
                        c = 0 | a,
                        s = 0 | i,
                        a = 0 | o,
                        i = 0 | n,
                        o = 0 | r;
                        const _ = St.add3L(k, A, M);
                        n = St.add3H(_, S, E, I),
                        r = 0 | _
                    }
                    ({h: n, l: r} = St.add(0 | this.Ah, 0 | this.Al, 0 | n, 0 | r)),
                    ({h: i, l: o} = St.add(0 | this.Bh, 0 | this.Bl, 0 | i, 0 | o)),
                    ({h: s, l: a} = St.add(0 | this.Ch, 0 | this.Cl, 0 | s, 0 | a)),
                    ({h: u, l: c} = St.add(0 | this.Dh, 0 | this.Dl, 0 | u, 0 | c)),
                    ({h: l, l: f} = St.add(0 | this.Eh, 0 | this.El, 0 | l, 0 | f)),
                    ({h, l: d} = St.add(0 | this.Fh, 0 | this.Fl, 0 | h, 0 | d)),
                    ({h: p, l: y} = St.add(0 | this.Gh, 0 | this.Gl, 0 | p, 0 | y)),
                    ({h: g, l: m} = St.add(0 | this.Hh, 0 | this.Hl, 0 | g, 0 | m)),
                    this.set(n, r, i, o, s, a, u, c, l, f, h, d, p, y, g, m)
                }
                roundClean() {
                    At.fill(0),
                    It.fill(0)
                }
                destroy() {
                    this.buffer.fill(0),
                    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
                }
            }
            const _t = lt(( () => new Mt))
              , Bt = BigInt(0)
              , jt = BigInt(1)
              , Ot = BigInt(2);
            function Pt(t) {
                return t instanceof Uint8Array || null != t && "object" == typeof t && "Uint8Array" === t.constructor.name
            }
            function Tt(t) {
                if (!Pt(t))
                    throw new Error("Uint8Array expected")
            }
            function Lt(t, e) {
                if ("boolean" != typeof e)
                    throw new Error(`${t} must be valid boolean, got "${e}".`)
            }
            const Rt = Array.from({
                length: 256
            }, ( (t, e) => e.toString(16).padStart(2, "0")));
            function Ut(t) {
                Tt(t);
                let e = "";
                for (let n = 0; n < t.length; n++)
                    e += Rt[t[n]];
                return e
            }
            function Nt(t) {
                const e = t.toString(16);
                return 1 & e.length ? `0${e}` : e
            }
            function zt(t) {
                if ("string" != typeof t)
                    throw new Error("hex string expected, got " + typeof t);
                return BigInt("" === t ? "0" : `0x${t}`)
            }
            const qt = {
                _0: 48,
                _9: 57,
                _A: 65,
                _F: 70,
                _a: 97,
                _f: 102
            };
            function Wt(t) {
                return t >= qt._0 && t <= qt._9 ? t - qt._0 : t >= qt._A && t <= qt._F ? t - (qt._A - 10) : t >= qt._a && t <= qt._f ? t - (qt._a - 10) : void 0
            }
            function Ct(t) {
                if ("string" != typeof t)
                    throw new Error("hex string expected, got " + typeof t);
                const e = t.length
                  , n = e / 2;
                if (e % 2)
                    throw new Error("padded hex string expected, got unpadded hex of length " + e);
                const r = new Uint8Array(n);
                for (let e = 0, i = 0; e < n; e++,
                i += 2) {
                    const n = Wt(t.charCodeAt(i))
                      , o = Wt(t.charCodeAt(i + 1));
                    if (void 0 === n || void 0 === o) {
                        const e = t[i] + t[i + 1];
                        throw new Error('hex string expected, got non-hex character "' + e + '" at index ' + i)
                    }
                    r[e] = 16 * n + o
                }
                return r
            }
            function Ft(t) {
                return zt(Ut(t))
            }
            function Kt(t) {
                return Tt(t),
                zt(Ut(Uint8Array.from(t).reverse()))
            }
            function Dt(t, e) {
                return Ct(t.toString(16).padStart(2 * e, "0"))
            }
            function $t(t, e) {
                return Dt(t, e).reverse()
            }
            function Ht(t) {
                return Ct(Nt(t))
            }
            function Vt(t, e, n) {
                let r;
                if ("string" == typeof e)
                    try {
                        r = Ct(e)
                    } catch (n) {
                        throw new Error(`${t} must be valid hex string, got "${e}". Cause: ${n}`)
                    }
                else {
                    if (!Pt(e))
                        throw new Error(`${t} must be hex string or Uint8Array`);
                    r = Uint8Array.from(e)
                }
                const i = r.length;
                if ("number" == typeof n && i !== n)
                    throw new Error(`${t} expected ${n} bytes, got ${i}`);
                return r
            }
            function Jt(...t) {
                let e = 0;
                for (let n = 0; n < t.length; n++) {
                    const r = t[n];
                    Tt(r),
                    e += r.length
                }
                const n = new Uint8Array(e);
                for (let e = 0, r = 0; e < t.length; e++) {
                    const i = t[e];
                    n.set(i, r),
                    r += i.length
                }
                return n
            }
            function Gt(t, e) {
                if (t.length !== e.length)
                    return !1;
                let n = 0;
                for (let r = 0; r < t.length; r++)
                    n |= t[r] ^ e[r];
                return 0 === n
            }
            function Zt(t) {
                if ("string" != typeof t)
                    throw new Error("utf8ToBytes expected string, got " + typeof t);
                return new Uint8Array((new TextEncoder).encode(t))
            }
            const Yt = t => "bigint" == typeof t && Bt <= t;
            function Qt(t, e, n) {
                return Yt(t) && Yt(e) && Yt(n) && e <= t && t < n
            }
            function Xt(t, e, n, r) {
                if (!Qt(e, n, r))
                    throw new Error(`expected valid ${t}: ${n} <= n < ${r}, got ${typeof e} ${e}`)
            }
            function te(t) {
                let e;
                for (e = 0; t > Bt; t >>= jt,
                e += 1)
                    ;
                return e
            }
            function ee(t, e) {
                return t >> BigInt(e) & jt
            }
            function ne(t, e, n) {
                return t | (n ? jt : Bt) << BigInt(e)
            }
            const re = t => (Ot << BigInt(t - 1)) - jt
              , ie = t => new Uint8Array(t)
              , oe = t => Uint8Array.from(t);
            function se(t, e, n) {
                if ("number" != typeof t || t < 2)
                    throw new Error("hashLen must be a number");
                if ("number" != typeof e || e < 2)
                    throw new Error("qByteLen must be a number");
                if ("function" != typeof n)
                    throw new Error("hmacFn must be a function");
                let r = ie(t)
                  , i = ie(t)
                  , o = 0;
                const s = () => {
                    r.fill(1),
                    i.fill(0),
                    o = 0
                }
                  , a = (...t) => n(i, r, ...t)
                  , u = (t=ie()) => {
                    i = a(oe([0]), t),
                    r = a(),
                    0 !== t.length && (i = a(oe([1]), t),
                    r = a())
                }
                  , c = () => {
                    if (o++ >= 1e3)
                        throw new Error("drbg: tried 1000 values");
                    let t = 0;
                    const n = [];
                    for (; t < e; ) {
                        r = a();
                        const e = r.slice();
                        n.push(e),
                        t += r.length
                    }
                    return Jt(...n)
                }
                ;
                return (t, e) => {
                    let n;
                    for (s(),
                    u(t); !(n = e(c())); )
                        u();
                    return s(),
                    n
                }
            }
            const ae = {
                bigint: t => "bigint" == typeof t,
                function: t => "function" == typeof t,
                boolean: t => "boolean" == typeof t,
                string: t => "string" == typeof t,
                stringOrUint8Array: t => "string" == typeof t || Pt(t),
                isSafeInteger: t => Number.isSafeInteger(t),
                array: t => Array.isArray(t),
                field: (t, e) => e.Fp.isValid(t),
                hash: t => "function" == typeof t && Number.isSafeInteger(t.outputLen)
            };
            function ue(t, e, n={}) {
                const r = (e, n, r) => {
                    const i = ae[n];
                    if ("function" != typeof i)
                        throw new Error(`Invalid validator "${n}", expected function`);
                    const o = t[e];
                    if (!(r && void 0 === o || i(o, t)))
                        throw new Error(`Invalid param ${String(e)}=${o} (${typeof o}), expected ${n}`)
                }
                ;
                for (const [t,n] of Object.entries(e))
                    r(t, n, !1);
                for (const [t,e] of Object.entries(n))
                    r(t, e, !0);
                return t
            }
            const ce = () => {
                throw new Error("not implemented")
            }
            ;
            function le(t) {
                const e = new WeakMap;
                return (n, ...r) => {
                    const i = e.get(n);
                    if (void 0 !== i)
                        return i;
                    const o = t(n, ...r);
                    return e.set(n, o),
                    o
                }
            }
            const fe = BigInt(0)
              , he = BigInt(1)
              , de = BigInt(2)
              , pe = BigInt(3)
              , ye = BigInt(4)
              , ge = BigInt(5)
              , me = BigInt(8);
            function be(t, e) {
                const n = t % e;
                return n >= fe ? n : e + n
            }
            function we(t, e, n) {
                if (n <= fe || e < fe)
                    throw new Error("Expected power/modulo > 0");
                if (n === he)
                    return fe;
                let r = he;
                for (; e > fe; )
                    e & he && (r = r * t % n),
                    t = t * t % n,
                    e >>= he;
                return r
            }
            function ve(t, e, n) {
                let r = t;
                for (; e-- > fe; )
                    r *= r,
                    r %= n;
                return r
            }
            function xe(t, e) {
                if (t === fe || e <= fe)
                    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
                let n = be(t, e)
                  , r = e
                  , i = fe
                  , o = he
                  , s = he
                  , a = fe;
                for (; n !== fe; ) {
                    const t = r / n
                      , e = r % n
                      , u = i - s * t
                      , c = o - a * t;
                    r = n,
                    n = e,
                    i = s,
                    o = a,
                    s = u,
                    a = c
                }
                if (r !== he)
                    throw new Error("invert: does not exist");
                return be(i, e)
            }
            BigInt(9),
            BigInt(16);
            const Se = ["create", "isValid", "is0", "neg", "inv", "sqrt", "sqr", "eql", "add", "sub", "mul", "pow", "div", "addN", "subN", "mulN", "sqrN"];
            function ke(t, e) {
                const n = void 0 !== e ? e : t.toString(2).length;
                return {
                    nBitLength: n,
                    nByteLength: Math.ceil(n / 8)
                }
            }
            function Ee(t, e, n=!1, r={}) {
                if (t <= fe)
                    throw new Error(`Expected Field ORDER > 0, got ${t}`);
                const {nBitLength: i, nByteLength: o} = ke(t, e);
                if (o > 2048)
                    throw new Error("Field lengths over 2048 bytes are not supported");
                const s = function(t) {
                    if (t % ye === pe) {
                        const e = (t + he) / ye;
                        return function(t, n) {
                            const r = t.pow(n, e);
                            if (!t.eql(t.sqr(r), n))
                                throw new Error("Cannot find square root");
                            return r
                        }
                    }
                    if (t % me === ge) {
                        const e = (t - ge) / me;
                        return function(t, n) {
                            const r = t.mul(n, de)
                              , i = t.pow(r, e)
                              , o = t.mul(n, i)
                              , s = t.mul(t.mul(o, de), i)
                              , a = t.mul(o, t.sub(s, t.ONE));
                            if (!t.eql(t.sqr(a), n))
                                throw new Error("Cannot find square root");
                            return a
                        }
                    }
                    return function(t) {
                        const e = (t - he) / de;
                        let n, r, i;
                        for (n = t - he,
                        r = 0; n % de === fe; n /= de,
                        r++)
                            ;
                        for (i = de; i < t && we(i, e, t) !== t - he; i++)
                            ;
                        if (1 === r) {
                            const e = (t + he) / ye;
                            return function(t, n) {
                                const r = t.pow(n, e);
                                if (!t.eql(t.sqr(r), n))
                                    throw new Error("Cannot find square root");
                                return r
                            }
                        }
                        const o = (n + he) / de;
                        return function(t, s) {
                            if (t.pow(s, e) === t.neg(t.ONE))
                                throw new Error("Cannot find square root");
                            let a = r
                              , u = t.pow(t.mul(t.ONE, i), n)
                              , c = t.pow(s, o)
                              , l = t.pow(s, n);
                            for (; !t.eql(l, t.ONE); ) {
                                if (t.eql(l, t.ZERO))
                                    return t.ZERO;
                                let e = 1;
                                for (let n = t.sqr(l); e < a && !t.eql(n, t.ONE); e++)
                                    n = t.sqr(n);
                                const n = t.pow(u, he << BigInt(a - e - 1));
                                u = t.sqr(n),
                                c = t.mul(c, n),
                                l = t.mul(l, u),
                                a = e
                            }
                            return c
                        }
                    }(t)
                }(t)
                  , a = Object.freeze({
                    ORDER: t,
                    BITS: i,
                    BYTES: o,
                    MASK: re(i),
                    ZERO: fe,
                    ONE: he,
                    create: e => be(e, t),
                    isValid: e => {
                        if ("bigint" != typeof e)
                            throw new Error("Invalid field element: expected bigint, got " + typeof e);
                        return fe <= e && e < t
                    }
                    ,
                    is0: t => t === fe,
                    isOdd: t => (t & he) === he,
                    neg: e => be(-e, t),
                    eql: (t, e) => t === e,
                    sqr: e => be(e * e, t),
                    add: (e, n) => be(e + n, t),
                    sub: (e, n) => be(e - n, t),
                    mul: (e, n) => be(e * n, t),
                    pow: (t, e) => function(t, e, n) {
                        if (n < fe)
                            throw new Error("Expected power > 0");
                        if (n === fe)
                            return t.ONE;
                        if (n === he)
                            return e;
                        let r = t.ONE
                          , i = e;
                        for (; n > fe; )
                            n & he && (r = t.mul(r, i)),
                            i = t.sqr(i),
                            n >>= he;
                        return r
                    }(a, t, e),
                    div: (e, n) => be(e * xe(n, t), t),
                    sqrN: t => t * t,
                    addN: (t, e) => t + e,
                    subN: (t, e) => t - e,
                    mulN: (t, e) => t * e,
                    inv: e => xe(e, t),
                    sqrt: r.sqrt || (t => s(a, t)),
                    invertBatch: t => function(t, e) {
                        const n = new Array(e.length)
                          , r = e.reduce(( (e, r, i) => t.is0(r) ? e : (n[i] = e,
                        t.mul(e, r))), t.ONE)
                          , i = t.inv(r);
                        return e.reduceRight(( (e, r, i) => t.is0(r) ? e : (n[i] = t.mul(e, n[i]),
                        t.mul(e, r))), i),
                        n
                    }(a, t),
                    cmov: (t, e, n) => n ? e : t,
                    toBytes: t => n ? $t(t, o) : Dt(t, o),
                    fromBytes: t => {
                        if (t.length !== o)
                            throw new Error(`Fp.fromBytes: expected ${o}, got ${t.length}`);
                        return n ? Kt(t) : Ft(t)
                    }
                });
                return Object.freeze(a)
            }
            function Ae(t) {
                if ("bigint" != typeof t)
                    throw new Error("field order must be bigint");
                const e = t.toString(2).length;
                return Math.ceil(e / 8)
            }
            function Ie(t) {
                const e = Ae(t);
                return e + Math.ceil(e / 2)
            }
            const Me = BigInt(0)
              , _e = BigInt(1)
              , Be = new WeakMap
              , je = new WeakMap;
            function Oe(t, e) {
                const n = (t, e) => {
                    const n = e.negate();
                    return t ? n : e
                }
                  , r = t => {
                    if (!Number.isSafeInteger(t) || t <= 0 || t > e)
                        throw new Error(`Wrong window size=${t}, should be [1..${e}]`)
                }
                  , i = t => (r(t),
                {
                    windows: Math.ceil(e / t) + 1,
                    windowSize: 2 ** (t - 1)
                });
                return {
                    constTimeNegate: n,
                    unsafeLadder(e, n) {
                        let r = t.ZERO
                          , i = e;
                        for (; n > Me; )
                            n & _e && (r = r.add(i)),
                            i = i.double(),
                            n >>= _e;
                        return r
                    },
                    precomputeWindow(t, e) {
                        const {windows: n, windowSize: r} = i(e)
                          , o = [];
                        let s = t
                          , a = s;
                        for (let t = 0; t < n; t++) {
                            a = s,
                            o.push(a);
                            for (let t = 1; t < r; t++)
                                a = a.add(s),
                                o.push(a);
                            s = a.double()
                        }
                        return o
                    },
                    wNAF(e, r, o) {
                        const {windows: s, windowSize: a} = i(e);
                        let u = t.ZERO
                          , c = t.BASE;
                        const l = BigInt(2 ** e - 1)
                          , f = 2 ** e
                          , h = BigInt(e);
                        for (let t = 0; t < s; t++) {
                            const e = t * a;
                            let i = Number(o & l);
                            o >>= h,
                            i > a && (i -= f,
                            o += _e);
                            const s = e
                              , d = e + Math.abs(i) - 1
                              , p = t % 2 != 0
                              , y = i < 0;
                            0 === i ? c = c.add(n(p, r[s])) : u = u.add(n(y, r[d]))
                        }
                        return {
                            p: u,
                            f: c
                        }
                    },
                    wNAFCached(t, e, n) {
                        const r = je.get(t) || 1;
                        let i = Be.get(t);
                        return i || (i = this.precomputeWindow(t, r),
                        1 !== r && Be.set(t, n(i))),
                        this.wNAF(r, i, e)
                    },
                    setWindowSize(t, e) {
                        r(e),
                        je.set(t, e),
                        Be.delete(t)
                    }
                }
            }
            function Pe(t, e, n, r) {
                if (!Array.isArray(n) || !Array.isArray(r) || r.length !== n.length)
                    throw new Error("arrays of points and scalars must have equal length");
                r.forEach(( (t, n) => {
                    if (!e.isValid(t))
                        throw new Error(`wrong scalar at index ${n}`)
                }
                )),
                n.forEach(( (e, n) => {
                    if (!(e instanceof t))
                        throw new Error(`wrong point at index ${n}`)
                }
                ));
                const i = te(BigInt(n.length))
                  , o = i > 12 ? i - 3 : i > 4 ? i - 2 : i ? 2 : 1
                  , s = (1 << o) - 1
                  , a = new Array(s + 1).fill(t.ZERO)
                  , u = Math.floor((e.BITS - 1) / o) * o;
                let c = t.ZERO;
                for (let e = u; e >= 0; e -= o) {
                    a.fill(t.ZERO);
                    for (let t = 0; t < r.length; t++) {
                        const i = r[t]
                          , o = Number(i >> BigInt(e) & BigInt(s));
                        a[o] = a[o].add(n[t])
                    }
                    let i = t.ZERO;
                    for (let e = a.length - 1, n = t.ZERO; e > 0; e--)
                        n = n.add(a[e]),
                        i = i.add(n);
                    if (c = c.add(i),
                    0 !== e)
                        for (let t = 0; t < o; t++)
                            c = c.double()
                }
                return c
            }
            function Te(t) {
                return ue(t.Fp, Se.reduce(( (t, e) => (t[e] = "function",
                t)), {
                    ORDER: "bigint",
                    MASK: "bigint",
                    BYTES: "isSafeInteger",
                    BITS: "isSafeInteger"
                })),
                ue(t, {
                    n: "bigint",
                    h: "bigint",
                    Gx: "field",
                    Gy: "field"
                }, {
                    nBitLength: "isSafeInteger",
                    nByteLength: "isSafeInteger"
                }),
                Object.freeze({
                    ...ke(t.n, t.nBitLength),
                    ...t,
                    p: t.Fp.ORDER
                })
            }
            const Le = BigInt(0)
              , Re = BigInt(1)
              , Ue = BigInt(2)
              , Ne = BigInt(8)
              , ze = {
                zip215: !0
            };
            const qe = BigInt("57896044618658097711785492504343953926634992332820282019728792003956564819949")
              , We = BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752")
              , Ce = (BigInt(0),
            BigInt(1))
              , Fe = BigInt(2)
              , Ke = (BigInt(3),
            BigInt(5))
              , De = BigInt(8);
            function $e(t) {
                return t[0] &= 248,
                t[31] &= 127,
                t[31] |= 64,
                t
            }
            function He(t, e) {
                const n = qe
                  , r = be(e * e * e, n)
                  , i = be(r * r * e, n);
                let o = be(t * r * function(t) {
                    const e = BigInt(10)
                      , n = BigInt(20)
                      , r = BigInt(40)
                      , i = BigInt(80)
                      , o = qe
                      , s = t * t % o * t % o
                      , a = ve(s, Fe, o) * s % o
                      , u = ve(a, Ce, o) * t % o
                      , c = ve(u, Ke, o) * u % o
                      , l = ve(c, e, o) * c % o
                      , f = ve(l, n, o) * l % o
                      , h = ve(f, r, o) * f % o
                      , d = ve(h, i, o) * h % o
                      , p = ve(d, i, o) * h % o
                      , y = ve(p, e, o) * c % o;
                    return {
                        pow_p_5_8: ve(y, Fe, o) * t % o,
                        b2: s
                    }
                }(t * i).pow_p_5_8, n);
                const s = be(e * o * o, n)
                  , a = o
                  , u = be(o * We, n)
                  , c = s === t
                  , l = s === be(-t, n)
                  , f = s === be(-t * We, n);
                return c && (o = a),
                (l || f) && (o = u),
                (be(o, n) & he) === he && (o = be(-o, n)),
                {
                    isValid: c || l,
                    value: o
                }
            }
            const Ve = ( () => Ee(qe, void 0, !0))()
              , Je = ( () => ({
                a: BigInt(-1),
                d: BigInt("37095705934669439343138083508754565189542113879843219016388785533085940283555"),
                Fp: Ve,
                n: BigInt("7237005577332262213973186563042994240857116359379907606001950938285454250989"),
                h: De,
                Gx: BigInt("15112221349535400772501151409588531511454012693041857206046113283949847762202"),
                Gy: BigInt("46316835694926478169428394003475163141307993866256225615783033603165251855960"),
                hash: _t,
                randomBytes: ft,
                adjustScalarBytes: $e,
                uvRatio: He
            }))()
              , Ge = ( () => function(t) {
                const e = function(t) {
                    const e = Te(t);
                    return ue(t, {
                        hash: "function",
                        a: "bigint",
                        d: "bigint",
                        randomBytes: "function"
                    }, {
                        adjustScalarBytes: "function",
                        domain: "function",
                        uvRatio: "function",
                        mapToCurve: "function"
                    }),
                    Object.freeze({
                        ...e
                    })
                }(t)
                  , {Fp: n, n: r, prehash: i, hash: o, randomBytes: s, nByteLength: a, h: u} = e
                  , c = Ue << BigInt(8 * a) - Re
                  , l = n.create
                  , f = Ee(e.n, e.nBitLength)
                  , h = e.uvRatio || ( (t, e) => {
                    try {
                        return {
                            isValid: !0,
                            value: n.sqrt(t * n.inv(e))
                        }
                    } catch (t) {
                        return {
                            isValid: !1,
                            value: Le
                        }
                    }
                }
                )
                  , d = e.adjustScalarBytes || (t => t)
                  , p = e.domain || ( (t, e, n) => {
                    if (Lt("phflag", n),
                    e.length || n)
                        throw new Error("Contexts/pre-hash are not supported");
                    return t
                }
                );
                function y(t, e) {
                    Xt("coordinate " + t, e, Le, c)
                }
                function g(t) {
                    if (!(t instanceof w))
                        throw new Error("ExtendedPoint expected")
                }
                const m = le(( (t, e) => {
                    const {ex: r, ey: i, ez: o} = t
                      , s = t.is0();
                    null == e && (e = s ? Ne : n.inv(o));
                    const a = l(r * e)
                      , u = l(i * e)
                      , c = l(o * e);
                    if (s)
                        return {
                            x: Le,
                            y: Re
                        };
                    if (c !== Re)
                        throw new Error("invZ was invalid");
                    return {
                        x: a,
                        y: u
                    }
                }
                ))
                  , b = le((t => {
                    const {a: n, d: r} = e;
                    if (t.is0())
                        throw new Error("bad point: ZERO");
                    const {ex: i, ey: o, ez: s, et: a} = t
                      , u = l(i * i)
                      , c = l(o * o)
                      , f = l(s * s)
                      , h = l(f * f)
                      , d = l(u * n);
                    if (l(f * l(d + c)) !== l(h + l(r * l(u * c))))
                        throw new Error("bad point: equation left != right (1)");
                    if (l(i * o) !== l(s * a))
                        throw new Error("bad point: equation left != right (2)");
                    return !0
                }
                ));
                class w {
                    constructor(t, e, n, r) {
                        this.ex = t,
                        this.ey = e,
                        this.ez = n,
                        this.et = r,
                        y("x", t),
                        y("y", e),
                        y("z", n),
                        y("t", r),
                        Object.freeze(this)
                    }
                    get x() {
                        return this.toAffine().x
                    }
                    get y() {
                        return this.toAffine().y
                    }
                    static fromAffine(t) {
                        if (t instanceof w)
                            throw new Error("extended point not allowed");
                        const {x: e, y: n} = t || {};
                        return y("x", e),
                        y("y", n),
                        new w(e,n,Re,l(e * n))
                    }
                    static normalizeZ(t) {
                        const e = n.invertBatch(t.map((t => t.ez)));
                        return t.map(( (t, n) => t.toAffine(e[n]))).map(w.fromAffine)
                    }
                    static msm(t, e) {
                        return Pe(w, f, t, e)
                    }
                    _setWindowSize(t) {
                        S.setWindowSize(this, t)
                    }
                    assertValidity() {
                        b(this)
                    }
                    equals(t) {
                        g(t);
                        const {ex: e, ey: n, ez: r} = this
                          , {ex: i, ey: o, ez: s} = t
                          , a = l(e * s)
                          , u = l(i * r)
                          , c = l(n * s)
                          , f = l(o * r);
                        return a === u && c === f
                    }
                    is0() {
                        return this.equals(w.ZERO)
                    }
                    negate() {
                        return new w(l(-this.ex),this.ey,this.ez,l(-this.et))
                    }
                    double() {
                        const {a: t} = e
                          , {ex: n, ey: r, ez: i} = this
                          , o = l(n * n)
                          , s = l(r * r)
                          , a = l(Ue * l(i * i))
                          , u = l(t * o)
                          , c = n + r
                          , f = l(l(c * c) - o - s)
                          , h = u + s
                          , d = h - a
                          , p = u - s
                          , y = l(f * d)
                          , g = l(h * p)
                          , m = l(f * p)
                          , b = l(d * h);
                        return new w(y,g,b,m)
                    }
                    add(t) {
                        g(t);
                        const {a: n, d: r} = e
                          , {ex: i, ey: o, ez: s, et: a} = this
                          , {ex: u, ey: c, ez: f, et: h} = t;
                        if (n === BigInt(-1)) {
                            const t = l((o - i) * (c + u))
                              , e = l((o + i) * (c - u))
                              , n = l(e - t);
                            if (n === Le)
                                return this.double();
                            const r = l(s * Ue * h)
                              , d = l(a * Ue * f)
                              , p = d + r
                              , y = e + t
                              , g = d - r
                              , m = l(p * n)
                              , b = l(y * g)
                              , v = l(p * g)
                              , x = l(n * y);
                            return new w(m,b,x,v)
                        }
                        const d = l(i * u)
                          , p = l(o * c)
                          , y = l(a * r * h)
                          , m = l(s * f)
                          , b = l((i + o) * (u + c) - d - p)
                          , v = m - y
                          , x = m + y
                          , S = l(p - n * d)
                          , k = l(b * v)
                          , E = l(x * S)
                          , A = l(b * S)
                          , I = l(v * x);
                        return new w(k,E,I,A)
                    }
                    subtract(t) {
                        return this.add(t.negate())
                    }
                    wNAF(t) {
                        return S.wNAFCached(this, t, w.normalizeZ)
                    }
                    multiply(t) {
                        const e = t;
                        Xt("scalar", e, Re, r);
                        const {p: n, f: i} = this.wNAF(e);
                        return w.normalizeZ([n, i])[0]
                    }
                    multiplyUnsafe(t) {
                        const e = t;
                        return Xt("scalar", e, Le, r),
                        e === Le ? x : this.equals(x) || e === Re ? this : this.equals(v) ? this.wNAF(e).p : S.unsafeLadder(this, e)
                    }
                    isSmallOrder() {
                        return this.multiplyUnsafe(u).is0()
                    }
                    isTorsionFree() {
                        return S.unsafeLadder(this, r).is0()
                    }
                    toAffine(t) {
                        return m(this, t)
                    }
                    clearCofactor() {
                        const {h: t} = e;
                        return t === Re ? this : this.multiplyUnsafe(t)
                    }
                    static fromHex(t, r=!1) {
                        const {d: i, a: o} = e
                          , s = n.BYTES;
                        t = Vt("pointHex", t, s),
                        Lt("zip215", r);
                        const a = t.slice()
                          , u = t[s - 1];
                        a[s - 1] = -129 & u;
                        const f = Kt(a)
                          , d = r ? c : n.ORDER;
                        Xt("pointHex.y", f, Le, d);
                        const p = l(f * f)
                          , y = l(p - Re)
                          , g = l(i * p - o);
                        let {isValid: m, value: b} = h(y, g);
                        if (!m)
                            throw new Error("Point.fromHex: invalid y coordinate");
                        const v = (b & Re) === Re
                          , x = !!(128 & u);
                        if (!r && b === Le && x)
                            throw new Error("Point.fromHex: x=0 and x_0=1");
                        return x !== v && (b = l(-b)),
                        w.fromAffine({
                            x: b,
                            y: f
                        })
                    }
                    static fromPrivateKey(t) {
                        return A(t).point
                    }
                    toRawBytes() {
                        const {x: t, y: e} = this.toAffine()
                          , r = $t(e, n.BYTES);
                        return r[r.length - 1] |= t & Re ? 128 : 0,
                        r
                    }
                    toHex() {
                        return Ut(this.toRawBytes())
                    }
                }
                w.BASE = new w(e.Gx,e.Gy,Re,l(e.Gx * e.Gy)),
                w.ZERO = new w(Le,Re,Re,Le);
                const {BASE: v, ZERO: x} = w
                  , S = Oe(w, 8 * a);
                function k(t) {
                    return be(t, r)
                }
                function E(t) {
                    return k(Kt(t))
                }
                function A(t) {
                    const e = a;
                    t = Vt("private key", t, e);
                    const n = Vt("hashed private key", o(t), 2 * e)
                      , r = d(n.slice(0, e))
                      , i = n.slice(e, 2 * e)
                      , s = E(r)
                      , u = v.multiply(s)
                      , c = u.toRawBytes();
                    return {
                        head: r,
                        prefix: i,
                        scalar: s,
                        point: u,
                        pointBytes: c
                    }
                }
                function I(t=new Uint8Array, ...e) {
                    const n = Jt(...e);
                    return E(o(p(n, Vt("context", t), !!i)))
                }
                const M = ze;
                return v._setWindowSize(8),
                {
                    CURVE: e,
                    getPublicKey: function(t) {
                        return A(t).pointBytes
                    },
                    sign: function(t, e, o={}) {
                        t = Vt("message", t),
                        i && (t = i(t));
                        const {prefix: s, scalar: u, pointBytes: c} = A(e)
                          , l = I(o.context, s, t)
                          , f = v.multiply(l).toRawBytes()
                          , h = k(l + I(o.context, f, c, t) * u);
                        return Xt("signature.s", h, Le, r),
                        Vt("result", Jt(f, $t(h, n.BYTES)), 2 * a)
                    },
                    verify: function(t, e, r, o=M) {
                        const {context: s, zip215: a} = o
                          , u = n.BYTES;
                        t = Vt("signature", t, 2 * u),
                        e = Vt("message", e),
                        void 0 !== a && Lt("zip215", a),
                        i && (e = i(e));
                        const c = Kt(t.slice(u, 2 * u));
                        let l, f, h;
                        try {
                            l = w.fromHex(r, a),
                            f = w.fromHex(t.slice(0, u), a),
                            h = v.multiplyUnsafe(c)
                        } catch (t) {
                            return !1
                        }
                        if (!a && l.isSmallOrder())
                            return !1;
                        const d = I(s, f.toRawBytes(), l.toRawBytes(), e);
                        return f.add(l.multiplyUnsafe(d)).subtract(h).clearCofactor().equals(w.ZERO)
                    },
                    ExtendedPoint: w,
                    utils: {
                        getExtendedPublicKey: A,
                        randomPrivateKey: () => s(n.BYTES),
                        precompute: (t=8, e=w.BASE) => (e._setWindowSize(t),
                        e.multiply(BigInt(3)),
                        e)
                    }
                }
            }(Je))();
            var Ze = n("../../../node_modules/bn.js/lib/bn.js")
              , Ye = n.n(Ze);
            const Qe = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298])
              , Xe = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225])
              , tn = new Uint32Array(64);
            class en extends dt {
                constructor() {
                    super(64, 32, 8, !1),
                    this.A = 0 | Xe[0],
                    this.B = 0 | Xe[1],
                    this.C = 0 | Xe[2],
                    this.D = 0 | Xe[3],
                    this.E = 0 | Xe[4],
                    this.F = 0 | Xe[5],
                    this.G = 0 | Xe[6],
                    this.H = 0 | Xe[7]
                }
                get() {
                    const {A: t, B: e, C: n, D: r, E: i, F: o, G: s, H: a} = this;
                    return [t, e, n, r, i, o, s, a]
                }
                set(t, e, n, r, i, o, s, a) {
                    this.A = 0 | t,
                    this.B = 0 | e,
                    this.C = 0 | n,
                    this.D = 0 | r,
                    this.E = 0 | i,
                    this.F = 0 | o,
                    this.G = 0 | s,
                    this.H = 0 | a
                }
                process(t, e) {
                    for (let n = 0; n < 16; n++,
                    e += 4)
                        tn[n] = t.getUint32(e, !1);
                    for (let t = 16; t < 64; t++) {
                        const e = tn[t - 15]
                          , n = tn[t - 2]
                          , r = ot(e, 7) ^ ot(e, 18) ^ e >>> 3
                          , i = ot(n, 17) ^ ot(n, 19) ^ n >>> 10;
                        tn[t] = i + tn[t - 7] + r + tn[t - 16] | 0
                    }
                    let {A: n, B: r, C: i, D: o, E: s, F: a, G: u, H: c} = this;
                    for (let t = 0; t < 64; t++) {
                        const e = c + (ot(s, 6) ^ ot(s, 11) ^ ot(s, 25)) + ((l = s) & a ^ ~l & u) + Qe[t] + tn[t] | 0
                          , f = (ot(n, 2) ^ ot(n, 13) ^ ot(n, 22)) + ht(n, r, i) | 0;
                        c = u,
                        u = a,
                        a = s,
                        s = o + e | 0,
                        o = i,
                        i = r,
                        r = n,
                        n = e + f | 0
                    }
                    var l;
                    n = n + this.A | 0,
                    r = r + this.B | 0,
                    i = i + this.C | 0,
                    o = o + this.D | 0,
                    s = s + this.E | 0,
                    a = a + this.F | 0,
                    u = u + this.G | 0,
                    c = c + this.H | 0,
                    this.set(n, r, i, o, s, a, u, c)
                }
                roundClean() {
                    tn.fill(0)
                }
                destroy() {
                    this.set(0, 0, 0, 0, 0, 0, 0, 0),
                    this.buffer.fill(0)
                }
            }
            const nn = lt(( () => new en));
            var rn = n("../../../node_modules/borsh/lib/index.js")
              , on = n("../../../node_modules/@solana/buffer-layout/lib/Layout.js")
              , sn = n("../../../node_modules/bigint-buffer/dist/browser.js");
            n("../../../node_modules/console-browserify/index.js");
            class an extends TypeError {
                constructor(t, e) {
                    let n;
                    const {message: r, explanation: i, ...o} = t
                      , {path: s} = t
                      , a = 0 === s.length ? r : `At path: ${s.join(".")} -- ${r}`;
                    super(i ?? a),
                    null != i && (this.cause = a),
                    Object.assign(this, o),
                    this.name = this.constructor.name,
                    this.failures = () => n ?? (n = [t, ...e()])
                }
            }
            function un(t) {
                return "object" == typeof t && null != t
            }
            function cn(t) {
                return un(t) && !Array.isArray(t)
            }
            function ln(t) {
                return "symbol" == typeof t ? t.toString() : "string" == typeof t ? JSON.stringify(t) : `${t}`
            }
            function fn(t, e, n, r) {
                if (!0 === t)
                    return;
                !1 === t ? t = {} : "string" == typeof t && (t = {
                    message: t
                });
                const {path: i, branch: o} = e
                  , {type: s} = n
                  , {refinement: a, message: u=`Expected a value of type \`${s}\`${a ? ` with refinement \`${a}\`` : ""}, but received: \`${ln(r)}\``} = t;
                return {
                    value: r,
                    type: s,
                    refinement: a,
                    key: i[i.length - 1],
                    path: i,
                    branch: o,
                    ...t,
                    message: u
                }
            }
            function *hn(t, e, n, r) {
                var i;
                un(i = t) && "function" == typeof i[Symbol.iterator] || (t = [t]);
                for (const i of t) {
                    const t = fn(i, e, n, r);
                    t && (yield t)
                }
            }
            function *dn(t, e, n={}) {
                const {path: r=[], branch: i=[t], coerce: o=!1, mask: s=!1} = n
                  , a = {
                    path: r,
                    branch: i,
                    mask: s
                };
                o && (t = e.coercer(t, a));
                let u = "valid";
                for (const r of e.validator(t, a))
                    r.explanation = n.message,
                    u = "not_valid",
                    yield[r, void 0];
                for (let[c,l,f] of e.entries(t, a)) {
                    const e = dn(l, f, {
                        path: void 0 === c ? r : [...r, c],
                        branch: void 0 === c ? i : [...i, l],
                        coerce: o,
                        mask: s,
                        message: n.message
                    });
                    for (const n of e)
                        n[0] ? (u = null != n[0].refinement ? "not_refined" : "not_valid",
                        yield[n[0], void 0]) : o && (l = n[1],
                        void 0 === c ? t = l : t instanceof Map ? t.set(c, l) : t instanceof Set ? t.add(l) : un(t) && (void 0 !== l || c in t) && (t[c] = l))
                }
                if ("not_valid" !== u)
                    for (const r of e.refiner(t, a))
                        r.explanation = n.message,
                        u = "not_refined",
                        yield[r, void 0];
                "valid" === u && (yield[void 0, t])
            }
            class pn {
                constructor(t) {
                    const {type: e, schema: n, validator: r, refiner: i, coercer: o=(t => t), entries: s=function*() {}
                    } = t;
                    this.type = e,
                    this.schema = n,
                    this.entries = s,
                    this.coercer = o,
                    this.validator = r ? (t, e) => hn(r(t, e), e, this, t) : () => [],
                    this.refiner = i ? (t, e) => hn(i(t, e), e, this, t) : () => []
                }
                assert(t, e) {
                    return function(t, e, n) {
                        const r = mn(t, e, {
                            message: n
                        });
                        if (r[0])
                            throw r[0]
                    }(t, this, e)
                }
                create(t, e) {
                    return yn(t, this, e)
                }
                is(t) {
                    return gn(t, this)
                }
                mask(t, e) {
                    return function(t, e, n) {
                        const r = mn(t, e, {
                            coerce: !0,
                            mask: !0,
                            message: n
                        });
                        if (r[0])
                            throw r[0];
                        return r[1]
                    }(t, this, e)
                }
                validate(t, e={}) {
                    return mn(t, this, e)
                }
            }
            function yn(t, e, n) {
                const r = mn(t, e, {
                    coerce: !0,
                    message: n
                });
                if (r[0])
                    throw r[0];
                return r[1]
            }
            function gn(t, e) {
                return !mn(t, e)[0]
            }
            function mn(t, e, n={}) {
                const r = dn(t, e, n)
                  , i = function(t) {
                    const {done: e, value: n} = t.next();
                    return e ? void 0 : n
                }(r);
                return i[0] ? [new an(i[0],(function*() {
                    for (const t of r)
                        t[0] && (yield t[0])
                }
                )), void 0] : [void 0, i[1]]
            }
            function bn(t, e) {
                return new pn({
                    type: t,
                    schema: null,
                    validator: e
                })
            }
            function wn(t) {
                return new pn({
                    type: "array",
                    schema: t,
                    *entries(e) {
                        if (t && Array.isArray(e))
                            for (const [n,r] of e.entries())
                                yield[n, r, t]
                    },
                    coercer: t => Array.isArray(t) ? t.slice() : t,
                    validator: t => Array.isArray(t) || `Expected an array value, but received: ${ln(t)}`
                })
            }
            function vn() {
                return bn("boolean", (t => "boolean" == typeof t))
            }
            function xn(t) {
                return bn("instance", (e => e instanceof t || `Expected a \`${t.name}\` instance, but received: ${ln(e)}`))
            }
            function Sn(t) {
                const e = ln(t)
                  , n = typeof t;
                return new pn({
                    type: "literal",
                    schema: "string" === n || "number" === n || "boolean" === n ? t : null,
                    validator: n => n === t || `Expected the literal \`${e}\`, but received: ${ln(n)}`
                })
            }
            function kn(t) {
                return new pn({
                    ...t,
                    validator: (e, n) => null === e || t.validator(e, n),
                    refiner: (e, n) => null === e || t.refiner(e, n)
                })
            }
            function En() {
                return bn("number", (t => "number" == typeof t && !isNaN(t) || `Expected a number, but received: ${ln(t)}`))
            }
            function An(t) {
                return new pn({
                    ...t,
                    validator: (e, n) => void 0 === e || t.validator(e, n),
                    refiner: (e, n) => void 0 === e || t.refiner(e, n)
                })
            }
            function In(t, e) {
                return new pn({
                    type: "record",
                    schema: null,
                    *entries(n) {
                        if (un(n))
                            for (const r in n) {
                                const i = n[r];
                                yield[r, r, t],
                                yield[r, i, e]
                            }
                    },
                    validator: t => cn(t) || `Expected an object, but received: ${ln(t)}`,
                    coercer: t => cn(t) ? {
                        ...t
                    } : t
                })
            }
            function Mn() {
                return bn("string", (t => "string" == typeof t || `Expected a string, but received: ${ln(t)}`))
            }
            function _n(t) {
                const e = bn("never", ( () => !1));
                return new pn({
                    type: "tuple",
                    schema: null,
                    *entries(n) {
                        if (Array.isArray(n)) {
                            const r = Math.max(t.length, n.length);
                            for (let i = 0; i < r; i++)
                                yield[i, n[i], t[i] || e]
                        }
                    },
                    validator: t => Array.isArray(t) || `Expected an array, but received: ${ln(t)}`,
                    coercer: t => Array.isArray(t) ? t.slice() : t
                })
            }
            function Bn(t) {
                const e = Object.keys(t);
                return new pn({
                    type: "type",
                    schema: t,
                    *entries(n) {
                        if (un(n))
                            for (const r of e)
                                yield[r, n[r], t[r]]
                    },
                    validator: t => cn(t) || `Expected an object, but received: ${ln(t)}`,
                    coercer: t => cn(t) ? {
                        ...t
                    } : t
                })
            }
            function jn(t) {
                const e = t.map((t => t.type)).join(" | ");
                return new pn({
                    type: "union",
                    schema: null,
                    coercer(e, n) {
                        for (const r of t) {
                            const [t,i] = r.validate(e, {
                                coerce: !0,
                                mask: n.mask
                            });
                            if (!t)
                                return i
                        }
                        return e
                    },
                    validator(n, r) {
                        const i = [];
                        for (const e of t) {
                            const [...t] = dn(n, e, r)
                              , [o] = t;
                            if (!o[0])
                                return [];
                            for (const [e] of t)
                                e && i.push(e)
                        }
                        return [`Expected the value to satisfy a union of \`${e}\`, but received: ${ln(n)}`, ...i]
                    }
                })
            }
            function On() {
                return bn("unknown", ( () => !0))
            }
            function Pn(t, e, n) {
                return new pn({
                    ...t,
                    coercer: (r, i) => gn(r, e) ? t.coercer(n(r, i), i) : t.coercer(r, i)
                })
            }
            n("../../../node_modules/jayson/lib/client/browser/index.js"),
            n("../../../node_modules/rpc-websockets/node_modules/eventemitter3/index.js");
            const Tn = []
              , Ln = []
              , Rn = []
              , Un = BigInt(0)
              , Nn = BigInt(1)
              , zn = BigInt(2)
              , qn = BigInt(7)
              , Wn = BigInt(256)
              , Cn = BigInt(113);
            for (let t = 0, e = Nn, n = 1, r = 0; t < 24; t++) {
                [n,r] = [r, (2 * n + 3 * r) % 5],
                Tn.push(2 * (5 * r + n)),
                Ln.push((t + 1) * (t + 2) / 2 % 64);
                let i = Un;
                for (let t = 0; t < 7; t++)
                    e = (e << Nn ^ (e >> qn) * Cn) % Wn,
                    e & zn && (i ^= Nn << (Nn << BigInt(t)) - Nn);
                Rn.push(i)
            }
            const [Fn,Kn] = mt(Rn, !0)
              , Dn = (t, e, n) => n > 32 ? vt(t, e, n) : bt(t, e, n)
              , $n = (t, e, n) => n > 32 ? xt(t, e, n) : wt(t, e, n);
            class Hn extends ct {
                constructor(t, e, n, r=!1, i=24) {
                    if (super(),
                    this.blockLen = t,
                    this.suffix = e,
                    this.outputLen = n,
                    this.enableXOF = r,
                    this.rounds = i,
                    this.pos = 0,
                    this.posOut = 0,
                    this.finished = !1,
                    this.destroyed = !1,
                    X(n),
                    0 >= this.blockLen || this.blockLen >= 200)
                        throw new Error("Sha3 supports only keccak-f1600 function");
                    var o;
                    this.state = new Uint8Array(200),
                    this.state32 = (o = this.state,
                    new Uint32Array(o.buffer,o.byteOffset,Math.floor(o.byteLength / 4)))
                }
                keccak() {
                    st || at(this.state32),
                    function(t, e=24) {
                        const n = new Uint32Array(10);
                        for (let r = 24 - e; r < 24; r++) {
                            for (let e = 0; e < 10; e++)
                                n[e] = t[e] ^ t[e + 10] ^ t[e + 20] ^ t[e + 30] ^ t[e + 40];
                            for (let e = 0; e < 10; e += 2) {
                                const r = (e + 8) % 10
                                  , i = (e + 2) % 10
                                  , o = n[i]
                                  , s = n[i + 1]
                                  , a = Dn(o, s, 1) ^ n[r]
                                  , u = $n(o, s, 1) ^ n[r + 1];
                                for (let n = 0; n < 50; n += 10)
                                    t[e + n] ^= a,
                                    t[e + n + 1] ^= u
                            }
                            let e = t[2]
                              , i = t[3];
                            for (let n = 0; n < 24; n++) {
                                const r = Ln[n]
                                  , o = Dn(e, i, r)
                                  , s = $n(e, i, r)
                                  , a = Tn[n];
                                e = t[a],
                                i = t[a + 1],
                                t[a] = o,
                                t[a + 1] = s
                            }
                            for (let e = 0; e < 50; e += 10) {
                                for (let r = 0; r < 10; r++)
                                    n[r] = t[e + r];
                                for (let r = 0; r < 10; r++)
                                    t[e + r] ^= ~n[(r + 2) % 10] & n[(r + 4) % 10]
                            }
                            t[0] ^= Fn[r],
                            t[1] ^= Kn[r]
                        }
                        n.fill(0)
                    }(this.state32, this.rounds),
                    st || at(this.state32),
                    this.posOut = 0,
                    this.pos = 0
                }
                update(t) {
                    et(this);
                    const {blockLen: e, state: n} = this
                      , r = (t = ut(t)).length;
                    for (let i = 0; i < r; ) {
                        const o = Math.min(e - this.pos, r - i);
                        for (let e = 0; e < o; e++)
                            n[this.pos++] ^= t[i++];
                        this.pos === e && this.keccak()
                    }
                    return this
                }
                finish() {
                    if (this.finished)
                        return;
                    this.finished = !0;
                    const {state: t, suffix: e, pos: n, blockLen: r} = this;
                    t[n] ^= e,
                    128 & e && n === r - 1 && this.keccak(),
                    t[r - 1] ^= 128,
                    this.keccak()
                }
                writeInto(t) {
                    et(this, !1),
                    tt(t),
                    this.finish();
                    const e = this.state
                      , {blockLen: n} = this;
                    for (let r = 0, i = t.length; r < i; ) {
                        this.posOut >= n && this.keccak();
                        const o = Math.min(n - this.posOut, i - r);
                        t.set(e.subarray(this.posOut, this.posOut + o), r),
                        this.posOut += o,
                        r += o
                    }
                    return t
                }
                xofInto(t) {
                    if (!this.enableXOF)
                        throw new Error("XOF is not possible for this instance");
                    return this.writeInto(t)
                }
                xof(t) {
                    return X(t),
                    this.xofInto(new Uint8Array(t))
                }
                digestInto(t) {
                    if (nt(t, this),
                    this.finished)
                        throw new Error("digest() was already called");
                    return this.writeInto(t),
                    this.destroy(),
                    t
                }
                digest() {
                    return this.digestInto(new Uint8Array(this.outputLen))
                }
                destroy() {
                    this.destroyed = !0,
                    this.state.fill(0)
                }
                _cloneInto(t) {
                    const {blockLen: e, suffix: n, outputLen: r, rounds: i, enableXOF: o} = this;
                    return t || (t = new Hn(e,n,r,o,i)),
                    t.state32.set(this.state32),
                    t.pos = this.pos,
                    t.posOut = this.posOut,
                    t.finished = this.finished,
                    t.rounds = i,
                    t.suffix = n,
                    t.outputLen = r,
                    t.enableXOF = o,
                    t.destroyed = this.destroyed,
                    t
                }
            }
            const Vn = ( (t, e, n) => lt(( () => new Hn(e,t,n))))(1, 136, 32);
            class Jn extends ct {
                constructor(t, e) {
                    super(),
                    this.finished = !1,
                    this.destroyed = !1,
                    function(t) {
                        if ("function" != typeof t || "function" != typeof t.create)
                            throw new Error("Hash should be wrapped by utils.wrapConstructor");
                        X(t.outputLen),
                        X(t.blockLen)
                    }(t);
                    const n = ut(e);
                    if (this.iHash = t.create(),
                    "function" != typeof this.iHash.update)
                        throw new Error("Expected instance of class which extends utils.Hash");
                    this.blockLen = this.iHash.blockLen,
                    this.outputLen = this.iHash.outputLen;
                    const r = this.blockLen
                      , i = new Uint8Array(r);
                    i.set(n.length > r ? t.create().update(n).digest() : n);
                    for (let t = 0; t < i.length; t++)
                        i[t] ^= 54;
                    this.iHash.update(i),
                    this.oHash = t.create();
                    for (let t = 0; t < i.length; t++)
                        i[t] ^= 106;
                    this.oHash.update(i),
                    i.fill(0)
                }
                update(t) {
                    return et(this),
                    this.iHash.update(t),
                    this
                }
                digestInto(t) {
                    et(this),
                    tt(t, this.outputLen),
                    this.finished = !0,
                    this.iHash.digestInto(t),
                    this.oHash.update(t),
                    this.oHash.digestInto(t),
                    this.destroy()
                }
                digest() {
                    const t = new Uint8Array(this.oHash.outputLen);
                    return this.digestInto(t),
                    t
                }
                _cloneInto(t) {
                    t || (t = Object.create(Object.getPrototypeOf(this), {}));
                    const {oHash: e, iHash: n, finished: r, destroyed: i, blockLen: o, outputLen: s} = this;
                    return t.finished = r,
                    t.destroyed = i,
                    t.blockLen = o,
                    t.outputLen = s,
                    t.oHash = e._cloneInto(t.oHash),
                    t.iHash = n._cloneInto(t.iHash),
                    t
                }
                destroy() {
                    this.destroyed = !0,
                    this.oHash.destroy(),
                    this.iHash.destroy()
                }
            }
            const Gn = (t, e, n) => new Jn(t,e).update(n).digest();
            function Zn(t) {
                void 0 !== t.lowS && Lt("lowS", t.lowS),
                void 0 !== t.prehash && Lt("prehash", t.prehash)
            }
            Gn.create = (t, e) => new Jn(t,e);
            const {bytesToNumberBE: Yn, hexToBytes: Qn} = r
              , Xn = {
                Err: class extends Error {
                    constructor(t="") {
                        super(t)
                    }
                }
                ,
                _tlv: {
                    encode: (t, e) => {
                        const {Err: n} = Xn;
                        if (t < 0 || t > 256)
                            throw new n("tlv.encode: wrong tag");
                        if (1 & e.length)
                            throw new n("tlv.encode: unpadded data");
                        const r = e.length / 2
                          , i = Nt(r);
                        if (i.length / 2 & 128)
                            throw new n("tlv.encode: long form length too big");
                        const o = r > 127 ? Nt(i.length / 2 | 128) : "";
                        return `${Nt(t)}${o}${i}${e}`
                    }
                    ,
                    decode(t, e) {
                        const {Err: n} = Xn;
                        let r = 0;
                        if (t < 0 || t > 256)
                            throw new n("tlv.encode: wrong tag");
                        if (e.length < 2 || e[r++] !== t)
                            throw new n("tlv.decode: wrong tlv");
                        const i = e[r++];
                        let o = 0;
                        if (128 & i) {
                            const t = 127 & i;
                            if (!t)
                                throw new n("tlv.decode(long): indefinite length not supported");
                            if (t > 4)
                                throw new n("tlv.decode(long): byte length is too big");
                            const s = e.subarray(r, r + t);
                            if (s.length !== t)
                                throw new n("tlv.decode: length bytes not complete");
                            if (0 === s[0])
                                throw new n("tlv.decode(long): zero leftmost byte");
                            for (const t of s)
                                o = o << 8 | t;
                            if (r += t,
                            o < 128)
                                throw new n("tlv.decode(long): not minimal encoding")
                        } else
                            o = i;
                        const s = e.subarray(r, r + o);
                        if (s.length !== o)
                            throw new n("tlv.decode: wrong value length");
                        return {
                            v: s,
                            l: e.subarray(r + o)
                        }
                    }
                },
                _int: {
                    encode(t) {
                        const {Err: e} = Xn;
                        if (t < tr)
                            throw new e("integer: negative integers are not allowed");
                        let n = Nt(t);
                        if (8 & Number.parseInt(n[0], 16) && (n = "00" + n),
                        1 & n.length)
                            throw new e("unexpected assertion");
                        return n
                    },
                    decode(t) {
                        const {Err: e} = Xn;
                        if (128 & t[0])
                            throw new e("Invalid signature integer: negative");
                        if (0 === t[0] && !(128 & t[1]))
                            throw new e("Invalid signature integer: unnecessary leading zero");
                        return Yn(t)
                    }
                },
                toSig(t) {
                    const {Err: e, _int: n, _tlv: r} = Xn
                      , i = "string" == typeof t ? Qn(t) : t;
                    Tt(i);
                    const {v: o, l: s} = r.decode(48, i);
                    if (s.length)
                        throw new e("Invalid signature: left bytes after parsing");
                    const {v: a, l: u} = r.decode(2, o)
                      , {v: c, l} = r.decode(2, u);
                    if (l.length)
                        throw new e("Invalid signature: left bytes after parsing");
                    return {
                        r: n.decode(a),
                        s: n.decode(c)
                    }
                },
                hexFromSig(t) {
                    const {_tlv: e, _int: n} = Xn
                      , r = `${e.encode(2, n.encode(t.r))}${e.encode(2, n.encode(t.s))}`;
                    return e.encode(48, r)
                }
            }
              , tr = BigInt(0)
              , er = BigInt(1)
              , nr = (BigInt(2),
            BigInt(3));
            function rr(t) {
                const e = function(t) {
                    const e = Te(t);
                    return ue(e, {
                        hash: "hash",
                        hmac: "function",
                        randomBytes: "function"
                    }, {
                        bits2int: "function",
                        bits2int_modN: "function",
                        lowS: "boolean"
                    }),
                    Object.freeze({
                        lowS: !0,
                        ...e
                    })
                }(t)
                  , {Fp: n, n: r} = e
                  , i = n.BYTES + 1
                  , o = 2 * n.BYTES + 1;
                function s(t) {
                    return be(t, r)
                }
                function a(t) {
                    return xe(t, r)
                }
                const {ProjectivePoint: u, normPrivateKeyToScalar: c, weierstrassEquation: l, isWithinCurveOrder: f} = function(t) {
                    const e = function(t) {
                        const e = Te(t);
                        ue(e, {
                            a: "field",
                            b: "field"
                        }, {
                            allowedPrivateKeyLengths: "array",
                            wrapPrivateKey: "boolean",
                            isTorsionFree: "function",
                            clearCofactor: "function",
                            allowInfinityPoint: "boolean",
                            fromBytes: "function",
                            toBytes: "function"
                        });
                        const {endo: n, Fp: r, a: i} = e;
                        if (n) {
                            if (!r.eql(i, r.ZERO))
                                throw new Error("Endomorphism can only be defined for Koblitz curves that have a=0");
                            if ("object" != typeof n || "bigint" != typeof n.beta || "function" != typeof n.splitScalar)
                                throw new Error("Expected endomorphism with beta: bigint and splitScalar: function")
                        }
                        return Object.freeze({
                            ...e
                        })
                    }(t)
                      , {Fp: n} = e
                      , r = Ee(e.n, e.nBitLength)
                      , i = e.toBytes || ( (t, e, r) => {
                        const i = e.toAffine();
                        return Jt(Uint8Array.from([4]), n.toBytes(i.x), n.toBytes(i.y))
                    }
                    )
                      , o = e.fromBytes || (t => {
                        const e = t.subarray(1);
                        return {
                            x: n.fromBytes(e.subarray(0, n.BYTES)),
                            y: n.fromBytes(e.subarray(n.BYTES, 2 * n.BYTES))
                        }
                    }
                    );
                    function s(t) {
                        const {a: r, b: i} = e
                          , o = n.sqr(t)
                          , s = n.mul(o, t);
                        return n.add(n.add(s, n.mul(t, r)), i)
                    }
                    if (!n.eql(n.sqr(e.Gy), s(e.Gx)))
                        throw new Error("bad generator point: equation left != right");
                    function a(t) {
                        const {allowedPrivateKeyLengths: n, nByteLength: r, wrapPrivateKey: i, n: o} = e;
                        if (n && "bigint" != typeof t) {
                            if (Pt(t) && (t = Ut(t)),
                            "string" != typeof t || !n.includes(t.length))
                                throw new Error("Invalid key");
                            t = t.padStart(2 * r, "0")
                        }
                        let s;
                        try {
                            s = "bigint" == typeof t ? t : Ft(Vt("private key", t, r))
                        } catch (e) {
                            throw new Error(`private key must be ${r} bytes, hex or bigint, not ${typeof t}`)
                        }
                        return i && (s = be(s, o)),
                        Xt("private key", s, er, o),
                        s
                    }
                    function u(t) {
                        if (!(t instanceof f))
                            throw new Error("ProjectivePoint expected")
                    }
                    const c = le(( (t, e) => {
                        const {px: r, py: i, pz: o} = t;
                        if (n.eql(o, n.ONE))
                            return {
                                x: r,
                                y: i
                            };
                        const s = t.is0();
                        null == e && (e = s ? n.ONE : n.inv(o));
                        const a = n.mul(r, e)
                          , u = n.mul(i, e)
                          , c = n.mul(o, e);
                        if (s)
                            return {
                                x: n.ZERO,
                                y: n.ZERO
                            };
                        if (!n.eql(c, n.ONE))
                            throw new Error("invZ was invalid");
                        return {
                            x: a,
                            y: u
                        }
                    }
                    ))
                      , l = le((t => {
                        if (t.is0()) {
                            if (e.allowInfinityPoint && !n.is0(t.py))
                                return;
                            throw new Error("bad point: ZERO")
                        }
                        const {x: r, y: i} = t.toAffine();
                        if (!n.isValid(r) || !n.isValid(i))
                            throw new Error("bad point: x or y not FE");
                        const o = n.sqr(i)
                          , a = s(r);
                        if (!n.eql(o, a))
                            throw new Error("bad point: equation left != right");
                        if (!t.isTorsionFree())
                            throw new Error("bad point: not in prime-order subgroup");
                        return !0
                    }
                    ));
                    class f {
                        constructor(t, e, r) {
                            if (this.px = t,
                            this.py = e,
                            this.pz = r,
                            null == t || !n.isValid(t))
                                throw new Error("x required");
                            if (null == e || !n.isValid(e))
                                throw new Error("y required");
                            if (null == r || !n.isValid(r))
                                throw new Error("z required");
                            Object.freeze(this)
                        }
                        static fromAffine(t) {
                            const {x: e, y: r} = t || {};
                            if (!t || !n.isValid(e) || !n.isValid(r))
                                throw new Error("invalid affine point");
                            if (t instanceof f)
                                throw new Error("projective point not allowed");
                            const i = t => n.eql(t, n.ZERO);
                            return i(e) && i(r) ? f.ZERO : new f(e,r,n.ONE)
                        }
                        get x() {
                            return this.toAffine().x
                        }
                        get y() {
                            return this.toAffine().y
                        }
                        static normalizeZ(t) {
                            const e = n.invertBatch(t.map((t => t.pz)));
                            return t.map(( (t, n) => t.toAffine(e[n]))).map(f.fromAffine)
                        }
                        static fromHex(t) {
                            const e = f.fromAffine(o(Vt("pointHex", t)));
                            return e.assertValidity(),
                            e
                        }
                        static fromPrivateKey(t) {
                            return f.BASE.multiply(a(t))
                        }
                        static msm(t, e) {
                            return Pe(f, r, t, e)
                        }
                        _setWindowSize(t) {
                            d.setWindowSize(this, t)
                        }
                        assertValidity() {
                            l(this)
                        }
                        hasEvenY() {
                            const {y: t} = this.toAffine();
                            if (n.isOdd)
                                return !n.isOdd(t);
                            throw new Error("Field doesn't support isOdd")
                        }
                        equals(t) {
                            u(t);
                            const {px: e, py: r, pz: i} = this
                              , {px: o, py: s, pz: a} = t
                              , c = n.eql(n.mul(e, a), n.mul(o, i))
                              , l = n.eql(n.mul(r, a), n.mul(s, i));
                            return c && l
                        }
                        negate() {
                            return new f(this.px,n.neg(this.py),this.pz)
                        }
                        double() {
                            const {a: t, b: r} = e
                              , i = n.mul(r, nr)
                              , {px: o, py: s, pz: a} = this;
                            let u = n.ZERO
                              , c = n.ZERO
                              , l = n.ZERO
                              , h = n.mul(o, o)
                              , d = n.mul(s, s)
                              , p = n.mul(a, a)
                              , y = n.mul(o, s);
                            return y = n.add(y, y),
                            l = n.mul(o, a),
                            l = n.add(l, l),
                            u = n.mul(t, l),
                            c = n.mul(i, p),
                            c = n.add(u, c),
                            u = n.sub(d, c),
                            c = n.add(d, c),
                            c = n.mul(u, c),
                            u = n.mul(y, u),
                            l = n.mul(i, l),
                            p = n.mul(t, p),
                            y = n.sub(h, p),
                            y = n.mul(t, y),
                            y = n.add(y, l),
                            l = n.add(h, h),
                            h = n.add(l, h),
                            h = n.add(h, p),
                            h = n.mul(h, y),
                            c = n.add(c, h),
                            p = n.mul(s, a),
                            p = n.add(p, p),
                            h = n.mul(p, y),
                            u = n.sub(u, h),
                            l = n.mul(p, d),
                            l = n.add(l, l),
                            l = n.add(l, l),
                            new f(u,c,l)
                        }
                        add(t) {
                            u(t);
                            const {px: r, py: i, pz: o} = this
                              , {px: s, py: a, pz: c} = t;
                            let l = n.ZERO
                              , h = n.ZERO
                              , d = n.ZERO;
                            const p = e.a
                              , y = n.mul(e.b, nr);
                            let g = n.mul(r, s)
                              , m = n.mul(i, a)
                              , b = n.mul(o, c)
                              , w = n.add(r, i)
                              , v = n.add(s, a);
                            w = n.mul(w, v),
                            v = n.add(g, m),
                            w = n.sub(w, v),
                            v = n.add(r, o);
                            let x = n.add(s, c);
                            return v = n.mul(v, x),
                            x = n.add(g, b),
                            v = n.sub(v, x),
                            x = n.add(i, o),
                            l = n.add(a, c),
                            x = n.mul(x, l),
                            l = n.add(m, b),
                            x = n.sub(x, l),
                            d = n.mul(p, v),
                            l = n.mul(y, b),
                            d = n.add(l, d),
                            l = n.sub(m, d),
                            d = n.add(m, d),
                            h = n.mul(l, d),
                            m = n.add(g, g),
                            m = n.add(m, g),
                            b = n.mul(p, b),
                            v = n.mul(y, v),
                            m = n.add(m, b),
                            b = n.sub(g, b),
                            b = n.mul(p, b),
                            v = n.add(v, b),
                            g = n.mul(m, v),
                            h = n.add(h, g),
                            g = n.mul(x, v),
                            l = n.mul(w, l),
                            l = n.sub(l, g),
                            g = n.mul(w, m),
                            d = n.mul(x, d),
                            d = n.add(d, g),
                            new f(l,h,d)
                        }
                        subtract(t) {
                            return this.add(t.negate())
                        }
                        is0() {
                            return this.equals(f.ZERO)
                        }
                        wNAF(t) {
                            return d.wNAFCached(this, t, f.normalizeZ)
                        }
                        multiplyUnsafe(t) {
                            Xt("scalar", t, tr, e.n);
                            const r = f.ZERO;
                            if (t === tr)
                                return r;
                            if (t === er)
                                return this;
                            const {endo: i} = e;
                            if (!i)
                                return d.unsafeLadder(this, t);
                            let {k1neg: o, k1: s, k2neg: a, k2: u} = i.splitScalar(t)
                              , c = r
                              , l = r
                              , h = this;
                            for (; s > tr || u > tr; )
                                s & er && (c = c.add(h)),
                                u & er && (l = l.add(h)),
                                h = h.double(),
                                s >>= er,
                                u >>= er;
                            return o && (c = c.negate()),
                            a && (l = l.negate()),
                            l = new f(n.mul(l.px, i.beta),l.py,l.pz),
                            c.add(l)
                        }
                        multiply(t) {
                            const {endo: r, n: i} = e;
                            let o, s;
                            if (Xt("scalar", t, er, i),
                            r) {
                                const {k1neg: e, k1: i, k2neg: a, k2: u} = r.splitScalar(t);
                                let {p: c, f: l} = this.wNAF(i)
                                  , {p: h, f: p} = this.wNAF(u);
                                c = d.constTimeNegate(e, c),
                                h = d.constTimeNegate(a, h),
                                h = new f(n.mul(h.px, r.beta),h.py,h.pz),
                                o = c.add(h),
                                s = l.add(p)
                            } else {
                                const {p: e, f: n} = this.wNAF(t);
                                o = e,
                                s = n
                            }
                            return f.normalizeZ([o, s])[0]
                        }
                        multiplyAndAddUnsafe(t, e, n) {
                            const r = f.BASE
                              , i = (t, e) => e !== tr && e !== er && t.equals(r) ? t.multiply(e) : t.multiplyUnsafe(e)
                              , o = i(this, e).add(i(t, n));
                            return o.is0() ? void 0 : o
                        }
                        toAffine(t) {
                            return c(this, t)
                        }
                        isTorsionFree() {
                            const {h: t, isTorsionFree: n} = e;
                            if (t === er)
                                return !0;
                            if (n)
                                return n(f, this);
                            throw new Error("isTorsionFree() has not been declared for the elliptic curve")
                        }
                        clearCofactor() {
                            const {h: t, clearCofactor: n} = e;
                            return t === er ? this : n ? n(f, this) : this.multiplyUnsafe(e.h)
                        }
                        toRawBytes(t=!0) {
                            return Lt("isCompressed", t),
                            this.assertValidity(),
                            i(f, this, t)
                        }
                        toHex(t=!0) {
                            return Lt("isCompressed", t),
                            Ut(this.toRawBytes(t))
                        }
                    }
                    f.BASE = new f(e.Gx,e.Gy,n.ONE),
                    f.ZERO = new f(n.ZERO,n.ONE,n.ZERO);
                    const h = e.nBitLength
                      , d = Oe(f, e.endo ? Math.ceil(h / 2) : h);
                    return {
                        CURVE: e,
                        ProjectivePoint: f,
                        normPrivateKeyToScalar: a,
                        weierstrassEquation: s,
                        isWithinCurveOrder: function(t) {
                            return Qt(t, er, e.n)
                        }
                    }
                }({
                    ...e,
                    toBytes(t, e, r) {
                        const i = e.toAffine()
                          , o = n.toBytes(i.x)
                          , s = Jt;
                        return Lt("isCompressed", r),
                        r ? s(Uint8Array.from([e.hasEvenY() ? 2 : 3]), o) : s(Uint8Array.from([4]), o, n.toBytes(i.y))
                    },
                    fromBytes(t) {
                        const e = t.length
                          , r = t[0]
                          , s = t.subarray(1);
                        if (e !== i || 2 !== r && 3 !== r) {
                            if (e === o && 4 === r)
                                return {
                                    x: n.fromBytes(s.subarray(0, n.BYTES)),
                                    y: n.fromBytes(s.subarray(n.BYTES, 2 * n.BYTES))
                                };
                            throw new Error(`Point of length ${e} was invalid. Expected ${i} compressed bytes or ${o} uncompressed bytes`)
                        }
                        {
                            const t = Ft(s);
                            if (!Qt(t, er, n.ORDER))
                                throw new Error("Point is not on curve");
                            const e = l(t);
                            let i;
                            try {
                                i = n.sqrt(e)
                            } catch (t) {
                                const e = t instanceof Error ? ": " + t.message : "";
                                throw new Error("Point is not on curve" + e)
                            }
                            return !(1 & ~r) != ((i & er) === er) && (i = n.neg(i)),
                            {
                                x: t,
                                y: i
                            }
                        }
                    }
                })
                  , h = t => Ut(Dt(t, e.nByteLength));
                function d(t) {
                    return t > r >> er
                }
                const p = (t, e, n) => Ft(t.slice(e, n));
                class y {
                    constructor(t, e, n) {
                        this.r = t,
                        this.s = e,
                        this.recovery = n,
                        this.assertValidity()
                    }
                    static fromCompact(t) {
                        const n = e.nByteLength;
                        return t = Vt("compactSignature", t, 2 * n),
                        new y(p(t, 0, n),p(t, n, 2 * n))
                    }
                    static fromDER(t) {
                        const {r: e, s: n} = Xn.toSig(Vt("DER", t));
                        return new y(e,n)
                    }
                    assertValidity() {
                        Xt("r", this.r, er, r),
                        Xt("s", this.s, er, r)
                    }
                    addRecoveryBit(t) {
                        return new y(this.r,this.s,t)
                    }
                    recoverPublicKey(t) {
                        const {r, s: i, recovery: o} = this
                          , c = w(Vt("msgHash", t));
                        if (null == o || ![0, 1, 2, 3].includes(o))
                            throw new Error("recovery id invalid");
                        const l = 2 === o || 3 === o ? r + e.n : r;
                        if (l >= n.ORDER)
                            throw new Error("recovery id 2 or 3 invalid");
                        const f = 1 & o ? "03" : "02"
                          , d = u.fromHex(f + h(l))
                          , p = a(l)
                          , y = s(-c * p)
                          , g = s(i * p)
                          , m = u.BASE.multiplyAndAddUnsafe(d, y, g);
                        if (!m)
                            throw new Error("point at infinify");
                        return m.assertValidity(),
                        m
                    }
                    hasHighS() {
                        return d(this.s)
                    }
                    normalizeS() {
                        return this.hasHighS() ? new y(this.r,s(-this.s),this.recovery) : this
                    }
                    toDERRawBytes() {
                        return Ct(this.toDERHex())
                    }
                    toDERHex() {
                        return Xn.hexFromSig({
                            r: this.r,
                            s: this.s
                        })
                    }
                    toCompactRawBytes() {
                        return Ct(this.toCompactHex())
                    }
                    toCompactHex() {
                        return h(this.r) + h(this.s)
                    }
                }
                const g = {
                    isValidPrivateKey(t) {
                        try {
                            return c(t),
                            !0
                        } catch (t) {
                            return !1
                        }
                    },
                    normPrivateKeyToScalar: c,
                    randomPrivateKey: () => {
                        const t = Ie(e.n);
                        return function(t, e, n=!1) {
                            const r = t.length
                              , i = Ae(e)
                              , o = Ie(e);
                            if (r < 16 || r < o || r > 1024)
                                throw new Error(`expected ${o}-1024 bytes of input, got ${r}`);
                            const s = be(n ? Ft(t) : Kt(t), e - he) + he;
                            return n ? $t(s, i) : Dt(s, i)
                        }(e.randomBytes(t), e.n)
                    }
                    ,
                    precompute: (t=8, e=u.BASE) => (e._setWindowSize(t),
                    e.multiply(BigInt(3)),
                    e)
                };
                function m(t) {
                    const e = Pt(t)
                      , n = "string" == typeof t
                      , r = (e || n) && t.length;
                    return e ? r === i || r === o : n ? r === 2 * i || r === 2 * o : t instanceof u
                }
                const b = e.bits2int || function(t) {
                    const n = Ft(t)
                      , r = 8 * t.length - e.nBitLength;
                    return r > 0 ? n >> BigInt(r) : n
                }
                  , w = e.bits2int_modN || function(t) {
                    return s(b(t))
                }
                  , v = re(e.nBitLength);
                function x(t) {
                    return Xt(`num < 2^${e.nBitLength}`, t, tr, v),
                    Dt(t, e.nByteLength)
                }
                const S = {
                    lowS: e.lowS,
                    prehash: !1
                }
                  , k = {
                    lowS: e.lowS,
                    prehash: !1
                };
                return u.BASE._setWindowSize(8),
                {
                    CURVE: e,
                    getPublicKey: function(t, e=!0) {
                        return u.fromPrivateKey(t).toRawBytes(e)
                    },
                    getSharedSecret: function(t, e, n=!0) {
                        if (m(t))
                            throw new Error("first arg must be private key");
                        if (!m(e))
                            throw new Error("second arg must be public key");
                        return u.fromHex(e).multiply(c(t)).toRawBytes(n)
                    },
                    sign: function(t, r, i=S) {
                        const {seed: o, k2sig: l} = function(t, r, i=S) {
                            if (["recovered", "canonical"].some((t => t in i)))
                                throw new Error("sign() legacy options not supported");
                            const {hash: o, randomBytes: l} = e;
                            let {lowS: h, prehash: p, extraEntropy: g} = i;
                            null == h && (h = !0),
                            t = Vt("msgHash", t),
                            Zn(i),
                            p && (t = Vt("prehashed msgHash", o(t)));
                            const m = w(t)
                              , v = c(r)
                              , k = [x(v), x(m)];
                            if (null != g && !1 !== g) {
                                const t = !0 === g ? l(n.BYTES) : g;
                                k.push(Vt("extraEntropy", t))
                            }
                            const E = Jt(...k)
                              , A = m;
                            return {
                                seed: E,
                                k2sig: function(t) {
                                    const e = b(t);
                                    if (!f(e))
                                        return;
                                    const n = a(e)
                                      , r = u.BASE.multiply(e).toAffine()
                                      , i = s(r.x);
                                    if (i === tr)
                                        return;
                                    const o = s(n * s(A + i * v));
                                    if (o === tr)
                                        return;
                                    let c = (r.x === i ? 0 : 2) | Number(r.y & er)
                                      , l = o;
                                    return h && d(o) && (l = function(t) {
                                        return d(t) ? s(-t) : t
                                    }(o),
                                    c ^= 1),
                                    new y(i,l,c)
                                }
                            }
                        }(t, r, i)
                          , h = e;
                        return se(h.hash.outputLen, h.nByteLength, h.hmac)(o, l)
                    },
                    verify: function(t, n, r, i=k) {
                        const o = t;
                        if (n = Vt("msgHash", n),
                        r = Vt("publicKey", r),
                        "strict"in i)
                            throw new Error("options.strict was renamed to lowS");
                        Zn(i);
                        const {lowS: c, prehash: l} = i;
                        let f, h;
                        try {
                            if ("string" == typeof o || Pt(o))
                                try {
                                    f = y.fromDER(o)
                                } catch (t) {
                                    if (!(t instanceof Xn.Err))
                                        throw t;
                                    f = y.fromCompact(o)
                                }
                            else {
                                if ("object" != typeof o || "bigint" != typeof o.r || "bigint" != typeof o.s)
                                    throw new Error("PARSE");
                                {
                                    const {r: t, s: e} = o;
                                    f = new y(t,e)
                                }
                            }
                            h = u.fromHex(r)
                        } catch (t) {
                            if ("PARSE" === t.message)
                                throw new Error("signature must be Signature instance, Uint8Array or hex string");
                            return !1
                        }
                        if (c && f.hasHighS())
                            return !1;
                        l && (n = e.hash(n));
                        const {r: d, s: p} = f
                          , g = w(n)
                          , m = a(p)
                          , b = s(g * m)
                          , v = s(d * m)
                          , x = u.BASE.multiplyAndAddUnsafe(h, b, v)?.toAffine();
                        return !!x && s(x.x) === d
                    },
                    ProjectivePoint: u,
                    Signature: y,
                    utils: g
                }
            }
            function ir(t) {
                return {
                    hash: t,
                    hmac: (e, ...n) => Gn(t, e, function(...t) {
                        let e = 0;
                        for (let n = 0; n < t.length; n++) {
                            const r = t[n];
                            tt(r),
                            e += r.length
                        }
                        const n = new Uint8Array(e);
                        for (let e = 0, r = 0; e < t.length; e++) {
                            const i = t[e];
                            n.set(i, r),
                            r += i.length
                        }
                        return n
                    }(...n)),
                    randomBytes: ft
                }
            }
            BigInt(4);
            const or = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f")
              , sr = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141")
              , ar = BigInt(1)
              , ur = BigInt(2)
              , cr = (t, e) => (t + e / ur) / e;
            const lr = Ee(or, void 0, void 0, {
                sqrt: function(t) {
                    const e = or
                      , n = BigInt(3)
                      , r = BigInt(6)
                      , i = BigInt(11)
                      , o = BigInt(22)
                      , s = BigInt(23)
                      , a = BigInt(44)
                      , u = BigInt(88)
                      , c = t * t * t % e
                      , l = c * c * t % e
                      , f = ve(l, n, e) * l % e
                      , h = ve(f, n, e) * l % e
                      , d = ve(h, ur, e) * c % e
                      , p = ve(d, i, e) * d % e
                      , y = ve(p, o, e) * p % e
                      , g = ve(y, a, e) * y % e
                      , m = ve(g, u, e) * g % e
                      , b = ve(m, a, e) * y % e
                      , w = ve(b, n, e) * l % e
                      , v = ve(w, s, e) * p % e
                      , x = ve(v, r, e) * c % e
                      , S = ve(x, ur, e);
                    if (!lr.eql(lr.sqr(S), t))
                        throw new Error("Cannot find square root");
                    return S
                }
            })
              , fr = function(t, e) {
                const n = e => rr({
                    ...t,
                    ...ir(e)
                });
                return Object.freeze({
                    ...n(e),
                    create: n
                })
            }({
                a: BigInt(0),
                b: BigInt(7),
                Fp: lr,
                n: sr,
                Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
                Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
                h: BigInt(1),
                lowS: !0,
                endo: {
                    beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
                    splitScalar: t => {
                        const e = sr
                          , n = BigInt("0x3086d221a7d46bcde86c90e49284eb15")
                          , r = -ar * BigInt("0xe4437ed6010e88286f547fa90abfe4c3")
                          , i = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8")
                          , o = n
                          , s = BigInt("0x100000000000000000000000000000000")
                          , a = cr(o * t, e)
                          , u = cr(-r * t, e);
                        let c = be(t - a * n - u * i, e)
                          , l = be(-a * r - u * o, e);
                        const f = c > s
                          , h = l > s;
                        if (f && (c = e - c),
                        h && (l = e - l),
                        c > s || l > s)
                            throw new Error("splitScalar: Endomorphism failed, k=" + t);
                        return {
                            k1neg: f,
                            k1: c,
                            k2neg: h,
                            k2: l
                        }
                    }
                }
            }, nn);
            BigInt(0),
            fr.ProjectivePoint;
            var hr = n("../../../node_modules/console-browserify/index.js");
            Ge.utils.randomPrivateKey;
            const dr = () => {
                const t = Ge.utils.randomPrivateKey()
                  , e = pr(t)
                  , n = new Uint8Array(64);
                return n.set(t),
                n.set(e, 32),
                {
                    publicKey: e,
                    secretKey: n
                }
            }
              , pr = Ge.getPublicKey;
            function yr(t) {
                try {
                    return Ge.ExtendedPoint.fromHex(t),
                    !0
                } catch {
                    return !1
                }
            }
            const gr = (t, e) => Ge.sign(t, e.slice(0, 32))
              , mr = Ge.verify
              , br = t => Q.Buffer.isBuffer(t) ? t : t instanceof Uint8Array ? Q.Buffer.from(t.buffer, t.byteOffset, t.byteLength) : Q.Buffer.from(t);
            class wr {
                constructor(t) {
                    Object.assign(this, t)
                }
                encode() {
                    return Q.Buffer.from((0,
                    rn.serialize)(vr, this))
                }
                static decode(t) {
                    return (0,
                    rn.deserialize)(vr, this, t)
                }
                static decodeUnchecked(t) {
                    return (0,
                    rn.deserializeUnchecked)(vr, this, t)
                }
            }
            const vr = new Map;
            var xr;
            const Sr = 32;
            let kr = 1;
            class Er extends wr {
                constructor(t) {
                    if (super({}),
                    this._bn = void 0,
                    function(t) {
                        return void 0 !== t._bn
                    }(t))
                        this._bn = t._bn;
                    else {
                        if ("string" == typeof t) {
                            const e = A().decode(t);
                            if (e.length != Sr)
                                throw new Error("Invalid public key input");
                            this._bn = new (Ye())(e)
                        } else
                            this._bn = new (Ye())(t);
                        if (this._bn.byteLength() > Sr)
                            throw new Error("Invalid public key input")
                    }
                }
                static unique() {
                    const t = new Er(kr);
                    return kr += 1,
                    new Er(t.toBuffer())
                }
                equals(t) {
                    return this._bn.eq(t._bn)
                }
                toBase58() {
                    return A().encode(this.toBytes())
                }
                toJSON() {
                    return this.toBase58()
                }
                toBytes() {
                    const t = this.toBuffer();
                    return new Uint8Array(t.buffer,t.byteOffset,t.byteLength)
                }
                toBuffer() {
                    const t = this._bn.toArrayLike(Q.Buffer);
                    if (t.length === Sr)
                        return t;
                    const e = Q.Buffer.alloc(32);
                    return t.copy(e, 32 - t.length),
                    e
                }
                get[Symbol.toStringTag]() {
                    return `PublicKey(${this.toString()})`
                }
                toString() {
                    return this.toBase58()
                }
                static async createWithSeed(t, e, n) {
                    const r = Q.Buffer.concat([t.toBuffer(), Q.Buffer.from(e), n.toBuffer()])
                      , i = nn(r);
                    return new Er(i)
                }
                static createProgramAddressSync(t, e) {
                    let n = Q.Buffer.alloc(0);
                    t.forEach((function(t) {
                        if (t.length > 32)
                            throw new TypeError("Max seed length exceeded");
                        n = Q.Buffer.concat([n, br(t)])
                    }
                    )),
                    n = Q.Buffer.concat([n, e.toBuffer(), Q.Buffer.from("ProgramDerivedAddress")]);
                    const r = nn(n);
                    if (yr(r))
                        throw new Error("Invalid seeds, address must fall off the curve");
                    return new Er(r)
                }
                static async createProgramAddress(t, e) {
                    return this.createProgramAddressSync(t, e)
                }
                static findProgramAddressSync(t, e) {
                    let n, r = 255;
                    for (; 0 != r; ) {
                        try {
                            const i = t.concat(Q.Buffer.from([r]));
                            n = this.createProgramAddressSync(i, e)
                        } catch (t) {
                            if (t instanceof TypeError)
                                throw t;
                            r--;
                            continue
                        }
                        return [n, r]
                    }
                    throw new Error("Unable to find a viable program address nonce")
                }
                static async findProgramAddress(t, e) {
                    return this.findProgramAddressSync(t, e)
                }
                static isOnCurve(t) {
                    return yr(new Er(t).toBytes())
                }
            }
            xr = Er,
            Er.default = new xr("11111111111111111111111111111111"),
            vr.set(Er, {
                kind: "struct",
                fields: [["_bn", "u256"]]
            }),
            new Er("BPFLoader1111111111111111111111111111111111");
            const Ar = 1232;
            class Ir extends Error {
                constructor(t) {
                    super(`Signature ${t} has expired: block height exceeded.`),
                    this.signature = void 0,
                    this.signature = t
                }
            }
            Object.defineProperty(Ir.prototype, "name", {
                value: "TransactionExpiredBlockheightExceededError"
            });
            class Mr extends Error {
                constructor(t, e) {
                    super(`Transaction was not confirmed in ${e.toFixed(2)} seconds. It is unknown if it succeeded or failed. Check signature ${t} using the Solana Explorer or CLI tools.`),
                    this.signature = void 0,
                    this.signature = t
                }
            }
            Object.defineProperty(Mr.prototype, "name", {
                value: "TransactionExpiredTimeoutError"
            });
            class _r extends Error {
                constructor(t) {
                    super(`Signature ${t} has expired: the nonce is no longer valid.`),
                    this.signature = void 0,
                    this.signature = t
                }
            }
            Object.defineProperty(_r.prototype, "name", {
                value: "TransactionExpiredNonceInvalidError"
            });
            class Br {
                constructor(t, e) {
                    this.staticAccountKeys = void 0,
                    this.accountKeysFromLookups = void 0,
                    this.staticAccountKeys = t,
                    this.accountKeysFromLookups = e
                }
                keySegments() {
                    const t = [this.staticAccountKeys];
                    return this.accountKeysFromLookups && (t.push(this.accountKeysFromLookups.writable),
                    t.push(this.accountKeysFromLookups.readonly)),
                    t
                }
                get(t) {
                    for (const e of this.keySegments()) {
                        if (t < e.length)
                            return e[t];
                        t -= e.length
                    }
                }
                get length() {
                    return this.keySegments().flat().length
                }
                compileInstructions(t) {
                    if (this.length > 256)
                        throw new Error("Account index overflow encountered during compilation");
                    const e = new Map;
                    this.keySegments().flat().forEach(( (t, n) => {
                        e.set(t.toBase58(), n)
                    }
                    ));
                    const n = t => {
                        const n = e.get(t.toBase58());
                        if (void 0 === n)
                            throw new Error("Encountered an unknown instruction account key during compilation");
                        return n
                    }
                    ;
                    return t.map((t => ({
                        programIdIndex: n(t.programId),
                        accountKeyIndexes: t.keys.map((t => n(t.pubkey))),
                        data: t.data
                    })))
                }
            }
            const jr = (t="publicKey") => on.Ik(32, t)
              , Or = (t="signature") => on.Ik(64, t)
              , Pr = (t="string") => {
                const e = on.n_([on.Jq("length"), on.Jq("lengthPadding"), on.Ik(on.cv(on.Jq(), -8), "chars")], t)
                  , n = e.decode.bind(e)
                  , r = e.encode.bind(e)
                  , i = e;
                return i.decode = (t, e) => n(t, e).chars.toString(),
                i.encode = (t, e, n) => {
                    const i = {
                        chars: Q.Buffer.from(t, "utf8")
                    };
                    return r(i, e, n)
                }
                ,
                i.alloc = t => on.Jq().span + on.Jq().span + Q.Buffer.from(t, "utf8").length,
                i
            }
            ;
            function Tr(t, e) {
                const n = t => {
                    if (t.span >= 0)
                        return t.span;
                    if ("function" == typeof t.alloc)
                        return t.alloc(e[t.property]);
                    if ("count"in t && "elementLayout"in t) {
                        const r = e[t.property];
                        if (Array.isArray(r))
                            return r.length * n(t.elementLayout)
                    } else if ("fields"in t)
                        return Tr({
                            layout: t
                        }, e[t.property]);
                    return 0
                }
                ;
                let r = 0;
                return t.layout.fields.forEach((t => {
                    r += n(t)
                }
                )),
                r
            }
            function Lr(t) {
                let e = 0
                  , n = 0;
                for (; ; ) {
                    let r = t.shift();
                    if (e |= (127 & r) << 7 * n,
                    n += 1,
                    !(128 & r))
                        break
                }
                return e
            }
            function Rr(t, e) {
                let n = e;
                for (; ; ) {
                    let e = 127 & n;
                    if (n >>= 7,
                    0 == n) {
                        t.push(e);
                        break
                    }
                    e |= 128,
                    t.push(e)
                }
            }
            function Ur(t, e) {
                if (!t)
                    throw new Error(e || "Assertion failed")
            }
            class Nr {
                constructor(t, e) {
                    this.payer = void 0,
                    this.keyMetaMap = void 0,
                    this.payer = t,
                    this.keyMetaMap = e
                }
                static compile(t, e) {
                    const n = new Map
                      , r = t => {
                        const e = t.toBase58();
                        let r = n.get(e);
                        return void 0 === r && (r = {
                            isSigner: !1,
                            isWritable: !1,
                            isInvoked: !1
                        },
                        n.set(e, r)),
                        r
                    }
                      , i = r(e);
                    i.isSigner = !0,
                    i.isWritable = !0;
                    for (const e of t) {
                        r(e.programId).isInvoked = !0;
                        for (const t of e.keys) {
                            const e = r(t.pubkey);
                            e.isSigner ||= t.isSigner,
                            e.isWritable ||= t.isWritable
                        }
                    }
                    return new Nr(e,n)
                }
                getMessageComponents() {
                    const t = [...this.keyMetaMap.entries()];
                    Ur(t.length <= 256, "Max static account keys length exceeded");
                    const e = t.filter(( ([,t]) => t.isSigner && t.isWritable))
                      , n = t.filter(( ([,t]) => t.isSigner && !t.isWritable))
                      , r = t.filter(( ([,t]) => !t.isSigner && t.isWritable))
                      , i = t.filter(( ([,t]) => !t.isSigner && !t.isWritable))
                      , o = {
                        numRequiredSignatures: e.length + n.length,
                        numReadonlySignedAccounts: n.length,
                        numReadonlyUnsignedAccounts: i.length
                    };
                    {
                        Ur(e.length > 0, "Expected at least one writable signer key");
                        const [t] = e[0];
                        Ur(t === this.payer.toBase58(), "Expected first writable signer key to be the fee payer")
                    }
                    return [o, [...e.map(( ([t]) => new Er(t))), ...n.map(( ([t]) => new Er(t))), ...r.map(( ([t]) => new Er(t))), ...i.map(( ([t]) => new Er(t)))]]
                }
                extractTableLookup(t) {
                    const [e,n] = this.drainKeysFoundInLookupTable(t.state.addresses, (t => !t.isSigner && !t.isInvoked && t.isWritable))
                      , [r,i] = this.drainKeysFoundInLookupTable(t.state.addresses, (t => !t.isSigner && !t.isInvoked && !t.isWritable));
                    if (0 !== e.length || 0 !== r.length)
                        return [{
                            accountKey: t.key,
                            writableIndexes: e,
                            readonlyIndexes: r
                        }, {
                            writable: n,
                            readonly: i
                        }]
                }
                drainKeysFoundInLookupTable(t, e) {
                    const n = new Array
                      , r = new Array;
                    for (const [i,o] of this.keyMetaMap.entries())
                        if (e(o)) {
                            const e = new Er(i)
                              , o = t.findIndex((t => t.equals(e)));
                            o >= 0 && (Ur(o < 256, "Max lookup table index exceeded"),
                            n.push(o),
                            r.push(e),
                            this.keyMetaMap.delete(i))
                        }
                    return [n, r]
                }
            }
            const zr = "Reached end of buffer unexpectedly";
            function qr(t) {
                if (0 === t.length)
                    throw new Error(zr);
                return t.shift()
            }
            function Wr(t, ...e) {
                const [n] = e;
                if (2 === e.length ? n + (e[1] ?? 0) > t.length : n >= t.length)
                    throw new Error(zr);
                return t.splice(...e)
            }
            class Cr {
                constructor(t) {
                    this.header = void 0,
                    this.accountKeys = void 0,
                    this.recentBlockhash = void 0,
                    this.instructions = void 0,
                    this.indexToProgramIds = new Map,
                    this.header = t.header,
                    this.accountKeys = t.accountKeys.map((t => new Er(t))),
                    this.recentBlockhash = t.recentBlockhash,
                    this.instructions = t.instructions,
                    this.instructions.forEach((t => this.indexToProgramIds.set(t.programIdIndex, this.accountKeys[t.programIdIndex])))
                }
                get version() {
                    return "legacy"
                }
                get staticAccountKeys() {
                    return this.accountKeys
                }
                get compiledInstructions() {
                    return this.instructions.map((t => ({
                        programIdIndex: t.programIdIndex,
                        accountKeyIndexes: t.accounts,
                        data: A().decode(t.data)
                    })))
                }
                get addressTableLookups() {
                    return []
                }
                getAccountKeys() {
                    return new Br(this.staticAccountKeys)
                }
                static compile(t) {
                    const e = Nr.compile(t.instructions, t.payerKey)
                      , [n,r] = e.getMessageComponents()
                      , i = new Br(r).compileInstructions(t.instructions).map((t => ({
                        programIdIndex: t.programIdIndex,
                        accounts: t.accountKeyIndexes,
                        data: A().encode(t.data)
                    })));
                    return new Cr({
                        header: n,
                        accountKeys: r,
                        recentBlockhash: t.recentBlockhash,
                        instructions: i
                    })
                }
                isAccountSigner(t) {
                    return t < this.header.numRequiredSignatures
                }
                isAccountWritable(t) {
                    const e = this.header.numRequiredSignatures;
                    return t >= this.header.numRequiredSignatures ? t - e < this.accountKeys.length - e - this.header.numReadonlyUnsignedAccounts : t < e - this.header.numReadonlySignedAccounts
                }
                isProgramId(t) {
                    return this.indexToProgramIds.has(t)
                }
                programIds() {
                    return [...this.indexToProgramIds.values()]
                }
                nonProgramIds() {
                    return this.accountKeys.filter(( (t, e) => !this.isProgramId(e)))
                }
                serialize() {
                    const t = this.accountKeys.length;
                    let e = [];
                    Rr(e, t);
                    const n = this.instructions.map((t => {
                        const {accounts: e, programIdIndex: n} = t
                          , r = Array.from(A().decode(t.data));
                        let i = [];
                        Rr(i, e.length);
                        let o = [];
                        return Rr(o, r.length),
                        {
                            programIdIndex: n,
                            keyIndicesCount: Q.Buffer.from(i),
                            keyIndices: e,
                            dataLength: Q.Buffer.from(o),
                            data: r
                        }
                    }
                    ));
                    let r = [];
                    Rr(r, n.length);
                    let i = Q.Buffer.alloc(Ar);
                    Q.Buffer.from(r).copy(i);
                    let o = r.length;
                    n.forEach((t => {
                        const e = on.n_([on.u8("programIdIndex"), on.Ik(t.keyIndicesCount.length, "keyIndicesCount"), on.A9(on.u8("keyIndex"), t.keyIndices.length, "keyIndices"), on.Ik(t.dataLength.length, "dataLength"), on.A9(on.u8("userdatum"), t.data.length, "data")]).encode(t, i, o);
                        o += e
                    }
                    )),
                    i = i.slice(0, o);
                    const s = on.n_([on.Ik(1, "numRequiredSignatures"), on.Ik(1, "numReadonlySignedAccounts"), on.Ik(1, "numReadonlyUnsignedAccounts"), on.Ik(e.length, "keyCount"), on.A9(jr("key"), t, "keys"), jr("recentBlockhash")])
                      , a = {
                        numRequiredSignatures: Q.Buffer.from([this.header.numRequiredSignatures]),
                        numReadonlySignedAccounts: Q.Buffer.from([this.header.numReadonlySignedAccounts]),
                        numReadonlyUnsignedAccounts: Q.Buffer.from([this.header.numReadonlyUnsignedAccounts]),
                        keyCount: Q.Buffer.from(e),
                        keys: this.accountKeys.map((t => br(t.toBytes()))),
                        recentBlockhash: A().decode(this.recentBlockhash)
                    };
                    let u = Q.Buffer.alloc(2048);
                    const c = s.encode(a, u);
                    return i.copy(u, c),
                    u.slice(0, c + i.length)
                }
                static from(t) {
                    let e = [...t];
                    const n = qr(e);
                    if (n !== (127 & n))
                        throw new Error("Versioned messages must be deserialized with VersionedMessage.deserialize()");
                    const r = qr(e)
                      , i = qr(e)
                      , o = Lr(e);
                    let s = [];
                    for (let t = 0; t < o; t++) {
                        const t = Wr(e, 0, Sr);
                        s.push(new Er(Q.Buffer.from(t)))
                    }
                    const a = Wr(e, 0, Sr)
                      , u = Lr(e);
                    let c = [];
                    for (let t = 0; t < u; t++) {
                        const t = qr(e)
                          , n = Wr(e, 0, Lr(e))
                          , r = Wr(e, 0, Lr(e))
                          , i = A().encode(Q.Buffer.from(r));
                        c.push({
                            programIdIndex: t,
                            accounts: n,
                            data: i
                        })
                    }
                    const l = {
                        header: {
                            numRequiredSignatures: n,
                            numReadonlySignedAccounts: r,
                            numReadonlyUnsignedAccounts: i
                        },
                        recentBlockhash: A().encode(Q.Buffer.from(a)),
                        accountKeys: s,
                        instructions: c
                    };
                    return new Cr(l)
                }
            }
            class Fr {
                constructor(t) {
                    this.header = void 0,
                    this.staticAccountKeys = void 0,
                    this.recentBlockhash = void 0,
                    this.compiledInstructions = void 0,
                    this.addressTableLookups = void 0,
                    this.header = t.header,
                    this.staticAccountKeys = t.staticAccountKeys,
                    this.recentBlockhash = t.recentBlockhash,
                    this.compiledInstructions = t.compiledInstructions,
                    this.addressTableLookups = t.addressTableLookups
                }
                get version() {
                    return 0
                }
                get numAccountKeysFromLookups() {
                    let t = 0;
                    for (const e of this.addressTableLookups)
                        t += e.readonlyIndexes.length + e.writableIndexes.length;
                    return t
                }
                getAccountKeys(t) {
                    let e;
                    if (t && "accountKeysFromLookups"in t && t.accountKeysFromLookups) {
                        if (this.numAccountKeysFromLookups != t.accountKeysFromLookups.writable.length + t.accountKeysFromLookups.readonly.length)
                            throw new Error("Failed to get account keys because of a mismatch in the number of account keys from lookups");
                        e = t.accountKeysFromLookups
                    } else if (t && "addressLookupTableAccounts"in t && t.addressLookupTableAccounts)
                        e = this.resolveAddressTableLookups(t.addressLookupTableAccounts);
                    else if (this.addressTableLookups.length > 0)
                        throw new Error("Failed to get account keys because address table lookups were not resolved");
                    return new Br(this.staticAccountKeys,e)
                }
                isAccountSigner(t) {
                    return t < this.header.numRequiredSignatures
                }
                isAccountWritable(t) {
                    const e = this.header.numRequiredSignatures
                      , n = this.staticAccountKeys.length;
                    return t >= n ? t - n < this.addressTableLookups.reduce(( (t, e) => t + e.writableIndexes.length), 0) : t >= this.header.numRequiredSignatures ? t - e < n - e - this.header.numReadonlyUnsignedAccounts : t < e - this.header.numReadonlySignedAccounts
                }
                resolveAddressTableLookups(t) {
                    const e = {
                        writable: [],
                        readonly: []
                    };
                    for (const n of this.addressTableLookups) {
                        const r = t.find((t => t.key.equals(n.accountKey)));
                        if (!r)
                            throw new Error(`Failed to find address lookup table account for table key ${n.accountKey.toBase58()}`);
                        for (const t of n.writableIndexes) {
                            if (!(t < r.state.addresses.length))
                                throw new Error(`Failed to find address for index ${t} in address lookup table ${n.accountKey.toBase58()}`);
                            e.writable.push(r.state.addresses[t])
                        }
                        for (const t of n.readonlyIndexes) {
                            if (!(t < r.state.addresses.length))
                                throw new Error(`Failed to find address for index ${t} in address lookup table ${n.accountKey.toBase58()}`);
                            e.readonly.push(r.state.addresses[t])
                        }
                    }
                    return e
                }
                static compile(t) {
                    const e = Nr.compile(t.instructions, t.payerKey)
                      , n = new Array
                      , r = {
                        writable: new Array,
                        readonly: new Array
                    }
                      , i = t.addressLookupTableAccounts || [];
                    for (const t of i) {
                        const i = e.extractTableLookup(t);
                        if (void 0 !== i) {
                            const [t,{writable: e, readonly: o}] = i;
                            n.push(t),
                            r.writable.push(...e),
                            r.readonly.push(...o)
                        }
                    }
                    const [o,s] = e.getMessageComponents()
                      , a = new Br(s,r).compileInstructions(t.instructions);
                    return new Fr({
                        header: o,
                        staticAccountKeys: s,
                        recentBlockhash: t.recentBlockhash,
                        compiledInstructions: a,
                        addressTableLookups: n
                    })
                }
                serialize() {
                    const t = Array();
                    Rr(t, this.staticAccountKeys.length);
                    const e = this.serializeInstructions()
                      , n = Array();
                    Rr(n, this.compiledInstructions.length);
                    const r = this.serializeAddressTableLookups()
                      , i = Array();
                    Rr(i, this.addressTableLookups.length);
                    const o = on.n_([on.u8("prefix"), on.n_([on.u8("numRequiredSignatures"), on.u8("numReadonlySignedAccounts"), on.u8("numReadonlyUnsignedAccounts")], "header"), on.Ik(t.length, "staticAccountKeysLength"), on.A9(jr(), this.staticAccountKeys.length, "staticAccountKeys"), jr("recentBlockhash"), on.Ik(n.length, "instructionsLength"), on.Ik(e.length, "serializedInstructions"), on.Ik(i.length, "addressTableLookupsLength"), on.Ik(r.length, "serializedAddressTableLookups")])
                      , s = new Uint8Array(Ar)
                      , a = o.encode({
                        prefix: 128,
                        header: this.header,
                        staticAccountKeysLength: new Uint8Array(t),
                        staticAccountKeys: this.staticAccountKeys.map((t => t.toBytes())),
                        recentBlockhash: A().decode(this.recentBlockhash),
                        instructionsLength: new Uint8Array(n),
                        serializedInstructions: e,
                        addressTableLookupsLength: new Uint8Array(i),
                        serializedAddressTableLookups: r
                    }, s);
                    return s.slice(0, a)
                }
                serializeInstructions() {
                    let t = 0;
                    const e = new Uint8Array(Ar);
                    for (const n of this.compiledInstructions) {
                        const r = Array();
                        Rr(r, n.accountKeyIndexes.length);
                        const i = Array();
                        Rr(i, n.data.length),
                        t += on.n_([on.u8("programIdIndex"), on.Ik(r.length, "encodedAccountKeyIndexesLength"), on.A9(on.u8(), n.accountKeyIndexes.length, "accountKeyIndexes"), on.Ik(i.length, "encodedDataLength"), on.Ik(n.data.length, "data")]).encode({
                            programIdIndex: n.programIdIndex,
                            encodedAccountKeyIndexesLength: new Uint8Array(r),
                            accountKeyIndexes: n.accountKeyIndexes,
                            encodedDataLength: new Uint8Array(i),
                            data: n.data
                        }, e, t)
                    }
                    return e.slice(0, t)
                }
                serializeAddressTableLookups() {
                    let t = 0;
                    const e = new Uint8Array(Ar);
                    for (const n of this.addressTableLookups) {
                        const r = Array();
                        Rr(r, n.writableIndexes.length);
                        const i = Array();
                        Rr(i, n.readonlyIndexes.length),
                        t += on.n_([jr("accountKey"), on.Ik(r.length, "encodedWritableIndexesLength"), on.A9(on.u8(), n.writableIndexes.length, "writableIndexes"), on.Ik(i.length, "encodedReadonlyIndexesLength"), on.A9(on.u8(), n.readonlyIndexes.length, "readonlyIndexes")]).encode({
                            accountKey: n.accountKey.toBytes(),
                            encodedWritableIndexesLength: new Uint8Array(r),
                            writableIndexes: n.writableIndexes,
                            encodedReadonlyIndexesLength: new Uint8Array(i),
                            readonlyIndexes: n.readonlyIndexes
                        }, e, t)
                    }
                    return e.slice(0, t)
                }
                static deserialize(t) {
                    let e = [...t];
                    const n = qr(e)
                      , r = 127 & n;
                    Ur(n !== r, "Expected versioned message but received legacy message"),
                    Ur(0 === r, `Expected versioned message with version 0 but found version ${r}`);
                    const i = {
                        numRequiredSignatures: qr(e),
                        numReadonlySignedAccounts: qr(e),
                        numReadonlyUnsignedAccounts: qr(e)
                    }
                      , o = []
                      , s = Lr(e);
                    for (let t = 0; t < s; t++)
                        o.push(new Er(Wr(e, 0, Sr)));
                    const a = A().encode(Wr(e, 0, Sr))
                      , u = Lr(e)
                      , c = [];
                    for (let t = 0; t < u; t++) {
                        const t = qr(e)
                          , n = Wr(e, 0, Lr(e))
                          , r = Lr(e)
                          , i = new Uint8Array(Wr(e, 0, r));
                        c.push({
                            programIdIndex: t,
                            accountKeyIndexes: n,
                            data: i
                        })
                    }
                    const l = Lr(e)
                      , f = [];
                    for (let t = 0; t < l; t++) {
                        const t = new Er(Wr(e, 0, Sr))
                          , n = Wr(e, 0, Lr(e))
                          , r = Wr(e, 0, Lr(e));
                        f.push({
                            accountKey: t,
                            writableIndexes: n,
                            readonlyIndexes: r
                        })
                    }
                    return new Fr({
                        header: i,
                        staticAccountKeys: o,
                        recentBlockhash: a,
                        compiledInstructions: c,
                        addressTableLookups: f
                    })
                }
            }
            const Kr = {
                deserializeMessageVersion(t) {
                    const e = t[0]
                      , n = 127 & e;
                    return n === e ? "legacy" : n
                },
                deserialize: t => {
                    const e = Kr.deserializeMessageVersion(t);
                    if ("legacy" === e)
                        return Cr.from(t);
                    if (0 === e)
                        return Fr.deserialize(t);
                    throw new Error(`Transaction message version ${e} deserialization is not supported`)
                }
            }
              , Dr = Q.Buffer.alloc(64).fill(0);
            class $r {
                constructor(t) {
                    this.keys = void 0,
                    this.programId = void 0,
                    this.data = Q.Buffer.alloc(0),
                    this.programId = t.programId,
                    this.keys = t.keys,
                    t.data && (this.data = t.data)
                }
                toJSON() {
                    return {
                        keys: this.keys.map(( ({pubkey: t, isSigner: e, isWritable: n}) => ({
                            pubkey: t.toJSON(),
                            isSigner: e,
                            isWritable: n
                        }))),
                        programId: this.programId.toJSON(),
                        data: [...this.data]
                    }
                }
            }
            class Hr {
                get signature() {
                    return this.signatures.length > 0 ? this.signatures[0].signature : null
                }
                constructor(t) {
                    if (this.signatures = [],
                    this.feePayer = void 0,
                    this.instructions = [],
                    this.recentBlockhash = void 0,
                    this.lastValidBlockHeight = void 0,
                    this.nonceInfo = void 0,
                    this.minNonceContextSlot = void 0,
                    this._message = void 0,
                    this._json = void 0,
                    t)
                        if (t.feePayer && (this.feePayer = t.feePayer),
                        t.signatures && (this.signatures = t.signatures),
                        Object.prototype.hasOwnProperty.call(t, "nonceInfo")) {
                            const {minContextSlot: e, nonceInfo: n} = t;
                            this.minNonceContextSlot = e,
                            this.nonceInfo = n
                        } else if (Object.prototype.hasOwnProperty.call(t, "lastValidBlockHeight")) {
                            const {blockhash: e, lastValidBlockHeight: n} = t;
                            this.recentBlockhash = e,
                            this.lastValidBlockHeight = n
                        } else {
                            const {recentBlockhash: e, nonceInfo: n} = t;
                            n && (this.nonceInfo = n),
                            this.recentBlockhash = e
                        }
                }
                toJSON() {
                    return {
                        recentBlockhash: this.recentBlockhash || null,
                        feePayer: this.feePayer ? this.feePayer.toJSON() : null,
                        nonceInfo: this.nonceInfo ? {
                            nonce: this.nonceInfo.nonce,
                            nonceInstruction: this.nonceInfo.nonceInstruction.toJSON()
                        } : null,
                        instructions: this.instructions.map((t => t.toJSON())),
                        signers: this.signatures.map(( ({publicKey: t}) => t.toJSON()))
                    }
                }
                add(...t) {
                    if (0 === t.length)
                        throw new Error("No instructions");
                    return t.forEach((t => {
                        "instructions"in t ? this.instructions = this.instructions.concat(t.instructions) : "data"in t && "programId"in t && "keys"in t ? this.instructions.push(t) : this.instructions.push(new $r(t))
                    }
                    )),
                    this
                }
                compileMessage() {
                    if (this._message && JSON.stringify(this.toJSON()) === JSON.stringify(this._json))
                        return this._message;
                    let t, e, n;
                    if (this.nonceInfo ? (t = this.nonceInfo.nonce,
                    e = this.instructions[0] != this.nonceInfo.nonceInstruction ? [this.nonceInfo.nonceInstruction, ...this.instructions] : this.instructions) : (t = this.recentBlockhash,
                    e = this.instructions),
                    !t)
                        throw new Error("Transaction recentBlockhash required");
                    if (e.length < 1 && hr.warn("No instructions provided"),
                    this.feePayer)
                        n = this.feePayer;
                    else {
                        if (!(this.signatures.length > 0 && this.signatures[0].publicKey))
                            throw new Error("Transaction fee payer required");
                        n = this.signatures[0].publicKey
                    }
                    for (let t = 0; t < e.length; t++)
                        if (void 0 === e[t].programId)
                            throw new Error(`Transaction instruction index ${t} has undefined program id`);
                    const r = []
                      , i = [];
                    e.forEach((t => {
                        t.keys.forEach((t => {
                            i.push({
                                ...t
                            })
                        }
                        ));
                        const e = t.programId.toString();
                        r.includes(e) || r.push(e)
                    }
                    )),
                    r.forEach((t => {
                        i.push({
                            pubkey: new Er(t),
                            isSigner: !1,
                            isWritable: !1
                        })
                    }
                    ));
                    const o = [];
                    i.forEach((t => {
                        const e = t.pubkey.toString()
                          , n = o.findIndex((t => t.pubkey.toString() === e));
                        n > -1 ? (o[n].isWritable = o[n].isWritable || t.isWritable,
                        o[n].isSigner = o[n].isSigner || t.isSigner) : o.push(t)
                    }
                    )),
                    o.sort((function(t, e) {
                        return t.isSigner !== e.isSigner ? t.isSigner ? -1 : 1 : t.isWritable !== e.isWritable ? t.isWritable ? -1 : 1 : t.pubkey.toBase58().localeCompare(e.pubkey.toBase58(), "en", {
                            localeMatcher: "best fit",
                            usage: "sort",
                            sensitivity: "variant",
                            ignorePunctuation: !1,
                            numeric: !1,
                            caseFirst: "lower"
                        })
                    }
                    ));
                    const s = o.findIndex((t => t.pubkey.equals(n)));
                    if (s > -1) {
                        const [t] = o.splice(s, 1);
                        t.isSigner = !0,
                        t.isWritable = !0,
                        o.unshift(t)
                    } else
                        o.unshift({
                            pubkey: n,
                            isSigner: !0,
                            isWritable: !0
                        });
                    for (const t of this.signatures) {
                        const e = o.findIndex((e => e.pubkey.equals(t.publicKey)));
                        if (!(e > -1))
                            throw new Error(`unknown signer: ${t.publicKey.toString()}`);
                        o[e].isSigner || (o[e].isSigner = !0,
                        hr.warn("Transaction references a signature that is unnecessary, only the fee payer and instruction signer accounts should sign a transaction. This behavior is deprecated and will throw an error in the next major version release."))
                    }
                    let a = 0
                      , u = 0
                      , c = 0;
                    const l = []
                      , f = [];
                    o.forEach(( ({pubkey: t, isSigner: e, isWritable: n}) => {
                        e ? (l.push(t.toString()),
                        a += 1,
                        n || (u += 1)) : (f.push(t.toString()),
                        n || (c += 1))
                    }
                    ));
                    const h = l.concat(f)
                      , d = e.map((t => {
                        const {data: e, programId: n} = t;
                        return {
                            programIdIndex: h.indexOf(n.toString()),
                            accounts: t.keys.map((t => h.indexOf(t.pubkey.toString()))),
                            data: A().encode(e)
                        }
                    }
                    ));
                    return d.forEach((t => {
                        Ur(t.programIdIndex >= 0),
                        t.accounts.forEach((t => Ur(t >= 0)))
                    }
                    )),
                    new Cr({
                        header: {
                            numRequiredSignatures: a,
                            numReadonlySignedAccounts: u,
                            numReadonlyUnsignedAccounts: c
                        },
                        accountKeys: h,
                        recentBlockhash: t,
                        instructions: d
                    })
                }
                _compile() {
                    const t = this.compileMessage()
                      , e = t.accountKeys.slice(0, t.header.numRequiredSignatures);
                    return this.signatures.length === e.length && this.signatures.every(( (t, n) => e[n].equals(t.publicKey))) || (this.signatures = e.map((t => ({
                        signature: null,
                        publicKey: t
                    })))),
                    t
                }
                serializeMessage() {
                    return this._compile().serialize()
                }
                async getEstimatedFee(t) {
                    return (await t.getFeeForMessage(this.compileMessage())).value
                }
                setSigners(...t) {
                    if (0 === t.length)
                        throw new Error("No signers");
                    const e = new Set;
                    this.signatures = t.filter((t => {
                        const n = t.toString();
                        return !e.has(n) && (e.add(n),
                        !0)
                    }
                    )).map((t => ({
                        signature: null,
                        publicKey: t
                    })))
                }
                sign(...t) {
                    if (0 === t.length)
                        throw new Error("No signers");
                    const e = new Set
                      , n = [];
                    for (const r of t) {
                        const t = r.publicKey.toString();
                        e.has(t) || (e.add(t),
                        n.push(r))
                    }
                    this.signatures = n.map((t => ({
                        signature: null,
                        publicKey: t.publicKey
                    })));
                    const r = this._compile();
                    this._partialSign(r, ...n)
                }
                partialSign(...t) {
                    if (0 === t.length)
                        throw new Error("No signers");
                    const e = new Set
                      , n = [];
                    for (const r of t) {
                        const t = r.publicKey.toString();
                        e.has(t) || (e.add(t),
                        n.push(r))
                    }
                    const r = this._compile();
                    this._partialSign(r, ...n)
                }
                _partialSign(t, ...e) {
                    const n = t.serialize();
                    e.forEach((t => {
                        const e = gr(n, t.secretKey);
                        this._addSignature(t.publicKey, br(e))
                    }
                    ))
                }
                addSignature(t, e) {
                    this._compile(),
                    this._addSignature(t, e)
                }
                _addSignature(t, e) {
                    Ur(64 === e.length);
                    const n = this.signatures.findIndex((e => t.equals(e.publicKey)));
                    if (n < 0)
                        throw new Error(`unknown signer: ${t.toString()}`);
                    this.signatures[n].signature = Q.Buffer.from(e)
                }
                verifySignatures(t=!0) {
                    return !this._getMessageSignednessErrors(this.serializeMessage(), t)
                }
                _getMessageSignednessErrors(t, e) {
                    const n = {};
                    for (const {signature: r, publicKey: i} of this.signatures)
                        null === r ? e && (n.missing ||= []).push(i) : mr(r, t, i.toBytes()) || (n.invalid ||= []).push(i);
                    return n.invalid || n.missing ? n : void 0
                }
                serialize(t) {
                    const {requireAllSignatures: e, verifySignatures: n} = Object.assign({
                        requireAllSignatures: !0,
                        verifySignatures: !0
                    }, t)
                      , r = this.serializeMessage();
                    if (n) {
                        const t = this._getMessageSignednessErrors(r, e);
                        if (t) {
                            let e = "Signature verification failed.";
                            throw t.invalid && (e += `\nInvalid signature for public key${1 === t.invalid.length ? "" : "(s)"} [\`${t.invalid.map((t => t.toBase58())).join("`, `")}\`].`),
                            t.missing && (e += `\nMissing signature for public key${1 === t.missing.length ? "" : "(s)"} [\`${t.missing.map((t => t.toBase58())).join("`, `")}\`].`),
                            new Error(e)
                        }
                    }
                    return this._serialize(r)
                }
                _serialize(t) {
                    const {signatures: e} = this
                      , n = [];
                    Rr(n, e.length);
                    const r = n.length + 64 * e.length + t.length
                      , i = Q.Buffer.alloc(r);
                    return Ur(e.length < 256),
                    Q.Buffer.from(n).copy(i, 0),
                    e.forEach(( ({signature: t}, e) => {
                        null !== t && (Ur(64 === t.length, "signature has invalid length"),
                        Q.Buffer.from(t).copy(i, n.length + 64 * e))
                    }
                    )),
                    t.copy(i, n.length + 64 * e.length),
                    Ur(i.length <= Ar, `Transaction too large: ${i.length} > 1232`),
                    i
                }
                get keys() {
                    return Ur(1 === this.instructions.length),
                    this.instructions[0].keys.map((t => t.pubkey))
                }
                get programId() {
                    return Ur(1 === this.instructions.length),
                    this.instructions[0].programId
                }
                get data() {
                    return Ur(1 === this.instructions.length),
                    this.instructions[0].data
                }
                static from(t) {
                    let e = [...t];
                    const n = Lr(e);
                    let r = [];
                    for (let t = 0; t < n; t++) {
                        const t = Wr(e, 0, 64);
                        r.push(A().encode(Q.Buffer.from(t)))
                    }
                    return Hr.populate(Cr.from(e), r)
                }
                static populate(t, e=[]) {
                    const n = new Hr;
                    return n.recentBlockhash = t.recentBlockhash,
                    t.header.numRequiredSignatures > 0 && (n.feePayer = t.accountKeys[0]),
                    e.forEach(( (e, r) => {
                        const i = {
                            signature: e == A().encode(Dr) ? null : A().decode(e),
                            publicKey: t.accountKeys[r]
                        };
                        n.signatures.push(i)
                    }
                    )),
                    t.instructions.forEach((e => {
                        const r = e.accounts.map((e => {
                            const r = t.accountKeys[e];
                            return {
                                pubkey: r,
                                isSigner: n.signatures.some((t => t.publicKey.toString() === r.toString())) || t.isAccountSigner(e),
                                isWritable: t.isAccountWritable(e)
                            }
                        }
                        ));
                        n.instructions.push(new $r({
                            keys: r,
                            programId: t.accountKeys[e.programIdIndex],
                            data: A().decode(e.data)
                        }))
                    }
                    )),
                    n._message = t,
                    n._json = n.toJSON(),
                    n
                }
            }
            class Vr {
                get version() {
                    return this.message.version
                }
                constructor(t, e) {
                    if (this.signatures = void 0,
                    this.message = void 0,
                    void 0 !== e)
                        Ur(e.length === t.header.numRequiredSignatures, "Expected signatures length to be equal to the number of required signatures"),
                        this.signatures = e;
                    else {
                        const e = [];
                        for (let n = 0; n < t.header.numRequiredSignatures; n++)
                            e.push(new Uint8Array(64));
                        this.signatures = e
                    }
                    this.message = t
                }
                serialize() {
                    const t = this.message.serialize()
                      , e = Array();
                    Rr(e, this.signatures.length);
                    const n = on.n_([on.Ik(e.length, "encodedSignaturesLength"), on.A9(Or(), this.signatures.length, "signatures"), on.Ik(t.length, "serializedMessage")])
                      , r = new Uint8Array(2048)
                      , i = n.encode({
                        encodedSignaturesLength: new Uint8Array(e),
                        signatures: this.signatures,
                        serializedMessage: t
                    }, r);
                    return r.slice(0, i)
                }
                static deserialize(t) {
                    let e = [...t];
                    const n = []
                      , r = Lr(e);
                    for (let t = 0; t < r; t++)
                        n.push(new Uint8Array(Wr(e, 0, 64)));
                    const i = Kr.deserialize(new Uint8Array(e));
                    return new Vr(i,n)
                }
                sign(t) {
                    const e = this.message.serialize()
                      , n = this.message.staticAccountKeys.slice(0, this.message.header.numRequiredSignatures);
                    for (const r of t) {
                        const t = n.findIndex((t => t.equals(r.publicKey)));
                        Ur(t >= 0, `Cannot sign with non signer key ${r.publicKey.toBase58()}`),
                        this.signatures[t] = gr(e, r.secretKey)
                    }
                }
                addSignature(t, e) {
                    Ur(64 === e.byteLength, "Signature must be 64 bytes long");
                    const n = this.message.staticAccountKeys.slice(0, this.message.header.numRequiredSignatures).findIndex((e => e.equals(t)));
                    Ur(n >= 0, `Can not add signature; \`${t.toBase58()}\` is not required to sign this transaction`),
                    this.signatures[n] = e
                }
            }
            const Jr = new Er("SysvarC1ock11111111111111111111111111111111")
              , Gr = (new Er("SysvarEpochSchedu1e111111111111111111111111"),
            new Er("Sysvar1nstructions1111111111111111111111111"),
            new Er("SysvarRecentB1ockHashes11111111111111111111"))
              , Zr = new Er("SysvarRent111111111111111111111111111111111")
              , Yr = (new Er("SysvarRewards111111111111111111111111111111"),
            new Er("SysvarS1otHashes111111111111111111111111111"),
            new Er("SysvarS1otHistory11111111111111111111111111"),
            new Er("SysvarStakeHistory1111111111111111111111111"));
            class Qr extends Error {
                constructor({action: t, signature: e, transactionMessage: n, logs: r}) {
                    const i = r ? `Logs: \n${JSON.stringify(r.slice(-10), null, 2)}. ` : ""
                      , o = "\nCatch the `SendTransactionError` and call `getLogs()` on it for full details.";
                    let s;
                    switch (t) {
                    case "send":
                        s = `Transaction ${e} resulted in an error. \n${n}. ` + i + o;
                        break;
                    case "simulate":
                        s = `Simulation failed. \nMessage: ${n}. \n` + i + o;
                        break;
                    default:
                        s = `Unknown action '${t}'`
                    }
                    super(s),
                    this.signature = void 0,
                    this.transactionMessage = void 0,
                    this.transactionLogs = void 0,
                    this.signature = e,
                    this.transactionMessage = n,
                    this.transactionLogs = r || void 0
                }
                get transactionError() {
                    return {
                        message: this.transactionMessage,
                        logs: Array.isArray(this.transactionLogs) ? this.transactionLogs : void 0
                    }
                }
                get logs() {
                    const t = this.transactionLogs;
                    if (null == t || "object" != typeof t || !("then"in t))
                        return t
                }
                async getLogs(t) {
                    return Array.isArray(this.transactionLogs) || (this.transactionLogs = new Promise(( (e, n) => {
                        t.getTransaction(this.signature).then((t => {
                            if (t && t.meta && t.meta.logMessages) {
                                const n = t.meta.logMessages;
                                this.transactionLogs = n,
                                e(n)
                            } else
                                n(new Error("Log messages not found"))
                        }
                        )).catch(n)
                    }
                    ))),
                    await this.transactionLogs
                }
            }
            async function Xr(t, e, n, r) {
                const i = r && {
                    skipPreflight: r.skipPreflight,
                    preflightCommitment: r.preflightCommitment || r.commitment,
                    maxRetries: r.maxRetries,
                    minContextSlot: r.minContextSlot
                }
                  , o = await t.sendTransaction(e, n, i);
                let s;
                if (null != e.recentBlockhash && null != e.lastValidBlockHeight)
                    s = (await t.confirmTransaction({
                        abortSignal: r?.abortSignal,
                        signature: o,
                        blockhash: e.recentBlockhash,
                        lastValidBlockHeight: e.lastValidBlockHeight
                    }, r && r.commitment)).value;
                else if (null != e.minNonceContextSlot && null != e.nonceInfo) {
                    const {nonceInstruction: n} = e.nonceInfo
                      , i = n.keys[0].pubkey;
                    s = (await t.confirmTransaction({
                        abortSignal: r?.abortSignal,
                        minContextSlot: e.minNonceContextSlot,
                        nonceAccountPubkey: i,
                        nonceValue: e.nonceInfo.nonce,
                        signature: o
                    }, r && r.commitment)).value
                } else
                    null != r?.abortSignal && hr.warn("sendAndConfirmTransaction(): A transaction with a deprecated confirmation strategy was supplied along with an `abortSignal`. Only transactions having `lastValidBlockHeight` or a combination of `nonceInfo` and `minNonceContextSlot` are abortable."),
                    s = (await t.confirmTransaction(o, r && r.commitment)).value;
                if (s.err) {
                    if (null != o)
                        throw new Qr({
                            action: "send",
                            signature: o,
                            transactionMessage: `Status: (${JSON.stringify(s)})`
                        });
                    throw new Error(`Transaction ${o} failed (${JSON.stringify(s)})`)
                }
                return o
            }
            function ti(t) {
                return new Promise((e => setTimeout(e, t)))
            }
            function ei(t, e) {
                const n = t.layout.span >= 0 ? t.layout.span : Tr(t, e)
                  , r = Q.Buffer.alloc(n)
                  , i = Object.assign({
                    instruction: t.index
                }, e);
                return t.layout.encode(i, r),
                r
            }
            Error;
            const ni = on._O("lamportsPerSignature")
              , ri = on.n_([on.Jq("version"), on.Jq("state"), jr("authorizedPubkey"), jr("nonce"), on.n_([ni], "feeCalculator")]).span
              , ii = (8,
            t => {
                const e = (0,
                on.Ik)(8, t)
                  , {encode: n, decode: r} = (t => ({
                    decode: t.decode.bind(t),
                    encode: t.encode.bind(t)
                }))(e)
                  , i = e;
                return i.decode = (t, e) => {
                    const n = r(t, e);
                    return (0,
                    sn.oU)(Q.Buffer.from(n))
                }
                ,
                i.encode = (t, e, r) => {
                    const i = (0,
                    sn.k$)(t, 8);
                    return n(i, e, r)
                }
                ,
                i
            }
            );
            const oi = Object.freeze({
                Create: {
                    index: 0,
                    layout: on.n_([on.Jq("instruction"), on.gM("lamports"), on.gM("space"), jr("programId")])
                },
                Assign: {
                    index: 1,
                    layout: on.n_([on.Jq("instruction"), jr("programId")])
                },
                Transfer: {
                    index: 2,
                    layout: on.n_([on.Jq("instruction"), ii("lamports")])
                },
                CreateWithSeed: {
                    index: 3,
                    layout: on.n_([on.Jq("instruction"), jr("base"), Pr("seed"), on.gM("lamports"), on.gM("space"), jr("programId")])
                },
                AdvanceNonceAccount: {
                    index: 4,
                    layout: on.n_([on.Jq("instruction")])
                },
                WithdrawNonceAccount: {
                    index: 5,
                    layout: on.n_([on.Jq("instruction"), on.gM("lamports")])
                },
                InitializeNonceAccount: {
                    index: 6,
                    layout: on.n_([on.Jq("instruction"), jr("authorized")])
                },
                AuthorizeNonceAccount: {
                    index: 7,
                    layout: on.n_([on.Jq("instruction"), jr("authorized")])
                },
                Allocate: {
                    index: 8,
                    layout: on.n_([on.Jq("instruction"), on.gM("space")])
                },
                AllocateWithSeed: {
                    index: 9,
                    layout: on.n_([on.Jq("instruction"), jr("base"), Pr("seed"), on.gM("space"), jr("programId")])
                },
                AssignWithSeed: {
                    index: 10,
                    layout: on.n_([on.Jq("instruction"), jr("base"), Pr("seed"), jr("programId")])
                },
                TransferWithSeed: {
                    index: 11,
                    layout: on.n_([on.Jq("instruction"), ii("lamports"), Pr("seed"), jr("programId")])
                },
                UpgradeNonceAccount: {
                    index: 12,
                    layout: on.n_([on.Jq("instruction")])
                }
            });
            class si {
                constructor() {}
                static createAccount(t) {
                    const e = ei(oi.Create, {
                        lamports: t.lamports,
                        space: t.space,
                        programId: br(t.programId.toBuffer())
                    });
                    return new $r({
                        keys: [{
                            pubkey: t.fromPubkey,
                            isSigner: !0,
                            isWritable: !0
                        }, {
                            pubkey: t.newAccountPubkey,
                            isSigner: !0,
                            isWritable: !0
                        }],
                        programId: this.programId,
                        data: e
                    })
                }
                static transfer(t) {
                    let e, n;
                    return "basePubkey"in t ? (e = ei(oi.TransferWithSeed, {
                        lamports: BigInt(t.lamports),
                        seed: t.seed,
                        programId: br(t.programId.toBuffer())
                    }),
                    n = [{
                        pubkey: t.fromPubkey,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: t.basePubkey,
                        isSigner: !0,
                        isWritable: !1
                    }, {
                        pubkey: t.toPubkey,
                        isSigner: !1,
                        isWritable: !0
                    }]) : (e = ei(oi.Transfer, {
                        lamports: BigInt(t.lamports)
                    }),
                    n = [{
                        pubkey: t.fromPubkey,
                        isSigner: !0,
                        isWritable: !0
                    }, {
                        pubkey: t.toPubkey,
                        isSigner: !1,
                        isWritable: !0
                    }]),
                    new $r({
                        keys: n,
                        programId: this.programId,
                        data: e
                    })
                }
                static assign(t) {
                    let e, n;
                    return "basePubkey"in t ? (e = ei(oi.AssignWithSeed, {
                        base: br(t.basePubkey.toBuffer()),
                        seed: t.seed,
                        programId: br(t.programId.toBuffer())
                    }),
                    n = [{
                        pubkey: t.accountPubkey,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: t.basePubkey,
                        isSigner: !0,
                        isWritable: !1
                    }]) : (e = ei(oi.Assign, {
                        programId: br(t.programId.toBuffer())
                    }),
                    n = [{
                        pubkey: t.accountPubkey,
                        isSigner: !0,
                        isWritable: !0
                    }]),
                    new $r({
                        keys: n,
                        programId: this.programId,
                        data: e
                    })
                }
                static createAccountWithSeed(t) {
                    const e = ei(oi.CreateWithSeed, {
                        base: br(t.basePubkey.toBuffer()),
                        seed: t.seed,
                        lamports: t.lamports,
                        space: t.space,
                        programId: br(t.programId.toBuffer())
                    });
                    let n = [{
                        pubkey: t.fromPubkey,
                        isSigner: !0,
                        isWritable: !0
                    }, {
                        pubkey: t.newAccountPubkey,
                        isSigner: !1,
                        isWritable: !0
                    }];
                    return t.basePubkey.equals(t.fromPubkey) || n.push({
                        pubkey: t.basePubkey,
                        isSigner: !0,
                        isWritable: !1
                    }),
                    new $r({
                        keys: n,
                        programId: this.programId,
                        data: e
                    })
                }
                static createNonceAccount(t) {
                    const e = new Hr;
                    "basePubkey"in t && "seed"in t ? e.add(si.createAccountWithSeed({
                        fromPubkey: t.fromPubkey,
                        newAccountPubkey: t.noncePubkey,
                        basePubkey: t.basePubkey,
                        seed: t.seed,
                        lamports: t.lamports,
                        space: ri,
                        programId: this.programId
                    })) : e.add(si.createAccount({
                        fromPubkey: t.fromPubkey,
                        newAccountPubkey: t.noncePubkey,
                        lamports: t.lamports,
                        space: ri,
                        programId: this.programId
                    }));
                    const n = {
                        noncePubkey: t.noncePubkey,
                        authorizedPubkey: t.authorizedPubkey
                    };
                    return e.add(this.nonceInitialize(n)),
                    e
                }
                static nonceInitialize(t) {
                    const e = ei(oi.InitializeNonceAccount, {
                        authorized: br(t.authorizedPubkey.toBuffer())
                    })
                      , n = {
                        keys: [{
                            pubkey: t.noncePubkey,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: Gr,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: Zr,
                            isSigner: !1,
                            isWritable: !1
                        }],
                        programId: this.programId,
                        data: e
                    };
                    return new $r(n)
                }
                static nonceAdvance(t) {
                    const e = ei(oi.AdvanceNonceAccount)
                      , n = {
                        keys: [{
                            pubkey: t.noncePubkey,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: Gr,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: t.authorizedPubkey,
                            isSigner: !0,
                            isWritable: !1
                        }],
                        programId: this.programId,
                        data: e
                    };
                    return new $r(n)
                }
                static nonceWithdraw(t) {
                    const e = ei(oi.WithdrawNonceAccount, {
                        lamports: t.lamports
                    });
                    return new $r({
                        keys: [{
                            pubkey: t.noncePubkey,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: t.toPubkey,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: Gr,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: Zr,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: t.authorizedPubkey,
                            isSigner: !0,
                            isWritable: !1
                        }],
                        programId: this.programId,
                        data: e
                    })
                }
                static nonceAuthorize(t) {
                    const e = ei(oi.AuthorizeNonceAccount, {
                        authorized: br(t.newAuthorizedPubkey.toBuffer())
                    });
                    return new $r({
                        keys: [{
                            pubkey: t.noncePubkey,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: t.authorizedPubkey,
                            isSigner: !0,
                            isWritable: !1
                        }],
                        programId: this.programId,
                        data: e
                    })
                }
                static allocate(t) {
                    let e, n;
                    return "basePubkey"in t ? (e = ei(oi.AllocateWithSeed, {
                        base: br(t.basePubkey.toBuffer()),
                        seed: t.seed,
                        space: t.space,
                        programId: br(t.programId.toBuffer())
                    }),
                    n = [{
                        pubkey: t.accountPubkey,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: t.basePubkey,
                        isSigner: !0,
                        isWritable: !1
                    }]) : (e = ei(oi.Allocate, {
                        space: t.space
                    }),
                    n = [{
                        pubkey: t.accountPubkey,
                        isSigner: !0,
                        isWritable: !0
                    }]),
                    new $r({
                        keys: n,
                        programId: this.programId,
                        data: e
                    })
                }
            }
            si.programId = new Er("11111111111111111111111111111111");
            class ai {
                constructor() {}
                static getMinNumSignatures(t) {
                    return 2 * (Math.ceil(t / ai.chunkSize) + 1 + 1)
                }
                static async load(t, e, n, r, i) {
                    {
                        const o = await t.getMinimumBalanceForRentExemption(i.length)
                          , s = await t.getAccountInfo(n.publicKey, "confirmed");
                        let a = null;
                        if (null !== s) {
                            if (s.executable)
                                return hr.error("Program load failed, account is already executable"),
                                !1;
                            s.data.length !== i.length && (a = a || new Hr,
                            a.add(si.allocate({
                                accountPubkey: n.publicKey,
                                space: i.length
                            }))),
                            s.owner.equals(r) || (a = a || new Hr,
                            a.add(si.assign({
                                accountPubkey: n.publicKey,
                                programId: r
                            }))),
                            s.lamports < o && (a = a || new Hr,
                            a.add(si.transfer({
                                fromPubkey: e.publicKey,
                                toPubkey: n.publicKey,
                                lamports: o - s.lamports
                            })))
                        } else
                            a = (new Hr).add(si.createAccount({
                                fromPubkey: e.publicKey,
                                newAccountPubkey: n.publicKey,
                                lamports: o > 0 ? o : 1,
                                space: i.length,
                                programId: r
                            }));
                        null !== a && await Xr(t, a, [e, n], {
                            commitment: "confirmed"
                        })
                    }
                    const o = on.n_([on.Jq("instruction"), on.Jq("offset"), on.Jq("bytesLength"), on.Jq("bytesLengthPadding"), on.A9(on.u8("byte"), on.cv(on.Jq(), -8), "bytes")])
                      , s = ai.chunkSize;
                    let a = 0
                      , u = i
                      , c = [];
                    for (; u.length > 0; ) {
                        const i = u.slice(0, s)
                          , l = Q.Buffer.alloc(s + 16);
                        o.encode({
                            instruction: 0,
                            offset: a,
                            bytes: i,
                            bytesLength: 0,
                            bytesLengthPadding: 0
                        }, l);
                        const f = (new Hr).add({
                            keys: [{
                                pubkey: n.publicKey,
                                isSigner: !0,
                                isWritable: !0
                            }],
                            programId: r,
                            data: l
                        });
                        if (c.push(Xr(t, f, [e, n], {
                            commitment: "confirmed"
                        })),
                        t._rpcEndpoint.includes("solana.com")) {
                            const t = 4;
                            await ti(1e3 / t)
                        }
                        a += s,
                        u = u.slice(s)
                    }
                    await Promise.all(c);
                    {
                        const i = on.n_([on.Jq("instruction")])
                          , o = Q.Buffer.alloc(i.span);
                        i.encode({
                            instruction: 1
                        }, o);
                        const s = (new Hr).add({
                            keys: [{
                                pubkey: n.publicKey,
                                isSigner: !0,
                                isWritable: !0
                            }, {
                                pubkey: Zr,
                                isSigner: !1,
                                isWritable: !1
                            }],
                            programId: r,
                            data: o
                        })
                          , a = "processed"
                          , u = await t.sendTransaction(s, [e, n], {
                            preflightCommitment: a
                        })
                          , {context: c, value: l} = await t.confirmTransaction({
                            signature: u,
                            lastValidBlockHeight: s.lastValidBlockHeight,
                            blockhash: s.recentBlockhash
                        }, a);
                        if (l.err)
                            throw new Error(`Transaction ${u} failed (${JSON.stringify(l)})`);
                        for (; ; ) {
                            try {
                                if (await t.getSlot({
                                    commitment: a
                                }) > c.slot)
                                    break
                            } catch {}
                            await new Promise((t => setTimeout(t, Math.round(200))))
                        }
                    }
                    return !0
                }
            }
            ai.chunkSize = 932,
            new Er("BPFLoader2111111111111111111111111111111111"),
            globalThis.fetch,
            on.n_([on.Jq("typeIndex"), ii("deactivationSlot"), on._O("lastExtendedSlot"), on.u8("lastExtendedStartIndex"), on.u8(), on.A9(jr(), on.cv(on.u8(), -1), "authority")]);
            const ui = Pn(xn(Er), Mn(), (t => new Er(t)))
              , ci = _n([Mn(), Sn("base64")])
              , li = Pn(xn(Q.Buffer), ci, (t => Q.Buffer.from(t[0], "base64")));
            function fi(t) {
                return jn([Bn({
                    jsonrpc: Sn("2.0"),
                    id: Mn(),
                    result: t
                }), Bn({
                    jsonrpc: Sn("2.0"),
                    id: Mn(),
                    error: Bn({
                        code: On(),
                        message: Mn(),
                        data: An(bn("any", ( () => !0)))
                    })
                })])
            }
            const hi = fi(On());
            function di(t) {
                return Pn(fi(t), hi, (e => "error"in e ? e : {
                    ...e,
                    result: yn(e.result, t)
                }))
            }
            function pi(t) {
                return di(Bn({
                    context: Bn({
                        slot: En()
                    }),
                    value: t
                }))
            }
            function yi(t) {
                return Bn({
                    context: Bn({
                        slot: En()
                    }),
                    value: t
                })
            }
            const gi = Bn({
                foundation: En(),
                foundationTerm: En(),
                initial: En(),
                taper: En(),
                terminal: En()
            })
              , mi = (di(wn(kn(Bn({
                epoch: En(),
                effectiveSlot: En(),
                amount: En(),
                postBalance: En(),
                commission: An(kn(En()))
            })))),
            wn(Bn({
                slot: En(),
                prioritizationFee: En()
            })))
              , bi = Bn({
                total: En(),
                validator: En(),
                foundation: En(),
                epoch: En()
            })
              , wi = Bn({
                epoch: En(),
                slotIndex: En(),
                slotsInEpoch: En(),
                absoluteSlot: En(),
                blockHeight: An(En()),
                transactionCount: An(En())
            })
              , vi = Bn({
                slotsPerEpoch: En(),
                leaderScheduleSlotOffset: En(),
                warmup: vn(),
                firstNormalEpoch: En(),
                firstNormalSlot: En()
            })
              , xi = In(Mn(), wn(En()))
              , Si = kn(jn([Bn({}), Mn()]))
              , ki = Bn({
                err: Si
            })
              , Ei = Sn("receivedSignature")
              , Ai = (Bn({
                "solana-core": Mn(),
                "feature-set": An(En())
            }),
            Bn({
                program: Mn(),
                programId: ui,
                parsed: On()
            }))
              , Ii = Bn({
                programId: ui,
                accounts: wn(ui),
                data: Mn()
            });
            pi(Bn({
                err: kn(jn([Bn({}), Mn()])),
                logs: kn(wn(Mn())),
                accounts: An(kn(wn(kn(Bn({
                    executable: vn(),
                    owner: Mn(),
                    lamports: En(),
                    data: wn(Mn()),
                    rentEpoch: An(En())
                }))))),
                unitsConsumed: An(En()),
                returnData: An(kn(Bn({
                    programId: Mn(),
                    data: _n([Mn(), Sn("base64")])
                }))),
                innerInstructions: An(kn(wn(Bn({
                    index: En(),
                    instructions: wn(jn([Ai, Ii]))
                }))))
            })),
            pi(Bn({
                byIdentity: In(Mn(), wn(En())),
                range: Bn({
                    firstSlot: En(),
                    lastSlot: En()
                })
            })),
            di(gi),
            di(bi),
            di(mi),
            di(wi),
            di(vi),
            di(xi),
            di(En()),
            pi(Bn({
                total: En(),
                circulating: En(),
                nonCirculating: En(),
                nonCirculatingAccounts: wn(ui)
            }));
            const Mi = Bn({
                amount: Mn(),
                uiAmount: kn(En()),
                decimals: En(),
                uiAmountString: An(Mn())
            })
              , _i = (pi(wn(Bn({
                address: ui,
                amount: Mn(),
                uiAmount: kn(En()),
                decimals: En(),
                uiAmountString: An(Mn())
            }))),
            pi(wn(Bn({
                pubkey: ui,
                account: Bn({
                    executable: vn(),
                    owner: ui,
                    lamports: En(),
                    data: li,
                    rentEpoch: En()
                })
            }))),
            Bn({
                program: Mn(),
                parsed: On(),
                space: En()
            }))
              , Bi = (pi(wn(Bn({
                pubkey: ui,
                account: Bn({
                    executable: vn(),
                    owner: ui,
                    lamports: En(),
                    data: _i,
                    rentEpoch: En()
                })
            }))),
            pi(wn(Bn({
                lamports: En(),
                address: ui
            }))),
            Bn({
                executable: vn(),
                owner: ui,
                lamports: En(),
                data: li,
                rentEpoch: En()
            }))
              , ji = (Bn({
                pubkey: ui,
                account: Bi
            }),
            Pn(jn([xn(Q.Buffer), _i]), jn([ci, _i]), (t => Array.isArray(t) ? yn(t, li) : t)))
              , Oi = Bn({
                executable: vn(),
                owner: ui,
                lamports: En(),
                data: ji,
                rentEpoch: En()
            })
              , Pi = (Bn({
                pubkey: ui,
                account: Oi
            }),
            Bn({
                state: jn([Sn("active"), Sn("inactive"), Sn("activating"), Sn("deactivating")]),
                active: En(),
                inactive: En()
            }),
            di(wn(Bn({
                signature: Mn(),
                slot: En(),
                err: Si,
                memo: kn(Mn()),
                blockTime: An(kn(En()))
            }))),
            di(wn(Bn({
                signature: Mn(),
                slot: En(),
                err: Si,
                memo: kn(Mn()),
                blockTime: An(kn(En()))
            }))),
            Bn({
                subscription: En(),
                result: yi(Bi)
            }),
            Bn({
                pubkey: ui,
                account: Bi
            }))
              , Ti = (Bn({
                subscription: En(),
                result: yi(Pi)
            }),
            Bn({
                parent: En(),
                slot: En(),
                root: En()
            }))
              , Li = (Bn({
                subscription: En(),
                result: Ti
            }),
            jn([Bn({
                type: jn([Sn("firstShredReceived"), Sn("completed"), Sn("optimisticConfirmation"), Sn("root")]),
                slot: En(),
                timestamp: En()
            }), Bn({
                type: Sn("createdBank"),
                parent: En(),
                slot: En(),
                timestamp: En()
            }), Bn({
                type: Sn("frozen"),
                slot: En(),
                timestamp: En(),
                stats: Bn({
                    numTransactionEntries: En(),
                    numSuccessfulTransactions: En(),
                    numFailedTransactions: En(),
                    maxTransactionsPerEntry: En()
                })
            }), Bn({
                type: Sn("dead"),
                slot: En(),
                timestamp: En(),
                err: Mn()
            })]))
              , Ri = (Bn({
                subscription: En(),
                result: Li
            }),
            Bn({
                subscription: En(),
                result: yi(jn([ki, Ei]))
            }),
            Bn({
                subscription: En(),
                result: En()
            }),
            Bn({
                pubkey: Mn(),
                gossip: kn(Mn()),
                tpu: kn(Mn()),
                rpc: kn(Mn()),
                version: kn(Mn())
            }),
            Bn({
                votePubkey: Mn(),
                nodePubkey: Mn(),
                activatedStake: En(),
                epochVoteAccount: vn(),
                epochCredits: wn(_n([En(), En(), En()])),
                commission: En(),
                lastVote: En(),
                rootSlot: kn(En())
            }))
              , Ui = (di(Bn({
                current: wn(Ri),
                delinquent: wn(Ri)
            })),
            jn([Sn("processed"), Sn("confirmed"), Sn("finalized")]))
              , Ni = Bn({
                slot: En(),
                confirmations: kn(En()),
                err: Si,
                confirmationStatus: An(Ui)
            })
              , zi = (pi(wn(kn(Ni))),
            di(En()),
            Bn({
                accountKey: ui,
                writableIndexes: wn(En()),
                readonlyIndexes: wn(En())
            }))
              , qi = Bn({
                signatures: wn(Mn()),
                message: Bn({
                    accountKeys: wn(Mn()),
                    header: Bn({
                        numRequiredSignatures: En(),
                        numReadonlySignedAccounts: En(),
                        numReadonlyUnsignedAccounts: En()
                    }),
                    instructions: wn(Bn({
                        accounts: wn(En()),
                        data: Mn(),
                        programIdIndex: En()
                    })),
                    recentBlockhash: Mn(),
                    addressTableLookups: An(wn(zi))
                })
            })
              , Wi = Bn({
                pubkey: ui,
                signer: vn(),
                writable: vn(),
                source: An(jn([Sn("transaction"), Sn("lookupTable")]))
            })
              , Ci = Bn({
                accountKeys: wn(Wi),
                signatures: wn(Mn())
            })
              , Fi = Bn({
                parsed: On(),
                program: Mn(),
                programId: ui
            })
              , Ki = Bn({
                accounts: wn(ui),
                data: Mn(),
                programId: ui
            })
              , Di = Pn(jn([Ki, Fi]), jn([Bn({
                parsed: On(),
                program: Mn(),
                programId: Mn()
            }), Bn({
                accounts: wn(Mn()),
                data: Mn(),
                programId: Mn()
            })]), (t => yn(t, "accounts"in t ? Ki : Fi)))
              , $i = Bn({
                signatures: wn(Mn()),
                message: Bn({
                    accountKeys: wn(Wi),
                    instructions: wn(Di),
                    recentBlockhash: Mn(),
                    addressTableLookups: An(kn(wn(zi)))
                })
            })
              , Hi = Bn({
                accountIndex: En(),
                mint: Mn(),
                owner: An(Mn()),
                programId: An(Mn()),
                uiTokenAmount: Mi
            })
              , Vi = Bn({
                writable: wn(ui),
                readonly: wn(ui)
            })
              , Ji = Bn({
                err: Si,
                fee: En(),
                innerInstructions: An(kn(wn(Bn({
                    index: En(),
                    instructions: wn(Bn({
                        accounts: wn(En()),
                        data: Mn(),
                        programIdIndex: En()
                    }))
                })))),
                preBalances: wn(En()),
                postBalances: wn(En()),
                logMessages: An(kn(wn(Mn()))),
                preTokenBalances: An(kn(wn(Hi))),
                postTokenBalances: An(kn(wn(Hi))),
                loadedAddresses: An(Vi),
                computeUnitsConsumed: An(En())
            })
              , Gi = Bn({
                err: Si,
                fee: En(),
                innerInstructions: An(kn(wn(Bn({
                    index: En(),
                    instructions: wn(Di)
                })))),
                preBalances: wn(En()),
                postBalances: wn(En()),
                logMessages: An(kn(wn(Mn()))),
                preTokenBalances: An(kn(wn(Hi))),
                postTokenBalances: An(kn(wn(Hi))),
                loadedAddresses: An(Vi),
                computeUnitsConsumed: An(En())
            })
              , Zi = jn([Sn(0), Sn("legacy")])
              , Yi = Bn({
                pubkey: Mn(),
                lamports: En(),
                postBalance: kn(En()),
                rewardType: kn(Mn()),
                commission: An(kn(En()))
            })
              , Qi = (di(kn(Bn({
                blockhash: Mn(),
                previousBlockhash: Mn(),
                parentSlot: En(),
                transactions: wn(Bn({
                    transaction: qi,
                    meta: kn(Ji),
                    version: An(Zi)
                })),
                rewards: An(wn(Yi)),
                blockTime: kn(En()),
                blockHeight: kn(En())
            }))),
            di(kn(Bn({
                blockhash: Mn(),
                previousBlockhash: Mn(),
                parentSlot: En(),
                rewards: An(wn(Yi)),
                blockTime: kn(En()),
                blockHeight: kn(En())
            }))),
            di(kn(Bn({
                blockhash: Mn(),
                previousBlockhash: Mn(),
                parentSlot: En(),
                transactions: wn(Bn({
                    transaction: Ci,
                    meta: kn(Ji),
                    version: An(Zi)
                })),
                rewards: An(wn(Yi)),
                blockTime: kn(En()),
                blockHeight: kn(En())
            }))),
            di(kn(Bn({
                blockhash: Mn(),
                previousBlockhash: Mn(),
                parentSlot: En(),
                transactions: wn(Bn({
                    transaction: $i,
                    meta: kn(Gi),
                    version: An(Zi)
                })),
                rewards: An(wn(Yi)),
                blockTime: kn(En()),
                blockHeight: kn(En())
            }))),
            di(kn(Bn({
                blockhash: Mn(),
                previousBlockhash: Mn(),
                parentSlot: En(),
                transactions: wn(Bn({
                    transaction: Ci,
                    meta: kn(Gi),
                    version: An(Zi)
                })),
                rewards: An(wn(Yi)),
                blockTime: kn(En()),
                blockHeight: kn(En())
            }))),
            di(kn(Bn({
                blockhash: Mn(),
                previousBlockhash: Mn(),
                parentSlot: En(),
                rewards: An(wn(Yi)),
                blockTime: kn(En()),
                blockHeight: kn(En())
            }))),
            di(kn(Bn({
                blockhash: Mn(),
                previousBlockhash: Mn(),
                parentSlot: En(),
                transactions: wn(Bn({
                    transaction: qi,
                    meta: kn(Ji)
                })),
                rewards: An(wn(Yi)),
                blockTime: kn(En())
            }))),
            di(kn(Bn({
                blockhash: Mn(),
                previousBlockhash: Mn(),
                parentSlot: En(),
                signatures: wn(Mn()),
                blockTime: kn(En())
            }))),
            di(kn(Bn({
                slot: En(),
                meta: kn(Ji),
                blockTime: An(kn(En())),
                transaction: qi,
                version: An(Zi)
            }))),
            di(kn(Bn({
                slot: En(),
                transaction: $i,
                meta: kn(Gi),
                blockTime: An(kn(En())),
                version: An(Zi)
            }))),
            pi(Bn({
                blockhash: Mn(),
                lastValidBlockHeight: En()
            })),
            pi(vn()),
            di(wn(Bn({
                slot: En(),
                numTransactions: En(),
                numSlots: En(),
                samplePeriodSecs: En()
            }))),
            pi(kn(Bn({
                feeCalculator: Bn({
                    lamportsPerSignature: En()
                })
            }))),
            di(Mn()),
            di(Mn()),
            Bn({
                err: Si,
                logs: wn(Mn()),
                signature: Mn()
            }));
            Bn({
                result: yi(Qi),
                subscription: En()
            });
            class Xi {
                constructor(t) {
                    this._keypair = void 0,
                    this._keypair = t ?? dr()
                }
                static generate() {
                    return new Xi(dr())
                }
                static fromSecretKey(t, e) {
                    if (64 !== t.byteLength)
                        throw new Error("bad secret key size");
                    const n = t.slice(32, 64);
                    if (!e || !e.skipValidation) {
                        const e = t.slice(0, 32)
                          , r = pr(e);
                        for (let t = 0; t < 32; t++)
                            if (n[t] !== r[t])
                                throw new Error("provided secretKey is invalid")
                    }
                    return new Xi({
                        publicKey: n,
                        secretKey: t
                    })
                }
                static fromSeed(t) {
                    const e = pr(t)
                      , n = new Uint8Array(64);
                    return n.set(t),
                    n.set(e, 32),
                    new Xi({
                        publicKey: e,
                        secretKey: n
                    })
                }
                get publicKey() {
                    return new Er(this._keypair.publicKey)
                }
                get secretKey() {
                    return new Uint8Array(this._keypair.secretKey)
                }
            }
            Object.freeze({
                CreateLookupTable: {
                    index: 0,
                    layout: on.n_([on.Jq("instruction"), ii("recentSlot"), on.u8("bumpSeed")])
                },
                FreezeLookupTable: {
                    index: 1,
                    layout: on.n_([on.Jq("instruction")])
                },
                ExtendLookupTable: {
                    index: 2,
                    layout: on.n_([on.Jq("instruction"), ii(), on.A9(jr(), on.cv(on.Jq(), -8), "addresses")])
                },
                DeactivateLookupTable: {
                    index: 3,
                    layout: on.n_([on.Jq("instruction")])
                },
                CloseLookupTable: {
                    index: 4,
                    layout: on.n_([on.Jq("instruction")])
                }
            });
            new Er("AddressLookupTab1e1111111111111111111111111");
            Object.freeze({
                RequestUnits: {
                    index: 0,
                    layout: on.n_([on.u8("instruction"), on.Jq("units"), on.Jq("additionalFee")])
                },
                RequestHeapFrame: {
                    index: 1,
                    layout: on.n_([on.u8("instruction"), on.Jq("bytes")])
                },
                SetComputeUnitLimit: {
                    index: 2,
                    layout: on.n_([on.u8("instruction"), on.Jq("units")])
                },
                SetComputeUnitPrice: {
                    index: 3,
                    layout: on.n_([on.u8("instruction"), ii("microLamports")])
                }
            });
            new Er("ComputeBudget111111111111111111111111111111");
            const to = on.n_([on.u8("numSignatures"), on.u8("padding"), on.KB("signatureOffset"), on.KB("signatureInstructionIndex"), on.KB("publicKeyOffset"), on.KB("publicKeyInstructionIndex"), on.KB("messageDataOffset"), on.KB("messageDataSize"), on.KB("messageInstructionIndex")]);
            class eo {
                constructor() {}
                static createInstructionWithPublicKey(t) {
                    const {publicKey: e, message: n, signature: r, instructionIndex: i} = t;
                    Ur(32 === e.length, `Public Key must be 32 bytes but received ${e.length} bytes`),
                    Ur(64 === r.length, `Signature must be 64 bytes but received ${r.length} bytes`);
                    const o = to.span
                      , s = o + e.length
                      , a = s + r.length
                      , u = Q.Buffer.alloc(a + n.length)
                      , c = null == i ? 65535 : i;
                    return to.encode({
                        numSignatures: 1,
                        padding: 0,
                        signatureOffset: s,
                        signatureInstructionIndex: c,
                        publicKeyOffset: o,
                        publicKeyInstructionIndex: c,
                        messageDataOffset: a,
                        messageDataSize: n.length,
                        messageInstructionIndex: c
                    }, u),
                    u.fill(e, o),
                    u.fill(r, s),
                    u.fill(n, a),
                    new $r({
                        keys: [],
                        programId: eo.programId,
                        data: u
                    })
                }
                static createInstructionWithPrivateKey(t) {
                    const {privateKey: e, message: n, instructionIndex: r} = t;
                    Ur(64 === e.length, `Private key must be 64 bytes but received ${e.length} bytes`);
                    try {
                        const t = Xi.fromSecretKey(e)
                          , i = t.publicKey.toBytes()
                          , o = gr(n, t.secretKey);
                        return this.createInstructionWithPublicKey({
                            publicKey: i,
                            message: n,
                            signature: o,
                            instructionIndex: r
                        })
                    } catch (t) {
                        throw new Error(`Error creating instruction; ${t}`)
                    }
                }
            }
            eo.programId = new Er("Ed25519SigVerify111111111111111111111111111"),
            fr.utils.isValidPrivateKey;
            const no = fr.getPublicKey
              , ro = on.n_([on.u8("numSignatures"), on.KB("signatureOffset"), on.u8("signatureInstructionIndex"), on.KB("ethAddressOffset"), on.u8("ethAddressInstructionIndex"), on.KB("messageDataOffset"), on.KB("messageDataSize"), on.u8("messageInstructionIndex"), on.Ik(20, "ethAddress"), on.Ik(64, "signature"), on.u8("recoveryId")]);
            class io {
                constructor() {}
                static publicKeyToEthAddress(t) {
                    Ur(64 === t.length, `Public key must be 64 bytes but received ${t.length} bytes`);
                    try {
                        return Q.Buffer.from(Vn(br(t))).slice(-20)
                    } catch (t) {
                        throw new Error(`Error constructing Ethereum address: ${t}`)
                    }
                }
                static createInstructionWithPublicKey(t) {
                    const {publicKey: e, message: n, signature: r, recoveryId: i, instructionIndex: o} = t;
                    return io.createInstructionWithEthAddress({
                        ethAddress: io.publicKeyToEthAddress(e),
                        message: n,
                        signature: r,
                        recoveryId: i,
                        instructionIndex: o
                    })
                }
                static createInstructionWithEthAddress(t) {
                    const {ethAddress: e, message: n, signature: r, recoveryId: i, instructionIndex: o=0} = t;
                    let s;
                    s = "string" == typeof e ? e.startsWith("0x") ? Q.Buffer.from(e.substr(2), "hex") : Q.Buffer.from(e, "hex") : e,
                    Ur(20 === s.length, `Address must be 20 bytes but received ${s.length} bytes`);
                    const a = 12 + s.length
                      , u = a + r.length + 1
                      , c = Q.Buffer.alloc(ro.span + n.length);
                    return ro.encode({
                        numSignatures: 1,
                        signatureOffset: a,
                        signatureInstructionIndex: o,
                        ethAddressOffset: 12,
                        ethAddressInstructionIndex: o,
                        messageDataOffset: u,
                        messageDataSize: n.length,
                        messageInstructionIndex: o,
                        signature: br(r),
                        ethAddress: br(s),
                        recoveryId: i
                    }, c),
                    c.fill(br(n), ro.span),
                    new $r({
                        keys: [],
                        programId: io.programId,
                        data: c
                    })
                }
                static createInstructionWithPrivateKey(t) {
                    const {privateKey: e, message: n, instructionIndex: r} = t;
                    Ur(32 === e.length, `Private key must be 32 bytes but received ${e.length} bytes`);
                    try {
                        const t = br(e)
                          , i = no(t, !1).slice(1)
                          , o = Q.Buffer.from(Vn(br(n)))
                          , [s,a] = ( (t, e) => {
                            const n = fr.sign(t, e);
                            return [n.toCompactRawBytes(), n.recovery]
                        }
                        )(o, t);
                        return this.createInstructionWithPublicKey({
                            publicKey: i,
                            message: n,
                            signature: s,
                            recoveryId: a,
                            instructionIndex: r
                        })
                    } catch (t) {
                        throw new Error(`Error creating instruction; ${t}`)
                    }
                }
            }
            var oo;
            io.programId = new Er("KeccakSecp256k11111111111111111111111111111");
            const so = new Er("StakeConfig11111111111111111111111111111111");
            class ao {
                constructor(t, e, n) {
                    this.unixTimestamp = void 0,
                    this.epoch = void 0,
                    this.custodian = void 0,
                    this.unixTimestamp = t,
                    this.epoch = e,
                    this.custodian = n
                }
            }
            oo = ao,
            ao.default = new oo(0,0,Er.default);
            const uo = Object.freeze({
                Initialize: {
                    index: 0,
                    layout: on.n_([on.Jq("instruction"), ( (t="authorized") => on.n_([jr("staker"), jr("withdrawer")], t))(), ( (t="lockup") => on.n_([on.gM("unixTimestamp"), on.gM("epoch"), jr("custodian")], t))()])
                },
                Authorize: {
                    index: 1,
                    layout: on.n_([on.Jq("instruction"), jr("newAuthorized"), on.Jq("stakeAuthorizationType")])
                },
                Delegate: {
                    index: 2,
                    layout: on.n_([on.Jq("instruction")])
                },
                Split: {
                    index: 3,
                    layout: on.n_([on.Jq("instruction"), on.gM("lamports")])
                },
                Withdraw: {
                    index: 4,
                    layout: on.n_([on.Jq("instruction"), on.gM("lamports")])
                },
                Deactivate: {
                    index: 5,
                    layout: on.n_([on.Jq("instruction")])
                },
                Merge: {
                    index: 7,
                    layout: on.n_([on.Jq("instruction")])
                },
                AuthorizeWithSeed: {
                    index: 8,
                    layout: on.n_([on.Jq("instruction"), jr("newAuthorized"), on.Jq("stakeAuthorizationType"), Pr("authoritySeed"), jr("authorityOwner")])
                }
            });
            Object.freeze({
                Staker: {
                    index: 0
                },
                Withdrawer: {
                    index: 1
                }
            });
            class co {
                constructor() {}
                static initialize(t) {
                    const {stakePubkey: e, authorized: n, lockup: r} = t
                      , i = r || ao.default
                      , o = ei(uo.Initialize, {
                        authorized: {
                            staker: br(n.staker.toBuffer()),
                            withdrawer: br(n.withdrawer.toBuffer())
                        },
                        lockup: {
                            unixTimestamp: i.unixTimestamp,
                            epoch: i.epoch,
                            custodian: br(i.custodian.toBuffer())
                        }
                    })
                      , s = {
                        keys: [{
                            pubkey: e,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: Zr,
                            isSigner: !1,
                            isWritable: !1
                        }],
                        programId: this.programId,
                        data: o
                    };
                    return new $r(s)
                }
                static createAccountWithSeed(t) {
                    const e = new Hr;
                    e.add(si.createAccountWithSeed({
                        fromPubkey: t.fromPubkey,
                        newAccountPubkey: t.stakePubkey,
                        basePubkey: t.basePubkey,
                        seed: t.seed,
                        lamports: t.lamports,
                        space: this.space,
                        programId: this.programId
                    }));
                    const {stakePubkey: n, authorized: r, lockup: i} = t;
                    return e.add(this.initialize({
                        stakePubkey: n,
                        authorized: r,
                        lockup: i
                    }))
                }
                static createAccount(t) {
                    const e = new Hr;
                    e.add(si.createAccount({
                        fromPubkey: t.fromPubkey,
                        newAccountPubkey: t.stakePubkey,
                        lamports: t.lamports,
                        space: this.space,
                        programId: this.programId
                    }));
                    const {stakePubkey: n, authorized: r, lockup: i} = t;
                    return e.add(this.initialize({
                        stakePubkey: n,
                        authorized: r,
                        lockup: i
                    }))
                }
                static delegate(t) {
                    const {stakePubkey: e, authorizedPubkey: n, votePubkey: r} = t
                      , i = ei(uo.Delegate);
                    return (new Hr).add({
                        keys: [{
                            pubkey: e,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: r,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: Jr,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: Yr,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: so,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: n,
                            isSigner: !0,
                            isWritable: !1
                        }],
                        programId: this.programId,
                        data: i
                    })
                }
                static authorize(t) {
                    const {stakePubkey: e, authorizedPubkey: n, newAuthorizedPubkey: r, stakeAuthorizationType: i, custodianPubkey: o} = t
                      , s = ei(uo.Authorize, {
                        newAuthorized: br(r.toBuffer()),
                        stakeAuthorizationType: i.index
                    })
                      , a = [{
                        pubkey: e,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: Jr,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: n,
                        isSigner: !0,
                        isWritable: !1
                    }];
                    return o && a.push({
                        pubkey: o,
                        isSigner: !0,
                        isWritable: !1
                    }),
                    (new Hr).add({
                        keys: a,
                        programId: this.programId,
                        data: s
                    })
                }
                static authorizeWithSeed(t) {
                    const {stakePubkey: e, authorityBase: n, authoritySeed: r, authorityOwner: i, newAuthorizedPubkey: o, stakeAuthorizationType: s, custodianPubkey: a} = t
                      , u = ei(uo.AuthorizeWithSeed, {
                        newAuthorized: br(o.toBuffer()),
                        stakeAuthorizationType: s.index,
                        authoritySeed: r,
                        authorityOwner: br(i.toBuffer())
                    })
                      , c = [{
                        pubkey: e,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: n,
                        isSigner: !0,
                        isWritable: !1
                    }, {
                        pubkey: Jr,
                        isSigner: !1,
                        isWritable: !1
                    }];
                    return a && c.push({
                        pubkey: a,
                        isSigner: !0,
                        isWritable: !1
                    }),
                    (new Hr).add({
                        keys: c,
                        programId: this.programId,
                        data: u
                    })
                }
                static splitInstruction(t) {
                    const {stakePubkey: e, authorizedPubkey: n, splitStakePubkey: r, lamports: i} = t
                      , o = ei(uo.Split, {
                        lamports: i
                    });
                    return new $r({
                        keys: [{
                            pubkey: e,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: r,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: n,
                            isSigner: !0,
                            isWritable: !1
                        }],
                        programId: this.programId,
                        data: o
                    })
                }
                static split(t, e) {
                    const n = new Hr;
                    return n.add(si.createAccount({
                        fromPubkey: t.authorizedPubkey,
                        newAccountPubkey: t.splitStakePubkey,
                        lamports: e,
                        space: this.space,
                        programId: this.programId
                    })),
                    n.add(this.splitInstruction(t))
                }
                static splitWithSeed(t, e) {
                    const {stakePubkey: n, authorizedPubkey: r, splitStakePubkey: i, basePubkey: o, seed: s, lamports: a} = t
                      , u = new Hr;
                    return u.add(si.allocate({
                        accountPubkey: i,
                        basePubkey: o,
                        seed: s,
                        space: this.space,
                        programId: this.programId
                    })),
                    e && e > 0 && u.add(si.transfer({
                        fromPubkey: t.authorizedPubkey,
                        toPubkey: i,
                        lamports: e
                    })),
                    u.add(this.splitInstruction({
                        stakePubkey: n,
                        authorizedPubkey: r,
                        splitStakePubkey: i,
                        lamports: a
                    }))
                }
                static merge(t) {
                    const {stakePubkey: e, sourceStakePubKey: n, authorizedPubkey: r} = t
                      , i = ei(uo.Merge);
                    return (new Hr).add({
                        keys: [{
                            pubkey: e,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: n,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: Jr,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: Yr,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: r,
                            isSigner: !0,
                            isWritable: !1
                        }],
                        programId: this.programId,
                        data: i
                    })
                }
                static withdraw(t) {
                    const {stakePubkey: e, authorizedPubkey: n, toPubkey: r, lamports: i, custodianPubkey: o} = t
                      , s = ei(uo.Withdraw, {
                        lamports: i
                    })
                      , a = [{
                        pubkey: e,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: r,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: Jr,
                        isSigner: !1,
                        isWritable: !1
                    }, {
                        pubkey: Yr,
                        isSigner: !1,
                        isWritable: !1
                    }, {
                        pubkey: n,
                        isSigner: !0,
                        isWritable: !1
                    }];
                    return o && a.push({
                        pubkey: o,
                        isSigner: !0,
                        isWritable: !1
                    }),
                    (new Hr).add({
                        keys: a,
                        programId: this.programId,
                        data: s
                    })
                }
                static deactivate(t) {
                    const {stakePubkey: e, authorizedPubkey: n} = t
                      , r = ei(uo.Deactivate);
                    return (new Hr).add({
                        keys: [{
                            pubkey: e,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: Jr,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: n,
                            isSigner: !0,
                            isWritable: !1
                        }],
                        programId: this.programId,
                        data: r
                    })
                }
            }
            co.programId = new Er("Stake11111111111111111111111111111111111111"),
            co.space = 200;
            const lo = Object.freeze({
                InitializeAccount: {
                    index: 0,
                    layout: on.n_([on.Jq("instruction"), ( (t="voteInit") => on.n_([jr("nodePubkey"), jr("authorizedVoter"), jr("authorizedWithdrawer"), on.u8("commission")], t))()])
                },
                Authorize: {
                    index: 1,
                    layout: on.n_([on.Jq("instruction"), jr("newAuthorized"), on.Jq("voteAuthorizationType")])
                },
                Withdraw: {
                    index: 3,
                    layout: on.n_([on.Jq("instruction"), on.gM("lamports")])
                },
                UpdateValidatorIdentity: {
                    index: 4,
                    layout: on.n_([on.Jq("instruction")])
                },
                AuthorizeWithSeed: {
                    index: 10,
                    layout: on.n_([on.Jq("instruction"), ( (t="voteAuthorizeWithSeedArgs") => on.n_([on.Jq("voteAuthorizationType"), jr("currentAuthorityDerivedKeyOwnerPubkey"), Pr("currentAuthorityDerivedKeySeed"), jr("newAuthorized")], t))()])
                }
            });
            Object.freeze({
                Voter: {
                    index: 0
                },
                Withdrawer: {
                    index: 1
                }
            });
            class fo {
                constructor() {}
                static initializeAccount(t) {
                    const {votePubkey: e, nodePubkey: n, voteInit: r} = t
                      , i = ei(lo.InitializeAccount, {
                        voteInit: {
                            nodePubkey: br(r.nodePubkey.toBuffer()),
                            authorizedVoter: br(r.authorizedVoter.toBuffer()),
                            authorizedWithdrawer: br(r.authorizedWithdrawer.toBuffer()),
                            commission: r.commission
                        }
                    })
                      , o = {
                        keys: [{
                            pubkey: e,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: Zr,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: Jr,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: n,
                            isSigner: !0,
                            isWritable: !1
                        }],
                        programId: this.programId,
                        data: i
                    };
                    return new $r(o)
                }
                static createAccount(t) {
                    const e = new Hr;
                    return e.add(si.createAccount({
                        fromPubkey: t.fromPubkey,
                        newAccountPubkey: t.votePubkey,
                        lamports: t.lamports,
                        space: this.space,
                        programId: this.programId
                    })),
                    e.add(this.initializeAccount({
                        votePubkey: t.votePubkey,
                        nodePubkey: t.voteInit.nodePubkey,
                        voteInit: t.voteInit
                    }))
                }
                static authorize(t) {
                    const {votePubkey: e, authorizedPubkey: n, newAuthorizedPubkey: r, voteAuthorizationType: i} = t
                      , o = ei(lo.Authorize, {
                        newAuthorized: br(r.toBuffer()),
                        voteAuthorizationType: i.index
                    })
                      , s = [{
                        pubkey: e,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: Jr,
                        isSigner: !1,
                        isWritable: !1
                    }, {
                        pubkey: n,
                        isSigner: !0,
                        isWritable: !1
                    }];
                    return (new Hr).add({
                        keys: s,
                        programId: this.programId,
                        data: o
                    })
                }
                static authorizeWithSeed(t) {
                    const {currentAuthorityDerivedKeyBasePubkey: e, currentAuthorityDerivedKeyOwnerPubkey: n, currentAuthorityDerivedKeySeed: r, newAuthorizedPubkey: i, voteAuthorizationType: o, votePubkey: s} = t
                      , a = ei(lo.AuthorizeWithSeed, {
                        voteAuthorizeWithSeedArgs: {
                            currentAuthorityDerivedKeyOwnerPubkey: br(n.toBuffer()),
                            currentAuthorityDerivedKeySeed: r,
                            newAuthorized: br(i.toBuffer()),
                            voteAuthorizationType: o.index
                        }
                    })
                      , u = [{
                        pubkey: s,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: Jr,
                        isSigner: !1,
                        isWritable: !1
                    }, {
                        pubkey: e,
                        isSigner: !0,
                        isWritable: !1
                    }];
                    return (new Hr).add({
                        keys: u,
                        programId: this.programId,
                        data: a
                    })
                }
                static withdraw(t) {
                    const {votePubkey: e, authorizedWithdrawerPubkey: n, lamports: r, toPubkey: i} = t
                      , o = ei(lo.Withdraw, {
                        lamports: r
                    })
                      , s = [{
                        pubkey: e,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: i,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: n,
                        isSigner: !0,
                        isWritable: !1
                    }];
                    return (new Hr).add({
                        keys: s,
                        programId: this.programId,
                        data: o
                    })
                }
                static safeWithdraw(t, e, n) {
                    if (t.lamports > e - n)
                        throw new Error("Withdraw will leave vote account with insufficient funds.");
                    return fo.withdraw(t)
                }
                static updateValidatorIdentity(t) {
                    const {votePubkey: e, authorizedWithdrawerPubkey: n, nodePubkey: r} = t
                      , i = ei(lo.UpdateValidatorIdentity)
                      , o = [{
                        pubkey: e,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: r,
                        isSigner: !0,
                        isWritable: !1
                    }, {
                        pubkey: n,
                        isSigner: !0,
                        isWritable: !1
                    }];
                    return (new Hr).add({
                        keys: o,
                        programId: this.programId,
                        data: i
                    })
                }
            }
            fo.programId = new Er("Vote111111111111111111111111111111111111111"),
            fo.space = 3762,
            new Er("Va1idator1nfo111111111111111111111111111111"),
            Bn({
                name: Mn(),
                website: An(Mn()),
                details: An(Mn()),
                iconUrl: An(Mn()),
                keybaseUsername: An(Mn())
            }),
            new Er("Vote111111111111111111111111111111111111111"),
            on.n_([jr("nodePubkey"), jr("authorizedWithdrawer"), on.u8("commission"), on._O(), on.A9(on.n_([on._O("slot"), on.Jq("confirmationCount")]), on.cv(on.Jq(), -8), "votes"), on.u8("rootSlotValid"), on._O("rootSlot"), on._O(), on.A9(on.n_([on._O("epoch"), jr("authorizedVoter")]), on.cv(on.Jq(), -8), "authorizedVoters"), on.n_([on.A9(on.n_([jr("authorizedPubkey"), on._O("epochOfLastAuthorizedSwitch"), on._O("targetEpoch")]), 32, "buf"), on._O("idx"), on.u8("isEmpty")], "priorVoters"), on._O(), on.A9(on.n_([on._O("epoch"), on._O("credits"), on._O("prevCredits")]), on.cv(on.Jq(), -8), "epochCredits"), on.n_([on._O("slot"), on._O("timestamp")], "lastTimestamp")]);
            var ho = n("../../../node_modules/eventemitter3/index.js")
              , po = n.n(ho);
            const yo = t => "method"in t && void 0 !== t.method;
            var go = n("../../../node_modules/uuid/dist/esm-browser/v4.js");
            const mo = t => void 0 === t.version
              , bo = t => mo(t) ? t.serialize({
                requireAllSignatures: !1,
                verifySignatures: !1
            }) : t.serialize()
              , wo = (t, e) => e ? Hr.from(t) : Vr.deserialize(t)
              , vo = t => A().encode(t)
              , xo = t => A().decode(t);
            var So;
            !function(t) {
                t.Connect = "connect",
                t.Disconnect = "disconnect",
                t.SignTransactionMessage = "signTransaction",
                t.SignTransaction = "signTransactionV2",
                t.SignAllTransactionMessages = "signAllTransactions",
                t.SignAllTransactions = "signAllTransactionsV2",
                t.SignAndSendTransaction = "signAndSendTransaction",
                t.SignMessage = "signMessage"
            }(So || (So = {}));
            class ko extends Error {
                constructor(t, e) {
                    super(e),
                    this.code = t,
                    this.name = "JRpcError"
                }
            }
            var Eo, Ao, Io, Mo, _o, Bo, jo, Oo = function(t, e, n, r, i) {
                if ("m" === r)
                    throw new TypeError("Private method is not writable");
                if ("a" === r && !i)
                    throw new TypeError("Private accessor was defined without a setter");
                if ("function" == typeof e ? t !== e || !i : !e.has(t))
                    throw new TypeError("Cannot write private member to an object whose class did not declare it");
                return "a" === r ? i.call(t, n) : i ? i.value = n : e.set(t, n),
                n
            }, Po = function(t, e, n, r) {
                if ("a" === n && !r)
                    throw new TypeError("Private accessor was defined without a getter");
                if ("function" == typeof e ? t !== e || !r : !e.has(t))
                    throw new TypeError("Cannot read private member from an object whose class did not declare it");
                return "m" === n ? r : "a" === n ? r.call(t) : r ? r.value : e.get(t)
            };
            Ao = new WeakMap,
            Io = new WeakMap,
            Mo = new WeakMap,
            _o = new WeakMap,
            jo = new WeakMap,
            Eo = new WeakSet,
            Bo = async function({method: t, params: e}) {
                if (t === So.Connect) {
                    if (Po(this, Ao, "f"))
                        return e.silent || Po(this, _o, "f").emit("connect", Po(this, Io, "f")),
                        !0;
                    try {
                        const {account: t} = await Po(this, jo, "f").call(this, {
                            method: "connect",
                            params: e
                        });
                        return Oo(this, Ao, !0, "f"),
                        Oo(this, Io, new Er(t.publicKey), "f"),
                        e.silent || Po(this, _o, "f").emit("connect", new Er(t.publicKey)),
                        !0
                    } catch (t) {
                        return e.silent || Po(this, _o, "f").emit("disconnect"),
                        !1
                    }
                } else if (t === So.Disconnect) {
                    if (!Po(this, Ao, "f"))
                        return Po(this, _o, "f").emit("disconnect"),
                        !0;
                    try {
                        return await Po(this, jo, "f").call(this, {
                            method: "disconnect"
                        }),
                        Oo(this, Ao, !1, "f"),
                        Oo(this, Io, null, "f"),
                        Po(this, _o, "f").emit("disconnect"),
                        !0
                    } catch {
                        return !1
                    }
                } else {
                    if (t === So.SignTransaction) {
                        if (!Po(this, Ao, "f"))
                            throw new ko(-32e3,"Not connected");
                        const {transaction: t} = await Po(this, jo, "f").call(this, {
                            method: "sign-transaction-request",
                            transaction: e.transaction
                        });
                        return {
                            transaction: t
                        }
                    }
                    if (t === So.SignTransactionMessage) {
                        if (!Po(this, Ao, "f"))
                            throw new ko(-32e3,"Not connected");
                        const {signature: t} = await Po(this, jo, "f").call(this, {
                            method: "sign-transaction-message-request",
                            message: e.message
                        });
                        return {
                            signature: t,
                            publicKey: Po(this, Io, "f")?.toString() ?? ""
                        }
                    }
                    if (t === So.SignAllTransactions) {
                        if (!Po(this, Ao, "f"))
                            throw new ko(-32e3,"Not connected");
                        const {transactions: t} = await Po(this, jo, "f").call(this, {
                            method: "sign-multiple-transactions-request",
                            transactions: e.transactions
                        });
                        return {
                            transactions: t
                        }
                    }
                    if (t === So.SignAllTransactionMessages) {
                        if (!Po(this, Ao, "f"))
                            throw new ko(-32e3,"Not connected");
                        const {signatures: t} = await Po(this, jo, "f").call(this, {
                            method: "sign-multiple-transaction-messages-request",
                            messages: e.messages
                        });
                        return {
                            signatures: t,
                            publicKey: Po(this, Io, "f")?.toString() ?? ""
                        }
                    }
                    if (t === So.SignAndSendTransaction) {
                        if (!Po(this, Ao, "f"))
                            throw new ko(-32e3,"Not connected");
                        const {signature: t} = await Po(this, jo, "f").call(this, {
                            method: "sign-and-send-transaction-request",
                            transaction: e.transaction,
                            options: e.options
                        });
                        return {
                            signature: t,
                            publicKey: Po(this, Io, "f")?.toString() ?? ""
                        }
                    }
                    if (t === So.SignMessage) {
                        if (!Po(this, Ao, "f"))
                            throw new ko(-32e3,"Not connected");
                        const {signature: t} = await Po(this, jo, "f").call(this, {
                            method: "sign-message-request",
                            message: e.message,
                            display: e.display
                        });
                        return {
                            signature: t,
                            publicKey: Po(this, Io, "f")?.toString() ?? ""
                        }
                    }
                }
            }
            ;
            const To = new class {
                constructor({name: t, target: e}) {
                    this.subscribers = new Set,
                    this.incomingChannel = () => `solflare_${this._target}->${this._name}`,
                    this.outgoingChannel = () => `solflare_${this._name}->${this._target}`,
                    this.handleMessage = t => {
                        t.isTrusted && t.data?.target === this.incomingChannel() && t.source === window && this.subscribers.forEach((e => e(t.data.payload, t)))
                    }
                    ,
                    this.onMessage = t => (this.subscribers.add(t),
                    () => {
                        this.subscribers.delete(t)
                    }
                    ),
                    this.send = t => {
                        const e = {
                            target: this.outgoingChannel(),
                            payload: t
                        };
                        window.postMessage(e)
                    }
                    ,
                    this._destroy = () => {
                        window.removeEventListener("message", this.handleMessage, !0)
                    }
                    ,
                    this._name = t,
                    this._target = e,
                    this.subscribers = new Set,
                    window.addEventListener("message", this.handleMessage, !0)
                }
            }
            ({
                name: "inpage",
                target: "contentscript"
            })
              , Lo = new class {
                constructor(t) {
                    Eo.add(this),
                    Ao.set(this, !1),
                    Io.set(this, void 0),
                    Mo.set(this, void 0),
                    _o.set(this, new (po())),
                    jo.set(this, (async t => (async (t, e, n) => {
                        const r = function(t, e) {
                            return {
                                id: e || (0,
                                go.Z)(),
                                payload: t
                            }
                        }(e, n);
                        return t.send(r),
                        new Promise(( (e, n) => {
                            const i = t.onMessage((t => {
                                if (t.id === r.id) {
                                    if ((t => "error"in t && t.error)(t.payload))
                                        return n(t.payload.message);
                                    e(t.payload),
                                    i()
                                }
                            }
                            ))
                        }
                        ))
                    }
                    )(Po(this, Mo, "f"), t))),
                    Oo(this, Mo, t, "f"),
                    t.onMessage(( ({payload: t}) => {
                        (t => yo(t) && "wallet-account-change" === t.method)(t) ? Po(this, Ao, "f") && (t.account.publicKey ? (Oo(this, Io, new Er(t.account.publicKey), "f"),
                        Po(this, _o, "f").emit("accountChanged", Po(this, Io, "f"))) : Po(this, _o, "f").emit("accountChanged", void 0)) : (t => yo(t) && "disconnect" === t.method)(t) && Po(this, Ao, "f") && (Oo(this, Ao, !1, "f"),
                        Oo(this, Io, null, "f"),
                        Po(this, _o, "f").emit("disconnect"))
                    }
                    )),
                    this.connect = this.connect.bind(this),
                    this.disconnect = this.disconnect.bind(this),
                    this.signTransaction = this.signTransaction.bind(this),
                    this.signAllTransactions = this.signAllTransactions.bind(this),
                    this.signAndSendTransaction = this.signAndSendTransaction.bind(this),
                    this.signMessage = this.signMessage.bind(this),
                    this.request = this.request.bind(this),
                    this.on = Po(this, _o, "f").on.bind(Po(this, _o, "f")),
                    this.addEventListener = Po(this, _o, "f").on.bind(Po(this, _o, "f")),
                    this.addListener = Po(this, _o, "f").on.bind(Po(this, _o, "f")),
                    this.once = Po(this, _o, "f").once.bind(Po(this, _o, "f")),
                    this.off = Po(this, _o, "f").off.bind(Po(this, _o, "f")),
                    this.removeEventListener = Po(this, _o, "f").off.bind(Po(this, _o, "f")),
                    this.removeListener = Po(this, _o, "f").off.bind(Po(this, _o, "f")),
                    this.eventNames = Po(this, _o, "f").eventNames.bind(Po(this, _o, "f")),
                    this.listenerCount = Po(this, _o, "f").listenerCount.bind(Po(this, _o, "f")),
                    this.listeners = Po(this, _o, "f").listeners.bind(Po(this, _o, "f")),
                    this.removeAllListeners = Po(this, _o, "f").removeAllListeners.bind(Po(this, _o, "f"))
                }
                get publicKey() {
                    return Po(this, Io, "f")
                }
                get autoApprove() {
                    return !1
                }
                get isSolflare() {
                    return !0
                }
                get priorityFeesSupported() {
                    return !0
                }
                get isConnected() {
                    return Po(this, Ao, "f")
                }
                async connect(t={}) {
                    return Po(this, Eo, "m", Bo).call(this, {
                        method: So.Connect,
                        params: t
                    })
                }
                async signTransaction(t) {
                    const e = bo(t)
                      , {transaction: n} = await Po(this, Eo, "m", Bo).call(this, {
                        method: So.SignTransaction,
                        params: {
                            transaction: vo(e)
                        }
                    });
                    return wo(xo(n), mo(t))
                }
                async signAllTransactions(t) {
                    const e = t.map(bo)
                      , {transactions: n} = await Po(this, Eo, "m", Bo).call(this, {
                        method: So.SignAllTransactions,
                        params: {
                            transactions: e.map(vo)
                        }
                    });
                    return n.map(( (e, n) => {
                        const r = t[n];
                        return wo(xo(e), mo(r))
                    }
                    ))
                }
                async signAndSendTransaction(t, e) {
                    const n = bo(t)
                      , {signature: r} = await Po(this, Eo, "m", Bo).call(this, {
                        method: So.SignAndSendTransaction,
                        params: {
                            transaction: vo(n),
                            options: e
                        }
                    });
                    return {
                        signature: r,
                        publicKey: this.publicKey?.toBase58() ?? ""
                    }
                }
                async signMessage(t, e) {
                    const {signature: n} = await Po(this, Eo, "m", Bo).call(this, {
                        method: So.SignMessage,
                        params: {
                            message: t,
                            display: e
                        }
                    });
                    return {
                        signature: xo(n),
                        publicKey: this.publicKey
                    }
                }
                async disconnect() {
                    await Po(this, Eo, "m", Bo).call(this, {
                        method: So.Disconnect,
                        params: null
                    })
                }
                async request(t) {
                    if (!t || "object" != typeof t || Array.isArray(t))
                        throw new Error("Invalid JSON-RPC request");
                    const {method: e} = t;
                    if ("string" != typeof e || !e.trim())
                        throw new Error("Invalid method name");
                    return Po(this, Eo, "m", Bo).call(this, t)
                }
            }
            (To);
            ( (t, e) => {
                const n = new Proxy(e,{
                    deleteProperty: () => !0,
                    get: (t, e) => t[e]
                });
                Object.defineProperty(window, "solflare", {
                    value: Object.freeze(n),
                    enumerable: !0
                })
            }
            )(0, Lo),
            Object.defineProperty(window, "solflareWalletStandardInitialized", {
                value: !0
            }),
            function(t) {
                const e = ({register: e}) => e(t);
                try {
                    window.dispatchEvent(new s(e))
                } catch (t) {
                    o.error("wallet-standard:register-wallet event could not be dispatched\n", t)
                }
                try {
                    window.addEventListener("wallet-standard:app-ready", ( ({detail: t}) => e(t)))
                } catch (t) {
                    o.error("wallet-standard:app-ready event listener could not be added\n", t)
                }
            }(new class {
                get version() {
                    return Z(this, j, "f")
                }
                get name() {
                    return Z(this, T, "f")
                }
                get icon() {
                    return Z(this, L, "f")
                }
                get chains() {
                    return [l, f, h]
                }
                get accounts() {
                    return Z(this, R, "f") ? [Z(this, R, "f")] : []
                }
                get features() {
                    return {
                        [a]: {
                            version: "1.0.0",
                            connect: Z(this, K, "f")
                        },
                        [u]: {
                            version: "1.0.0",
                            disconnect: Z(this, D, "f")
                        },
                        [c]: {
                            version: "1.0.0",
                            on: Z(this, N, "f")
                        },
                        [y]: {
                            version: "1.0.0",
                            supportedTransactionVersions: ["legacy", 0],
                            signAndSendTransaction: Z(this, $, "f")
                        },
                        [g]: {
                            version: "1.0.0",
                            supportedTransactionVersions: ["legacy", 0],
                            signTransaction: Z(this, H, "f")
                        },
                        [m]: {
                            version: "1.0.0",
                            signMessage: Z(this, V, "f")
                        }
                    }
                }
                constructor() {
                    B.add(this),
                    j.set(this, "1.0.0"),
                    O.set(this, window.solflare),
                    P.set(this, {}),
                    T.set(this, "Solflare"),
                    L.set(this, "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJTIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCA1MCI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiMwMjA1MGE7c3Ryb2tlOiNmZmVmNDY7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOi41cHg7fS5jbHMtMntmaWxsOiNmZmVmNDY7fTwvc3R5bGU+PC9kZWZzPjxyZWN0IGNsYXNzPSJjbHMtMiIgeD0iMCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiByeD0iMTIiIHJ5PSIxMiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTI0LjIzLDI2LjQybDIuNDYtMi4zOCw0LjU5LDEuNWMzLjAxLDEsNC41MSwyLjg0LDQuNTEsNS40MywwLDEuOTYtLjc1LDMuMjYtMi4yNSw0LjkzbC0uNDYuNS4xNy0xLjE3Yy42Ny00LjI2LS41OC02LjA5LTQuNzItNy40M2wtNC4zLTEuMzhoMFpNMTguMDUsMTEuODVsMTIuNTIsNC4xNy0yLjcxLDIuNTktNi41MS0yLjE3Yy0yLjI1LS43NS0zLjAxLTEuOTYtMy4zLTQuNTF2LS4wOGgwWk0xNy4zLDMzLjA2bDIuODQtMi43MSw1LjM0LDEuNzVjMi44LjkyLDMuNzYsMi4xMywzLjQ2LDUuMThsLTExLjY1LTQuMjJoMFpNMTMuNzEsMjAuOTVjMC0uNzkuNDItMS41NCwxLjEzLTIuMTcuNzUsMS4wOSwyLjA1LDIuMDUsNC4wOSwyLjcxbDQuNDIsMS40Ni0yLjQ2LDIuMzgtNC4zNC0xLjQyYy0yLS42Ny0yLjg0LTEuNjctMi44NC0yLjk2TTI2LjgyLDQyLjg3YzkuMTgtNi4wOSwxNC4xMS0xMC4yMywxNC4xMS0xNS4zMiwwLTMuMzgtMi01LjI2LTYuNDMtNi43MmwtMy4zNC0xLjEzLDkuMTQtOC43Ny0xLjg0LTEuOTYtMi43MSwyLjM4LTEyLjgxLTQuMjJjLTMuOTcsMS4yOS04Ljk3LDUuMDktOC45Nyw4Ljg5LDAsLjQyLjA0LjgzLjE3LDEuMjktMy4zLDEuODgtNC42MywzLjYzLTQuNjMsNS44LDAsMi4wNSwxLjA5LDQuMDksNC41NSw1LjIybDIuNzUuOTItOS41Miw5LjE0LDEuODQsMS45NiwyLjk2LTIuNzEsMTQuNzMsNS4yMmgwWiIvPjwvc3ZnPg=="),
                    R.set(this, null),
                    U.set(this, (t => new _({
                        address: t.toString(),
                        publicKey: t.toBytes(),
                        chains: this.chains,
                        features: Object.keys(this.features)
                    }))),
                    N.set(this, ( (t, e) => {
                        var n;
                        return (null === (n = Z(this, P, "f")[t]) || void 0 === n ? void 0 : n.push(e)) || (Z(this, P, "f")[t] = [e]),
                        () => Z(this, B, "m", q).call(this, t, e)
                    }
                    )),
                    W.set(this, ( () => {
                        Z(this, O, "f").publicKey && (Z(this, R, "f") && Z(this, R, "f").address === Z(this, O, "f").publicKey.toString() && Z(this, R, "f").publicKey.toString() === Z(this, O, "f").publicKey.toString() || (Y(this, R, Z(this, U, "f").call(this, Z(this, O, "f").publicKey), "f"),
                        Z(this, B, "m", z).call(this, "change", {
                            accounts: this.accounts
                        })))
                    }
                    )),
                    C.set(this, ( () => {
                        Z(this, R, "f") && (Y(this, R, null, "f"),
                        Z(this, B, "m", z).call(this, "change", {
                            accounts: this.accounts
                        }))
                    }
                    )),
                    F.set(this, ( () => {
                        Z(this, O, "f").publicKey ? Z(this, W, "f").call(this) : Z(this, C, "f").call(this)
                    }
                    )),
                    K.set(this, (t => G(this, void 0, void 0, (function*() {
                        var e;
                        if (!Z(this, O, "f").publicKey && !(yield Z(this, O, "f").request({
                            method: "connect",
                            params: {
                                silent: null !== (e = null == t ? void 0 : t.silent) && void 0 !== e && e
                            }
                        })))
                            throw new Error("Connection rejected");
                        return Z(this, W, "f").call(this),
                        {
                            accounts: this.accounts
                        }
                    }
                    )))),
                    D.set(this, ( () => G(this, void 0, void 0, (function*() {
                        yield Z(this, O, "f").request({
                            method: "disconnect"
                        })
                    }
                    )))),
                    $.set(this, ( (...t) => G(this, void 0, void 0, (function*() {
                        if (!Z(this, R, "f"))
                            throw new Error("Wallet not connected");
                        const e = [];
                        for (const n of t) {
                            const {transaction: t, account: r, chain: i, options: o} = n;
                            if (r !== Z(this, R, "f"))
                                throw new Error("Invalid account");
                            if (!p(i))
                                throw new Error("Invalid chain");
                            const {signature: s} = yield Z(this, O, "f").request({
                                method: "signAndSendTransaction",
                                params: {
                                    transaction: A().encode(t),
                                    options: o
                                }
                            });
                            e.push({
                                signature: A().decode(s)
                            })
                        }
                        return e
                    }
                    )))),
                    H.set(this, ( (...t) => G(this, void 0, void 0, (function*() {
                        if (!Z(this, R, "f"))
                            throw new Error("Wallet not connected");
                        if (1 === t.length) {
                            const {transaction: e, account: n, chain: r} = t[0];
                            if (n !== Z(this, R, "f"))
                                throw new Error("Invalid account");
                            if (r && !p(r))
                                throw new Error("Invalid chain");
                            const {transaction: i} = yield Z(this, O, "f").request({
                                method: "signTransactionV2",
                                params: {
                                    transaction: A().encode(e)
                                }
                            });
                            return [{
                                signedTransaction: A().decode(i)
                            }]
                        }
                        {
                            for (const e of t) {
                                if (e.account !== Z(this, R, "f"))
                                    throw new Error("Invalid account");
                                if (e.chain && !p(e.chain))
                                    throw new Error("Invalid chain")
                            }
                            const {transactions: e} = yield Z(this, O, "f").request({
                                method: "signAllTransactionsV2",
                                params: {
                                    transactions: t.map((t => A().encode(t.transaction)))
                                }
                            });
                            return e.map((t => ({
                                signedTransaction: A().decode(t)
                            })))
                        }
                    }
                    )))),
                    V.set(this, ( (...t) => G(this, void 0, void 0, (function*() {
                        if (!Z(this, R, "f"))
                            throw new Error("Wallet not connected");
                        const e = [];
                        for (const n of t) {
                            const {message: t, account: r} = n;
                            if (r !== Z(this, R, "f"))
                                throw new Error("Invalid account");
                            const {signature: i} = yield Z(this, O, "f").request({
                                method: "signMessage",
                                params: {
                                    message: t,
                                    display: "utf8"
                                }
                            });
                            e.push({
                                signedMessage: t,
                                signature: A().decode(i)
                            })
                        }
                        return e
                    }
                    )))),
                    J.set(this, ( () => G(this, void 0, void 0, (function*() {
                        (yield Z(this, O, "f").request({
                            method: "connect",
                            params: {
                                silent: !0
                            }
                        })) && Z(this, O, "f").publicKey && (Y(this, R, Z(this, U, "f").call(this, Z(this, O, "f").publicKey), "f"),
                        Z(this, B, "m", z).call(this, "change", {
                            accounts: this.accounts
                        }))
                    }
                    )))),
                    Z(this, O, "f").on("connect", Z(this, W, "f"), this),
                    Z(this, O, "f").on("disconnect", Z(this, C, "f"), this),
                    Z(this, O, "f").on("accountChanged", Z(this, F, "f"), this),
                    Z(this, O, "f").publicKey ? Y(this, R, Z(this, U, "f").call(this, Z(this, O, "f").publicKey), "f") : Z(this, J, "f").call(this)
                }
            }
            )
        }
        ,
        "../../../node_modules/util/support/isBufferBrowser.js": t => {
            t.exports = function(t) {
                return t && "object" == typeof t && "function" == typeof t.copy && "function" == typeof t.fill && "function" == typeof t.readUInt8
            }
        }
        ,
        "../../../node_modules/util/support/types.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/is-arguments/index.js")
              , i = n("../../../node_modules/is-generator-function/index.js")
              , o = n("../../../node_modules/which-typed-array/index.js")
              , s = n("../../../node_modules/is-typed-array/index.js");
            function a(t) {
                return t.call.bind(t)
            }
            var u = "undefined" != typeof BigInt
              , c = "undefined" != typeof Symbol
              , l = a(Object.prototype.toString)
              , f = a(Number.prototype.valueOf)
              , h = a(String.prototype.valueOf)
              , d = a(Boolean.prototype.valueOf);
            if (u)
                var p = a(BigInt.prototype.valueOf);
            if (c)
                var y = a(Symbol.prototype.valueOf);
            function g(t, e) {
                if ("object" != typeof t)
                    return !1;
                try {
                    return e(t),
                    !0
                } catch (t) {
                    return !1
                }
            }
            function m(t) {
                return "[object Map]" === l(t)
            }
            function b(t) {
                return "[object Set]" === l(t)
            }
            function w(t) {
                return "[object WeakMap]" === l(t)
            }
            function v(t) {
                return "[object WeakSet]" === l(t)
            }
            function x(t) {
                return "[object ArrayBuffer]" === l(t)
            }
            function S(t) {
                return "undefined" != typeof ArrayBuffer && (x.working ? x(t) : t instanceof ArrayBuffer)
            }
            function k(t) {
                return "[object DataView]" === l(t)
            }
            function E(t) {
                return "undefined" != typeof DataView && (k.working ? k(t) : t instanceof DataView)
            }
            e.isArgumentsObject = r,
            e.isGeneratorFunction = i,
            e.isTypedArray = s,
            e.isPromise = function(t) {
                return "undefined" != typeof Promise && t instanceof Promise || null !== t && "object" == typeof t && "function" == typeof t.then && "function" == typeof t.catch
            }
            ,
            e.isArrayBufferView = function(t) {
                return "undefined" != typeof ArrayBuffer && ArrayBuffer.isView ? ArrayBuffer.isView(t) : s(t) || E(t)
            }
            ,
            e.isUint8Array = function(t) {
                return "Uint8Array" === o(t)
            }
            ,
            e.isUint8ClampedArray = function(t) {
                return "Uint8ClampedArray" === o(t)
            }
            ,
            e.isUint16Array = function(t) {
                return "Uint16Array" === o(t)
            }
            ,
            e.isUint32Array = function(t) {
                return "Uint32Array" === o(t)
            }
            ,
            e.isInt8Array = function(t) {
                return "Int8Array" === o(t)
            }
            ,
            e.isInt16Array = function(t) {
                return "Int16Array" === o(t)
            }
            ,
            e.isInt32Array = function(t) {
                return "Int32Array" === o(t)
            }
            ,
            e.isFloat32Array = function(t) {
                return "Float32Array" === o(t)
            }
            ,
            e.isFloat64Array = function(t) {
                return "Float64Array" === o(t)
            }
            ,
            e.isBigInt64Array = function(t) {
                return "BigInt64Array" === o(t)
            }
            ,
            e.isBigUint64Array = function(t) {
                return "BigUint64Array" === o(t)
            }
            ,
            m.working = "undefined" != typeof Map && m(new Map),
            e.isMap = function(t) {
                return "undefined" != typeof Map && (m.working ? m(t) : t instanceof Map)
            }
            ,
            b.working = "undefined" != typeof Set && b(new Set),
            e.isSet = function(t) {
                return "undefined" != typeof Set && (b.working ? b(t) : t instanceof Set)
            }
            ,
            w.working = "undefined" != typeof WeakMap && w(new WeakMap),
            e.isWeakMap = function(t) {
                return "undefined" != typeof WeakMap && (w.working ? w(t) : t instanceof WeakMap)
            }
            ,
            v.working = "undefined" != typeof WeakSet && v(new WeakSet),
            e.isWeakSet = function(t) {
                return v(t)
            }
            ,
            x.working = "undefined" != typeof ArrayBuffer && x(new ArrayBuffer),
            e.isArrayBuffer = S,
            k.working = "undefined" != typeof ArrayBuffer && "undefined" != typeof DataView && k(new DataView(new ArrayBuffer(1),0,1)),
            e.isDataView = E;
            var A = "undefined" != typeof SharedArrayBuffer ? SharedArrayBuffer : void 0;
            function I(t) {
                return "[object SharedArrayBuffer]" === l(t)
            }
            function M(t) {
                return void 0 !== A && (void 0 === I.working && (I.working = I(new A)),
                I.working ? I(t) : t instanceof A)
            }
            function _(t) {
                return g(t, f)
            }
            function B(t) {
                return g(t, h)
            }
            function j(t) {
                return g(t, d)
            }
            function O(t) {
                return u && g(t, p)
            }
            function P(t) {
                return c && g(t, y)
            }
            e.isSharedArrayBuffer = M,
            e.isAsyncFunction = function(t) {
                return "[object AsyncFunction]" === l(t)
            }
            ,
            e.isMapIterator = function(t) {
                return "[object Map Iterator]" === l(t)
            }
            ,
            e.isSetIterator = function(t) {
                return "[object Set Iterator]" === l(t)
            }
            ,
            e.isGeneratorObject = function(t) {
                return "[object Generator]" === l(t)
            }
            ,
            e.isWebAssemblyCompiledModule = function(t) {
                return "[object WebAssembly.Module]" === l(t)
            }
            ,
            e.isNumberObject = _,
            e.isStringObject = B,
            e.isBooleanObject = j,
            e.isBigIntObject = O,
            e.isSymbolObject = P,
            e.isBoxedPrimitive = function(t) {
                return _(t) || B(t) || j(t) || O(t) || P(t)
            }
            ,
            e.isAnyArrayBuffer = function(t) {
                return "undefined" != typeof Uint8Array && (S(t) || M(t))
            }
            ,
            ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach((function(t) {
                Object.defineProperty(e, t, {
                    enumerable: !1,
                    value: function() {
                        throw new Error(t + " is not supported in userland")
                    }
                })
            }
            ))
        }
        ,
        "../../../node_modules/util/util.js": (t, e, n) => {
            var r = n("../../../node_modules/process/browser.js")
              , i = n("../../../node_modules/console-browserify/index.js")
              , o = Object.getOwnPropertyDescriptors || function(t) {
                for (var e = Object.keys(t), n = {}, r = 0; r < e.length; r++)
                    n[e[r]] = Object.getOwnPropertyDescriptor(t, e[r]);
                return n
            }
              , s = /%[sdj%]/g;
            e.format = function(t) {
                if (!v(t)) {
                    for (var e = [], n = 0; n < arguments.length; n++)
                        e.push(l(arguments[n]));
                    return e.join(" ")
                }
                n = 1;
                for (var r = arguments, i = r.length, o = String(t).replace(s, (function(t) {
                    if ("%%" === t)
                        return "%";
                    if (n >= i)
                        return t;
                    switch (t) {
                    case "%s":
                        return String(r[n++]);
                    case "%d":
                        return Number(r[n++]);
                    case "%j":
                        try {
                            return JSON.stringify(r[n++])
                        } catch (t) {
                            return "[Circular]"
                        }
                    default:
                        return t
                    }
                }
                )), a = r[n]; n < i; a = r[++n])
                    b(a) || !k(a) ? o += " " + a : o += " " + l(a);
                return o
            }
            ,
            e.deprecate = function(t, n) {
                if (void 0 !== r && !0 === r.noDeprecation)
                    return t;
                if (void 0 === r)
                    return function() {
                        return e.deprecate(t, n).apply(this, arguments)
                    }
                    ;
                var o = !1;
                return function() {
                    if (!o) {
                        if (r.throwDeprecation)
                            throw new Error(n);
                        r.traceDeprecation ? i.trace(n) : i.error(n),
                        o = !0
                    }
                    return t.apply(this, arguments)
                }
            }
            ;
            var a = {}
              , u = /^$/;
            if ("MISSING_ENV_VAR".NODE_DEBUG) {
                var c = "MISSING_ENV_VAR".NODE_DEBUG;
                c = c.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase(),
                u = new RegExp("^" + c + "$","i")
            }
            function l(t, n) {
                var r = {
                    seen: [],
                    stylize: h
                };
                return arguments.length >= 3 && (r.depth = arguments[2]),
                arguments.length >= 4 && (r.colors = arguments[3]),
                m(n) ? r.showHidden = n : n && e._extend(r, n),
                x(r.showHidden) && (r.showHidden = !1),
                x(r.depth) && (r.depth = 2),
                x(r.colors) && (r.colors = !1),
                x(r.customInspect) && (r.customInspect = !0),
                r.colors && (r.stylize = f),
                d(r, t, r.depth)
            }
            function f(t, e) {
                var n = l.styles[e];
                return n ? "[" + l.colors[n][0] + "m" + t + "[" + l.colors[n][1] + "m" : t
            }
            function h(t, e) {
                return t
            }
            function d(t, n, r) {
                if (t.customInspect && n && I(n.inspect) && n.inspect !== e.inspect && (!n.constructor || n.constructor.prototype !== n)) {
                    var i = n.inspect(r, t);
                    return v(i) || (i = d(t, i, r)),
                    i
                }
                var o = function(t, e) {
                    if (x(e))
                        return t.stylize("undefined", "undefined");
                    if (v(e)) {
                        var n = "'" + JSON.stringify(e).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                        return t.stylize(n, "string")
                    }
                    return w(e) ? t.stylize("" + e, "number") : m(e) ? t.stylize("" + e, "boolean") : b(e) ? t.stylize("null", "null") : void 0
                }(t, n);
                if (o)
                    return o;
                var s = Object.keys(n)
                  , a = function(t) {
                    var e = {};
                    return t.forEach((function(t, n) {
                        e[t] = !0
                    }
                    )),
                    e
                }(s);
                if (t.showHidden && (s = Object.getOwnPropertyNames(n)),
                A(n) && (s.indexOf("message") >= 0 || s.indexOf("description") >= 0))
                    return p(n);
                if (0 === s.length) {
                    if (I(n)) {
                        var u = n.name ? ": " + n.name : "";
                        return t.stylize("[Function" + u + "]", "special")
                    }
                    if (S(n))
                        return t.stylize(RegExp.prototype.toString.call(n), "regexp");
                    if (E(n))
                        return t.stylize(Date.prototype.toString.call(n), "date");
                    if (A(n))
                        return p(n)
                }
                var c, l = "", f = !1, h = ["{", "}"];
                return g(n) && (f = !0,
                h = ["[", "]"]),
                I(n) && (l = " [Function" + (n.name ? ": " + n.name : "") + "]"),
                S(n) && (l = " " + RegExp.prototype.toString.call(n)),
                E(n) && (l = " " + Date.prototype.toUTCString.call(n)),
                A(n) && (l = " " + p(n)),
                0 !== s.length || f && 0 != n.length ? r < 0 ? S(n) ? t.stylize(RegExp.prototype.toString.call(n), "regexp") : t.stylize("[Object]", "special") : (t.seen.push(n),
                c = f ? function(t, e, n, r, i) {
                    for (var o = [], s = 0, a = e.length; s < a; ++s)
                        j(e, String(s)) ? o.push(y(t, e, n, r, String(s), !0)) : o.push("");
                    return i.forEach((function(i) {
                        i.match(/^\d+$/) || o.push(y(t, e, n, r, i, !0))
                    }
                    )),
                    o
                }(t, n, r, a, s) : s.map((function(e) {
                    return y(t, n, r, a, e, f)
                }
                )),
                t.seen.pop(),
                function(t, e, n) {
                    return t.reduce((function(t, e) {
                        return e.indexOf("\n"),
                        t + e.replace(/\u001b\[\d\d?m/g, "").length + 1
                    }
                    ), 0) > 60 ? n[0] + ("" === e ? "" : e + "\n ") + " " + t.join(",\n  ") + " " + n[1] : n[0] + e + " " + t.join(", ") + " " + n[1]
                }(c, l, h)) : h[0] + l + h[1]
            }
            function p(t) {
                return "[" + Error.prototype.toString.call(t) + "]"
            }
            function y(t, e, n, r, i, o) {
                var s, a, u;
                if ((u = Object.getOwnPropertyDescriptor(e, i) || {
                    value: e[i]
                }).get ? a = u.set ? t.stylize("[Getter/Setter]", "special") : t.stylize("[Getter]", "special") : u.set && (a = t.stylize("[Setter]", "special")),
                j(r, i) || (s = "[" + i + "]"),
                a || (t.seen.indexOf(u.value) < 0 ? (a = b(n) ? d(t, u.value, null) : d(t, u.value, n - 1)).indexOf("\n") > -1 && (a = o ? a.split("\n").map((function(t) {
                    return "  " + t
                }
                )).join("\n").slice(2) : "\n" + a.split("\n").map((function(t) {
                    return "   " + t
                }
                )).join("\n")) : a = t.stylize("[Circular]", "special")),
                x(s)) {
                    if (o && i.match(/^\d+$/))
                        return a;
                    (s = JSON.stringify("" + i)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (s = s.slice(1, -1),
                    s = t.stylize(s, "name")) : (s = s.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"),
                    s = t.stylize(s, "string"))
                }
                return s + ": " + a
            }
            function g(t) {
                return Array.isArray(t)
            }
            function m(t) {
                return "boolean" == typeof t
            }
            function b(t) {
                return null === t
            }
            function w(t) {
                return "number" == typeof t
            }
            function v(t) {
                return "string" == typeof t
            }
            function x(t) {
                return void 0 === t
            }
            function S(t) {
                return k(t) && "[object RegExp]" === M(t)
            }
            function k(t) {
                return "object" == typeof t && null !== t
            }
            function E(t) {
                return k(t) && "[object Date]" === M(t)
            }
            function A(t) {
                return k(t) && ("[object Error]" === M(t) || t instanceof Error)
            }
            function I(t) {
                return "function" == typeof t
            }
            function M(t) {
                return Object.prototype.toString.call(t)
            }
            function _(t) {
                return t < 10 ? "0" + t.toString(10) : t.toString(10)
            }
            e.debuglog = function(t) {
                if (t = t.toUpperCase(),
                !a[t])
                    if (u.test(t)) {
                        var n = r.pid;
                        a[t] = function() {
                            var r = e.format.apply(e, arguments);
                            i.error("%s %d: %s", t, n, r)
                        }
                    } else
                        a[t] = function() {}
                        ;
                return a[t]
            }
            ,
            e.inspect = l,
            l.colors = {
                bold: [1, 22],
                italic: [3, 23],
                underline: [4, 24],
                inverse: [7, 27],
                white: [37, 39],
                grey: [90, 39],
                black: [30, 39],
                blue: [34, 39],
                cyan: [36, 39],
                green: [32, 39],
                magenta: [35, 39],
                red: [31, 39],
                yellow: [33, 39]
            },
            l.styles = {
                special: "cyan",
                number: "yellow",
                boolean: "yellow",
                undefined: "grey",
                null: "bold",
                string: "green",
                date: "magenta",
                regexp: "red"
            },
            e.types = n("../../../node_modules/util/support/types.js"),
            e.isArray = g,
            e.isBoolean = m,
            e.isNull = b,
            e.isNullOrUndefined = function(t) {
                return null == t
            }
            ,
            e.isNumber = w,
            e.isString = v,
            e.isSymbol = function(t) {
                return "symbol" == typeof t
            }
            ,
            e.isUndefined = x,
            e.isRegExp = S,
            e.types.isRegExp = S,
            e.isObject = k,
            e.isDate = E,
            e.types.isDate = E,
            e.isError = A,
            e.types.isNativeError = A,
            e.isFunction = I,
            e.isPrimitive = function(t) {
                return null === t || "boolean" == typeof t || "number" == typeof t || "string" == typeof t || "symbol" == typeof t || void 0 === t
            }
            ,
            e.isBuffer = n("../../../node_modules/util/support/isBufferBrowser.js");
            var B = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            function j(t, e) {
                return Object.prototype.hasOwnProperty.call(t, e)
            }
            e.log = function() {
                var t, n;
                i.log("%s - %s", (n = [_((t = new Date).getHours()), _(t.getMinutes()), _(t.getSeconds())].join(":"),
                [t.getDate(), B[t.getMonth()], n].join(" ")), e.format.apply(e, arguments))
            }
            ,
            e.inherits = n("../../../node_modules/inherits/inherits_browser.js"),
            e._extend = function(t, e) {
                if (!e || !k(e))
                    return t;
                for (var n = Object.keys(e), r = n.length; r--; )
                    t[n[r]] = e[n[r]];
                return t
            }
            ;
            var O = "undefined" != typeof Symbol ? Symbol("util.promisify.custom") : void 0;
            function P(t, e) {
                if (!t) {
                    var n = new Error("Promise was rejected with a falsy value");
                    n.reason = t,
                    t = n
                }
                return e(t)
            }
            e.promisify = function(t) {
                if ("function" != typeof t)
                    throw new TypeError('The "original" argument must be of type Function');
                if (O && t[O]) {
                    var e;
                    if ("function" != typeof (e = t[O]))
                        throw new TypeError('The "util.promisify.custom" argument must be of type Function');
                    return Object.defineProperty(e, O, {
                        value: e,
                        enumerable: !1,
                        writable: !1,
                        configurable: !0
                    }),
                    e
                }
                function e() {
                    for (var e, n, r = new Promise((function(t, r) {
                        e = t,
                        n = r
                    }
                    )), i = [], o = 0; o < arguments.length; o++)
                        i.push(arguments[o]);
                    i.push((function(t, r) {
                        t ? n(t) : e(r)
                    }
                    ));
                    try {
                        t.apply(this, i)
                    } catch (t) {
                        n(t)
                    }
                    return r
                }
                return Object.setPrototypeOf(e, Object.getPrototypeOf(t)),
                O && Object.defineProperty(e, O, {
                    value: e,
                    enumerable: !1,
                    writable: !1,
                    configurable: !0
                }),
                Object.defineProperties(e, o(t))
            }
            ,
            e.promisify.custom = O,
            e.callbackify = function(t) {
                if ("function" != typeof t)
                    throw new TypeError('The "original" argument must be of type Function');
                function e() {
                    for (var e = [], n = 0; n < arguments.length; n++)
                        e.push(arguments[n]);
                    var i = e.pop();
                    if ("function" != typeof i)
                        throw new TypeError("The last argument must be of type Function");
                    var o = this
                      , s = function() {
                        return i.apply(o, arguments)
                    };
                    t.apply(this, e).then((function(t) {
                        r.nextTick(s.bind(null, null, t))
                    }
                    ), (function(t) {
                        r.nextTick(P.bind(null, t, s))
                    }
                    ))
                }
                return Object.setPrototypeOf(e, Object.getPrototypeOf(t)),
                Object.defineProperties(e, o(t)),
                e
            }
        }
        ,
        "../../../node_modules/uuid/dist/esm-browser/index.js": (t, e, n) => {
            "use strict";
            n.d(e, {
                v4: () => r.Z
            });
            var r = n("../../../node_modules/uuid/dist/esm-browser/v4.js")
        }
        ,
        "../../../node_modules/uuid/dist/esm-browser/stringify.js": (t, e, n) => {
            "use strict";
            n.d(e, {
                Z: () => s
            });
            for (var r = n("../../../node_modules/uuid/dist/esm-browser/validate.js"), i = [], o = 0; o < 256; ++o)
                i.push((o + 256).toString(16).substr(1));
            const s = function(t) {
                var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0
                  , n = (i[t[e + 0]] + i[t[e + 1]] + i[t[e + 2]] + i[t[e + 3]] + "-" + i[t[e + 4]] + i[t[e + 5]] + "-" + i[t[e + 6]] + i[t[e + 7]] + "-" + i[t[e + 8]] + i[t[e + 9]] + "-" + i[t[e + 10]] + i[t[e + 11]] + i[t[e + 12]] + i[t[e + 13]] + i[t[e + 14]] + i[t[e + 15]]).toLowerCase();
                if (!(0,
                r.Z)(n))
                    throw TypeError("Stringified UUID is invalid");
                return n
            }
        }
        ,
        "../../../node_modules/uuid/dist/esm-browser/v4.js": (t, e, n) => {
            "use strict";
            var r;
            n.d(e, {
                Z: () => a
            });
            var i = new Uint8Array(16);
            function o() {
                if (!r && !(r = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto)))
                    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
                return r(i)
            }
            var s = n("../../../node_modules/uuid/dist/esm-browser/stringify.js");
            const a = function(t, e, n) {
                var r = (t = t || {}).random || (t.rng || o)();
                if (r[6] = 15 & r[6] | 64,
                r[8] = 63 & r[8] | 128,
                e) {
                    n = n || 0;
                    for (var i = 0; i < 16; ++i)
                        e[n + i] = r[i];
                    return e
                }
                return (0,
                s.Z)(r)
            }
        }
        ,
        "../../../node_modules/uuid/dist/esm-browser/validate.js": (t, e, n) => {
            "use strict";
            n.d(e, {
                Z: () => i
            });
            const r = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i
              , i = function(t) {
                return "string" == typeof t && r.test(t)
            }
        }
        ,
        "../../../node_modules/which-typed-array/index.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/for-each/index.js")
              , i = n("../../../node_modules/available-typed-arrays/index.js")
              , o = n("../../../node_modules/call-bind/index.js")
              , s = n("../../../node_modules/call-bind/callBound.js")
              , a = n("../../../node_modules/gopd/index.js")
              , u = s("Object.prototype.toString")
              , c = n("../../../node_modules/has-tostringtag/shams.js")()
              , l = "undefined" == typeof globalThis ? n.g : globalThis
              , f = i()
              , h = s("String.prototype.slice")
              , d = Object.getPrototypeOf
              , p = s("Array.prototype.indexOf", !0) || function(t, e) {
                for (var n = 0; n < t.length; n += 1)
                    if (t[n] === e)
                        return n;
                return -1
            }
              , y = {
                __proto__: null
            };
            r(f, c && a && d ? function(t) {
                var e = new l[t];
                if (Symbol.toStringTag in e) {
                    var n = d(e)
                      , r = a(n, Symbol.toStringTag);
                    if (!r) {
                        var i = d(n);
                        r = a(i, Symbol.toStringTag)
                    }
                    y["$" + t] = o(r.get)
                }
            }
            : function(t) {
                var e = new l[t]
                  , n = e.slice || e.set;
                n && (y["$" + t] = o(n))
            }
            ),
            t.exports = function(t) {
                if (!t || "object" != typeof t)
                    return !1;
                if (!c) {
                    var e = h(u(t), 8, -1);
                    return p(f, e) > -1 ? e : "Object" === e && function(t) {
                        var e = !1;
                        return r(y, (function(n, r) {
                            if (!e)
                                try {
                                    n(t),
                                    e = h(r, 1)
                                } catch (t) {}
                        }
                        )),
                        e
                    }(t)
                }
                return a ? function(t) {
                    var e = !1;
                    return r(y, (function(n, r) {
                        if (!e)
                            try {
                                "$" + n(t) === r && (e = h(r, 1))
                            } catch (t) {}
                    }
                    )),
                    e
                }(t) : null
            }
        }
        ,
        "?6876": () => {}
        ,
        "../../../node_modules/available-typed-arrays/index.js": (t, e, n) => {
            "use strict";
            var r = n("../../../node_modules/possible-typed-array-names/index.js")
              , i = "undefined" == typeof globalThis ? n.g : globalThis;
            t.exports = function() {
                for (var t = [], e = 0; e < r.length; e++)
                    "function" == typeof i[r[e]] && (t[t.length] = r[e]);
                return t
            }
        }
    }
      , e = {};
    function n(r) {
        var i = e[r];
        if (void 0 !== i)
            return i.exports;
        var o = e[r] = {
            id: r,
            loaded: !1,
            exports: {}
        };
        return t[r].call(o.exports, o, o.exports, n),
        o.loaded = !0,
        o.exports
    }
    n.n = t => {
        var e = t && t.__esModule ? () => t.default : () => t;
        return n.d(e, {
            a: e
        }),
        e
    }
    ,
    n.d = (t, e) => {
        for (var r in e)
            n.o(e, r) && !n.o(t, r) && Object.defineProperty(t, r, {
                enumerable: !0,
                get: e[r]
            })
    }
    ,
    n.g = function() {
        if ("object" == typeof globalThis)
            return globalThis;
        try {
            return this || new Function("return this")()
        } catch (t) {
            if ("object" == typeof window)
                return window
        }
    }(),
    n.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e),
    n.r = t => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }
    ,
    n.nmd = t => (t.paths = [],
    t.children || (t.children = []),
    t),
    n("../../../node_modules/regenerator-runtime/runtime.js"),
    n("./src/scripts/inpage.ts")
}
)();
