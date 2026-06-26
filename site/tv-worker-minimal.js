var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const cors = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type"};
  if (request.method === "OPTIONS") return new Response(null,{headers:cors});
  if (request.method === "GET") {
    if (url.searchParams.has("purgevotes")) { const d=await env.DB.prepare("DELETE FROM comments WHERE name LIKE 'vote_%'").run(); return Response.json({success:true,deleted:d?.meta?.changes||0},{headers:cors}); }
    const {results}=await env.DB.prepare("SELECT id,name,content,created_at FROM comments ORDER BY created_at DESC").all();
    return Response.json({success:true,comments:results},{headers:cors});
  }
  if (request.method === "POST") {
    try { const b=await request.json(); const n=(b.name||"").trim(),c=(b.content||"").trim();
      if (!n||!c) return Response.json({success:false,error:"请填写姓名和留言内容"},{status:400,headers:cors});
      if (n.length>20) return Response.json({success:false,error:"姓名不能超过20个字符"},{status:400,headers:cors});
      if (c.length>500) return Response.json({success:false,error:"留言内容不能超过500个字符"},{status:400,headers:cors});
      const r=await env.DB.prepare("INSERT INTO comments (name,content,created_at) VALUES (?,?,datetime('now'))").bind(n,c).run();
      return Response.json({success:!!r?.success},{headers:cors});
    } catch(e) { return Response.json({success:false,error:"请求格式错误"},{status:400,headers:cors}); }
  }
  return new Response("Method not allowed",{status:405});
}
__name(onRequest,"onRequest");
async function onRequest2(context) {
  const {request,env}=context;const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type"};
  if(request.method==="OPTIONS")return new Response(null,{headers:cors});
  if(request.method==="GET") {const {results}=await env.DB.prepare("SELECT * FROM feedback ORDER BY created_at DESC").all(); return Response.json({success:true,feedbacks:results},{headers:cors});}
  if(request.method==="POST") {try{const b=await request.json();const{family_name,destinations,destination_other,adults,elderly,children,time_pref,accommodation,travel_style,special_needs}=b;
    if(!family_name||!family_name.trim())return Response.json({success:false,error:"请填写家庭名称"},{status:400,headers:cors});
    const r=await env.DB.prepare("INSERT INTO feedback (family_name,destinations,destination_other,adults,elderly,children,time_pref,accommodation,travel_style,special_needs,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,datetime('now'))")
      .bind(family_name.trim(),JSON.stringify(destinations||[]),(destination_other||"").trim(),parseInt(adults)||0,parseInt(elderly)||0,parseInt(children)||0,JSON.stringify(time_pref||[]),accommodation||"",travel_style||"",(special_needs||"").trim()).run();
    return Response.json({success:!!r?.success},{headers:cors});}catch(e){return Response.json({success:false,error:"请求格式错误"},{status:400,headers:cors});}}
  return new Response("Method not allowed",{status:405});
}
__name(onRequest2,"onRequest2");
var routes=[
  {routePath:"/api/comments",mountPath:"/api",method:"",middlewares:[],modules:[onRequest]},
  {routePath:"/api/feedback",mountPath:"/api",method:"",middlewares:[],modules:[onRequest2]}
];
var escapeRegex=/[.+?^${}()|[\]\\]/g;
function lexer(s){var t=[];var i=0;while(i<s.length){var c=s[i];
  if(c==="*"||c==="+"||c==="?"){t.push({type:"MODIFIER",index:i,value:s[i++]});continue;}
  if(c==="\\"){t.push({type:"ESCAPED_CHAR",index:i++,value:s[i++]});continue;}
  if(c==="{"){t.push({type:"OPEN",index:i,value:s[i++]});continue;}
  if(c==="}"){t.push({type:"CLOSE",index:i,value:s[i++]});continue;}
  if(c===":"){var n="";var j=i+1;while(j<s.length&&/[a-zA-Z0-9_]/.test(s[j]))n+=s[j++];
    if(!n)throw new TypeError("Missing parameter name at "+i);t.push({type:"NAME",index:i,value:n});i=j;continue;}
  if(c==="("){throw new TypeError("Capturing groups not allowed")}
  t.push({type:"CHAR",index:i,value:s[i++]});}t.push({type:"END",index:i,value:""});return t;}
