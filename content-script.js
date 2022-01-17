var script = document.createElement("script");
script.src = chrome.runtime.getURL("rankings-enhance.js");
document.documentElement.appendChild(script);
