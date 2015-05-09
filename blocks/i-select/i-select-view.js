'use strict';

var block = 'i-select';

ns.views.select = Backbone.View.extend({
    'events': {
        'keydown .i-button': 'onkeydown',
        'keyup   .i-button': 'onkeyup',
        'blur    .i-button': 'onblur',
        'mousedown': 'stop',
        'mouseup':   'proxyButton',
        'mouseout':  'proxyButton',
        'mouseover': 'proxyButton',
        'click':     'proxyButton'
    },

    'initialize': function(options) {

        this.$button = options.$button;
        this.$popup  = options.$popup;
        this.$list   = options.$list;

        this.listenTo(
            this.$button,
            'action',
            this.buttonHandler
        );
        this.listenTo(
            this.$popup,
            'show',
            this.popupHandler.bind(this, true)
        );
        this.listenTo(
            this.$popup,
            'hide',
            this.popupHandler.bind(this, false)
        );
        this.listenTo(
            this.model,
            'change:label',
            this.proxyLabel
        );
        this.listenTo(
            this.model,
            'asyncInit',
            this.proxyInit
        );
        this.listenTo(
            this.model,
            'change:open',
            this.openHandler
        );
        this.listenTo(
            this.model,
            'change:checked',
            this.proxyChecked
        );
        this.listenTo(
            this.model,
            'change:disabled',
            this.proxyDisabled
        );
    },
    'onblur': function(){
        //this.model.set('open', false);
    },
    'onkeyup': function(e) {
        switch (e.which) {
            case ns.keys.esc:
                e.preventDefault();
                this.model.set('open', false);
            break;
        }
    },
    'stop': function(e){
        e.preventDefault();
        e.stopPropagation();
    },
    'onkeydown': function(e) {
        var select = this.model;
        switch (e.which) {
            case ns.keys.up:
                e.preventDefault();
                (select.focusPrev() && this.scrollFocused(select.get('focus'), true)) || select.set('open', false);
            break;
            case ns.keys.down:
                e.preventDefault();
                select.get('open') ? (select.focusNext() && this.scrollFocused(select.get('focus'), false)) : select.set('open', true);
            break;
        }
    },
    'scrollFocused': function(cid, dir){
        if(cid){
            this.$list.focusScroll(cid, dir);
        }
        return true;
    },
    'popupHandler': function(open){
        this.$el.toggleClass( block + '__open', open);
        this.model.set('open', open);
    },
    'openHandler': function(model, open) {
        if(open){
            this.$el.find('.i-button').not('[tabindex="-1"]').focus();
        }
        this.$popup[open ? 'show' : 'hide']();
    },
    'buttonHandler': function(button, real) {
        if (this.model.get("focus")) {
            if( real ){
                this.model.set("focus", void(0));
                this.model.toggleOpen(false);
            } else {
                this.model.selectFocused();
            }
        } else {
            this.model.toggleOpen();
        }
    },
    'proxyInit': function(){
        this.$button.trigger('asyncInit')
    },
    'proxyButton': function(e) {
        //console.log('proxyButton', e.clientX);
        if(e.clientX){
            this.model.set('focus', void(0));
            this.$el.find('.i-button').trigger(e.type);
        }
    },
    'proxyChecked': function(model, checked) {
        this.$button.set('checked', checked);
    },
    'proxyLabel': function(model, label) {
        this.$button.set('label', label);
    },
    'proxyDisabled': function(model, value) {
        this.$button.set('disabled', value);
    }
});