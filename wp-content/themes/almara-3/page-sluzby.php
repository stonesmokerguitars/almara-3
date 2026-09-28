<?php get_header(); ?>
<main id="main">
	<nav class="shell breadcrumbs" aria-label="Drobečková navigace"><ol><li><a href="<?php echo esc_url(home_url('/')); ?>">Domů</a></li><li><span aria-current="page">Služby</span></li></ol></nav>
	<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
		<?php $heading = almara_field_value(get_the_ID(), 'heading') ?: 'Pro každý prostor.<br><em>Přesně pro vás.</em>'; $lead = almara_field_value(get_the_ID(), 'lead') ?: 'Od kuchyně až po poslední polici. Objevte možnosti zakázkové výroby pro váš domov, kancelář nebo provozovnu.'; ?>
		<section class="page-intro shell" id="top"><p class="eyebrow hero-enter"><?php echo esc_html(almara_field_value(get_the_ID(), 'eyebrow') ?: 'Co pro vás můžeme vytvořit'); ?></p><h1 class="hero-enter"><?php echo wp_kses($heading, array('br' => array(), 'em' => array())); ?></h1><p class="page-lead hero-enter"><?php echo esc_html($lead); ?></p></section>
		<?php almara_render_content(); ?>
	<?php endwhile; endif; ?>
</main>
<?php get_footer(); ?>
