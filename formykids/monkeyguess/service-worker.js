"use strict";var precacheConfig=[["./index.html","47f42912af90ca0a1f238670dab6563d"],["./static/css/main.b95e86b0.css","9efa9fd14d4d5ec4d88405d06fa0ef98"],["./static/js/main.2cbe7284.js","065d160ff2b304d1a79b1346731e70f3"],["./static/media/0.4b8f2e31.png","4b8f2e31db1e93e4dbea6582b4ed6bbd"],["./static/media/4.96e8f6fd.png","96e8f6fd7c1031dc190c271984ae0704"],["./static/media/5.7f1df7e4.png","7f1df7e4580ca6046ab681ed99243bf4"],["./static/media/6.56887360.png","568873604fdbb75182b5153c9641492b"],["./static/media/8.f12c1223.png","f12c1223d99eeb41aac9dadb0462d8ff"],["./static/media/9.42d865c3.png","42d865c346e34f9eb786522ebb600f64"],["./static/media/autoq.beac22c9.png","beac22c9f6bce1655a6f9b2bce8d2d71"],["./static/media/bg.ef9f5aef.png","ef9f5aef298ac349354f681514cfb8e9"],["./static/media/box.4622a619.png","4622a619b7b81a1d93a90369686b449a"],["./static/media/box_blur.a8b7054e.png","a8b7054e97ce83215258f2d53210fedb"],["./static/media/cross.570e3656.svg","570e3656bf8a75977b2e1029102aa676"],["./static/media/guess.df683b6e.png","df683b6e7cb9197379f841d57eb16ece"],["./static/media/info.46161d43.svg","46161d434903b705cf51217a259e488c"],["./static/media/q.c482608d.png","c482608db94f8feaaa181a4f8d415367"],["./static/media/restart.b6247159.png","b6247159487eb0521b25f6638bb1edfe"],["./static/media/start.7ced5d9c.png","7ced5d9cf87c576f9e6f8cc6483c893d"],["./static/media/success.2efe96ac.png","2efe96ac312d6deff7f186d2fd85f487"],["./static/media/title.787ad30f.png","787ad30f94f29876bdae48a7523d2547"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var a=new URL(e);return"/"===a.pathname.slice(-1)&&(a.pathname+=t),a.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(t){return new Response(t,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,t,a,n){var r=new URL(e);return n&&r.pathname.match(n)||(r.search+=(r.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(a)),r.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var a=new URL(t).pathname;return e.some(function(e){return a.match(e)})},stripIgnoredUrlParameters=function(e,t){var a=new URL(e);return a.hash="",a.search=a.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return t.every(function(t){return!t.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),a.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],a=e[1],n=new URL(t,self.location),r=createCacheKey(n,hashParamName,a,/\.\w{8}\./);return[n.toString(),r]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(a){if(!t.has(a)){var n=new Request(a,{credentials:"same-origin"});return fetch(n).then(function(t){if(!t.ok)throw new Error("Request for "+a+" returned a response with status "+t.status);return cleanResponse(t).then(function(t){return e.put(a,t)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(a){return Promise.all(a.map(function(a){if(!t.has(a.url))return e.delete(a)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var t,a=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching),n="index.html";(t=urlsToCacheKeys.has(a))||(a=addDirectoryIndex(a,n),t=urlsToCacheKeys.has(a));var r="./index.html";!t&&"navigate"===e.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],e.request.url)&&(a=new URL(r,self.location).toString(),t=urlsToCacheKeys.has(a)),t&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(a)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(t){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,t),fetch(e.request)}))}});