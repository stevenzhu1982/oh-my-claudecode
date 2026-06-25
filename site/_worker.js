var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// api/comments.js
async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (request.method === "GET") {
    const { results } = await env.DB.prepare(
      "SELECT id, name, content, created_at FROM comments ORDER BY created_at DESC"
    ).all();
    return Response.json({ success: true, comments: results }, { headers: corsHeaders });
  }
  if (request.method === "POST") {
    try {
      const body = await request.json();
      const name = (body.name || "").trim();
      const content = (body.content || "").trim();
      if (!name || !content) {
        return Response.json(
          { success: false, error: "\u8BF7\u586B\u5199\u59D3\u540D\u548C\u7559\u8A00\u5185\u5BB9" },
          { status: 400, headers: corsHeaders }
        );
      }
      if (name.length > 20) {
        return Response.json(
          { success: false, error: "\u59D3\u540D\u4E0D\u80FD\u8D85\u8FC720\u4E2A\u5B57\u7B26" },
          { status: 400, headers: corsHeaders }
        );
      }
      if (content.length > 500) {
        return Response.json(
          { success: false, error: "\u7559\u8A00\u5185\u5BB9\u4E0D\u80FD\u8D85\u8FC7500\u4E2A\u5B57\u7B26" },
          { status: 400, headers: corsHeaders }
        );
      }
      const { success } = await env.DB.prepare(
        "INSERT INTO comments (name, content, created_at) VALUES (?, ?, datetime('now'))"
      ).bind(name, content).run();
      if (success) {
        return Response.json({ success: true }, { headers: corsHeaders });
      } else {
        return Response.json(
          { success: false, error: "\u63D0\u4EA4\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5" },
          { status: 500, headers: corsHeaders }
        );
      }
    } catch (e) {
      return Response.json(
        { success: false, error: "\u8BF7\u6C42\u683C\u5F0F\u9519\u8BEF" },
        { status: 400, headers: corsHeaders }
      );
    }
  }
  return new Response("Method not allowed", { status: 405 });
}
__name(onRequest, "onRequest");

