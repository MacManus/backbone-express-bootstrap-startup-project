(function($) {
    // this is to avoid conflict between ejs <% %> notation and underscore notation {{ }}
    _.templateSettings = {
      interpolate : /\{\{(.+?)\}\}/g
    };

    //override default backbone behavior reading _id from mongo
    Backbone.Model.prototype.idAttribute = '_id';

    // code goes here ...

    
    // on DOM READY stuffs ...
    $(document).ready(function() {
        
    });

})(jQuery);
