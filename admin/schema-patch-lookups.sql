-- Run once in phpMyAdmin after existing schema is in place.
-- Adds configurable lookup options + project type; widens status columns for dynamic values.

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS lookup_options (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
    group_key       VARCHAR(40) NOT NULL,
    option_key      VARCHAR(40) NOT NULL,
    label           VARCHAR(80) NOT NULL,
    sort_order      SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    is_active       TINYINT(1) NOT NULL DEFAULT 1,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_lookup_group_option (group_key, option_key),
    KEY idx_lookup_group_active (group_key, is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Widen ENUM status columns so options are configurable from Settings.
ALTER TABLE clients MODIFY status VARCHAR(40) NOT NULL DEFAULT 'lead';
ALTER TABLE projects MODIFY status VARCHAR(40) NOT NULL DEFAULT 'planned';
ALTER TABLE invoices MODIFY status VARCHAR(40) NOT NULL DEFAULT 'draft';

-- Project type (Fixed Cost / Dedicated / Hourly — managed in Settings).
-- Skip this line if you already ran it and get "duplicate column" error.
ALTER TABLE projects ADD COLUMN project_type VARCHAR(40) NULL AFTER status;

INSERT IGNORE INTO lookup_options (group_key, option_key, label, sort_order) VALUES
    ('client_status', 'lead', 'Lead', 10),
    ('client_status', 'active', 'Active', 20),
    ('client_status', 'paused', 'Paused', 30),
    ('client_status', 'churned', 'Churned', 40),
    ('project_status', 'planned', 'Planned', 10),
    ('project_status', 'active', 'Active', 20),
    ('project_status', 'on_hold', 'On Hold', 30),
    ('project_status', 'completed', 'Completed', 40),
    ('project_status', 'cancelled', 'Cancelled', 50),
    ('project_type', 'fixed_cost', 'Fixed Cost', 10),
    ('project_type', 'dedicated', 'Dedicated', 20),
    ('project_type', 'hourly', 'Hourly', 30),
    ('invoice_status', 'draft', 'Draft', 10),
    ('invoice_status', 'sent', 'Sent', 20),
    ('invoice_status', 'paid', 'Paid', 30),
    ('invoice_status', 'overdue', 'Overdue', 40),
    ('invoice_status', 'void', 'Void', 50);
