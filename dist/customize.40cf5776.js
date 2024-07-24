// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"scripts/customize.js":[function(require,module,exports) {
document.addEventListener('DOMContentLoaded', function () {
  var primaryFrostingInput = document.getElementById('primary-frosting');
  var secondaryFrostingInput = document.getElementById('secondary-frosting');
  var primaryColorDisplay = document.getElementById('primary-color-display');
  var secondaryColorDisplay = document.getElementById('secondary-color-display');
  var primaryColorRGB = document.getElementById('primary-color-rgb');
  var secondaryColorRGB = document.getElementById('secondary-color-rgb');
  var cakeBaseSelect = document.getElementById('cake-base');
  var pokeballSelect = document.getElementById('pokeball');
  var fontSelect = document.getElementById('font');
  var messageShort = document.getElementById('message-short');
  var messageLong = document.getElementById('message-long');
  var previewButton = document.getElementById('preview-button');
  var purchaseButton = document.getElementById('purchase-button');
  var messagePreview = document.getElementById('message-preview');
  var form = document.getElementById('custom-cake-form');
  var totalPriceDiv = document.getElementById('total-price');
  var messageLengthRadios = document.getElementsByName('message-length');
  var pokemonSearch = document.getElementById('pokemon-search');
  var pokemonList = document.getElementById('pokemon-list');
  var pokemonTypeSelect = document.getElementById('pokemon-type');
  var pokemonImageContainer = document.getElementById('pokemon-image-container');
  var pokemonStampCheckboxes = document.querySelectorAll('#pokemon-stamp input[type="checkbox"]');
  var allPokemon = [];
  fetch('https://pokeapi.co/api/v2/type').then(function (response) {
    return response.json();
  }).then(function (data) {
    data.results.forEach(function (type) {
      var option = document.createElement('option');
      option.value = type.name;
      option.textContent = type.name.charAt(0).toUpperCase() + type.name.slice(1);
      pokemonTypeSelect.appendChild(option);
    });
  }).catch(function (error) {
    return console.error('Error fetching Pokémon types:', error);
  });
  fetch('https://pokeapi.co/api/v2/pokemon?limit=151').then(function (response) {
    return response.json();
  }).then(function (data) {
    var promises = data.results.map(function (pokemon) {
      return fetch(pokemon.url).then(function (res) {
        return res.json();
      });
    });
    Promise.all(promises).then(function (pokemonData) {
      allPokemon = pokemonData;
      updatePokemonList(allPokemon);
    });
  }).catch(function (error) {
    return console.error('Error fetching Pokémon:', error);
  });
  function updatePokemonList(pokemon) {
    pokemonList.innerHTML = '';
    pokemon.forEach(function (p) {
      var option = document.createElement('option');
      option.value = p.name;
      option.textContent = p.name.charAt(0).toUpperCase() + p.name.slice(1);
      option.dataset.url = p.sprites.front_default;
      pokemonList.appendChild(option);
    });
  }
  function displayPokemonImage(pokemon) {
    pokemonImageContainer.innerHTML = "<img src=\"".concat(pokemon.sprites.front_default, "\" alt=\"").concat(pokemon.name, "\">");
  }
  function filterPokemon() {
    var filteredPokemon = allPokemon;
    var searchQuery = pokemonSearch.value.toLowerCase().trim();
    if (searchQuery) {
      filteredPokemon = filteredPokemon.filter(function (p) {
        return p.name.includes(searchQuery);
      });
    }
    var selectedTypes = Array.from(pokemonTypeSelect.selectedOptions).map(function (option) {
      return option.value;
    });
    if (selectedTypes.length > 0) {
      filteredPokemon = filteredPokemon.filter(function (p) {
        return selectedTypes.every(function (type) {
          return p.types.some(function (t) {
            return t.type.name === type;
          });
        });
      });
    }
    updatePokemonList(filteredPokemon);
  }
  function updateColorDisplay() {
    primaryColorDisplay.style.backgroundColor = primaryFrostingInput.value;
    primaryColorRGB.textContent = primaryFrostingInput.value;
    secondaryColorDisplay.style.backgroundColor = secondaryFrostingInput.value;
    secondaryColorRGB.textContent = secondaryFrostingInput.value;
  }
  pokemonSearch.addEventListener('input', filterPokemon);
  pokemonTypeSelect.addEventListener('change', filterPokemon);
  pokemonList.addEventListener('change', function () {
    var selectedPokemon = pokemonList.value;
    var selectedPokemonData = allPokemon.find(function (p) {
      return p.name === selectedPokemon;
    });
    displayPokemonImage(selectedPokemonData);
  });
  primaryFrostingInput.addEventListener('input', updateColorDisplay);
  secondaryFrostingInput.addEventListener('input', updateColorDisplay);

  // Initial color display update
  updateColorDisplay();
  function calculateTotalPrice() {
    var totalPrice = 0;
    var selectedCakeBase = cakeBaseSelect.options[cakeBaseSelect.selectedIndex];
    var selectedPokeball = pokeballSelect.options[pokeballSelect.selectedIndex];
    var selectedPokemonStamps = Array.from(pokemonStampCheckboxes).filter(function (cb) {
      return cb.checked;
    });
    totalPrice += parseFloat(selectedCakeBase.dataset.price);
    totalPrice += parseFloat(selectedPokeball.dataset.price);
    selectedPokemonStamps.forEach(function (stamp) {
      totalPrice += parseFloat(stamp.dataset.price);
    });
    var message = getCurrentMessage().replace(/_/g, '');
    if (message.length > 20) {
      totalPrice += message.length - 20; // $1 per letter after the first 20 characters
    }
    totalPriceDiv.textContent = "Total Price: $".concat(totalPrice);
  }
  function getCurrentMessage() {
    return messageShort.style.display === 'none' ? messageLong.value : messageShort.value;
  }
  function formatMessage(text, maxLineLength) {
    var lines = [];
    var line = '';
    for (var i = 0; i < text.length; i++) {
      if (text[i] === '_') {
        lines.push(line);
        line = '';
      } else {
        if (line.length >= maxLineLength) {
          lines.push(line);
          line = '';
        }
        line += text[i];
      }
    }
    if (line.length > 0) lines.push(line);
    return lines.join('_');
  }
  function handleInput(event) {
    var maxLineLength = event.target.id === 'message-short' ? 15 : 20;
    var formattedMessage = formatMessage(event.target.value, maxLineLength);
    event.target.value = formattedMessage;
  }
  function previewMessage() {
    var message = getCurrentMessage().replace(/_/g, '\n');
    messagePreview.innerHTML = "<pre style=\"font-family: ".concat(fontSelect.value, ";\">").concat(message, "</pre>");
  }
  messageLengthRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (radio.value === 'short') {
        messageShort.style.display = 'block';
        messageLong.style.display = 'none';
      } else {
        messageShort.style.display = 'none';
        messageLong.style.display = 'block';
      }
      calculateTotalPrice();
    });
  });
  messageShort.addEventListener('input', handleInput);
  messageLong.addEventListener('input', handleInput);
  form.addEventListener('change', calculateTotalPrice);
  previewButton.addEventListener('click', function () {
    previewMessage();
    calculateTotalPrice();
  });
  purchaseButton.addEventListener('click', function () {
    var message = getCurrentMessage();
    if (message.length > 50) {
      var confirmPurchase = confirm('You have exceeded the recommended text length. Do you agree to proceed?');
      if (!confirmPurchase) {
        return;
      }
    }
    alert('Purchase complete!');
    // Handle the purchase action here
  });
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    alert('Custom cake saved!');
    // Save the custom cake details to localStorage or handle submission here
  });
  calculateTotalPrice(); // Initial calculation
});
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60597" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","scripts/customize.js"], null)
//# sourceMappingURL=/customize.40cf5776.js.map