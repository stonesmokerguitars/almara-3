<?php if (!defined('ABSPATH')) { exit; } ?>
<?php if (is_front_page() || is_page('realizace')) : ?>
<dialog class="lightbox" id="lightbox" aria-labelledby="lightbox-title">
	<button class="dialog-close round-button" data-close-dialog aria-label="Zavřít fotografii"><svg class="icon" aria-hidden="true"><use href="#i-close"/></svg></button>
	<button class="round-button lightbox-prev" aria-label="Předchozí fotografie"><svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></button>
	<figure><div class="lightbox-image-wrap"><img id="lightbox-image" alt=""></div><figcaption><div><h2 id="lightbox-title"></h2><p id="lightbox-caption"></p></div><span id="lightbox-count"></span></figcaption></figure>
	<button class="round-button lightbox-next" aria-label="Další fotografie"><svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></button>
</dialog>
<?php endif; ?>
<footer class="site-footer">
	<div class="shell footer-main">
		<a class="brand" href="<?php echo esc_url(home_url('/')); ?>" aria-label="Almara-3 — zpět na úvod"><img class="brand-logo" src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/logo-almara-modern.svg'); ?>" alt="<?php echo esc_attr(get_option('almara_legal_name', 'Almara-3 s.r.o.')); ?>" width="1973" height="259" loading="lazy"><span class="brand-tagline">TRUHLÁŘSTVÍ NA MÍRU</span></a>
		<nav class="footer-nav" aria-label="Navigace v patičce">
			<?php wp_nav_menu(array('theme_location' => 'footer', 'container' => false, 'items_wrap' => '<ul class="menu">%3$s</ul>', 'fallback_cb' => 'almara_footer_menu_fallback', 'depth' => 1)); ?>
		</nav>
		<a class="footer-email" href="mailto:<?php echo esc_attr(get_option('almara_email', 'info@almara-3.cz')); ?>"><?php echo esc_html(get_option('almara_email', 'info@almara-3.cz')); ?> <svg class="icon" aria-hidden="true"><use href="#i-up-right"/></svg></a>
		<a class="round-button back-top" href="#top" aria-label="Zpět nahoru"><svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></a>
	</div>
	<div class="shell footer-bottom"><span>© <span id="year"><?php echo esc_html(wp_date('Y')); ?></span> <?php echo esc_html(get_option('almara_legal_name', 'Almara-3 s.r.o.')); ?></span><span>Poctivě vyrobeno. S citem pro váš prostor.</span><span><?php echo esc_html(get_option('almara_area', 'Teplice a okolí')); ?></span></div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
