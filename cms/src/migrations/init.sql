CREATE TABLE `media` (
	`id` integer PRIMARY KEY NOT NULL,
	`alt` text NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`url` text,
	`thumbnail_u_r_l` text,
	`filename` text,
	`mime_type` text,
	`filesize` numeric,
	`width` numeric,
	`height` numeric,
	`focal_x` numeric,
	`focal_y` numeric,
	`sizes_thumbnail_url` text,
	`sizes_thumbnail_width` numeric,
	`sizes_thumbnail_height` numeric,
	`sizes_thumbnail_mime_type` text,
	`sizes_thumbnail_filesize` numeric,
	`sizes_thumbnail_filename` text,
	`sizes_card_url` text,
	`sizes_card_width` numeric,
	`sizes_card_height` numeric,
	`sizes_card_mime_type` text,
	`sizes_card_filesize` numeric,
	`sizes_card_filename` text,
	`sizes_hero_url` text,
	`sizes_hero_width` numeric,
	`sizes_hero_height` numeric,
	`sizes_hero_mime_type` text,
	`sizes_hero_filesize` numeric,
	`sizes_hero_filename` text,
	`sizes_full_url` text,
	`sizes_full_width` numeric,
	`sizes_full_height` numeric,
	`sizes_full_mime_type` text,
	`sizes_full_filesize` numeric,
	`sizes_full_filename` text
);
CREATE INDEX `media_updated_at_idx` ON `media` (`updated_at`);
CREATE INDEX `media_created_at_idx` ON `media` (`created_at`);
CREATE UNIQUE INDEX `media_filename_idx` ON `media` (`filename`);
CREATE INDEX `media_sizes_thumbnail_sizes_thumbnail_filename_idx` ON `media` (`sizes_thumbnail_filename`);
CREATE INDEX `media_sizes_card_sizes_card_filename_idx` ON `media` (`sizes_card_filename`);
CREATE INDEX `media_sizes_hero_sizes_hero_filename_idx` ON `media` (`sizes_hero_filename`);
CREATE INDEX `media_sizes_full_sizes_full_filename_idx` ON `media` (`sizes_full_filename`);
CREATE TABLE `services_supporting_pillars` (
	`order` integer NOT NULL,
	`parent_id` integer NOT NULL,
	`value` text,
	`id` integer PRIMARY KEY NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `services_supporting_pillars_order_idx` ON `services_supporting_pillars` (`order`);
CREATE INDEX `services_supporting_pillars_parent_idx` ON `services_supporting_pillars` (`parent_id`);
CREATE TABLE `services_process` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`step_title` text NOT NULL,
	`step_description` text NOT NULL,
	`step_image_id` integer,
	FOREIGN KEY (`step_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`_parent_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `services_process_order_idx` ON `services_process` (`_order`);
CREATE INDEX `services_process_parent_id_idx` ON `services_process` (`_parent_id`);
CREATE INDEX `services_process_step_image_idx` ON `services_process` (`step_image_id`);
CREATE TABLE `services` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`tagline` text NOT NULL,
	`primary_value_pillar` text NOT NULL,
	`service_type` text DEFAULT 'core',
	`hero_image_id` integer NOT NULL,
	`overview` text NOT NULL,
	`anxiety_stack_structural_safety` text,
	`anxiety_stack_code_compliance` text,
	`anxiety_stack_drainage_moisture` text,
	`anxiety_stack_dust_disruption` text,
	`anxiety_stack_cost_affordability` text,
	`anxiety_stack_aesthetics` text,
	`anxiety_stack_timeline` text,
	`differentiator` text,
	`cta_headline` text,
	`seo_meta_title` text NOT NULL,
	`seo_meta_description` text NOT NULL,
	`seo_og_image_id` integer,
	`status` text DEFAULT 'draft' NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`hero_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`seo_og_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE UNIQUE INDEX `services_slug_idx` ON `services` (`slug`);
CREATE INDEX `services_hero_image_idx` ON `services` (`hero_image_id`);
CREATE INDEX `services_seo_seo_og_image_idx` ON `services` (`seo_og_image_id`);
CREATE INDEX `services_updated_at_idx` ON `services` (`updated_at`);
CREATE INDEX `services_created_at_idx` ON `services` (`created_at`);
CREATE TABLE `services_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`faqs_id` integer,
	`projects_id` integer,
	`reviews_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`faqs_id`) REFERENCES `faqs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`projects_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`reviews_id`) REFERENCES `reviews`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `services_rels_order_idx` ON `services_rels` (`order`);
