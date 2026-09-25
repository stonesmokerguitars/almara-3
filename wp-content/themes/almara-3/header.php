<?php if (!defined('ABSPATH')) { exit; } ?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="theme-color" content="#f8f6f2">
	<link rel="icon" href="<?php echo esc_url(get_template_directory_uri() . '/assets/images/favicon.svg'); ?>" type="image/svg+xml">
	<?php if (is_front_page()) : ?><link rel="preload" as="image" href="<?php echo esc_url(get_template_directory_uri() . '/assets/images/hero-kuchyne.webp'); ?>" fetchpriority="high"><?php endif; ?>
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#main">Přejít na obsah</a>
<?php get_template_part('template-parts/icon-sprite'); ?>
<header class="site-header">
	<div class="shell nav-wrap">
		<a class="brand" href="<?php echo esc_url(home_url('/')); ?>" aria-label="Almara-3 — domů">
			<img class="brand-logo" src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/logo-almara-modern.svg'); ?>" alt="<?php echo esc_attr(get_option('almara_legal_name', 'Almara-3 s.r.o.')); ?>" width="1973" height="259">
			<span class="brand-tagline">TRUHLÁŘSTVÍ NA MÍRU</span>
		</a>
		<nav class="main-nav" id="main-nav" aria-label="Hlavní navigace">
			<?php
			wp_nav_menu(array(
				'theme_location' => 'primary', 'container' => false, 'items_wrap' => '<ul class="menu">%3$s</ul>',
				'fallback_cb' => 'almara_primary_menu_fallback', 'depth' => 1,
			));
			?>
			<a class="button button-primary mobile-cta" href="<?php echo esc_url(home_url('/poptavka/')); ?>">Nezávazná poptávka <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></a>
		</nav>
		<a class="button button-outline header-cta" href="<?php echo esc_url(home_url('/poptavka/')); ?>">Nezávazná poptávka <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></a>
		<button class="menu-toggle" type="button" aria-label="Otevřít menu" aria-expanded="false" aria-controls="main-nav"><span></span><span></span></button>
	</div>
	<div class="reading-progress" aria-hidden="true"></div>
</header>
