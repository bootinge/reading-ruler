//---------------------------------------------------------------------
// (C) Copyright 2014 Denison Linus
//
// Author: Denison Linus
// Email: dlmtavar@gmail.com
//
//---------------------------------------------------------------------

var Highlighter = {
	
    ExtentionsEnabled: false,
    Enabled: false,
    Elements: ':header, p, pre',
    HightlighterID: 'highlighter',
    Color: '#ffff00',
    Opacity: 0.2,
    Shadow: 'black 0px 0px 15px',
    MaxZIndex: 2147483647,
	
    updateHighLighter: function() {
        $('#'+this.HightlighterID).css({
            'background-color': this.Color,
            'opacity': this.Opacity,
            'box-shadow': this.Shadow,
        });
    },
    hideHighLighter: function() {
        $('#'+this.HightlighterID).hide();
    },
    showHighLighter: function(top, left, height, width) {
        $('#'+this.HightlighterID).css({
            'top': top,
            'left': left-5,
            'height': height,
            'width': width+10,
        }).show();        
    },
    createHighLighter: function() {
        $('<div>')
            .attr('id', this.HightlighterID)
            .css({
                'position': 'absolute',
                'border-radius': '25px',
                'z-index': this.MaxZIndex,
                'background-color': this.Color,
                'opacity': this.Opacity,
                'box-shadow': this.Shadow,
            })
            .hide()
            .appendTo(document.body)
        ;
    },
    setColor: function(color) {
        this.Color = color;
        this.updateHighLighter();
    },
    setOpacity: function(opacity) {
        this.Opacity = opacity;
        this.updateHighLighter();
    },
    setShadow: function(shadow) {
        this.Shadow = shadow;
        this.updateHighLighter();
    },
    setExtentionsEnabled: function(value) {
        this.ExtentionsEnabled = value;
    },
    stop: function() {
        this.Enabled = false;
        this.hideHighLighter();
    },
    start: function() {
        this.Enabled = true;
    },
    create: function() {
        var self = this,
            Index = [],
            Items = [],
            I = 0
        ;
        var debouncer = function( func , timeout ) {
            var timeoutID,
                timeout = timeout || 200
            ;
            return function () {
                var scope = this,
                    args = arguments
                ;
                clearTimeout(timeoutID);
                timeoutID = setTimeout(function () {
                    func.apply(scope, Array.prototype.slice.call( args ));
                }, timeout);
            }
        };
        var hashKey = function(str) {
            //http://erlycoder.com/49/javascript-hash-functions-to-convert-string-into-integer-hash-
            var hash = 0,
                char = 0
            ;
            if (str.length === 0) return hash;
            for (var i = 0, j = str.length; i < j; i++) {
                char = str.charCodeAt(i);
                hash = ((hash<<5)-hash)+char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return hash;
        };
        var clamp = function (low, high, value) {
            return Math.min(Math.max(value,low), high);
        };        
        var textHeight = function(ele) {
            if (!this.$fake) {
                this.$fake = $('<span>').hide().text('x').appendTo(document.body);
                this.cache = {};
            }
            var all = window.getComputedStyle(ele),
                styles = {font: all.font},
                hash = hashKey(JSON.stringify(styles))
            ;
            if(!(hash in this.cache)) {
                for (key in styles) {
                    this.$fake[0].style[key] = styles[key];
                }
                this.cache[hash] = this.$fake.height();
            }
            return this.cache[hash];
        };
        var createItems = function() {
            Items = $(document).find(self.Elements);
            Items = Items.filter(function(i, e) {
                return $(e).text().trim().length > 0;
            });
        };
        /*var addClientRectsOverlay = function(elt) {
            // Absolutely position a div over each client rect so that its border width
            // is the same as the rectangle's width.
            // Note: the overlays will be out of place if the user resizes or zooms.
            var rects = elt.getClientRects();
            for (var i = 0; i != rects.length; i++) {
                var rect = rects[i];
                var tableRectDiv = document.createElement('div');
                tableRectDiv.style.position = 'absolute';
                tableRectDiv.style.border = '1px solid red';
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
                tableRectDiv.style.margin = tableRectDiv.style.padding = '0';
                tableRectDiv.style.top = (rect.top + scrollTop) + 'px';
                tableRectDiv.style.left = (rect.left + scrollLeft) + 'px';
                // we want rect.width to be the border width, so content width is 2px less.
                tableRectDiv.style.width = (rect.width - 2) + 'px';
                tableRectDiv.style.height = (rect.height - 2) + 'px';
                tableRectDiv.style.zIndex = -1;
                document.body.appendChild(tableRectDiv);
            }
        };*/
        var makeIndex = function() {
            var index = [],
                scrollTop = $(window).scrollTop(),
                scrollLeft = $(window).scrollLeft(),
                N = 0,
                top = 0,
                left = 0,
                height = 0,
                width = 0,
                rect = null,
                paddingTop = 0,
                marginTopBottom = 0,
                i = 0,
                j = 0,
                len = 0,
                all = null
            ;
            for (i = 0, len = Items.length; i < len; i++) {
                //rect = Items[i].getClientRects()[0];
                rect = Items[i].getBoundingClientRect();
                //addClientRectsOverlay(Items[i]);
                if (rect) {
                    all = window.getComputedStyle(Items[i]),
                    paddingTop = parseFloat(all.paddingTop.replace('px', ''));
                    paddingBottom = parseFloat(all.paddingBottom.replace('px', ''));
                    height = textHeight(Items[i]);
                    width = rect.width;
                    left = rect.left + scrollLeft;
                    //N = Math.ceil(rect.height / height);
                    N = Math.round((rect.height-(paddingTop+paddingBottom)) / height, 0);
                    for (j = 0; j < N; j++) {
                        top = rect.top + paddingTop + scrollTop + (height * j);
                        index.push({i:i, j:j, n:N, top:top, left:left, height:height, width:width});
                    }
                }
            }
            Index = index;
        };
        var scrollPage = function(top) {
            $('html,body').animate({'scrollTop' : top}, 200);
            //window.scrollTo(0,top);
        };
        var moveElement = function(inc) {
            if (!self.Enabled || !self.ExtentionsEnabled) {
                return;
            }
            self.hideHighLighter();
            I = clamp(0, Index.length-1, I+inc);
            self.showHighLighter(Index[I].top, Index[I].left, Index[I].height, Index[I].width);
            var scrollTop = $(document).scrollTop(),
                //scrollHeight = $(window).height(),
                scrollHeight = $(window)[0].innerHeight,
                top = Math.floor(Index[I].top),
                bottom = Math.ceil(Index[I].top+Index[I].height)
            ;
            if (bottom > scrollTop+scrollHeight) {
                scrollPage(top - 50);
            } else {
                if (top < scrollTop) {
                    scrollPage(top - scrollHeight + 50);
                }
            }
        };

        $(window).on('resize', debouncer(function() {
            //hideHighLighter();
            var lastIndex = Index[I].i,
                percent = Index[I].j / Index[I].n,
                i = 0,
                len = 0
            ;
            makeIndex();
            for (i = 0, len = Index.length; i < len; i++) {
                if (Index[i].i === lastIndex) {
                    I = i + Math.round(percent*Index[i].n, 0);
                    break;
                }
            }
            moveElement(0);
        }, 200));
        
        $(document).on('keydown', function (e) {
            var keyCode = e.keyCode || e.which;
            switch(keyCode) {
                case 27:
                    self.stop()
                    break;
                case 38:
                    moveElement(-1);
                    break;
                case 40:
                    moveElement(+1);
                    break;
                default:
                    return;
            };
            if(self.Enabled && self.ExtentionsEnabled) {
                e.preventDefault(); 
            }
        });
        $(document).on('dblclick', '#'+self.HightlighterID, function(e) {
            //e.preventDefault(); 
            //e.stopPropagation();
            self.stop();
        });
        $(document).on('dblclick', self.Elements, function(e) {
            var x = -1,
                i = 0,
                len = 0,
                I_ = -1,
                $this = $(this)[0],
                rect = null,
                percent = 0.0
            ;
            //I = 0;
            self.start();
            for (i = 0, len = Items.length; i < len; i++) {
                if (Items[i] == $this) {
                    x = i;
                    break;
                }
            }
            if (x > -1) {
                //rect = Items[x].getClientRects()[0];
                rect = Items[x].getBoundingClientRect();
                if (rect) {
                    percent = (e.clientY-rect.top)/rect.height;
                    for (i = 0, len = Index.length; i < len; i++) {
                        if (Index[i].i === x) {
                            I_ = i + Math.floor(percent*Index[i].n);
                            break;
                        }
                    }
                    /*if(I_ == I) {
                    //
                    self.stop()
                    } else {
                    I = I_;
                    moveElement(0);
                    }*/
                    I = I_;
                    moveElement(0);
                }
            }
        });
        
        self.createHighLighter();
        createItems();
        makeIndex();
        //moveElement(0);
    }
};

function HighlighterStart() {
    if (!this.Created) {
        Highlighter.create();
        this.Created = true;
    }
    Highlighter.setExtentionsEnabled(true);
    //highlighter.start();
    Highlighter.stop();
}
function HighlighterStop() {
    Highlighter.setExtentionsEnabled(false);
    Highlighter.stop();
}
function HighlighterColor(color) {
    Highlighter.setColor(color);
}
function HighlighterOpacity(opacity) {
    Highlighter.setOpacity(opacity / 100.0);
}
function HighlighterShadow(shadow) {
    Highlighter.setShadow(shadow ? 'black 0px 0px 15px' : 'none');
}

//-----------------------------------------------------------------------------
;(function($, window, document, undefined) {

    $(document).ready(function() {
    
        chrome.storage.local.get([
            'hlEnabled',
            'hlColor',
            'hlOpacity',
            'hlShadow'
        ], function(items) {
            if (items.hlEnabled) {
                HighlighterStart();
            } else {
                HighlighterStop();
            }
            if (items.hlColor) {
                HighlighterColor(items.hlColor);
            }
            if (items.hlOpacity) {
                HighlighterOpacity(items.hlOpacity);
            }             
            if (items.hlShadow) {
                HighlighterShadow(true);
            } else {
                HighlighterShadow(false);
            }              
        });
        chrome.storage.onChanged.addListener(function(changes, namespace) {
            if (changes.hlEnabled) {
                if(changes.hlEnabled.newValue) {
                    HighlighterStart();
                } else {
                    HighlighterStop();
                }
            }
            if (changes.hlColor) {
                if(changes.hlColor.newValue) {
                    HighlighterColor(changes.hlColor.newValue);
                }
            }
            if (changes.hlOpacity) {
                if(changes.hlOpacity.newValue) {
                    HighlighterOpacity(changes.hlOpacity.newValue);
                }
            }             
            if (changes.hlShadow) {
                if(changes.hlShadow.newValue) {
                    HighlighterShadow(true);
                } else {
                    HighlighterShadow(false);
                }
            }        
        });
        
    });

})(window.jQuery, window, document);
