// when the extension is first installed
chrome.runtime.onInstalled.addListener(function(details) {
    //console.log('installed!');
    chrome.storage.local.set({'lh_is_enabled': true});
});
// Listen for any changes to the URL of any tab.
// see: http://developer.chrome.com/extensions/tabs.html#event-onUpdated
/*chrome.tabs.onUpdated.addListener(function(id, info, tab){
    // decide if we're ready to inject content script
    if (tab.status !== 'complete'){
        console.log('not yet');
        return;
    }
    chrome.storage.local.get('lh_is_enabled', function(items) {
        var lh_is_enabled = ('lh_is_enabled' in items) ? items['lh_is_enabled'] : false;
        if (lh_is_enabled){
            console.log('enabled!');
        } else {
            console.log('disabled!');
        }
    });
    

});*/