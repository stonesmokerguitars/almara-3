<?php
/** Almara-3 theme setup. */
if (!defined('ABSPATH')) { exit; }

define('ALMARA_VERSION', '1.0.0');

function almara_setup() {
	load_theme_textdomain('almara-3', get_template_directory() . '/languages');
	add_theme_support('title-tag');
	add_theme_support('post-thumbnails');
	add_theme_support('html5', array('search-form', 'gallery', 'caption', 'style', 'script'));
	add_theme_support('responsive-embeds');
	add_theme_support('editor-styles');
	add_editor_style('styles.css');
	register_nav_menus(array('primary' => 'Hlavní navigace', 'footer' => 'Navigace v patičce'));
}
add_action('after_setup_theme', 'almara_setup');

function almara_register_content() {
	register_post_type('sluzba', array(
		'labels' => array('name' => 'Služby', 'singular_name' => 'Služba', 'add_new_item' => 'Přidat službu', 'edit_item' => 'Upravit službu', 'all_items' => 'Všechny služby', 'menu_name' => 'Služby'),
		'public' => true,
		'publicly_queryable' => true,
		'show_in_rest' => true,
		'menu_icon' => 'dashicons-hammer',
		'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'page-attributes'),
		'has_archive' => false,
		'rewrite' => array('slug' => '', 'with_front' => false, 'pages' => false),
		'query_var' => true,
		'show_in_nav_menus' => true,
	));
	register_taxonomy('skupina_sluzeb', 'sluzba', array(
		'labels' => array('name' => 'Skupiny služeb', 'singular_name' => 'Skupina služeb', 'menu_name' => 'Skupiny služeb'),
		'public' => true, 'hierarchical' => true, 'show_in_rest' => true,
		'rewrite' => array('slug' => 'skupina-sluzeb', 'with_front' => false),
	));
}
add_action('init', 'almara_register_content');

