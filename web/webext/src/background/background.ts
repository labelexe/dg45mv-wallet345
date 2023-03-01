/**
 * Copyright 2022, Yoshi Jaeger at DigiCorp Labs
 */

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.executeScript({
    file: "./main.js",
  });
});
