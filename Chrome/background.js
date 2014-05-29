function checkForValidUrl(tabIdd, changeInfo, tab) {

   var a = document.createElement ('a');
   a.href = tab.url;
   if (a.hostname == "audiotool.com" || a.hostname == "www.audiotool.com" ) {
       // ... show the page action.
	   chrome.pageAction.setIcon({path: "icon38.png",
	                             tabId: tabIdd});
       chrome.pageAction.show(tabIdd);
	   chrome.tabs.executeScript(tabIdd, {file: 'Leaf.js'});
   }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
//For highlighted tab as well
chrome.tabs.onHighlighted.addListener(checkForValidUrl);