;(function (window) {
    'use strict';
    var document = window.document,
        docElem = document.documentElement;

    function extend(a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }

    function getViewportH() {
        var client = docElem['clientHeight'],
            inner = window['innerHeight'];
        if (client < inner)
            return inner;
        else
            return client;
    }

    function getOffset(el) {
        return el.getBoundingClientRect();
    }

    function isMouseLeaveOrEnter(e, handler) {
        if (e.type != 'mouseout' && e.type != 'mouseover') return false;
        var reltg = e.relatedTarget ? e.relatedTarget :
            e.type == 'mouseout' ? e.toElement : e.fromElement;
        while (reltg && reltg != handler) reltg = reltg.parentNode;
        return (reltg != handler);
    }

    function cbpTooltipMenu(el, options) {
        this.el = el;
        this.options = extend(this.defaults, options);
        this._init();
    }

    cbpTooltipMenu.prototype = {
        defaults: {// add a timeout to avoid the menu to open instantly
            delayMenu: 100
        },

        _init: function () {
            this.touch = Modernizr.touch;
            this.menuItems = document.querySelectorAll('#' + this.el.id + ' > li');
            this._initEvents();
        },

        _initEvents: function () {

            var self = this;

            Array.prototype.slice.call(this.menuItems).forEach(function (el, i) {
                var trigger = el.querySelector('a');
                if (self.touch) {
                    trigger.addEventListener('click', function (ev) {
                        self._handleClick(this, ev);
                    });
                }
                else {
                    trigger.addEventListener('click', function (ev) {
                        if (this.parentNode.querySelector('ul.cbp-tm-submenu')) {
                            ev.preventDefault();
                        }
                    });
                    el.addEventListener('mouseover', function (ev) {
                        if (isMouseLeaveOrEnter(ev, this)) self._openMenu(this);
                    });
                    el.addEventListener('mouseout', function (ev) {
                        if (isMouseLeaveOrEnter(ev, this)) self._closeMenu(this);
                    });
                }
            });
        },

        _openMenu: function (el) {

            var self = this;
            clearTimeout(this.omtimeout);

            this.omtimeout = setTimeout(function () {
                    // var submenu_third = el.querySelector('ul.cbp-tm-submenu.rido_third_ul');
                    var submenu = el.querySelector('ul.cbp-tm-submenu');

                    if (submenu) {
                        el.className = 'cbp-tm-show';
                        el.className += ' cbp-tm-show-below';
                    }
                    // if (submenu_third) {
                    //     el.className = 'cbp-tm-show';
                    //     el.className += ' cbp-tm-show-below';
                    // }
                },
                this.touch ? 0 : this.options.delayMenu);
        },

        _closeMenu: function (el) {

            clearTimeout(this.omtimeout);
            // var submenu_third = el.querySelector('ul.cbp-tm-submenu.rido_third_ul');
            var submenu = el.querySelector('ul.cbp-tm-submenu');
            if (submenu) {
                el.className = el.className.replace(new RegExp("(^|\\s+)" + "cbp-tm-show" + "(\\s+|$)"), ' ');
                el.className = el.className.replace(new RegExp("(^|\\s+)" + "cbp-tm-show-below" + "(\\s+|$)"), ' ');
            }
            // if (submenu_third) {
            //     // based on https://github.com/desandro/classie/blob/master/classie.js
            //     el.className = el.className.replace(new RegExp("(^|\\s+)" + "cbp-tm-show" + "(\\s+|$)"), ' ');
            //     el.className = el.className.replace(new RegExp("(^|\\s+)" + "cbp-tm-show-below" + "(\\s+|$)"), ' ');
            // }
        },


        _handleClick: function (el, ev) {
            var item = el.parentNode,
                items = Array.prototype.slice.call(this.menuItems),
                submenu = item.querySelector('ul.cbp-tm-submenu');
                // submenu_third = el.querySelector('ul.cbp-tm-submenu.rido_third_ul');
            // first close any opened one..
            if(typeof this.current !== 'undefined' && items.indexOf(item) !== this.current) {
                this._closeMenu(this.el.children[this.current]);
                this.el.children[this.current].querySelector('ul.cbp-tm-submenu').setAttribute('data-open', 'false');
            }

            if (submenu) {
                ev.preventDefault();
                var isOpen = submenu.getAttribute('data-open');
                if (isOpen === 'true') {
                    this._closeMenu(item);
                    submenu.setAttribute('data-open', 'false');
                }
                else {
                    this._openMenu(item);
                    this.current = items.indexOf(item);
                    submenu.setAttribute('data-open', 'true');
                }
            }

            // if (submenu_third) {
            //     ev.preventDefault();
            //     var isOpen = submenu_third.getAttribute('data-open');
            //     if (isOpen === 'true') {
            //         this._closeMenu(item);
            //         submenu_third.setAttribute('data-open', 'false');
            //     }
            //     else {
            //         this._openMenu(item);
            //         this.current = items.indexOf(item);
            //         submenu_third.setAttribute('data-open', 'true');
            //     }
            // }
        },

        _positionMenu: function (el) {
            // checking where's more space left in the viewport: above or below the element
            var vH = getViewportH(),
                ot = getOffset(el),
                spaceUp = ot.top,
                spaceDown = vH - spaceUp - el.offsetHeight;

            return ( spaceDown <= spaceUp ? 'top' : 'bottom' );
        }
    }

    // add to global namespace
    window.cbpTooltipMenu = cbpTooltipMenu;

})(window);