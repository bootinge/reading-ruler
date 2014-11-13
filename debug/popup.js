//---------------------------------------------------------------------
// (C) Copyright 2014 Denison Linus
//
// Author: Denison Linus
// Email: dlmtavar@gmail.com
//
//---------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    
    var
        input_enabled = document.getElementById('hl-form-enabled'),
        input_color = document.getElementById('hl-form-color'),
        input_opacity = document.getElementById('hl-form-opacity'),
        input_shadow = document.getElementById('hl-form-shadow')
    ;
    
    // set the initial state of the widgets
    chrome.storage.local.get([
        'hlEnabled',
        'hlColor',
        'hlOpacity',
        'hlShadow'
    ], function(items) {
        input_enabled.checked = items.hlEnabled ? true : false;
        input_color.value = items.hlColor ? items.hlColor : '#ffff00';
        input_opacity.value = items.hlOpacity ? items.hlOpacity : '20';
        input_shadow.checked = items.hlShadow ? true : false;
    });

    // widgets events
    input_enabled.addEventListener('change', function(e){
        chrome.storage.local.set({'hlEnabled': this.checked});
    });
    input_color.addEventListener('change', function(e){
        chrome.storage.local.set({'hlColor': this.value});
    });
    input_opacity.addEventListener('change', function(e){
        chrome.storage.local.set({'hlOpacity': this.value});
    });
    input_shadow.addEventListener('change', function(e){
        chrome.storage.local.set({'hlShadow': this.checked});
    });
    
    
});
