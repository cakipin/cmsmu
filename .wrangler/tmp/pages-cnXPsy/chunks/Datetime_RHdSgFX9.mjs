globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as __toESM, t as __commonJSMin } from "./rolldown-runtime_BDykq6kg.mjs";
import { F as maybeRenderHead, J as createAstro, L as addAttribute, _ as renderTemplate, l as renderComponent } from "./server__3e0ELtE.mjs";
import { t as createComponent } from "./astro-component_D9NtsI1-.mjs";
import { i as useTranslations } from "./Footer_BnjUarGW.mjs";
import { t as config } from "./config_BdbSVu5n.mjs";
import "./compiler_C1DeRWGl.mjs";
import { t as createSvgComponent } from "./runtime_Bwzfvzj8.mjs";
import { r as slugifyStr } from "./postFilter_B3fh8a1F.mjs";
//#region src/utils/toTransitionName.ts
/**
* Produce a valid CSS <custom-ident> for view-transition-name.
* CSS idents only allow [a-zA-Z0-9_-] plus Unicode U+00A0+.
* Non-ASCII chars are hex-encoded, ASCII special chars (:, /, etc.)
* are replaced with hyphens to keep the browser from ignoring the name.
*/
var toTransitionName = (str) => {
	let result = slugifyStr(str.replaceAll(".", "-")).replace(/[^\x00-\x7F]/gu, (c) => "u" + c.codePointAt(0).toString(16).padStart(6, "0")).replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
	if (/^\d/.test(result)) result = "p-" + result;
	if (!result) result = "post";
	return result;
};
//#endregion
//#region node_modules/dayjs/dayjs.min.js
var require_dayjs_min = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(t, e) {
		"object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs = e();
	})(exports, (function() {
		"use strict";
		var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|YYYY|YY|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = {
			name: "en",
			weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
			months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
			ordinal: function(t) {
				var e = [
					"th",
					"st",
					"nd",
					"rd"
				], n = t % 100;
				return "[" + t + (e[(n - 20) % 10] || e[n] || e[0]) + "]";
			}
		}, m = function(t, e, n) {
			var r = String(t);
			return !r || r.length >= e ? t : "" + Array(e + 1 - r.length).join(n) + t;
		}, v = {
			s: m,
			z: function(t) {
				var e = -t.utcOffset(), n = Math.abs(e), r = Math.floor(n / 60), i = n % 60;
				return (e <= 0 ? "+" : "-") + m(r, 2, "0") + ":" + m(i, 2, "0");
			},
			m: function t(e, n) {
				if (e.date() < n.date()) return -t(n, e);
				var r = 12 * (n.year() - e.year()) + (n.month() - e.month()), i = e.clone().add(r, c), s = n - i < 0, u = e.clone().add(r + (s ? -1 : 1), c);
				return +(-(r + (n - i) / (s ? i - u : u - i)) || 0);
			},
			a: function(t) {
				return t < 0 ? Math.ceil(t) || 0 : Math.floor(t);
			},
			p: function(t) {
				return {
					M: c,
					y: h,
					w: o,
					d: a,
					D: d,
					h: u,
					m: s,
					s: i,
					ms: r,
					Q: f
				}[t] || String(t || "").toLowerCase().replace(/s$/, "");
			},
			u: function(t) {
				return void 0 === t;
			}
		}, g = "en", D = {};
		D[g] = M;
		var p = "$isDayjsObject", S = function(t) {
			return t instanceof _ || !(!t || !t[p]);
		}, w = function t(e, n, r) {
			var i;
			if (!e) return g;
			if ("string" == typeof e) {
				var s = e.toLowerCase();
				D[s] && (i = s), n && (D[s] = n, i = s);
				var u = e.split("-");
				if (!i && u.length > 1) return t(u[0]);
			} else {
				var a = e.name;
				D[a] = e, i = a;
			}
			return !r && i && (g = i), i || !r && g;
		}, O = function(t, e) {
			if (S(t)) return t.clone();
			var n = "object" == typeof e ? e : {};
			return n.date = t, n.args = arguments, new _(n);
		}, b = v;
		b.l = w, b.i = S, b.w = function(t, e) {
			return O(t, {
				locale: e.$L,
				utc: e.$u,
				x: e.$x,
				$offset: e.$offset
			});
		};
		var _ = function() {
			function M(t) {
				this.$L = w(t.locale, null, !0), this.parse(t), this.$x = this.$x || t.x || {}, this[p] = !0;
			}
			var m = M.prototype;
			return m.parse = function(t) {
				this.$d = function(t) {
					var e = t.date, n = t.utc;
					if (null === e) return /* @__PURE__ */ new Date(NaN);
					if (b.u(e)) return /* @__PURE__ */ new Date();
					if (e instanceof Date) return new Date(e);
					if ("string" == typeof e && !/Z$/i.test(e)) {
						var r = e.match($);
						if (r) {
							var i = r[2] - 1 || 0, s = (r[7] || "0").substring(0, 3);
							return n ? new Date(Date.UTC(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, s)) : new Date(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, s);
						}
					}
					return new Date(e);
				}(t), this.init();
			}, m.init = function() {
				var t = this.$d;
				this.$y = t.getFullYear(), this.$M = t.getMonth(), this.$D = t.getDate(), this.$W = t.getDay(), this.$H = t.getHours(), this.$m = t.getMinutes(), this.$s = t.getSeconds(), this.$ms = t.getMilliseconds();
			}, m.$utils = function() {
				return b;
			}, m.isValid = function() {
				return !(this.$d.toString() === l);
			}, m.isSame = function(t, e) {
				var n = O(t);
				return this.startOf(e) <= n && n <= this.endOf(e);
			}, m.isAfter = function(t, e) {
				return O(t) < this.startOf(e);
			}, m.isBefore = function(t, e) {
				return this.endOf(e) < O(t);
			}, m.$g = function(t, e, n) {
				return b.u(t) ? this[e] : this.set(n, t);
			}, m.unix = function() {
				return Math.floor(this.valueOf() / 1e3);
			}, m.valueOf = function() {
				return this.$d.getTime();
			}, m.startOf = function(t, e) {
				var n = this, r = !!b.u(e) || e, f = b.p(t), l = function(t, e) {
					var i = b.w(n.$u ? Date.UTC(n.$y, e, t) : new Date(n.$y, e, t), n);
					return r ? i : i.endOf(a);
				}, $ = function(t, e) {
					return b.w(n.toDate()[t].apply(n.toDate("s"), (r ? [
						0,
						0,
						0,
						0
					] : [
						23,
						59,
						59,
						999
					]).slice(e)), n);
				}, y = this.$W, M = this.$M, m = this.$D, v = "set" + (this.$u ? "UTC" : "");
				switch (f) {
					case h: return r ? l(1, 0) : l(31, 11);
					case c: return r ? l(1, M) : l(0, M + 1);
					case o:
						var g = this.$locale().weekStart || 0, D = (y < g ? y + 7 : y) - g;
						return l(r ? m - D : m + (6 - D), M);
					case a:
					case d: return $(v + "Hours", 0);
					case u: return $(v + "Minutes", 1);
					case s: return $(v + "Seconds", 2);
					case i: return $(v + "Milliseconds", 3);
					default: return this.clone();
				}
			}, m.endOf = function(t) {
				return this.startOf(t, !1);
			}, m.$set = function(t, e) {
				var n, o = b.p(t), f = "set" + (this.$u ? "UTC" : ""), l = (n = {}, n[a] = f + "Date", n[d] = f + "Date", n[c] = f + "Month", n[h] = f + "FullYear", n[u] = f + "Hours", n[s] = f + "Minutes", n[i] = f + "Seconds", n[r] = f + "Milliseconds", n)[o], $ = o === a ? this.$D + (e - this.$W) : e;
				if (o === c || o === h) {
					var y = this.clone().set(d, 1);
					y.$d[l]($), y.init(), this.$d = y.set(d, Math.min(this.$D, y.daysInMonth())).$d;
				} else l && this.$d[l]($);
				return this.init(), this;
			}, m.set = function(t, e) {
				return this.clone().$set(t, e);
			}, m.get = function(t) {
				return this[b.p(t)]();
			}, m.add = function(r, f) {
				var d, l = this;
				r = Number(r);
				var $ = b.p(f), y = function(t) {
					var e = O(l);
					return b.w(e.date(e.date() + Math.round(t * r)), l);
				};
				if ($ === c) return this.set(c, this.$M + r);
				if ($ === h) return this.set(h, this.$y + r);
				if ($ === a) return y(1);
				if ($ === o) return y(7);
				var M = (d = {}, d[s] = e, d[u] = n, d[i] = t, d)[$] || 1, m = this.$d.getTime() + r * M;
				return b.w(m, this);
			}, m.subtract = function(t, e) {
				return this.add(-1 * t, e);
			}, m.format = function(t) {
				var e = this, n = this.$locale();
				if (!this.isValid()) return n.invalidDate || l;
				var r = t || "YYYY-MM-DDTHH:mm:ssZ", i = b.z(this), s = this.$H, u = this.$m, a = this.$M, o = n.weekdays, c = n.months, f = n.meridiem, h = function(t, n, i, s) {
					return t && (t[n] || t(e, r)) || i[n].slice(0, s);
				}, d = function(t) {
					return b.s(s % 12 || 12, t, "0");
				}, $ = f || function(t, e, n) {
					var r = t < 12 ? "AM" : "PM";
					return n ? r.toLowerCase() : r;
				};
				return r.replace(y, (function(t, r) {
					return r || function(t) {
						switch (t) {
							case "YY": return String(e.$y).slice(-2);
							case "YYYY": return b.s(e.$y, 4, "0");
							case "M": return a + 1;
							case "MM": return b.s(a + 1, 2, "0");
							case "MMM": return h(n.monthsShort, a, c, 3);
							case "MMMM": return h(c, a);
							case "D": return e.$D;
							case "DD": return b.s(e.$D, 2, "0");
							case "d": return String(e.$W);
							case "dd": return h(n.weekdaysMin, e.$W, o, 2);
							case "ddd": return h(n.weekdaysShort, e.$W, o, 3);
							case "dddd": return o[e.$W];
							case "H": return String(s);
							case "HH": return b.s(s, 2, "0");
							case "h": return d(1);
							case "hh": return d(2);
							case "a": return $(s, u, !0);
							case "A": return $(s, u, !1);
							case "m": return String(u);
							case "mm": return b.s(u, 2, "0");
							case "s": return String(e.$s);
							case "ss": return b.s(e.$s, 2, "0");
							case "SSS": return b.s(e.$ms, 3, "0");
							case "Z": return i;
						}
						return null;
					}(t) || i.replace(":", "");
				}));
			}, m.utcOffset = function() {
				return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
			}, m.diff = function(r, d, l) {
				var $, y = this, M = b.p(d), m = O(r), v = (m.utcOffset() - this.utcOffset()) * e, g = this - m, D = function() {
					return b.m(y, m);
				};
				switch (M) {
					case h:
						$ = D() / 12;
						break;
					case c:
						$ = D();
						break;
					case f:
						$ = D() / 3;
						break;
					case o:
						$ = (g - v) / 6048e5;
						break;
					case a:
						$ = (g - v) / 864e5;
						break;
					case u:
						$ = g / n;
						break;
					case s:
						$ = g / e;
						break;
					case i:
						$ = g / t;
						break;
					default: $ = g;
				}
				return l ? $ : b.a($);
			}, m.daysInMonth = function() {
				return this.endOf(c).$D;
			}, m.$locale = function() {
				return D[this.$L];
			}, m.locale = function(t, e) {
				if (!t) return this.$L;
				var n = this.clone(), r = w(t, e, !0);
				return r && (n.$L = r), n;
			}, m.clone = function() {
				return b.w(this.$d, this);
			}, m.toDate = function() {
				return new Date(this.valueOf());
			}, m.toJSON = function() {
				return this.isValid() ? this.toISOString() : null;
			}, m.toISOString = function() {
				return this.$d.toISOString();
			}, m.toString = function() {
				return this.$d.toUTCString();
			}, M;
		}(), Y = _.prototype;
		return O.prototype = Y, [
			["$ms", r],
			["$s", i],
			["$m", s],
			["$H", u],
			["$W", a],
			["$M", c],
			["$y", h],
			["$D", d]
		].forEach((function(t) {
			Y[t[1]] = function(e) {
				return this.$g(e, t[0], t[1]);
			};
		})), O.extend = function(t, e) {
			return t.$i || (t(e, _, O), t.$i = !0), O;
		}, O.locale = w, O.isDayjs = S, O.unix = function(t) {
			return O(1e3 * t);
		}, O.en = D[g], O.Ls = D, O.p = {}, O;
	}));
}));
//#endregion
//#region node_modules/dayjs/plugin/utc.js
var require_utc = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(t, i) {
		"object" == typeof exports && "undefined" != typeof module ? module.exports = i() : "function" == typeof define && define.amd ? define(i) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs_plugin_utc = i();
	})(exports, (function() {
		"use strict";
		var t = "minute", i = /[+-]\d\d(?::?\d\d)?/g, e = /([+-]|\d\d)/g;
		return function(s, f, n) {
			var u = f.prototype;
			n.utc = function(t) {
				return new f({
					date: t,
					utc: !0,
					args: arguments
				});
			}, u.utc = function(i) {
				var e = n(this.toDate(), {
					locale: this.$L,
					utc: !0
				});
				return i ? e.add(this.utcOffset(), t) : e;
			}, u.local = function() {
				return n(this.toDate(), {
					locale: this.$L,
					utc: !1
				});
			};
			var r = u.parse;
			u.parse = function(t) {
				t.utc && (this.$u = !0), this.$utils().u(t.$offset) || (this.$offset = t.$offset), r.call(this, t);
			};
			var o = u.init;
			u.init = function() {
				if (this.$u) {
					var t = this.$d;
					this.$y = t.getUTCFullYear(), this.$M = t.getUTCMonth(), this.$D = t.getUTCDate(), this.$W = t.getUTCDay(), this.$H = t.getUTCHours(), this.$m = t.getUTCMinutes(), this.$s = t.getUTCSeconds(), this.$ms = t.getUTCMilliseconds();
				} else o.call(this);
			};
			var a = u.utcOffset;
			u.utcOffset = function(s, f) {
				var n = this.$utils().u;
				if (n(s)) return this.$u ? 0 : n(this.$offset) ? a.call(this) : this.$offset;
				if ("string" == typeof s && (s = function(t) {
					void 0 === t && (t = "");
					var s = t.match(i);
					if (!s) return null;
					var f = ("" + s[0]).match(e) || [
						"-",
						0,
						0
					], n = f[0], u = 60 * +f[1] + +f[2];
					return 0 === u ? 0 : "+" === n ? u : -u;
				}(s), null === s)) return this;
				var u = Math.abs(s) <= 16 ? 60 * s : s;
				if (0 === u) return this.utc(f);
				var r = this.clone();
				if (f) return r.$offset = u, r.$u = !1, r;
				var o = this.$u ? this.toDate().getTimezoneOffset() : -1 * this.utcOffset();
				return (r = this.local().add(u + o, t)).$offset = u, r.$x.$localOffset = o, r;
			};
			var h = u.format;
			u.format = function(t) {
				var i = t || (this.$u ? "YYYY-MM-DDTHH:mm:ss[Z]" : "");
				return h.call(this, i);
			}, u.valueOf = function() {
				var t = this.$utils().u(this.$offset) ? 0 : this.$offset + (this.$x.$localOffset || this.$d.getTimezoneOffset());
				return this.$d.valueOf() - 6e4 * t;
			}, u.isUTC = function() {
				return !!this.$u;
			}, u.toISOString = function() {
				return this.toDate().toISOString();
			}, u.toString = function() {
				return this.toDate().toUTCString();
			};
			var l = u.toDate;
			u.toDate = function(t) {
				return "s" === t && this.$offset ? n(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate() : l.call(this);
			};
			var c = u.diff;
			u.diff = function(t, i, e) {
				if (t && this.$u === t.$u) return c.call(this, t, i, e);
				var s = this.local(), f = n(t).local();
				return c.call(s, f, i, e);
			};
		};
	}));
}));
//#endregion
//#region node_modules/dayjs/plugin/timezone.js
var require_timezone = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(t, e) {
		"object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs_plugin_timezone = e();
	})(exports, (function() {
		"use strict";
		var t = {
			year: 0,
			month: 1,
			day: 2,
			hour: 3,
			minute: 4,
			second: 5
		}, e = {};
		return function(n, i, o) {
			var r, a = function(t, n, i) {
				void 0 === i && (i = {});
				var o = new Date(t);
				return function(t, n) {
					void 0 === n && (n = {});
					var i = n.timeZoneName || "short", o = t + "|" + i, r = e[o];
					return r || (r = new Intl.DateTimeFormat("en-US", {
						hour12: !1,
						timeZone: t,
						year: "numeric",
						month: "2-digit",
						day: "2-digit",
						hour: "2-digit",
						minute: "2-digit",
						second: "2-digit",
						timeZoneName: i
					}), e[o] = r), r;
				}(n, i).formatToParts(o);
			}, u = function(e, n) {
				for (var i = a(e, n), r = [], u = 0; u < i.length; u += 1) {
					var f = i[u], s = f.type, m = f.value, c = t[s];
					c >= 0 && (r[c] = parseInt(m, 10));
				}
				var d = r[3], l = 24 === d ? 0 : d, h = r[0] + "-" + r[1] + "-" + r[2] + " " + l + ":" + r[4] + ":" + r[5] + ":000", v = +e;
				return (o.utc(h).valueOf() - (v -= v % 1e3)) / 6e4;
			}, f = i.prototype;
			f.tz = function(t, e) {
				void 0 === t && (t = r);
				var n, i = this.utcOffset(), a = this.toDate(), u = a.toLocaleString("en-US", { timeZone: t }), f = Math.round((a - new Date(u)) / 1e3 / 60), s = 15 * -Math.round(a.getTimezoneOffset() / 15) - f;
				if (!Number(s)) n = this.utcOffset(0, e);
				else if (n = o(u, { locale: this.$L }).$set("millisecond", this.$ms).utcOffset(s, !0), e) {
					var m = n.utcOffset();
					n = n.add(i - m, "minute");
				}
				return n.$x.$timezone = t, n;
			}, f.offsetName = function(t) {
				var e = this.$x.$timezone || o.tz.guess(), n = a(this.valueOf(), e, { timeZoneName: t }).find((function(t) {
					return "timezonename" === t.type.toLowerCase();
				}));
				return n && n.value;
			};
			var s = f.startOf;
			f.startOf = function(t, e) {
				if (!this.$x || !this.$x.$timezone) return s.call(this, t, e);
				var n = o(this.format("YYYY-MM-DD HH:mm:ss:SSS"), { locale: this.$L });
				return s.call(n, t, e).tz(this.$x.$timezone, !0);
			}, o.tz = function(t, e, n) {
				var i = n && e, a = n || e || r, f = u(+o(), a);
				if ("string" != typeof t) return o(t).tz(a);
				var s = function(t, e, n) {
					var i = t - 60 * e * 1e3, o = u(i, n);
					if (e === o) return [i, e];
					var r = u(i -= 60 * (o - e) * 1e3, n);
					return o === r ? [i, o] : [t - 60 * Math.min(o, r) * 1e3, Math.max(o, r)];
				}(o.utc(t, i).valueOf(), f, a), m = s[0], c = s[1], d = o(m).utcOffset(c);
				return d.$x.$timezone = a, d;
			}, o.tz.guess = function() {
				return Intl.DateTimeFormat().resolvedOptions().timeZone;
			}, o.tz.setDefault = function(t) {
				r = t;
			};
		};
	}));
}));
//#endregion
//#region src/assets/icons/IconCalendar.svg
var import_dayjs_min = /* @__PURE__ */ __toESM(require_dayjs_min());
var import_utc = /* @__PURE__ */ __toESM(require_utc());
var import_timezone = /* @__PURE__ */ __toESM(require_timezone());
var IconCalendar_default = createSvgComponent({
	"meta": {
		"src": "/_astro/IconCalendar.C0xY3fv4.svg",
		"width": 24,
		"height": 24,
		"format": "svg"
	},
	"attributes": {
		"width": "24",
		"height": "24",
		"fill": "none",
		"stroke": "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		"class": "icon icon-tabler icons-tabler-outline icon-tabler-calendar-week",
		"viewBox": "0 0 24 24"
	},
	"children": "<path stroke=\"none\" d=\"M0 0h24v24H0z\" /><path d=\"M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM16 3v4M8 3v4M4 11h16M7 14h.013M10.01 14h.005M13.01 14h.005M16.015 14h.005M13.015 17h.005M7.01 17h.005M10.01 17h.005\" />",
	"styles": []
});
//#endregion
//#region src/components/Datetime.astro
createAstro("https://astro-paper.pages.dev/");
var $$Datetime = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Datetime;
	import_dayjs_min.default.extend(import_utc.default);
	import_dayjs_min.default.extend(import_timezone.default);
	const { pubDatetime, modDatetime, size = "sm", class: className = "", timezone: postTimezone } = Astro.props;
	const t = useTranslations(Astro.currentLocale);
	const isModified = modDatetime && modDatetime > pubDatetime;
	const datetime = (0, import_dayjs_min.default)(isModified ? modDatetime : pubDatetime).tz(postTimezone ?? config.site.timezone);
	const date = datetime.format("D MMM, YYYY");
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["text-muted-foreground flex items-center gap-x-2", className], "class:list")}>${renderComponent($$result, "IconCalendar", IconCalendar_default, { "class:list": ["inline-block size-6 min-w-5.5", { "scale-90": size === "sm" }] })}${isModified && renderTemplate`<span${addAttribute(["text-sm", { "sm:text-base": size === "lg" }], "class:list")}>${t.post.updatedAt}:</span>`}<time${addAttribute(["text-sm", { "sm:text-base": size === "lg" }], "class:list")}${addAttribute(datetime.toISOString(), "datetime")}>${date}</time></div>`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/components/Datetime.astro", void 0);
//#endregion
export { toTransitionName as n, $$Datetime as t };