CREATE INDEX `services_rels_parent_idx` ON `services_rels` (`parent_id`);
CREATE INDEX `services_rels_path_idx` ON `services_rels` (`path`);
CREATE INDEX `services_rels_faqs_id_idx` ON `services_rels` (`faqs_id`);
CREATE INDEX `services_rels_projects_id_idx` ON `services_rels` (`projects_id`);
CREATE INDEX `services_rels_reviews_id_idx` ON `services_rels` (`reviews_id`);
CREATE TABLE `service_areas` (
	`id` integer PRIMARY KEY NOT NULL,
	`city_name` text NOT NULL,
	`state_abbrev` text DEFAULT 'UT' NOT NULL,
	`slug` text NOT NULL,
	`county` text NOT NULL,
	`coordinates_lat` numeric NOT NULL,
	`coordinates_lng` numeric NOT NULL,
	`service_radius` numeric DEFAULT 15 NOT NULL,
	`local_content` text NOT NULL,
	`local_references` text NOT NULL,
	`hero_image_id` integer,
	`seo_meta_title` text NOT NULL,
	`seo_meta_description` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`hero_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE UNIQUE INDEX `service_areas_slug_idx` ON `service_areas` (`slug`);
CREATE INDEX `service_areas_hero_image_idx` ON `service_areas` (`hero_image_id`);
CREATE INDEX `service_areas_updated_at_idx` ON `service_areas` (`updated_at`);
CREATE INDEX `service_areas_created_at_idx` ON `service_areas` (`created_at`);
CREATE TABLE `service_areas_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`projects_id` integer,
	`reviews_id` integer,
	`faqs_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `service_areas`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`projects_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`reviews_id`) REFERENCES `reviews`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`faqs_id`) REFERENCES `faqs`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `service_areas_rels_order_idx` ON `service_areas_rels` (`order`);
CREATE INDEX `service_areas_rels_parent_idx` ON `service_areas_rels` (`parent_id`);
CREATE INDEX `service_areas_rels_path_idx` ON `service_areas_rels` (`path`);
CREATE INDEX `service_areas_rels_projects_id_idx` ON `service_areas_rels` (`projects_id`);
CREATE INDEX `service_areas_rels_reviews_id_idx` ON `service_areas_rels` (`reviews_id`);
CREATE INDEX `service_areas_rels_faqs_id_idx` ON `service_areas_rels` (`faqs_id`);
CREATE TABLE `faqs` (
	`id` integer PRIMARY KEY NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`category` text NOT NULL,
	`sort_order` numeric DEFAULT 0,
	`status` text DEFAULT 'draft' NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE INDEX `faqs_updated_at_idx` ON `faqs` (`updated_at`);
CREATE INDEX `faqs_created_at_idx` ON `faqs` (`created_at`);
CREATE TABLE `faqs_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`services_id` integer,
	`service_areas_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `faqs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`services_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`service_areas_id`) REFERENCES `service_areas`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `faqs_rels_order_idx` ON `faqs_rels` (`order`);
CREATE INDEX `faqs_rels_parent_idx` ON `faqs_rels` (`parent_id`);
CREATE INDEX `faqs_rels_path_idx` ON `faqs_rels` (`path`);
CREATE INDEX `faqs_rels_services_id_idx` ON `faqs_rels` (`services_id`);
CREATE INDEX `faqs_rels_service_areas_id_idx` ON `faqs_rels` (`service_areas_id`);
CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY NOT NULL,
	`reviewer_name` text NOT NULL,
	`review_text` text NOT NULL,
	`star_rating` numeric NOT NULL,
	`city_id` integer,
	`service_type_id` integer,
	`source` text NOT NULL,
	`review_date` text,
	`featured` integer DEFAULT false,
	`status` text DEFAULT 'draft' NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`city_id`) REFERENCES `service_areas`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`service_type_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE INDEX `reviews_city_idx` ON `reviews` (`city_id`);
CREATE INDEX `reviews_service_type_idx` ON `reviews` (`service_type_id`);
CREATE INDEX `reviews_updated_at_idx` ON `reviews` (`updated_at`);
CREATE INDEX `reviews_created_at_idx` ON `reviews` (`created_at`);
CREATE TABLE `projects_before_images` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`image_id` integer NOT NULL,
	`caption` text,
	FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`_parent_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `projects_before_images_order_idx` ON `projects_before_images` (`_order`);
