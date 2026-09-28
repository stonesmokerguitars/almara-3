<?php
/** One-time, non-destructive conversion of the bundled static pages into WP content. */
if (!defined('ABSPATH')) { exit; }

function almara_import_page_list() {
	return array(
		'index.html' => array('Domů', 'almara-domu', true),
		'sluzby/index.html' => array('Služby', 'sluzby', false),
		'o-nas/index.html' => array('O nás', 'o-nas', false),
		'jak-pracujeme/index.html' => array('Jak pracujeme', 'jak-pracujeme', false),
		'realizace/index.html' => array('Realizace a inspirace', 'realizace', false),
		'kontakt/index.html' => array('Kontakt', 'kontakt', false),
		'poptavka/index.html' => array('Nezávazná poptávka', 'poptavka', false),
	);
}

function almara_import_service_slugs() {
	return array('kuchyne-na-miru', 'vestavene-skrine', 'obyvaci-steny', 'koupelnovy-nabytek', 'loznice-na-miru', 'komercni-interiery', 'satny-na-miru', 'nabytek-na-miru', 'predsinovy-nabytek', 'detske-pokoje', 'kancelarsky-nabytek', 'dvere-na-miru', 'atypicky-nabytek', 'rekonstrukce-interieru');
}

function almara_page_template($slug) {
	if ($slug === 'almara-domu') { return 'templates/almara-home.php'; }
	if ($slug === 'sluzby') { return 'templates/almara-services.php'; }
	return 'templates/almara-content.php';
}

function almara_extract_html($html, $pattern, $default = '') {
	if (preg_match($pattern, $html, $matches) && isset($matches[1])) { return trim($matches[1]); }
	return $default;
}