function parse(s,o){o=o||{};var t=lexer(s);var pre=o.prefixes||"./";var del=o.delimiter||"/#?";var r=[];var key=0;var i=0;var pth="";
  function tc(tp){if(i<t.length&&t[i].type===tp)return t[i++].value;}
  function mc(tp){var v=tc(tp);if(v!==void 0)return v;throw new TypeError("Unexpected "+t[i].type+" at "+t[i].index+", expected "+tp);}
  function ct(){var r2="";var v;while(v=tc("CHAR")||tc("ESCAPED_CHAR"))r2+=v;return r2;}
  function sf(pre2){var prev=r[r.length-1];var pt=pre2||(prev&&typeof prev==="string"?prev:"");
    if(prev&&!pt)throw new TypeError("Must have text between two params");if(!pt||/[\\/#?]/.test(pt))return"[^"+del.replace(/([.+*?^=!:${}()|[\]/\\])/g,"\\$1")+"]+?";return"(?:(?!"+pt.replace(/([.+*?^=!:${}()|[\]/\\])/g,"\\$1")+")[^"+del.replace(/([.+*?^=!:${}()|[\]/\\])/g,"\\$1")+"])+?";}
  while(i<t.length){var ch=tc("CHAR");var nm=tc("NAME");var pt=tc("PATTERN");
    if(nm||pt){var pref=ch||"";if(pre.indexOf(pref)===-1){pth+=pref;pref="";}if(pth){r.push(pth);pth="";}
      r.push({name:nm||key++,prefix:pref,suffix:"",pattern:pt||sf(pref),modifier:tc("MODIFIER")||""});continue;}
    var val=ch||tc("ESCAPED_CHAR");if(val){pth+=val;continue;}if(pth){r.push(pth);pth="";}
    var op=tc("OPEN");if(op){var pre2=ct();var nm2=tc("NAME")||"";var pt2=tc("PATTERN")||"";var sf2=ct();mc("CLOSE");
      r.push({name:nm2||(pt2?key++:""),pattern:nm2&&!pt2?sf(pre2):pt2,prefix:pre2,suffix:sf2,modifier:tc("MODIFIER")||""});continue;}
    mc("END");}return r;}
function tokensToRegexp(tokens,keys,o){o=o||{};var strict=o.strict||false;var start=o.start!==false;var end=o.end!==false;var enc=o.encode||function(x){return x;};var del=o.delimiter||"/#?";var ew=o.endsWith||"";var ewRe="["+ew.replace(/([.+*?^=!:${}()|[\]/\\])/g,"\\$1")+"]|$";var delRe="["+del.replace(/([.+*?^=!:${}()|[\]/\\])/g,"\\$1")+"]";var rt=start?"^":"";
  for(var ti=0;ti<tokens.length;ti++){var tk=tokens[ti];if(typeof tk==="string"){rt+=enc(tk).replace(/([.+*?^=!:${}()|[\]/\\])/g,"\\$1");}else{
    var pre=enc(tk.prefix).replace(/([.+*?^=!:${}()|[\]/\\])/g,"\\$1");var suf=enc(tk.suffix).replace(/([.+*?^=!:${}()|[\]/\\])/g,"\\$1");
    if(tk.pattern){if(keys)keys.push(tk);if(pre||suf){if(tk.modifier==="+"||tk.modifier==="*"){var mod=tk.modifier==="*"?"?":"";rt+="(?:"+pre+"((?:"+tk.pattern+")(?:"+suf+pre+"(?:"+tk.pattern+"))*)"+suf+")"+mod;}else{rt+="(?:"+pre+"("+tk.pattern+")"+suf+")"+tk.modifier;}}else{if(tk.modifier==="+"||tk.modifier==="*")throw new TypeError('Cannot repeat "'+tk.name+'" without prefix/suffix');rt+="("+tk.pattern+")"+tk.modifier;}}else{rt+="(?:"+pre+suf+")"+tk.modifier;}}}
  if(end){if(!strict)rt+=delRe+"?";rt+=o.endsWith?"(?="+ewRe+")":"$";}else{var et=tokens[tokens.length-1];var ed=typeof et==="string"?delRe.indexOf(et[et.length-1])>-1:et===void 0;if(!strict)rt+="(?:"+delRe+"(?="+ewRe+"))?";if(!ed)rt+="(?="+delRe+"|"+ewRe+")";}
  return new RegExp(rt,o.sensitive?"":"i");}
function pathToRegexp(p,keys,o){if(p instanceof RegExp){if(keys){var gr=/\((?:\?<(.*?)>)?(?!\?)/g;var idx=0;var ex;while(ex=gr.exec(p.source))keys.push({name:ex[1]||idx++,prefix:"",suffix:"",modifier:"",pattern:""});}return p;}
  if(Array.isArray(p)){var parts=p.map(function(pp){return pathToRegexp(pp,keys,o).source;});return new RegExp("(?:"+parts.join("|")+")",(o&&o.sensitive?"":"i"));}
  return tokensToRegexp(parse(p,o),keys,o);}
function match(str,o){var keys=[];var re=pathToRegexp(str,keys,o);return function(pathname){var m=re.exec(pathname);if(!m)return false;var params={};for(var i=1;i<m.length;i++){var key=keys[i-1];if(key.modifier==="*"||key.modifier==="+"){params[key.name]=m[i].split(key.prefix+key.suffix).map(function(v){return (o&&o.decode?o.decode:function(x){return x;})(v,key);});}else{params[key.name]=(o&&o.decode?o.decode:function(x){return x;})(m[i],key);}}return{path:m[0],index:m.index,params:params};};}
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) continue;
    const routeMatcher = match(route.routePath.replace(escapeRegex,"\\$&"),{end:false});
    const mountMatcher = match(route.mountPath.replace(escapeRegex,"\\$&"),{end:false});
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) yield {handler,params:matchResult.params,path:mountMatchResult.path};
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) continue;
    const routeMatcher = match(route.routePath.replace(escapeRegex,"\\$&"),{end:true});
    const mountMatcher = match(route.mountPath.replace(escapeRegex,"\\$&"),{end:false});
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) yield {handler,params:matchResult.params,path:matchResult.path};
      break;
    }
  }
}
var PASSWORD = "8888";
var COOKIE_NAME = "site_pw";
function checkAuth(request) {
  var url = new URL(request.url);
  if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|css|js|mp4|webm|pdf|docx)$/i)) return true;
  if (url.pathname.startsWith("/api/")) return true;
  if (url.pathname.startsWith("/flight-monitor") || url.pathname.startsWith("/spring-monitor") || url.pathname.startsWith("/thai-monitor")) return true;
  if (url.pathname === "/countdown.html" || url.pathname === "/countdown") return true;
  if (url.pathname.startsWith("/thailand/") || url.pathname === "/thailand") return true;
  if (url.searchParams.get("pw") === PASSWORD) return true;
  var cookie = request.headers.get("Cookie") || "";
  if (cookie.indexOf(COOKIE_NAME + "=" + PASSWORD) >= 0) return true;
  return false;
}
var LOGIN_PAGE = '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>验证</title><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a1a2e,#16213e);font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif}.box{background:#fff;border-radius:20px;padding:40px 36px;text-align:center;max-width:380px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.3)}h1{font-size:22px;color:#1a1a2e;margin-bottom:6px}p{font-size:14px;color:#666;margin-bottom:24px}.input-wrap{position:relative;margin-bottom:20px}input{width:100%;padding:14px 16px;border:2px solid #e0e0e0;border-radius:12px;font-size:18px;text-align:center;outline:none;box-sizing:border-box;letter-spacing:6px;font-weight:700}input:focus{border-color:#6c5ce7}button{width:100%;padding:14px;background:linear-gradient(135deg,#2d1b69,#6c5ce7);color:#fff;border:none;border-radius:12px;font-size:16px;font-weight:600;cursor:pointer}button:hover{opacity:.9}.error{color:#e53e3e;font-size:13px;margin-top:10px;display:none}</style></head><body><div class="box"><h1>🔐 请输入访问密码</h1><p>2026暑假 · 马来西亚亲子游</p><form method="GET"><div class="input-wrap"><input type="password" name="pw" placeholder="输入密码" autofocus></div><button type="submit">验证</button><div class="error" id="error">密码错误，请重试</div></form></div><script>var err=new URLSearchParams(location.search).get("error");if(err){document.getElementById("error").style.display="block"}</script></body></html>';
var GITHUB_RAW = "https://raw.githubusercontent.com/stevenzhu1982/family-trip-2026/master/site";
async function fetchFromGitHub(pathname) {
  var url = GITHUB_RAW + pathname;
  var resp = await fetch(url);
  if (!resp.ok) return null;
  var body = await resp.text();
  var ext = pathname.split('.').pop();
  var mime = { html: 'text/html', js: 'application/javascript', css: 'text/css', png: 'image/png', jpg: 'image/jpeg', svg: 'image/svg+xml', json: 'application/json', pdf: 'application/pdf', mp4: 'video/mp4', mp3: 'audio/mpeg', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
  return new Response(body, { headers: { 'Content-Type': (mime[ext] || 'text/plain') + ';charset=utf-8' } });
}
export default {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    if (!checkAuth(request)) {
      var url = new URL(request.url);
      var pw = url.searchParams.get("pw");
      if (pw === PASSWORD) {
        return new Response("", { status: 302, headers: { "Location": url.origin + url.pathname, "Set-Cookie": COOKIE_NAME + "=" + PASSWORD + "; Path=/; Max-Age=2592000; SameSite=Lax; Secure" } });
      }
      if (pw && pw !== PASSWORD) return new Response(LOGIN_PAGE.replace('style="display:none"','style="display:block"'), { headers: { "Content-Type": "text/html;charset=utf-8" } });
      return new Response(LOGIN_PAGE, { headers: { "Content-Type": "text/html;charset=utf-8" } });
    }
    var COOKIE_HEADER = COOKIE_NAME + "=" + PASSWORD + "; Path=/; Max-Age=2592000; SameSite=Lax; Secure";
    var _tvUrl = new URL(request.url);
    if (_tvUrl.pathname === "/TV" || _tvUrl.pathname === "/TV/") {
      _tvUrl.pathname = "/tv.html";
      request = new Request(_tvUrl, request);
    }
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = async (input, init) => {
      if (input !== void 0) {
        let u = input;
        if (typeof input === "string") u = new URL(input, request.url).toString();
        request = new Request(u, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = { request: new Request(request.clone()), functionPath: path, next, params, get data() { return data; }, set data(value) { if (typeof value !== "object" || value === null) throw new Error("context.data must be an object"); data = value; }, env, waitUntil: workerContext.waitUntil.bind(workerContext), passThroughOnException: () => { isFailOpen = true; } };
        const response = await handler(context);
        response.headers.append("Set-Cookie", COOKIE_HEADER);
        return _cloneResponse(response);
      } else if ("ASSETS") {
        var assetResp = await env["ASSETS"].fetch(request);
        if (assetResp.status === 404) {
          var ghResp = await fetchFromGitHub(new URL(request.url).pathname);
          if (ghResp) { ghResp.headers.append("Set-Cookie", COOKIE_HEADER); return ghResp; }
        }
        var respWithCookie = new Response(assetResp.body, assetResp);
        respWithCookie.headers.append("Set-Cookie", COOKIE_HEADER);
        return respWithCookie;
      } else {
        var fetchResp = await fetch(request);
        var respWithCookie2 = new Response(fetchResp.body, fetchResp);
        respWithCookie2.headers.append("Set-Cookie", COOKIE_HEADER);
        return respWithCookie2;
      }
    };
    try { return await next(); }
    catch (error) { if (isFailOpen) { const response = await env["ASSETS"].fetch(request); return _cloneResponse(response); } throw error; }
  }
};
var _cloneResponse = (response) => new Response([101,204,205,304].includes(response.status) ? null : response.body, response);