CREATE INDEX `projects_before_images_parent_id_idx` ON `projects_before_images` (`_parent_id`);
CREATE INDEX `projects_before_images_image_idx` ON `projects_before_images` (`image_id`);
CREATE TABLE `projects_after_images` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`image_id` integer NOT NULL,
	`caption` text,
	FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`_parent_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `projects_after_images_order_idx` ON `projects_after_images` (`_order`);
CREATE INDEX `projects_after_images_parent_id_idx` ON `projects_after_images` (`_parent_id`);
CREATE INDEX `projects_after_images_image_idx` ON `projects_after_images` (`image_id`);
CREATE TABLE `projects_detail_images` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`image_id` integer NOT NULL,
	`caption` text,
	FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`_parent_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `projects_detail_images_order_idx` ON `projects_detail_images` (`_order`);
CREATE INDEX `projects_detail_images_parent_id_idx` ON `projects_detail_images` (`_parent_id`);
CREATE INDEX `projects_detail_images_image_idx` ON `projects_detail_images` (`image_id`);
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`project_type_id` integer NOT NULL,
	`city_id` integer NOT NULL,
	`challenge` text NOT NULL,
	`solution` text NOT NULL,
	`outcome` text NOT NULL,
	`featured` integer DEFAULT false,
	`seo_meta_title` text,
	`seo_meta_description` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`project_type_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`city_id`) REFERENCES `service_areas`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE UNIQUE INDEX `projects_slug_idx` ON `projects` (`slug`);
CREATE INDEX `projects_project_type_idx` ON `projects` (`project_type_id`);
CREATE INDEX `projects_city_idx` ON `projects` (`city_id`);
CREATE INDEX `projects_updated_at_idx` ON `projects` (`updated_at`);
CREATE INDEX `projects_created_at_idx` ON `projects` (`created_at`);
CREATE TABLE `leads` (
	`id` integer PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`status` text DEFAULT 'partial' NOT NULL,
	`current_step` numeric DEFAULT 0 NOT NULL,
	`service_type` text,
	`zip_code` text,
	`project_purpose` text,
	`timeline` text,
	`name` text,
	`phone` text,
	`email` text,
	`address` text,
	`additional_notes` text,
	`source_page` text NOT NULL,
	`source_utm_source` text,
	`source_utm_medium` text,
	`source_utm_campaign` text,
	`source_utm_content` text,
	`source_utm_term` text,
	`source_referrer` text,
	`is_out_of_service_area` integer DEFAULT false,
	`form_type` text NOT NULL,
	`confirmation_sent_at` text,
	`team_notified_at` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE INDEX `leads_updated_at_idx` ON `leads` (`updated_at`);
CREATE INDEX `leads_created_at_idx` ON `leads` (`created_at`);
CREATE TABLE `offers_applicable_pages` (
	`order` integer NOT NULL,
	`parent_id` integer NOT NULL,
	`value` text,
	`id` integer PRIMARY KEY NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `offers`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `offers_applicable_pages_order_idx` ON `offers_applicable_pages` (`order`);
CREATE INDEX `offers_applicable_pages_parent_idx` ON `offers_applicable_pages` (`parent_id`);
CREATE TABLE `offers` (
	`id` integer PRIMARY KEY NOT NULL,
	`headline` text NOT NULL,
	`description` text NOT NULL,
	`terms` text,
	`start_date` text NOT NULL,
	`end_date` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE INDEX `offers_updated_at_idx` ON `offers` (`updated_at`);
CREATE INDEX `offers_created_at_idx` ON `offers` (`created_at`);
CREATE TABLE `offers_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`services_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `offers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`services_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `offers_rels_order_idx` ON `offers_rels` (`order`);
CREATE INDEX `offers_rels_parent_idx` ON `offers_rels` (`parent_id`);
CREATE INDEX `offers_rels_path_idx` ON `offers_rels` (`path`);
CREATE INDEX `offers_rels_services_id_idx` ON `offers_rels` (`services_id`);
CREATE TABLE `paid_landing_pages_trust_badges` (
	`order` integer NOT NULL,
	`parent_id` integer NOT NULL,
	`value` text,
	`id` integer PRIMARY KEY NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `paid_landing_pages`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `paid_landing_pages_trust_badges_order_idx` ON `paid_landing_pages_trust_badges` (`order`);
CREATE INDEX `paid_landing_pages_trust_badges_parent_idx` ON `paid_landing_pages_trust_badges` (`parent_id`);
CREATE TABLE `paid_landing_pages` (
	`id` integer PRIMARY KEY NOT NULL,
	`campaign_slug` text NOT NULL,
	`headline` text NOT NULL,
	`subheadline` text,
	`hero_image_id` integer,
	`body_content` text NOT NULL,
	`form_type` text NOT NULL,
	`offer_id` integer,
	`target_service_id` integer,
	`suppress_navigation` integer DEFAULT true,
	`utm_campaign` text,
	`seo_meta_title` text NOT NULL,
	`seo_meta_description` text NOT NULL,
	`seo_noindex` integer DEFAULT true,
	`status` text DEFAULT 'draft' NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`hero_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`offer_id`) REFERENCES `offers`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`target_service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE UNIQUE INDEX `paid_landing_pages_campaign_slug_idx` ON `paid_landing_pages` (`campaign_slug`);
CREATE INDEX `paid_landing_pages_hero_image_idx` ON `paid_landing_pages` (`hero_image_id`);
CREATE INDEX `paid_landing_pages_offer_idx` ON `paid_landing_pages` (`offer_id`);
CREATE INDEX `paid_landing_pages_target_service_idx` ON `paid_landing_pages` (`target_service_id`);
CREATE INDEX `paid_landing_pages_updated_at_idx` ON `paid_landing_pages` (`updated_at`);
CREATE INDEX `paid_landing_pages_created_at_idx` ON `paid_landing_pages` (`created_at`);
CREATE TABLE `lead_magnets_required_fields` (
	`order` integer NOT NULL,
	`parent_id` integer NOT NULL,
	`value` text,
	`id` integer PRIMARY KEY NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `lead_magnets`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `lead_magnets_required_fields_order_idx` ON `lead_magnets_required_fields` (`order`);
CREATE INDEX `lead_magnets_required_fields_parent_idx` ON `lead_magnets_required_fields` (`parent_id`);
CREATE TABLE `lead_magnets` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text NOT NULL,
	`file_id` integer NOT NULL,
	`thumbnail_image_id` integer,
	`cta_text` text DEFAULT 'Download Free Guide' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`file_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`thumbnail_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE UNIQUE INDEX `lead_magnets_slug_idx` ON `lead_magnets` (`slug`);
CREATE INDEX `lead_magnets_file_idx` ON `lead_magnets` (`file_id`);
CREATE INDEX `lead_magnets_thumbnail_image_idx` ON `lead_magnets` (`thumbnail_image_id`);
CREATE INDEX `lead_magnets_updated_at_idx` ON `lead_magnets` (`updated_at`);
CREATE INDEX `lead_magnets_created_at_idx` ON `lead_magnets` (`created_at`);
CREATE TABLE `blog_posts` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`excerpt` text NOT NULL,
	`hero_image_id` integer,
	`content` text NOT NULL,
	`category` text NOT NULL,
	`lead_magnet_c_t_a_id` integer,
	`author` text NOT NULL,
	`publish_date` text NOT NULL,
	`seo_meta_title` text NOT NULL,
	`seo_meta_description` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`hero_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`lead_magnet_c_t_a_id`) REFERENCES `lead_magnets`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE UNIQUE INDEX `blog_posts_slug_idx` ON `blog_posts` (`slug`);
