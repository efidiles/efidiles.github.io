window.Fidi = {};

window.Fidi.Header = (function() {

    var $nav = $('header nav'),
        $toggleButton = $nav.find('> a'),
        toggleClass = 'open';

    function init() {
        $toggleButton.on('click', function() {
            $nav.toggleClass(toggleClass);
        });
    }

    return {
        init: init
    }
}());