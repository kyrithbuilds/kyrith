-- Run this ONLY if your first schema.sql import stopped at the settlements table.
-- Your database already has 10 tables; this creates the 3 that were skipped.
-- Safe to run: uses CREATE TABLE IF NOT EXISTS.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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

SET FOREIGN_KEY_CHECKS = 1;
