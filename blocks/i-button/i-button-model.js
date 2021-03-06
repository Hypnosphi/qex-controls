ns.models.button = Backbone.Model.extend(
    {
        'defaults': {
            'size':     'M',
            'checked':  false,
            'disabled': false,
            'loading':  false,
            'action':   false,
            'template': void(0),
            'fake':     false
        },
        'isDisabled': function(){
            return this.get('disabled') || this.get('loading');
        }
    }
);