CREATE INDEX `blog_posts_hero_image_idx` ON `blog_posts` (`hero_image_id`);
CREATE INDEX `blog_posts_lead_magnet_c_t_a_idx` ON `blog_posts` (`lead_magnet_c_t_a_id`);
CREATE INDEX `blog_posts_updated_at_idx` ON `blog_posts` (`updated_at`);
CREATE INDEX `blog_posts_created_at_idx` ON `blog_posts` (`created_at`);
CREATE TABLE `blog_posts_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`services_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `blog_posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`services_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `blog_posts_rels_order_idx` ON `blog_posts_rels` (`order`);
CREATE INDEX `blog_posts_rels_parent_idx` ON `blog_posts_rels` (`parent_id`);
CREATE INDEX `blog_posts_rels_path_idx` ON `blog_posts_rels` (`path`);
CREATE INDEX `blog_posts_rels_services_id_idx` ON `blog_posts_rels` (`services_id`);
CREATE TABLE `payload_kv` (
	`id` integer PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`data` text NOT NULL
);
CREATE UNIQUE INDEX `payload_kv_key_idx` ON `payload_kv` (`key`);
CREATE TABLE `users_sessions` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text,
	`expires_at` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `users_sessions_order_idx` ON `users_sessions` (`_order`);
CREATE INDEX `users_sessions_parent_id_idx` ON `users_sessions` (`_parent_id`);
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`email` text NOT NULL,
	`reset_password_token` text,
	`reset_password_expiration` text,
	`salt` text,
	`hash` text,
	`login_attempts` numeric DEFAULT 0,
	`lock_until` text
);
CREATE INDEX `users_updated_at_idx` ON `users` (`updated_at`);
CREATE INDEX `users_created_at_idx` ON `users` (`created_at`);
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);
CREATE TABLE `payload_locked_documents` (
	`id` integer PRIMARY KEY NOT NULL,
	`global_slug` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE INDEX `payload_locked_documents_global_slug_idx` ON `payload_locked_documents` (`global_slug`);
CREATE INDEX `payload_locked_documents_updated_at_idx` ON `payload_locked_documents` (`updated_at`);
CREATE INDEX `payload_locked_documents_created_at_idx` ON `payload_locked_documents` (`created_at`);
CREATE TABLE `payload_locked_documents_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`media_id` integer,
	`services_id` integer,
	`service_areas_id` integer,
	`faqs_id` integer,
	`reviews_id` integer,
	`projects_id` integer,
	`leads_id` integer,
	`offers_id` integer,
	`paid_landing_pages_id` integer,
	`lead_magnets_id` integer,
	`blog_posts_id` integer,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `payload_locked_documents`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`services_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`service_areas_id`) REFERENCES `service_areas`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`faqs_id`) REFERENCES `faqs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`reviews_id`) REFERENCES `reviews`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`projects_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`leads_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`offers_id`) REFERENCES `offers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`paid_landing_pages_id`) REFERENCES `paid_landing_pages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`lead_magnets_id`) REFERENCES `lead_magnets`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`blog_posts_id`) REFERENCES `blog_posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `payload_locked_documents_rels_order_idx` ON `payload_locked_documents_rels` (`order`);
