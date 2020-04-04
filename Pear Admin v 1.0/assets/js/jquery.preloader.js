(function($) {

    /**
     * jQuery preloader plugin
     * @param params
     * @returns {*}
     */
    $.fn.preloader = function(params) {

        /**
         * Plugin options
         */
        var options = $.extend({
            selector: '#preloader',
            type: 'document',
            removeType: 'fade',
            fadeDuration: 750,
            delay: 0
        }, params);

        /**
         * Preloader container holder
         * @type {null}
         */
        var element = null;

        /**
         * Initialize plugin
         */
        function init() {
            element = $(options.selector);
        }

        /**
         * Run plugin main event
         */
        function run() {
            switch (options.type) {
                case 'document':
                default:
                    setTimeout(function(){
                        enforceRemove();
                    }, options.delay);
                    break;
            }
        }

        /**
         * Enforce remove process
         */
        function enforceRemove() {
            switch (options.removeType) {
                case 'fade':
                    fadeOut();
                    break;
                case 'remove':
                default:
                    remove();
                    break;
            }
        }

        /**
         * Direct remove
         * @returns {*}
         */
        function remove() {
            return element.remove();
        }

        /**
         * Fade-out remove
         * @returns {*|{opacity}}
         */
        function fadeOut() {
            return element.fadeOut(
                options.fadeDuration,
                afterCallback()
            );
        }

        /**
         * After fade-out remove
         * @returns {Function}
         */
        function afterCallback() {
            return function(){
                element.remove();
            }
        }

        /*
         * Init plugin
         */
        init();

        /**
         * Return
         */
        return this.ready(function(){
            $(this).trigger('preloader:before');

            run();

            $(this).trigger('preloader:after');
        });
    }

}(jQuery));