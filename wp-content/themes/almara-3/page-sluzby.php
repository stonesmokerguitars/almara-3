<?php get_header(); ?>
<main id="main">
	<nav class="shell breadcrumbs" aria-label="Drobečková navigace"><ol><li><a href="<?php echo esc_url(home_url('/')); ?>">Domů</a></li><li><span aria-current="page">Služby</span></li></ol></nav>
	<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
		<?php $heading = almara_field_value(get_the_ID(), 'heading') ?: 'Pro každý prostor.<br><em>Přesně pro vás.</em>'; $lead = almara_field_value(get_the_ID(), 'lead') ?: 'Od kuchyně až po poslední polici. Objevte možnosti zakázkové výroby pro váš domov, kancelář nebo provozovnu.'; ?>
		<section class="page-intro shell" id="top"><p class="eyebrow hero-enter"><?php echo esc_html(almara_field_value(get_the_ID(), 'eyebrow') ?: 'Co pro vás můžeme vytvořit'); ?></p><h1 class="hero-enter"><?php echo wp_kses($heading, array('br' => array(), 'em' => array())); ?></h1><p class="page-lead hero-enter"><?php echo esc_html($lead); ?></p></section>
	<?php endwhile; endif; ?>
	<section class="section catalog-section"><div class="shell"><div class="service-grid">
		<?php $services = new WP_Query(array('post_type' => 'sluzba', 'posts_per_page' => -1, 'orderby' => array('menu_order' => 'ASC', 'title' => 'ASC'))); $i = 0; ?>
		<?php if ($services->have_posts()) : while ($services->have_posts()) : $services->the_post(); $i++; $image = almara_service_image_url(get_the_ID()); ?>
			<a class="service-card reveal" href="<?php the_permalink(); ?>" style="--delay:<?php echo esc_attr((($i - 1) % 3) * 80); ?>ms"><div class="service-image"><img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr(get_the_title() . ' — inspirace a materiály'); ?>" width="1440" height="960" loading="lazy"><span class="service-number"><?php echo esc_html(str_pad((string) $i, 2, '0', STR_PAD_LEFT)); ?> /</span><span class="service-hover">Objevte možnosti pro váš prostor</span></div><div class="service-label"><h3><?php the_title(); ?></h3><span class="card-arrow"><svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></span></div></a>
		<?php endwhile; wp_reset_postdata(); else : ?><p>Obsah služeb zatím nebyl importován. V administraci otevřete Nástroje → Import obsahu Almara-3.</p><?php endif; ?>
	</div></div></section>
	<section class="contact-banner"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/hero-kuchyne.webp'); ?>" width="1672" height="941" loading="lazy" alt="" data-parallax="24"><div class="banner-shade"></div><div class="shell banner-inner"><div class="reveal"><p class="eyebrow">Váš interiér. Naše řemeslo.</p><h2>Proměňme vaši představu<br><em>ve skutečnost.</em></h2><p>Stačí nám napsat. Společně najdeme řešení pro váš prostor.</p></div><a class="button button-light" href="<?php echo esc_url(home_url('/poptavka/')); ?>">Nezávazně poptat <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></a></div></section>
</main>
<?php get_footer(); ?>
