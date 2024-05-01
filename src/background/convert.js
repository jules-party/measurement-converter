var convert = require('convert-units');

const contextMenuItem = {
	"id": "mcParent",
	"title": "Convert Measurement",
	"contexts": ["selection"]
};

function convertMeasurement(number, from, to) {
	var num = Number(number);
	if(!isNaN(num)) {
		var result = convert(num).from(from).to(to);
		result = Number(result.toFixed(2));
		chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, {action: 'measurementConverter', msg: `${result}${to}`});
		});
	}
}

Object.defineProperty(String.prototype, 'capitalize', {
  value: function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false
});

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create(contextMenuItem);
	const categories = convert().measures();
	categories.forEach((c) => {
		chrome.contextMenus.create({
			title: c.capitalize(),
			contexts: ["selection"],
			parentId: "mcParent",
			id: c
		});
		const measurements = convert().possibilities(c);
		measurements.forEach((m) => {
			chrome.contextMenus.create({
				title: m,
				contexts: ["selection"],
				parentId: c,
				id: m
			});
			var stripped = measurements.filter(e => e !== m);
			stripped.forEach((s) => {
				chrome.contextMenus.create({
					title: s,
					contexts: ["selection"],
					parentId: m,
					id: `${m}_${s}`
				});
			});
		});
	});
});

chrome.contextMenus.onClicked.addListener((clickData) => {
	convertMeasurement(clickData.selectionText, clickData.parentMenuItemId, clickData.menuItemId.split('_')[1]);
});

/*chrome.tabs.onActivated.addListener((tab) => {
	chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, {msg: "test"});
	});
});*/
