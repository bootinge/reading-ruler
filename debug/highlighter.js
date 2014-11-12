//---------------------------------------------------------------------
// (C) Copyright 2014 Denison Linus
//
// Author: Denison Linus
// Email: dlmtavar@gmail.com
//
//---------------------------------------------------------------------

var highlighter = {
	
    ExtentionsEnabled: false,
    Enabled: false,
    Elements: ':header, p, pre',
    HightlighterID: 'highlighter',
    Opacity: 0.2,
    MaxZIndex: 2147483647,
	
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
                //'width': '100%',
                'background-color': 'yellow',
                'opacity': this.Opacity,
                'z-index': this.MaxZIndex,
                'box-shadow': 'black 0px 0px 15px',
                'border-radius': '25px'
            })
            .hide()
            .appendTo(document.body);
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
		function debouncer( func , timeout ) {
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
            var hash = 0;
                if (str.length == 0) return hash;
                for (i = 0; i < str.length; i++) {
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
                styles = {font: all.font}
                hash = hashKey(JSON.stringify(styles))
            ;
            if(!(hash in this.cache)) {
                for(key in styles) {
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
                all = null
            ;

            for(i = 0; i < Items.length; i++) {
                
                //rect = Items[i].getClientRects()[0];
                rect = Items[i].getBoundingClientRect();
                
                //addClientRectsOverlay(Items[i]);
                
                if(rect) {
                    all = window.getComputedStyle(Items[i]),
                    paddingTop = parseFloat(all.paddingTop.replace('px', ''));
                    paddingBottom = parseFloat(all.paddingBottom.replace('px', ''));
                    height = textHeight(Items[i]);
                    width = rect.width;
                    left = rect.left + scrollLeft;
                    //N = Math.ceil(rect.height / height);
                    N = Math.round((rect.height-(paddingTop+paddingBottom)) / height, 0);
                    for(j = 0; j < N; j++) {
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
            if(!self.Enabled || !self.ExtentionsEnabled) {
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
            if(bottom > scrollTop+scrollHeight) {
                scrollPage(top - 50);
            } else {
                if(top < scrollTop) {
                    scrollPage(top - scrollHeight + 50);
                }
            }
        };

		
        $(window).on('resize', debouncer(function() {
            //hideHighLighter();
			var lastIndex = Index[I].i,
                percent = Index[I].j / Index[I].n,
                i = 0
            ;
			makeIndex();
			for(i = 0; i < Index.length; i++) {
				if(Index[i].i === lastIndex) {
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
                I_ = -1,
                $this = $(this)[0],
                rect = null,
                percent = 0.0
            ;
            //I = 0;
            self.start();
            for(i = 0; i < Items.length; i++) {
                if(Items[i] == $this) {
                    x = i;
                    break;
                }
            }
            if(x > -1) {
                //rect = Items[x].getClientRects()[0];
                rect = Items[x].getBoundingClientRect();
                if(rect) {
                    percent = (e.clientY-rect.top)/rect.height;
                    for(i = 0; i < Index.length; i++) {
                        if(Index[i].i === x) {
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


function startHighlighter() {
    if(!this.Created) {
        highlighter.create();
        this.Created = true;
    }
    highlighter.setExtentionsEnabled(true);
    //highlighter.start();
    highlighter.stop();
}
function stopHighlighter() {
	highlighter.setExtentionsEnabled(false);
    highlighter.stop();
}

;(function($, window, document, undefined) {

    $(document).ready(function() {
    
        chrome.storage.local.get('lh_is_enabled', function(items) {
            var lh_is_enabled = ('lh_is_enabled' in items) ? items['lh_is_enabled'] : false;
            if (lh_is_enabled){
                startHighlighter();
            } else {
                stopHighlighter();
            }
        });
        
        chrome.storage.onChanged.addListener(function(changes, namespace) {
            var lh_is_enabled = ('lh_is_enabled' in changes) ? changes['lh_is_enabled'] : false;
            if(lh_is_enabled.newValue) {
                startHighlighter();
            } else {
                stopHighlighter();
            }
        });        
    
    });

})(window.jQuery, window, document);