function almara_extract_meta($html, $name) {
	$quoted = preg_quote($name, '/');
	return html_entity_decode(almara_extract_html($html, '/<meta\s+name="' . $quoted . '"\s+content="([^"]*)"/i'), ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

function almara_import_content($html, $kind) {
	$main = almara_extract_html($html, '/<main\b[^>]*>([\s\S]*?)<\/main>/i');
	$main = preg_replace('/^\s*<nav class="shell breadcrumbs"[\s\S]*?<\/nav>/i', '', $main, 1);
	if ($kind === 'home') {
		$main = preg_replace('/<section class="hero"[\s\S]*?<\/section>/i', '', $main, 1);
	} elseif ($kind === 'service') {
		$main = preg_replace('/<section class="shell page-hero"[\s\S]*?<\/section>/i', '', $main, 1);
	} else {
		$main = preg_replace('/<section class="page-intro shell"[\s\S]*?<\/section>/i', '', $main, 1);
	}
	$theme_images = get_template_directory_uri() . '/assets/images/';
	$main = preg_replace('~((?:\.\./)*assets/images/)~', $theme_images, $main);
	$main = str_replace('?sluzba=', '?typ=', $main);
	return trim($main);
}

function almara_read_hero($html, $kind) {
	if ($kind === 'home') {
		$section = almara_extract_html($html, '/<section class="hero"[^>]*>([\s\S]*?)<\/section>/i');
		$pattern = '/<p class="eyebrow hero-enter"><span><\/span>\s*(.*?)<\/p>/s';
		$image_pattern = '/<div class="hero-picture"><img[^>]+src="([^"]+)"/i';
		$description_pattern = '/<p class="hero-description hero-enter">(.*?)<\/p>/s';
	} elseif ($kind === 'service') {
		$section = almara_extract_html($html, '/<section class="shell page-hero"[^>]*>([\s\S]*?)<\/section>/i');
		$pattern = '/<p class="eyebrow hero-enter">(.*?)<\/p>/s';
		$image_pattern = '/<div class="page-hero-visual[^>]*><img[^>]+src="([^"]+)"/i';
		$description_pattern = '/\x00/';
	} else {
		$section = almara_extract_html($html, '/<section class="page-intro shell"[^>]*>([\s\S]*?)<\/section>/i');
		$pattern = '/<p class="eyebrow hero-enter">(.*?)<\/p>/s';
		$image_pattern = '/\x00/';
		$description_pattern = '/\x00/';
	}
	$heading = almara_extract_html($section, '/<h1[^>]*>([\s\S]*?)<\/h1>/i');
	$lead = almara_extract_html($section, '/<p class="page-lead hero-enter">([\s\S]*?)<\/p>/i');
	if ($kind === 'home') { $lead = almara_extract_html($section, '/<p class="hero-lead hero-enter">([\s\S]*?)<\/p>/i'); }
	$image = almara_extract_html($section, $image_pattern);
	return array(
		'eyebrow' => sanitize_text_field(wp_strip_all_tags(almara_extract_html($section, $pattern))),
		'heading' => wp_kses($heading, array('br' => array(), 'em' => array(), 'strong' => array())),
		'lead' => sanitize_textarea_field(wp_strip_all_tags($lead)),
		'hero_description' => sanitize_textarea_field(wp_strip_all_tags(almara_extract_html($section, $description_pattern))),
		'image' => $image ? get_template_directory_uri() . '/assets/images/' . rawurlencode(basename(html_entity_decode($image, ENT_QUOTES | ENT_HTML5, 'UTF-8'))) : '',
	);
}

function almara_import_post($file, $title, $slug, $post_type, $kind, $order = 0) {
	$path = get_template_directory() . '/' . $file;
	if (!is_readable($path)) { return new WP_Error('almara_missing_source', 'Chybí zdrojový soubor: ' . $file); }
	$existing = get_page_by_path($slug, OBJECT, $post_type);
	if ($existing) {
		if (get_post_meta($existing->ID, '_almara_legacy_source', true) === $file) {
			update_post_meta($existing->ID, '_almara_imported_html', '1');
			if ($post_type === 'page') { update_post_meta($existing->ID, '_wp_page_template', almara_page_template($slug)); }
		}
		return $existing;
	}
	$html = file_get_contents($path);
	$content = almara_import_content($html, $kind);
	if (!$content) { return new WP_Error('almara_empty_source', 'Zdrojová stránka neobsahuje obsah: ' . $file); }
	$administrators = get_users(array('role' => 'administrator', 'number' => 1, 'fields' => 'ID'));
	$kses_priority = has_filter('content_save_pre', 'wp_filter_post_kses');
	if ($kses_priority !== false) { remove_filter('content_save_pre', 'wp_filter_post_kses', $kses_priority); }
	$post_id = wp_insert_post(wp_slash(array(
		'post_type' => $post_type,
		'post_status' => 'publish',
		'post_title' => $title,
		'post_name' => $slug,
		'post_content' => $content,
		'post_excerpt' => sanitize_textarea_field(wp_strip_all_tags(almara_extract_html($html, '/<p class="page-lead hero-enter">([\s\S]*?)<\/p>/i'))),
		'menu_order' => $order,
		'post_author' => $administrators ? (int) $administrators[0] : 0,
	)));
	if ($kses_priority !== false) { add_filter('content_save_pre', 'wp_filter_post_kses', $kses_priority); }
	if (is_wp_error($post_id)) { return $post_id; }
	if (!$post_id) { return new WP_Error('almara_insert_failed', 'WordPress nevytvořil stránku: ' . $file); }
	update_post_meta($post_id, '_almara_imported_html', '1');
	update_post_meta($post_id, '_almara_legacy_source', $file);
	if ($post_type === 'page') { update_post_meta($post_id, '_wp_page_template', almara_page_template($slug)); }
	$fields = almara_read_hero($html, $kind);
	foreach ($fields as $key => $value) { if ($value !== '') { update_post_meta($post_id, '_almara_' . $key, $value); } }
	$seo_title = almara_extract_html($html, '/<title>(.*?)<\/title>/is');
	$seo_description = almara_extract_meta($html, 'description');
	if ($seo_title) { update_post_meta($post_id, '_almara_seo_title', sanitize_text_field(html_entity_decode($seo_title, ENT_QUOTES | ENT_HTML5, 'UTF-8'))); }
	if ($seo_description) { update_post_meta($post_id, '_almara_seo_description', sanitize_text_field($seo_description)); }
	return $post_id;
}

function almara_import_notice() {
	if (!current_user_can('manage_options') || get_option('almara_content_imported')) { return; }
	echo '<div class="notice notice-info"><p><strong>Almara-3:</strong> Přeneste původní stránky a 14 služeb do WordPressu. Import zachová zdrojové soubory a přeskočí již vytvořený obsah. <a href="' . esc_url(admin_url('tools.php?page=almara-import')) . '">Otevřít import obsahu</a></p></div>';
}
add_action('admin_notices', 'almara_import_notice');

function almara_import_menu() {
	add_management_page('Import obsahu Almara-3', 'Import obsahu Almara-3', 'manage_options', 'almara-import', 'almara_import_page');
}
add_action('admin_menu', 'almara_import_menu');

function almara_import_page() {
	if (!current_user_can('manage_options')) { return; }
	echo '<div class="wrap"><h1>Import obsahu Almara-3</h1><p>Naimportují se úvodní stránka, informační stránky a 14 služeb z HTML souborů této šablony. Texty zůstanou editovatelné v editoru WordPressu; úvodní nadpisy, perexy a SEO údaje budou v samostatných polích. Existující příspěvky ani původní soubory se nemažou.</p>';
	if (get_option('almara_content_imported')) { echo '<div class="notice notice-success inline"><p>Úvodní import již proběhl. Opakovaný import existující záznamy nepřepíše.</p></div>'; }
	echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '">';
	echo '<input type="hidden" name="action" value="almara_import_content">';
	wp_nonce_field('almara_import_content');
	submit_button('Importovat původní obsah');
	echo '</form></div>';
}

function almara_run_import() {
	if (!current_user_can('manage_options')) { wp_die('K této akci nemáte oprávnění.'); }
	check_admin_referer('almara_import_content');
	$result = almara_import_all();
	$message = sprintf('Import dokončen. Vytvořeno nových položek: %d.', $result['created']);
	if ($result['errors']) { $message .= ' Některé soubory se nepodařilo importovat: ' . implode(' ', $result['errors']); }
	set_transient('almara_import_result_' . get_current_user_id(), $message, 90);
	wp_safe_redirect(admin_url('tools.php?page=almara-import&imported=1'));
	exit;
}
add_action('admin_post_almara_import_content', 'almara_run_import');

function almara_import_all() {
	$created = 0;
	$errors = array();
	foreach (almara_import_page_list() as $file => $page) {
		$result = almara_import_post($file, $page[0], $page[1], 'page', $page[2] ? 'home' : 'page');
		if (is_wp_error($result)) { $errors[] = $result->get_error_message(); }
		elseif (is_int($result)) { $created++; if ($page[2]) { update_option('show_on_front', 'page'); update_option('page_on_front', $result); } }
		elseif ($page[2] && $result instanceof WP_Post) { update_option('show_on_front', 'page'); update_option('page_on_front', $result->ID); }
	}
	foreach (almara_import_service_slugs() as $index => $slug) {
		$file = $slug . '/index.html';
		$html = is_readable(get_template_directory() . '/' . $file) ? file_get_contents(get_template_directory() . '/' . $file) : '';
		if (!$html) { $errors[] = 'Chybí zdrojová služba: ' . $file; continue; }
		$breadcrumb_title = almara_extract_html($html, '/<span aria-current="page">([^<]+)<\/span>/i');
		$title = $breadcrumb_title ?: $slug;
		$result = almara_import_post($file, html_entity_decode($title, ENT_QUOTES | ENT_HTML5, 'UTF-8'), $slug, 'sluzba', 'service', $index);
		if (is_wp_error($result)) { $errors[] = $result->get_error_message(); }
		elseif (is_int($result)) { $created++; }
	}
	if (!$errors) {
		update_option('almara_content_imported', current_time('mysql'));
		update_option('almara_bootstrap_version', '2');
	}
	flush_rewrite_rules(false);
	return array('created' => $created, 'errors' => $errors);
}

function almara_ensure_content() {
	if (get_option('almara_bootstrap_version') === '2' || wp_installing()) { return; }
	$lock = (int) get_option('almara_bootstrap_lock');
	if ($lock && time() - $lock < 300) { return; }
	if ($lock) { delete_option('almara_bootstrap_lock'); }
	if (!add_option('almara_bootstrap_lock', time(), '', false)) { return; }
	almara_import_all();
	delete_option('almara_bootstrap_lock');
}
add_action('init', 'almara_ensure_content', 30);

function almara_repair_imported_intro() {
	if (get_option('almara_intro_repair_version') === '1' || !get_option('almara_content_imported')) { return; }
	$items = array();
	foreach (almara_import_page_list() as $file => $page) {
		$items[] = array($file, $page[1], 'page', $page[2] ? 'home' : 'page');
	}
	foreach (almara_import_service_slugs() as $slug) {
		$items[] = array($slug . '/index.html', $slug, 'sluzba', 'service');
	}
	foreach ($items as $item) {
		list($file, $slug, $type, $kind) = $item;
		$post = get_page_by_path($slug, OBJECT, $type);
		$path = get_template_directory() . '/' . $file;
		if (!$post || get_post_meta($post->ID, '_almara_legacy_source', true) !== $file || !is_readable($path)) { continue; }
		foreach (almara_read_hero(file_get_contents($path), $kind) as $key => $value) {
			if ($value !== '' && !get_post_meta($post->ID, '_almara_' . $key, true)) {
				update_post_meta($post->ID, '_almara_' . $key, $value);
			}
		}
	}
	update_option('almara_intro_repair_version', '1');
}
add_action('init', 'almara_repair_imported_intro', 50);

function almara_import_result_notice() {
	if (!isset($_GET['imported']) || !current_user_can('manage_options')) { return; }
	$message = get_transient('almara_import_result_' . get_current_user_id());
	if ($message) { delete_transient('almara_import_result_' . get_current_user_id()); echo '<div class="notice notice-success"><p>' . esc_html($message) . '</p></div>'; }
}
add_action('admin_notices', 'almara_import_result_notice');
