-- KyrithBuilds Admin Panel — Master Database Schema
-- Run once via phpMyAdmin (cPanel) or MySQL CLI.
-- Seed data (partners, categories, sample transactions) is in seed.php, not here.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ========== CORE / AUTH ==========

CREATE TABLE IF NOT EXISTS admin_users (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    role            ENUM('owner', 'partner', 'staff') NOT NULL DEFAULT 'partner',
    is_active       TINYINT(1) NOT NULL DEFAULT 1,
    last_login_at   DATETIME NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_admin_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS login_attempts (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
    email           VARCHAR(150) NOT NULL,
    ip_address      VARCHAR(45) NOT NULL,
    succeeded       TINYINT(1) NOT NULL DEFAULT 0,
    attempted_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_login_attempts_email_attempted (email, attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS partners (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL,
    admin_user_id   INT UNSIGNED NULL,
    split_ratio     DECIMAL(5,4) NOT NULL DEFAULT 0.5000,
    is_active       TINYINT(1) NOT NULL DEFAULT 1,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_partners_admin_user_id (admin_user_id),
    CONSTRAINT fk_partners_admin_user
        FOREIGN KEY (admin_user_id) REFERENCES admin_users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== CLIENTS / PROJECTS / INVOICES (tables now, UI later) ==========

CREATE TABLE IF NOT EXISTS clients (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
    company_name    VARCHAR(150) NOT NULL,
    contact_name    VARCHAR(150) NULL,
    contact_email   VARCHAR(150) NULL,
    contact_phone   VARCHAR(30) NULL,
    billing_address TEXT NULL,
    status          VARCHAR(40) NOT NULL DEFAULT 'lead',
    notes           TEXT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS projects (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
    client_id       INT UNSIGNED NOT NULL,
    name            VARCHAR(150) NOT NULL,
    description     TEXT NULL,
    status          VARCHAR(40) NOT NULL DEFAULT 'planned',
    project_type    VARCHAR(40) NULL,
    start_date      DATE NULL,
    end_date        DATE NULL,
    budget_amount   DECIMAL(12,2) NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_projects_client_id (client_id),
    KEY idx_projects_status (status),
    CONSTRAINT fk_projects_client
        FOREIGN KEY (client_id) REFERENCES clients (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS invoices (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
    client_id       INT UNSIGNED NOT NULL,
    project_id      INT UNSIGNED NULL,
    invoice_number  VARCHAR(40) NOT NULL,
    status          VARCHAR(40) NOT NULL DEFAULT 'draft',
    issue_date      DATE NOT NULL,
    due_date        DATE NOT NULL,
    subtotal_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    tax_amount      DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_amount    DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    currency        VARCHAR(3) NOT NULL DEFAULT 'INR',
    notes           TEXT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_invoices_invoice_number (invoice_number),
    KEY idx_invoices_client_id (client_id),
    KEY idx_invoices_status (status),
    CONSTRAINT fk_invoices_client
        FOREIGN KEY (client_id) REFERENCES clients (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_invoices_project
        FOREIGN KEY (project_id) REFERENCES projects (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== FINANCE ==========

CREATE TABLE IF NOT EXISTS expense_categories (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name            VARCHAR(60) NOT NULL,
    is_active       TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uq_expense_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS income_categories (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name            VARCHAR(60) NOT NULL,
    is_active       TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uq_income_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS expenses (
    id                  INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name                VARCHAR(150) NOT NULL,
    description         TEXT NULL,
    expense_date        DATE NOT NULL,
    amount              DECIMAL(12,2) NOT NULL,
    category_id         INT UNSIGNED NOT NULL,
    paid_by_partner_id  INT UNSIGNED NOT NULL,
    project_id          INT UNSIGNED NULL,
    created_by          INT UNSIGNED NOT NULL,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_expenses_expense_date (expense_date),
    KEY idx_expenses_paid_by_partner_id (paid_by_partner_id),
    KEY idx_expenses_category_id (category_id),
    CONSTRAINT fk_expenses_category
        FOREIGN KEY (category_id) REFERENCES expense_categories (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_expenses_paid_by_partner
        FOREIGN KEY (paid_by_partner_id) REFERENCES partners (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_expenses_project
        FOREIGN KEY (project_id) REFERENCES projects (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_expenses_created_by
        FOREIGN KEY (created_by) REFERENCES admin_users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS income (
    id                      INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name                    VARCHAR(150) NOT NULL,
    description             TEXT NULL,
    income_date             DATE NOT NULL,
    amount                  DECIMAL(12,2) NOT NULL,
    category_id             INT UNSIGNED NOT NULL,
    received_by_partner_id  INT UNSIGNED NOT NULL,
    project_id              INT UNSIGNED NULL,
    invoice_id              INT UNSIGNED NULL,
    created_by              INT UNSIGNED NOT NULL,
    created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_income_income_date (income_date),
    KEY idx_income_received_by_partner_id (received_by_partner_id),
    KEY idx_income_category_id (category_id),
    CONSTRAINT fk_income_category
        FOREIGN KEY (category_id) REFERENCES income_categories (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_income_received_by_partner
        FOREIGN KEY (received_by_partner_id) REFERENCES partners (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_income_project
        FOREIGN KEY (project_id) REFERENCES projects (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_income_invoice
        FOREIGN KEY (invoice_id) REFERENCES invoices (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_income_created_by
        FOREIGN KEY (created_by) REFERENCES admin_users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS settlements (
    id                  INT UNSIGNED NOT NULL AUTO_INCREMENT,
    from_partner_id     INT UNSIGNED NOT NULL,
    to_partner_id       INT UNSIGNED NOT NULL,
    amount              DECIMAL(12,2) NOT NULL,
    settlement_date     DATE NOT NULL,
    note                VARCHAR(255) NULL,
    created_by          INT UNSIGNED NOT NULL,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_settlements_settlement_date (settlement_date),
    -- Note: "from" and "to" must differ — enforced in PHP (settlements-create.php),
    -- not via CHECK constraint (not supported on all cPanel MariaDB/MySQL versions).
    CONSTRAINT fk_settlements_from_partner
        FOREIGN KEY (from_partner_id) REFERENCES partners (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_settlements_to_partner
        FOREIGN KEY (to_partner_id) REFERENCES partners (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_settlements_created_by
        FOREIGN KEY (created_by) REFERENCES admin_users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS invoice_items (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
    invoice_id      INT UNSIGNED NOT NULL,
    description     VARCHAR(255) NOT NULL,
    quantity        DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    unit_price      DECIMAL(12,2) NOT NULL,
    line_total      DECIMAL(12,2) NOT NULL,
    sort_order      INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY idx_invoice_items_invoice_id (invoice_id),
    CONSTRAINT fk_invoice_items_invoice
        FOREIGN KEY (invoice_id) REFERENCES invoices (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- ========== AUDIT ==========

CREATE TABLE IF NOT EXISTS activity_log (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
    admin_user_id   INT UNSIGNED NOT NULL,
    action          VARCHAR(100) NOT NULL,
    entity_type     VARCHAR(50) NOT NULL,
    entity_id       INT UNSIGNED NULL,
    details         TEXT NULL,
    ip_address      VARCHAR(45) NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_activity_log_created_at (created_at),
    KEY idx_activity_log_admin_user_id (admin_user_id),
    CONSTRAINT fk_activity_log_admin_user
        FOREIGN KEY (admin_user_id) REFERENCES admin_users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

SET FOREIGN_KEY_CHECKS = 1;