function almara_assets() {
	$uri = get_template_directory_uri();
	$dir = get_template_directory();
	wp_enqueue_style('almara-fonts', 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;450;500;550;600;650;700&family=DM+Serif+Display:ital@0;1&display=swap', array(), null);
	wp_enqueue_style('almara-style', $uri . '/styles.css', array('almara-fonts'), file_exists($dir . '/styles.css') ? filemtime($dir . '/styles.css') : ALMARA_VERSION);
	wp_enqueue_script('almara-script', $uri . '/script.js', array(), file_exists($dir . '/script.js') ? filemtime($dir . '/script.js') : ALMARA_VERSION, true);
	wp_localize_script('almara-script', 'almaraSite', array('homeUrl' => home_url('/'), 'themeUrl' => $uri, 'email' => get_option('almara_email', 'info@almara-3.cz')));
}
add_action('wp_enqueue_scripts', 'almara_assets');

function almara_media_admin($hook) {
	if (!in_array($hook, array('post.php', 'post-new.php'), true)) { return; }
	$screen = get_current_screen();
	if (!$screen || !in_array($screen->post_type, array('sluzba', 'page'), true)) { return; }
	wp_enqueue_media();
	wp_enqueue_script('almara-admin', get_template_directory_uri() . '/assets/js/admin.js', array('jquery'), ALMARA_VERSION, true);
}
add_action('admin_enqueue_scripts', 'almara_media_admin');

function almara_register_meta_boxes() {
	add_meta_box('almara-page-fields', 'Almara-3 · úvodní a SEO údaje', 'almara_render_page_fields', array('page', 'sluzba'), 'normal', 'high');
}
add_action('add_meta_boxes', 'almara_register_meta_boxes');

function almara_field_value($post_id, $key) {
	$value = get_post_meta($post_id, '_almara_' . $key, true);
	if (is_string($value) && $key !== 'image') {
		$value = str_replace('Teplice a okolí', get_option('almara_area', 'Teplice a okolí'), $value);
	}
	return $value;
}

function almara_render_page_fields($post) {
	wp_nonce_field('almara_save_fields', 'almara_fields_nonce');
	$fields = array(
		'eyebrow' => array('Horní popisek', 'Krátký text nad hlavním nadpisem.'),
		'heading' => array('Hlavní nadpis', 'Lze použít HTML <em> a <br> pro kurzívu a zalomení řádku.'),
		'lead' => array('Úvodní odstavec', 'Krátký perex pod hlavním nadpisem.'),
		'hero_description' => array('Doplňující text úvodního banneru', 'Používá se na hlavní stránce pod krátkým perexem.'),
		'seo_title' => array('SEO titulek', 'Pokud zůstane prázdný, použije se název stránky.'),
		'seo_description' => array('SEO popis', 'Krátký popis do výsledků vyhledávání.'),
		'image' => array('Úvodní obrázek', 'URL obrázku z knihovny médií nebo cesta v šabloně.'),
	);
	echo '<div class="almara-fields">';
	foreach ($fields as $key => $field) {
		$value = almara_field_value($post->ID, $key);
		$wide = in_array($key, array('heading', 'lead', 'hero_description', 'seo_description'), true);
		echo '<p class="' . ($wide ? 'almara-field-wide' : '') . '"><label for="almara-' . esc_attr($key) . '"><strong>' . esc_html($field[0]) . '</strong></label><br>';
		if (in_array($key, array('heading', 'lead', 'hero_description', 'seo_description'), true)) {
			echo '<textarea rows="' . ($key === 'heading' ? '3' : '2') . '" class="widefat" id="almara-' . esc_attr($key) . '" name="almara_fields[' . esc_attr($key) . ']">' . esc_textarea($value) . '</textarea>';
		} else {
			echo '<input class="widefat" id="almara-' . esc_attr($key) . '" name="almara_fields[' . esc_attr($key) . ']" value="' . esc_attr($value) . '">';
			if ($key === 'image') { echo '<button type="button" class="button almara-media-button" data-target="almara-image">Vybrat z knihovny médií</button>'; }
		}
		echo '<span class="description">' . esc_html($field[1]) . '</span></p>';
	}
	echo '</div>';
}

function almara_save_fields($post_id) {
	if (!isset($_POST['almara_fields_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['almara_fields_nonce'])), 'almara_save_fields')) { return; }
	if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) { return; }
	if (!current_user_can('edit_post', $post_id) || empty($_POST['almara_fields']) || !is_array($_POST['almara_fields'])) { return; }
	$fields = wp_unslash($_POST['almara_fields']);
	$plain = array('eyebrow', 'seo_title');
	foreach (array('eyebrow', 'heading', 'lead', 'hero_description', 'seo_title', 'seo_description', 'image') as $key) {
		if (!isset($fields[$key])) { continue; }
		$value = is_scalar($fields[$key]) ? (string) $fields[$key] : '';
		if ($key === 'heading') { $value = wp_kses($value, array('br' => array(), 'em' => array(), 'strong' => array(), 'span' => array())); }
		elseif ($key === 'image') { $value = esc_url_raw($value); }
		elseif (in_array($key, $plain, true)) { $value = sanitize_text_field($value); }
		else { $value = sanitize_textarea_field($value); }
		update_post_meta($post_id, '_almara_' . $key, $value);
	}
}
add_action('save_post_page', 'almara_save_fields');
add_action('save_post_sluzba', 'almara_save_fields');

function almara_admin_styles() {
	echo '<style>.almara-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 22px}.almara-fields .almara-field-wide{grid-column:1/-1}.almara-fields label strong{display:inline-block;margin-bottom:5px}.almara-fields .description{display:block;margin-top:5px}.almara-media-button{margin-top:7px}</style>';
}
add_action('admin_head-post.php', 'almara_admin_styles');
add_action('admin_head-post-new.php', 'almara_admin_styles');

function almara_register_settings() {
	register_setting('almara_site_settings', 'almara_phone', array('sanitize_callback' => 'sanitize_text_field', 'default' => '+420 777 123 456'));
	register_setting('almara_site_settings', 'almara_email', array('sanitize_callback' => 'sanitize_email', 'default' => 'info@almara-3.cz'));
	register_setting('almara_site_settings', 'almara_area', array('sanitize_callback' => 'sanitize_text_field', 'default' => 'Teplice a okolí'));
	register_setting('almara_site_settings', 'almara_legal_name', array('sanitize_callback' => 'sanitize_text_field', 'default' => 'Almara-3 s.r.o.'));
	add_settings_section('almara_contact', 'Kontaktní a firemní údaje', '__return_false', 'almara-settings');
	foreach (array('almara_phone' => 'Telefon', 'almara_email' => 'E-mail', 'almara_area' => 'Oblast působení', 'almara_legal_name' => 'Název firmy') as $key => $label) {
		add_settings_field($key, $label, 'almara_settings_field', 'almara-settings', 'almara_contact', array('label_for' => $key, 'key' => $key));
	}
}
add_action('admin_init', 'almara_register_settings');

function almara_settings_field($args) {
	$key = $args['key'];
	echo '<input class="regular-text" id="' . esc_attr($key) . '" name="' . esc_attr($key) . '" value="' . esc_attr(get_option($key)) . '">';
}

function almara_admin_pages() {
	add_theme_page('Nastavení Almara-3', 'Nastavení Almara-3', 'manage_options', 'almara-settings', 'almara_settings_page');
}
add_action('admin_menu', 'almara_admin_pages');

function almara_settings_page() {
	if (!current_user_can('manage_options')) { return; }
	echo '<div class="wrap"><h1>Nastavení Almara-3</h1><p>Údaje se používají v hlavičce, patičce a kontaktních textech importovaných stránek.</p><form method="post" action="options.php">';
	settings_fields('almara_site_settings');
	do_settings_sections('almara-settings');
	submit_button('Uložit údaje');
	echo '</form></div>';
}

function almara_filter_content($content) {
	$phone = get_option('almara_phone', '+420 777 123 456');
	$email = get_option('almara_email', 'info@almara-3.cz');
	$area = get_option('almara_area', 'Teplice a okolí');
	return str_replace(array('+420 777 123 456', '+420777123456', 'info@almara-3.cz', 'Teplice a okolí'), array(esc_html($phone), esc_attr(preg_replace('/[^0-9+]/', '', $phone)), esc_html($email), esc_html($area)), $content);
}
add_filter('the_content', 'almara_filter_content', 20);

function almara_document_title($title) {
	if (is_singular(array('page', 'sluzba'))) {
		$custom = get_post_meta(get_queried_object_id(), '_almara_seo_title', true);
		if ($custom) { return $custom; }
	}
	return $title;
}
add_filter('pre_get_document_title', 'almara_document_title');

function almara_meta_description() {
	if (!is_singular(array('page', 'sluzba')) || defined('WPSEO_VERSION') || class_exists('RankMath\\Helper')) { return; }
	$description = get_post_meta(get_queried_object_id(), '_almara_seo_description', true);
	if ($description) { echo '<meta name="description" content="' . esc_attr($description) . '">' . "\n"; }
}
add_action('wp_head', 'almara_meta_description', 2);

function almara_menu_link_attributes($atts, $item, $args) {
	if (in_array(($args->theme_location ?? ''), array('primary', 'footer'), true)) {
		$classes = array(($args->theme_location === 'primary') ? 'nav-link' : 'footer-link');
		if (!empty($item->current)) { $classes[] = 'active'; $atts['aria-current'] = 'page'; }
		$atts['class'] = implode(' ', $classes);
	}
	return $atts;
}
add_filter('nav_menu_link_attributes', 'almara_menu_link_attributes', 10, 3);

function almara_primary_menu_fallback() {
	$items = array('Služby' => '/sluzby/', 'Realizace' => '/realizace/', 'Jak pracujeme' => '/jak-pracujeme/', 'O nás' => '/o-nas/', 'Kontakt' => '/kontakt/');
	foreach ($items as $label => $path) { echo '<a class="nav-link" href="' . esc_url(home_url($path)) . '">' . esc_html($label) . '</a>'; }
}

function almara_footer_menu_fallback() {
	$items = array('Služby' => '/sluzby/', 'Naše práce' => '/realizace/', 'O nás' => '/o-nas/', 'Kontakt' => '/kontakt/');
	foreach ($items as $label => $path) { echo '<a href="' . esc_url(home_url($path)) . '">' . esc_html($label) . '</a>'; }
}

function almara_service_image_url($post_id) {
	$image = almara_field_value($post_id, 'image');
	if ($image && preg_match('~^https?://~i', $image)) { return $image; }
	if ($image) { return get_template_directory_uri() . '/assets/images/' . rawurlencode(basename($image)); }
	return get_template_directory_uri() . '/assets/images/hero-kuchyne.webp';
}

function almara_flush_rewrites() {
	almara_register_content();
	flush_rewrite_rules();
}
add_action('after_switch_theme', 'almara_flush_rewrites');

require_once get_template_directory() . '/inc/content-importer.php';
