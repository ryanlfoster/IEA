/*global define*/

define(function() {
    var Helloworld = IEA.module('UI.helloworld', function(helloworld, app, IEA) {

        _.extend(helloworld, {

            /*********************PUBLIC METHODS******************************************/

            /**
             * intialize function. the super function inside it will call the abstract initializse of the iea view.
             * @method initialize
             * @param {} options
             * @return 
             */
            initialize: function (options) {
                this._super(options);
            },

            /**
             * render logic . this gets automatically called if the component is a client side component
             * @method render
             * @return 
             */
            render: function () {
                this.$el.html(this.template(this.model.toJSON().data));

                if(this._isEnabled === false) {
                    this.enable();
                    this._isEnabled = true;
                }
            },

            /**
             * enable function to write component enable logics. this function gets automatically called if the 
             * component is a server side component, skipping the call to render
             * @method enable
             * @return 
             */
            enable: function () {
                
            }  


            /**************************PRIVATE METHODS******************************************/          

            /**
                component private functions are written with '_' prefix to diffrentiate between the public methods
                example:

                _showContent: function (argument) {
                    // body...
                }
                
            */

        });
    });

    return Helloworld;
});
