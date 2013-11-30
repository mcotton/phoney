
$(document).ready(function() {

    /* utility vars */
    var user_id = $('#user_id').attr('name').trim()

    /* Models */
    window.Call = Backbone.Model.extend({
        
        direction: function() {
            return this.get('direction')
        }
    })

    /* Collections */
    window.Calls = Backbone.Collection.extend({
    
        model: Call,
        url: '/api/v1/phone/by_date/outbound-dial',

        parse: function(response) {
            // fix this to use user's id
            for(var i=0;i<response.rows.length;i++) {
                if(response.rows[i].key == user_id) {
                    return response.rows[i].value
                }    
            }
        }


    })
    
    window.phoneCalls = new Calls

    /* Views */
    window.CallsByDate = Backbone.View.extend({
    
        tagName: 'tr',

        template:  _.template($('#phone_list_template').html() || ''),
        
        events: {
        },

        initialize: function() {
            this.model.bind('change', this.render, this) 
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()))
            return this
        }

    })

    window.AppView = Backbone.View.extend({
        
        events: {
        },

        initialize: function() {
            
            //phoneCalls.bind('reset', this.appendRows, this)
            //phoneCalls.bind('reset', this.sortDirection, this)
            phoneCalls.bind('sortLengthUp', this.sortLengthUp, this)
            phoneCalls.bind('sortLengthDown', this.sortLengthDown, this)
            phoneCalls.bind('sortDateUp', this.sortDateUp, this)
            phoneCalls.bind('sortDateDown', this.sortDateDown, this)
            
            phoneCalls.fetch()
        },

        appendRows: function(call) {
            $('tbody tr').remove()
            phoneCalls.each(function(item) { 
                var view = new CallsByDate({ model: item })
                this.$('#phone_list_by_date tbody').append(view.render().el)
            })
        },

        sortLengthUp: function() {
            $('tbody tr').remove()
            sorted = _.sortBy(phoneCalls.models, function(item) {
                return parseInt(item.get('duration'),10)
            }) 
            sorted.reverse()
            _.each(sorted, function(item) {
                var view = new CallsByDate({ model: item })
                this.$('#phone_list_by_date tbody').append(view.render().el)
            })
        },

        sortLengthDown: function() {
            $('tbody tr').remove()
            sorted = _.sortBy(phoneCalls.models, function(item) {
                return parseInt(item.get('duration'),10)
            }) 
            _.each(sorted, function(item) {
                var view = new CallsByDate({ model: item })
                this.$('#phone_list_by_date tbody').append(view.render().el)
            })
        },

        sortDateUp: function() {
            $('tbody tr').remove()
            sorted = _.sortBy(phoneCalls.models, function(item) {
                return new Date(item.get('start_time'))
            }) 
            sorted.reverse()
            _.each(sorted, function(item) {
                var view = new CallsByDate({ model: item })
                this.$('#phone_list_by_date tbody').append(view.render().el)
            })
        },

        sortDateDown: function() {
            $('tbody tr').remove()
            sorted = _.sortBy(phoneCalls.models, function(item) {
                return new Date(item.get('start_time'))
            }) 
            _.each(sorted, function(item) {
                var view = new CallsByDate({ model: item })
                this.$('#phone_list_by_date tbody').append(view.render().el)
            })
        },
        
        sortDirection: function() {
            $('tbody tr').remove()
            _.each(phoneCalls.models, function(item) {
                if(item.direction() == 'outbound-dial') {
                    var view = new CallsByDate({ model: item })
                    this.$('#phone_list_by_date tbody').append(view.render().el)
                }
            })
        }

    })

    /* Router */
    window.Path = Backbone.Router.extend({
        
        initialize: function() {},

        routes: {
            '':             'sortDateUp',
            'sortLengthUp': 'sortLengthUp',
            'sortLengthDown': 'sortLengthDown',
            'sortDateUp': 'sortDateUp',
            'sortDateDown': 'sortDateDown',
            'sortStatus': 'sortStatus'
        },

        sortLengthUp: function() {
            phoneCalls.trigger('sortLengthUp')
        },

        sortLengthDown: function() {
            phoneCalls.trigger('sortLengthDown')
        },

        sortDateUp: function() {
            phoneCalls.trigger('sortDateUp')
        },

        sortDateDown: function() {
            phoneCalls.trigger('sortDateDown')
        },

        sortStatus: function() {
            phoneCalls.trigger('sortStatus')
        }

    })

    window.app = new AppView()
    window.path = new Path()
    Backbone.history.start()
    
});
