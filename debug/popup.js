//---------------------------------------------------------------------
// (C) Copyright 2014 Denison Linus
//
// Author: Denison Linus
// Email: dlmtavar@gmail.com
//
//---------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    // set the initial state of the checkbox
    var input = document.getElementById('lh-form-checkbox');
    chrome.storage.local.get('lh_is_enabled', function(items) {
        var lh_is_enabled = ('lh_is_enabled' in items) ? items['lh_is_enabled'] : false;
        if(lh_is_enabled){
            input.checked = true;
        } else {
            input.checked = false;
        }
    });
    input.addEventListener('change', function(){
        chrome.storage.local.set({'lh_is_enabled': input.checked});
    });  
  
});
