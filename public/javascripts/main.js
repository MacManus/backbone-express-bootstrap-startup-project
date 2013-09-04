(function($) {
    _.templateSettings = {
      interpolate : /\{\{(.+?)\}\}/g
    };

    //override default backbone behavior reading _id from mongo
    Backbone.Model.prototype.idAttribute = '_id';

    var annoncesView, annonceDetailsView;
    // define Annonce Model
    var Annonce = Backbone.Model.extend({
        urlRoot: '/annonces',
        // urlRoot: '/api/annonces',
        defaults : function () {
            return {
                author: ''
                , title: ''
                , contract: ''
                , typeOfProperty: ''
                , description: ''
            }
        }
    });
    var AnnonceList = Backbone.Collection.extend({
        model : Annonce,
        url : '/annonces'
    });
    var annonces = new AnnonceList() ;

    var AnnonceView = Backbone.View.extend({
        model : new Annonce(),
        tagName: 'tr',
        events: {
            'click .edit'       : 'edit',
            'click .delete'     : 'delete',
            'click .details'     : 'details',
            'blur .title'      : 'close',
            'keypress .title'  : 'onEnterUpdate'
        },

        initialize: function () {
            this.template = _.template($('#annonce-template').html());
        },

        edit: function (ev) {
            ev.preventDefault();
            this.$('.title').attr('contenteditable', true).focus();
        },

        details : function (ev) {
            var target = $(ev.currentTarget);
            ev.preventDefault();
            router.navigate(target.attr('href'), {trigger : true });
        },

        close: function (ev) {
            var title = this.$('.title').text();
            var self =this; 
            this.model.set('title', title);
            this.model.save( {title : title}, {
                success : function () { 
                    console.log("Sucess updating content " + self.model.id )} ,
                    // hide a throbber...
                error : function () { console.log( "Failed to remove annonce with id = " + this.model.id); } ,
            });
            this.$('.title').removeAttr('contenteditable');
        },

        onEnterUpdate : function (ev) {
            var self = this;
            if(ev.keyCode == 13) {
                this.close();
                _.delay(function () {self.$('.title').blur() }, 100);
            }
        },

        delete : function  (ev) {
            ev.preventDefault();
            this.model.destroy({
                success : function () { annonces.remove(this.model) ; } ,
                error : function () { console.log( "Failed to remove annonce with id = " + this.model.id); } ,
            });
            this.$el.html(this.template(this.model.toJSON() ));
            return this;
        },

        render : function() {                     
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var AnnoncesView = Backbone.View.extend({
        model : annonces,
        el : $('#annonces-container'),
        // el : '.container',
        initialize: function () {
            var self = this ;
            this.model.on('add', this.render, this);
            this.model.on('remove', this.render, this);

            annonces.fetch( {
                success : function () { self.render(); },
                error : function () { console.log("Cannont retrieve models from server"); },
            })
        },        

        render : function () {
            var self = this ;
            self.$el.html('');
            _.each(this.model.toArray(), function(annonce, i) {
                self.$el.append((new AnnonceView({model : annonce})).render().$el);
            });
            return this;
        },
        hide: function () {
            this.$el.hide();
        },
        show: function () {
            this.$el.show();
        },
    });

    var AnnonceDetailsView = Backbone.View.extend({
        el: $('#annonce-details'),
        // el : '.container',
        events: {
            'click .back': 'back'
        },
        initialize: function () {
            this.template = _.template($('#annonce-details-template').html());
        },
        back: function (ev) {
            ev.preventDefault();
            router.navigate('', {trigger : true });
        },
        hide: function () {
            this.$el.hide();
        },
        show: function (id) {
            //this.model = model;
            // console.log(model);
            this.render({id : id});
            this.$el.show();
        },
        render: function (options) {
            // console.log(options);
            var self = this;
            if(options.id) {
                var annonce = new Annonce({ _id : options.id }) ;
                annonce.fetch({
                    success : function (annonce) {
                        //console.log(annonce);
                        var template = _.template($('#annonce-details-template').html(), {annonce: annonce.attributes} ) ; // annonces.models
                        console.log(template);
                        self.$el.html(template); 
                    }
                });
            } else {

            }
                
            // var template = _.template($('#annonce-details-template').html(), {annonce: this.model.toJSON() } ) ; // annonces.models
            // this.$el.html(this.template(this.model.toJSON()));
            // this.$el.html(template); 
            // return this;
        }
    })

    var Router = Backbone.Router.extend({
        routes : {
            '' : 'index',
            'annonces/:id': 'show',
        },
        index: function () {
            annonceDetailsView.hide();
            annoncesView.show();
        },
        show: function (id) {
            annonceDetailsView.show(id);
            annoncesView.hide();
            // model = new Annonce ({ _id: id });
            // model.fetch({
            //     success: function () {
            //         // annonceDetailsView.show(model);
                    
            //         //annonceDetailsView.render();
            //     },
            //     error: function () {
            //         console.log("Cannot fetch model to show");
            //     }
            // });

        }
    });

    var router = new Router();

    // router.on('route:show', function (id) {
    //     annonceDetailsView.show(id);
    //     annoncesView.hide();
    // });

    $(document).ready(function() {
        $('#new-ad').submit(function(ev) {
            var annonce = new Annonce({
                author: $('#author-name').val()
                , title : $('#ad-title').val()
                , contract : $('#ad-contract').val()
                , typeOfProperty : $('#ad-type').val()
                , description : $('#ad-desc').val()
            });
            
            console.log(annonces.toJSON());

            annonce.save({}, {
                success : function (data) { 
                    console.log(data.attributes._id);
                    // we need to get the Objectid returned by mongo
                    //annonce._id = data.attributes._id ;
                    console.log(" Success saving annonce") ; 
                    annonces.add(annonce);
                },
                error : function () { console.log( " Error saving annonce") ; }
            } ) ;
            
            return false ;
        });

        annoncesView = new AnnoncesView();
        annonceDetailsView = new AnnonceDetailsView();
        Backbone.history.start({ pushState: true});
        // var tweet1 = new Tweet({ author: 'MacManus', status : 'watching some tutorials'}) ;
        // var tweet2 = new Tweet({ author: 'Toto', status : 'great some tutorials'}) ;
        // var tweet3 = new Tweet({ author: 'Momo', status : 'ooh shit some tutorials'}) ;

        // console.log(tweets.first(2));
    });


    


})(jQuery);
