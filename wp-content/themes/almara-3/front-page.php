<?php get_header(); ?>
<main id="main">
	<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
		<?php
		$eyebrow = almara_field_value(get_the_ID(), 'eyebrow') ?: 'Truhlářství na míru · ' . get_option('almara_area', 'Teplice a okolí');
		$heading = almara_field_value(get_the_ID(), 'heading') ?: 'Nábytek na míru,<br>který dává <em>smysl.</em>';
		$lead = almara_field_value(get_the_ID(), 'lead') ?: 'Prostor pro váš život. Vytvořený přesně pro vás.';
		$description = almara_field_value(get_the_ID(), 'hero_description') ?: 'Vyrábíme kuchyně, vestavěné skříně a nábytek do celého interiéru. Spojujeme poctivé řemeslo, promyšlený design a materiály, se kterými je radost žít.';
		$image = almara_field_value(get_the_ID(), 'image') ?: get_template_directory_uri() . '/assets/images/hero-kuchyne.webp';
		?>
		<section class="hero" id="top" aria-labelledby="hero-title">
			<div class="hero-picture"><img src="<?php echo esc_url($image); ?>" alt="Nábytek na míru od Almara-3" width="1672" height="941" fetchpriority="high" data-parallax="24"></div><div class="hero-wash"></div>
			<div class="shell hero-inner"><div class="hero-copy">
				<p class="eyebrow hero-enter"><span></span> <?php echo esc_html($eyebrow); ?></p>
				<h1 id="hero-title" class="hero-enter"><?php echo wp_kses($heading, array('br' => array(), 'em' => array(), 'strong' => array())); ?></h1>
				<p class="hero-lead hero-enter"><?php echo esc_html($lead); ?></p><p class="hero-description hero-enter"><?php echo esc_html($description); ?></p>
				<div class="hero-actions hero-enter"><a class="button button-primary" href="<?php echo esc_url(home_url('/poptavka/')); ?>">Nezávazná poptávka <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></a><a class="button button-outline" href="<?php echo esc_url(home_url('/realizace/')); ?>">Naše práce <svg class="icon" aria-hidden="true"><use href="#i-up-right"/></svg></a></div>
				<a class="hero-scroll hero-enter" href="<?php echo esc_url(home_url('/o-nas/')); ?>"><span class="scroll-line" aria-hidden="true"></span> Poznejte naše řemeslo <svg class="icon" aria-hidden="true"><use href="#i-chevron"/></svg></a>
			</div></div><div class="hero-caption"><span class="caption-dot"></span> Přírodní materiály. Přirozený domov.</div><span class="hero-index" aria-hidden="true">01 — ALMARA</span>
		</section>
		<?php the_content(); ?>
	<?php endwhile; endif; ?>
</main>
<?php get_footer(); ?>
