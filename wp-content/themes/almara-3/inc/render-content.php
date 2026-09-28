<?php
/** Preserve the original section markup while supporting new WordPress blocks. */
if (!defined('ABSPATH')) { exit; }

function almara_render_content() {
	$post = get_post();
	if (!$post) { return; }
	if (get_post_meta($post->ID, '_almara_imported_html', true)) {
		$content = do_blocks($post->post_content);
		// The imported HTML is trusted theme content. wpautop would alter its layout.
		echo almara_filter_content($content); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		return;
	}
	the_content();
}