// api/feedback.js
async function onRequest2(context) {
  const { request, env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (request.method === "GET") {
    const { results } = await env.DB.prepare(
      "SELECT * FROM feedback ORDER BY created_at DESC"
    ).all();
    return Response.json({ success: true, feedbacks: results }, { headers: corsHeaders });
  }
  if (request.method === "POST") {
    try {
      const body = await request.json();
      const { family_name, destinations, destination_other, adults, elderly, children, time_pref, accommodation, travel_style, special_needs } = body;
      if (!family_name || !family_name.trim()) {
        return Response.json(
          { success: false, error: "\u8BF7\u586B\u5199\u5BB6\u5EAD\u540D\u79F0" },
          { status: 400, headers: corsHeaders }
        );
      }
      const { success } = await env.DB.prepare(
        `INSERT INTO feedback (family_name, destinations, destination_other, adults, elderly, children, time_pref, accommodation, travel_style, special_needs, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
      ).bind(
        family_name.trim(),
        JSON.stringify(destinations || []),
        (destination_other || "").trim(),
        parseInt(adults) || 0,
        parseInt(elderly) || 0,
        parseInt(children) || 0,
        JSON.stringify(time_pref || []),
        accommodation || "",
        travel_style || "",
        (special_needs || "").trim()
      ).run();
      if (success) {
        return Response.json({ success: true }, { headers: corsHeaders });
      }
      return Response.json(
        { success: false, error: "\u63D0\u4EA4\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5" },
        { status: 500, headers: corsHeaders }
      );
    } catch (e) {
      return Response.json(
        { success: false, error: "\u8BF7\u6C42\u683C\u5F0F\u9519\u8BEF" },
        { status: 400, headers: corsHeaders }
      );
    }
  }
  return new Response("Method not allowed", { status: 405 });
}
__name(onRequest2, "onRequest");

// ../.wrangler/tmp/pages-wRSpKC/functionsRoutes-0.9718547786553169.mjs
var routes = [
  {
    routePath: "/api/comments",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest]
  },
  {
    routePath: "/api/feedback",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest2]
  }
];

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var PASSWORD = "8888";
var COOKIE_NAME = "site_pw";

function checkAuth(request) {
  var url = new URL(request.url);
  // Skip auth for static assets (images, css, js)
  if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|css|js|mp4|webm|pdf|docx)$/i)) return true;
  // Skip API routes
  if (url.pathname.startsWith("/api/")) return true;
  // Skip flight monitor pages
  if (url.pathname.startsWith("/flight-monitor") || url.pathname.startsWith("/spring-monitor") || url.pathname.startsWith("/thai-monitor")) return true;
  // Skip public pages
  if (url.pathname === "/countdown.html" || url.pathname === "/countdown") return true;
  // Skip thailand itinerary page (public)
  if (url.pathname.startsWith("/thailand/") || url.pathname === "/thailand") return true;

  // Check query param
  if (url.searchParams.get("pw") === PASSWORD) return true;

  // Check cookie
  var cookie = request.headers.get("Cookie") || "";
  if (cookie.indexOf(COOKIE_NAME + "=" + PASSWORD) >= 0) return true;

  return false;
}

var LOGIN_PAGE = '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>验证</title><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a1a2e,#16213e);font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif}.box{background:#fff;border-radius:20px;padding:40px 36px;text-align:center;max-width:380px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.3)}h1{font-size:22px;color:#1a1a2e;margin-bottom:6px}p{font-size:14px;color:#666;margin-bottom:24px}.input-wrap{position:relative;margin-bottom:20px}input{width:100%;padding:14px 16px;border:2px solid #e0e0e0;border-radius:12px;font-size:18px;text-align:center;outline:none;box-sizing:border-box;letter-spacing:6px;font-weight:700}input:focus{border-color:#6c5ce7}button{width:100%;padding:14px;background:linear-gradient(135deg,#2d1b69,#6c5ce7);color:#fff;border:none;border-radius:12px;font-size:16px;font-weight:600;cursor:pointer}button:hover{opacity:.9}.error{color:#e53e3e;font-size:13px;margin-top:10px;display:none}</style></head><body><div class="box"><h1>🔐 请输入访问密码</h1><p>2026暑假 · 马来西亚亲子游</p><form method="GET"><div class="input-wrap"><input type="password" name="pw" placeholder="输入密码" autofocus></div><button type="submit">验证</button><div class="error" id="error">密码错误，请重试</div></form></div><script>var err=new URLSearchParams(location.search).get("error");if(err){document.getElementById("error").style.display="block"}</script></body></html>';

var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;

    // Password protection
    if (!checkAuth(request)) {
      var url = new URL(request.url);
      var pw = url.searchParams.get("pw");
      if (pw === PASSWORD) {
        // Set cookie and redirect to clean URL
        var cleanUrl = url.origin + url.pathname;
        return new Response("", {
          status: 302,
          headers: {
            "Location": cleanUrl,
            "Set-Cookie": COOKIE_NAME + "=" + PASSWORD + "; Path=/; Max-Age=2592000; SameSite=Lax; Secure"
          }
        });
      }
      if (pw && pw !== PASSWORD) {
        return new Response(LOGIN_PAGE.replace('style="display:none"', 'style="display:block"'), {
          headers: { "Content-Type": "text/html;charset=utf-8" }
        });
      }
      return new Response(LOGIN_PAGE, {
        headers: { "Content-Type": "text/html;charset=utf-8" }
      });
    }

    // IPTV TV page: /TV and /tv.html served from CDN (bypasses ASSETS SPA fallback)
    var _tvUrl = new URL(request.url);
    if (_tvUrl.pathname === "/TV" || _tvUrl.pathname === "/TV/" || _tvUrl.pathname === "/tv.html") {
      try {
        var _tvResp = await fetch("https://cdn.jsdelivr.net/gh/stevenzhu1982/family-trip-2026@master/site/tv.html");
        if (_tvResp.ok) {
          var _tvBody = await _tvResp.text();
          var _tvResult = new Response(_tvBody, {
            headers: { "Content-Type": "text/html;charset=utf-8" }
          });
          _tvResult.headers.append("Set-Cookie", COOKIE_NAME + "=" + PASSWORD + "; Path=/; Max-Age=2592000; SameSite=Lax; Secure");
          return _tvResult;
        }
      } catch(e) { /* CDN fetch failed, fall through to ASSETS */ }
    }

    // Cookie header that refreshes on every response (30 day expiry)
    var COOKIE_HEADER = COOKIE_NAME + "=" + PASSWORD + "; Path=/; Max-Age=2592000; SameSite=Lax; Secure";

    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        response.headers.append("Set-Cookie", COOKIE_HEADER);
        return cloneResponse(response);
      } else if ("ASSETS") {
        var assetResp = await env["ASSETS"].fetch(request);
        var respWithCookie = new Response(assetResp.body, assetResp);
        respWithCookie.headers.append("Set-Cookie", COOKIE_HEADER);
        return respWithCookie;
      } else {
        var fetchResp = await fetch(request);
        var respWithCookie2 = new Response(fetchResp.body, fetchResp);
        respWithCookie2.headers.append("Set-Cookie", COOKIE_HEADER);
        return respWithCookie2;
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