CREATE INDEX `payload_locked_documents_rels_parent_idx` ON `payload_locked_documents_rels` (`parent_id`);
CREATE INDEX `payload_locked_documents_rels_path_idx` ON `payload_locked_documents_rels` (`path`);
CREATE INDEX `payload_locked_documents_rels_media_id_idx` ON `payload_locked_documents_rels` (`media_id`);
CREATE INDEX `payload_locked_documents_rels_services_id_idx` ON `payload_locked_documents_rels` (`services_id`);
CREATE INDEX `payload_locked_documents_rels_service_areas_id_idx` ON `payload_locked_documents_rels` (`service_areas_id`);
CREATE INDEX `payload_locked_documents_rels_faqs_id_idx` ON `payload_locked_documents_rels` (`faqs_id`);
CREATE INDEX `payload_locked_documents_rels_reviews_id_idx` ON `payload_locked_documents_rels` (`reviews_id`);
CREATE INDEX `payload_locked_documents_rels_projects_id_idx` ON `payload_locked_documents_rels` (`projects_id`);
CREATE INDEX `payload_locked_documents_rels_leads_id_idx` ON `payload_locked_documents_rels` (`leads_id`);
CREATE INDEX `payload_locked_documents_rels_offers_id_idx` ON `payload_locked_documents_rels` (`offers_id`);
CREATE INDEX `payload_locked_documents_rels_paid_landing_pages_id_idx` ON `payload_locked_documents_rels` (`paid_landing_pages_id`);
CREATE INDEX `payload_locked_documents_rels_lead_magnets_id_idx` ON `payload_locked_documents_rels` (`lead_magnets_id`);
CREATE INDEX `payload_locked_documents_rels_blog_posts_id_idx` ON `payload_locked_documents_rels` (`blog_posts_id`);
CREATE INDEX `payload_locked_documents_rels_users_id_idx` ON `payload_locked_documents_rels` (`users_id`);
CREATE TABLE `payload_preferences` (
	`id` integer PRIMARY KEY NOT NULL,
	`key` text,
	`value` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE INDEX `payload_preferences_key_idx` ON `payload_preferences` (`key`);
CREATE INDEX `payload_preferences_updated_at_idx` ON `payload_preferences` (`updated_at`);
CREATE INDEX `payload_preferences_created_at_idx` ON `payload_preferences` (`created_at`);
CREATE TABLE `payload_preferences_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `payload_preferences`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `payload_preferences_rels_order_idx` ON `payload_preferences_rels` (`order`);
CREATE INDEX `payload_preferences_rels_parent_idx` ON `payload_preferences_rels` (`parent_id`);
CREATE INDEX `payload_preferences_rels_path_idx` ON `payload_preferences_rels` (`path`);
CREATE INDEX `payload_preferences_rels_users_id_idx` ON `payload_preferences_rels` (`users_id`);
CREATE TABLE `payload_migrations` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`batch` numeric,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE INDEX `payload_migrations_updated_at_idx` ON `payload_migrations` (`updated_at`);
CREATE INDEX `payload_migrations_created_at_idx` ON `payload_migrations` (`created_at`);
CREATE TABLE `site_settings_operating_hours` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`day` text NOT NULL,
	`open` text NOT NULL,
	`close` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `site_settings`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `site_settings_operating_hours_order_idx` ON `site_settings_operating_hours` (`_order`);
CREATE INDEX `site_settings_operating_hours_parent_id_idx` ON `site_settings_operating_hours` (`_parent_id`);
CREATE TABLE `site_settings_risk_reversals` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`statement` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `site_settings`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `site_settings_risk_reversals_order_idx` ON `site_settings_risk_reversals` (`_order`);
CREATE INDEX `site_settings_risk_reversals_parent_id_idx` ON `site_settings_risk_reversals` (`_parent_id`);
CREATE TABLE `site_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`business_name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text NOT NULL,
	`address_street` text NOT NULL,
	`address_city` text NOT NULL,
	`address_state` text NOT NULL,
	`address_zip` text NOT NULL,
	`license_number` text,
	`insurance_info` text,
	`social_links_google` text,
	`social_links_facebook` text,
	`social_links_instagram` text,
	`show_reviews` integer DEFAULT false,
	`show_gallery` integer DEFAULT false,
	`service_area_zip_codes` text,
	`updated_at` text,
	`created_at` text
);
CREATE TABLE `navigation_main_nav_children` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`url` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `navigation_main_nav`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `navigation_main_nav_children_order_idx` ON `navigation_main_nav_children` (`_order`);
CREATE INDEX `navigation_main_nav_children_parent_id_idx` ON `navigation_main_nav_children` (`_parent_id`);
CREATE TABLE `navigation_main_nav` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`url` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `navigation`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `navigation_main_nav_order_idx` ON `navigation_main_nav` (`_order`);
CREATE INDEX `navigation_main_nav_parent_id_idx` ON `navigation_main_nav` (`_parent_id`);
CREATE TABLE `navigation_footer_nav_links` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`url` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `navigation_footer_nav`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `navigation_footer_nav_links_order_idx` ON `navigation_footer_nav_links` (`_order`);
CREATE INDEX `navigation_footer_nav_links_parent_id_idx` ON `navigation_footer_nav_links` (`_parent_id`);
CREATE TABLE `navigation_footer_nav` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`heading` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `navigation`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `navigation_footer_nav_order_idx` ON `navigation_footer_nav` (`_order`);
CREATE INDEX `navigation_footer_nav_parent_id_idx` ON `navigation_footer_nav` (`_parent_id`);
CREATE TABLE `navigation` (
	`id` integer PRIMARY KEY NOT NULL,
	`updated_at` text,
	`created_at` text
);
INSERT INTO payload_migrations (name, batch) VALUES ('20260326_161312', 1);
