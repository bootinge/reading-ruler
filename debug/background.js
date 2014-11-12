//---------------------------------------------------------------------
// (C) Copyright 2014 Denison Linus
//
// Author: Denison Linus
// Email: dlmtavar@gmail.com
//
//---------------------------------------------------------------------

// when the extension is first installed
chrome.runtime.onInstalled.addListener(function(details) {
    
    chrome.storage.local.set({'lh_is_enabled': true});
    
});
