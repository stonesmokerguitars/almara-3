<?php get_header(); ?>
<main id="main">
	<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
		<?php
		$eyebrow = almara_field_value(get_the_ID(), 'eyebrow');
		$heading = almara_field_value(get_the_ID(), 'heading');
		$lead = almara_field_value(get_the_ID(), 'lead');
		?>
		<nav class="shell breadcrumbs" aria-label="Drobečková navigace"><ol><li><a href="<?php echo esc_url(home_url('/')); ?>">Domů</a></li><li><span aria-current="page"><?php the_title(); ?></span></li></ol></nav>
		<section class="page-intro shell" id="top"><?php if ($eyebrow) : ?><p class="eyebrow hero-enter"><?php echo esc_html($eyebrow); ?></p><?php endif; ?><h1 class="hero-enter"><?php echo wp_kses($heading ?: get_the_title(), array('br' => array(), 'em' => array(), 'strong' => array())); ?></h1><?php if ($lead) : ?><p class="page-lead hero-enter"><?php echo esc_html($lead); ?></p><?php endif; ?></section>
		<?php almara_render_content(); ?>
	<?php endwhile; endif; ?>
</main>
<?php get_footer(); ?>
