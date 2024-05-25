'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "63f2bb214c9257250b9b1f61f7d3a766",
"version.json": "212ca3f584cd06aa250de8dba7cc4d28",
"index.html": "695527f7ecb608f44f70cffa73e64923",
"/": "695527f7ecb608f44f70cffa73e64923",
"main.dart.js": "d9d5b3c5781cd7c1e339bc5cb6f751ea",
"flutter.js": "383e55f7f3cce5be08fcf1f3881f585c",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "42047d172bafe9494556bf3db01324b4",
"assets/AssetManifest.json": "d3f64c772c531c34e0121c3e849adf89",
"assets/NOTICES": "bf9368f81010e499d011f64f2c465076",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/AssetManifest.bin.json": "65b3f8e4fde9abf3b31722c1388c3cbc",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "ef6b3c89058dc8e924b35868bc0b3f15",
"assets/fonts/MaterialIcons-Regular.otf": "a288c947be76a583c1626a7df7903ade",
"assets/assets/river.jpg": "26a20cd1da2fd5d893f857fea07ebce7",
"assets/assets/images/TASIHome.jpg": "fb893592cae64cadd4bed569c304ecb0",
"assets/assets/images/inprogress.jpg": "eea0990d58e6f558ddddd975431a1e25",
"assets/assets/images/ashok.jpg": "712e03419d10e1cdabee6713a2fb5372",
"assets/assets/images/bottom1.png": "6b84f28383721d9658f43202fc05df65",
"assets/assets/images/top2.png": "5ba82c2d5a07482a351172f7b5ebcfb7",
"assets/assets/images/bottom2.png": "d75870ab4305146f8f4098192422a4d2",
"assets/assets/images/tasi_group3_mob.jpg": "16c1dc51ee47139372cae014955a54ca",
"assets/assets/images/top1.png": "b080bce9f5b1ea61f79200807d3d154d",
"assets/assets/images/tasi_group2_mob.jpg": "6333f3ac6134578b0082c1566970aae6",
"assets/assets/images/inprogress_mob.jpg": "87782b41656ac17e91c6e2cd16c6ac19",
"assets/assets/images/tasi_group1.jpg": "2f096c61a6fe78e9df338911ee214e09",
"assets/assets/images/tasi_group2.jpg": "451d0028cec861f4eff40de06f2ab426",
"assets/assets/images/tasi_group3.jpg": "5b315a81915197aa753c919ec8f59f27",
"assets/assets/images/tasi_group1_mob.jpg": "9aefd91ade1fd4c4d104e997f55c0153",
"assets/assets/forest.png": "8e858215f55a6f0b5460f8c07f15838b",
"assets/assets/navbar-bg.jpg": "cf1208b9a2091151d399e3b350d64cc2",
"assets/assets/tasi.jpg": "f0aad54160faf2651d7db0b3f003b878",
"assets/assets/sea.jpg": "77159a74af8c3991425bf8b86fefe091",
"assets/assets/header-bg.jpg": "7d69a29fff23bf0b231f34ba96d188a9",
"canvaskit/skwasm.js": "f17a293d422e2c0b3a04962e68236cc2",
"canvaskit/skwasm.js.symbols": "415b8dbcd170b4ca5080721520437111",
"canvaskit/canvaskit.js.symbols": "b1d839d2c52ffd664f59d23efba38e16",
"canvaskit/skwasm.wasm": "73748440750366cea9cfa5a69e13b476",
"canvaskit/chromium/canvaskit.js.symbols": "e3cf8e0ba4d48cd7e3218c7689943a9a",
"canvaskit/chromium/canvaskit.js": "87325e67bf77a9b483250e1fb1b54677",
"canvaskit/chromium/canvaskit.wasm": "2b520c8ad6199d8c037652a81928f8d5",
"canvaskit/canvaskit.js": "5fda3f1af7d6433d53b24083e2219fa0",
"canvaskit/canvaskit.wasm": "45863d75c14f508cbb4e24f13edd6050",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
