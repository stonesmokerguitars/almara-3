(function ($) {
  'use strict';
  $(document).on('click', '.almara-media-button', function (event) {
    event.preventDefault();
    const target = $('#' + $(this).data('target'));
    const picker = wp.media({ title: 'Vyberte úvodní obrázek', button: { text: 'Použít obrázek' }, multiple: false, library: { type: 'image' } });
    picker.on('select', function () {
      const image = picker.state().get('selection').first().toJSON();
      target.val(image.url).trigger('change');
    });
    picker.open();
  });
})(jQuery);
