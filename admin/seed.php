<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/session.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/includes/finance-calculations.php';

admin_session_start();

function seed_is_complete(PDO $pdo): bool
{
    $count = (int) $pdo->query('SELECT COUNT(*) FROM partners')->fetchColumn();
    return $count > 0;
}

function seed_partner_id(PDO $pdo, string $name): int
{
    $stmt = $pdo->prepare('SELECT id FROM partners WHERE name = :name LIMIT 1');
    $stmt->execute(['name' => $name]);
    $id = $stmt->fetchColumn();
    if ($id === false) {
        throw new RuntimeException('Partner not found: ' . $name);
    }
    return (int) $id;
}

function seed_category_id(PDO $pdo, string $table, string $name): int
{
    if ($table !== 'expense_categories' && $table !== 'income_categories') {
        throw new InvalidArgumentException('Invalid category table.');
    }

    $stmt = $pdo->prepare("SELECT id FROM {$table} WHERE name = :name LIMIT 1");
    $stmt->execute(['name' => $name]);
    $id = $stmt->fetchColumn();
    if ($id === false) {
        throw new RuntimeException('Category not found: ' . $name);
    }
    return (int) $id;
}

/**
 * @return array{message: string, summary: array}
 */
function seed_run(PDO $pdo, string $adminName, string $adminEmail, string $adminPassword): array
{
    $pdo->beginTransaction();

    try {
        $passwordHash = password_hash($adminPassword, PASSWORD_DEFAULT);
        if ($passwordHash === false) {
            throw new RuntimeException('Could not hash password.');
        }

        $userStmt = $pdo->prepare(
            'INSERT INTO admin_users (name, email, password_hash, role, is_active)
             VALUES (:name, :email, :password_hash, :role, 1)'
        );
        $userStmt->execute([
            'name' => $adminName,
            'email' => $adminEmail,
            'password_hash' => $passwordHash,
            'role' => 'owner',
        ]);
        $adminUserId = (int) $pdo->lastInsertId();

        $partnerStmt = $pdo->prepare(
            'INSERT INTO partners (name, admin_user_id, split_ratio, is_active)
             VALUES (:name, :admin_user_id, :split_ratio, 1)'
        );
        $partnerStmt->execute([
            'name' => 'Karan',
            'admin_user_id' => $adminUserId,
            'split_ratio' => '0.5000',
        ]);
        $partnerStmt->execute([
            'name' => 'Tirth',
            'admin_user_id' => null,
            'split_ratio' => '0.5000',
        ]);

        $karanId = seed_partner_id($pdo, 'Karan');
        $tirthId = seed_partner_id($pdo, 'Tirth');

        $expenseCategories = ['Website', 'Legal', 'Hardware', 'Software', 'Marketing', 'Travel', 'Other'];
        $catStmt = $pdo->prepare('INSERT INTO expense_categories (name, is_active) VALUES (:name, 1)');
        foreach ($expenseCategories as $category) {
            $catStmt->execute(['name' => $category]);
        }

        $incomeCategories = ['Bubble', 'Client Project', 'Retainer', 'Other'];
        $incCatStmt = $pdo->prepare('INSERT INTO income_categories (name, is_active) VALUES (:name, 1)');
        foreach ($incomeCategories as $category) {
            $incCatStmt->execute(['name' => $category]);
        }

        $websiteId = seed_category_id($pdo, 'expense_categories', 'Website');
        $legalId = seed_category_id($pdo, 'expense_categories', 'Legal');
        $hardwareId = seed_category_id($pdo, 'expense_categories', 'Hardware');
        $bubbleId = seed_category_id($pdo, 'income_categories', 'Bubble');

        $expenseStmt = $pdo->prepare(
            'INSERT INTO expenses
                (name, description, expense_date, amount, category_id, paid_by_partner_id, created_by)
             VALUES
                (:name, :description, :expense_date, :amount, :category_id, :paid_by_partner_id, :created_by)'
        );

        $expenses = [
            ['Domain', 'Purchased Domain from NamesCheap', '2026-03-05', '644.00', $websiteId, $karanId],
            ['Hosting', 'Purchased Hosting from Hoisting.india', '2026-03-05', '943.00', $websiteId, $tirthId],
            ['Notary Charges', 'Charges for notary by Mittal', '2026-03-17', '1400.00', $legalId, $tirthId],
            ['CA Fees', 'Fees paid for Deed to Mitul Kanzariya', '2026-03-31', '3500.00', $legalId, $tirthId],
            ['Headphones', 'Tirth - Headphones for calls', '2026-06-27', '1200.00', $hardwareId, $tirthId],
        ];

        foreach ($expenses as $row) {
            $expenseStmt->execute([
                'name' => $row[0],
                'description' => $row[1],
                'expense_date' => $row[2],
                'amount' => $row[3],
                'category_id' => $row[4],
                'paid_by_partner_id' => $row[5],
                'created_by' => $adminUserId,
            ]);
        }

        $incomeStmt = $pdo->prepare(
            'INSERT INTO income
                (name, description, income_date, amount, category_id, received_by_partner_id, created_by)
             VALUES
                (:name, :description, :income_date, :amount, :category_id, :received_by_partner_id, :created_by)'
        );

        $incomes = [
            ['Aprit', 'Bubble Payment', '2026-03-05', '11200.00', $bubbleId, $tirthId],
            ['Emmanual', 'Bubble Payment - Reference Code / Advance Payment', '2026-06-22', '9521.00', $bubbleId, $karanId],
        ];

        foreach ($incomes as $row) {
            $incomeStmt->execute([
                'name' => $row[0],
                'description' => $row[1],
                'income_date' => $row[2],
                'amount' => $row[3],
                'category_id' => $row[4],
                'received_by_partner_id' => $row[5],
                'created_by' => $adminUserId,
            ]);
        }

        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }

    $summary = finance_calculate_settlement_summary($pdo);

    return [
        'message' => 'Seed completed successfully.',
        'summary' => $summary,
    ];
}

$error = '';
$success = false;
$summary = null;
$alreadySeeded = false;

try {
    $pdo = db();
    $alreadySeeded = seed_is_complete($pdo);

    if ($alreadySeeded) {
        $summary = finance_calculate_settlement_summary($pdo);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $token = (string) ($_POST['csrf_token'] ?? '');
        $adminName = trim((string) ($_POST['admin_name'] ?? ''));
        $adminEmail = trim((string) ($_POST['admin_email'] ?? ''));
        $adminPassword = (string) ($_POST['admin_password'] ?? '');
        $adminPasswordConfirm = (string) ($_POST['admin_password_confirm'] ?? '');

        if (!csrf_validate($token)) {
            $error = 'Your session expired. Please refresh this page and try again.';
            csrf_token();
        } elseif ($adminName === '' || $adminEmail === '' || $adminPassword === '') {
            $error = 'Please fill in all fields.';
        } elseif (!filter_var($adminEmail, FILTER_VALIDATE_EMAIL)) {
            $error = 'Please enter a valid email address.';
        } elseif (strlen($adminPassword) < 8) {
            $error = 'Password must be at least 8 characters.';
        } elseif ($adminPassword !== $adminPasswordConfirm) {
            $error = 'Passwords do not match.';
        } else {
            $result = seed_run($pdo, $adminName, $adminEmail, $adminPassword);
            $success = true;
            $summary = $result['summary'];
            $alreadySeeded = true;
        }
    }
} catch (Throwable $e) {
    $error = 'Seed failed: ' . $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>One-time setup — KyrithBuilds Admin</title>
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body class="auth-page">
    <div class="auth-card setup-card">
        <h1 class="auth-brand">One-time setup</h1>

        <?php if ($error !== ''): ?>
            <div class="alert alert-error"><?= h($error) ?></div>
        <?php endif; ?>

        <?php if ($success): ?>
            <div class="alert alert-success">Database seeded successfully. You can now sign in.</div>
        <?php endif; ?>

        <?php if ($alreadySeeded && $summary !== null): ?>
            <p class="auth-subtitle">Current partner balance (live from database):</p>
            <div class="balance-box"><?= h($summary['balance_message']) ?></div>

            <?php if ($summary['balance_message'] === 'Karan owes Tirth ₹2,360.00'): ?>
                <div class="alert alert-success">Balance matches the expected test case.</div>
            <?php endif; ?>

            <p><strong>Next steps:</strong></p>
            <ol>
                <li>Go to <a href="/login.php">/login.php</a> and sign in with the email and password you just created.</li>
                <li>Delete <code>seed.php</code> from the server (cPanel File Manager) when done.</li>
                <li>Delete <code>db-test.php</code> if it is still on the server.</li>
            </ol>
        <?php else: ?>
            <p class="auth-subtitle">
                This runs once. It creates partners, categories, sample income/expenses, and your admin login.
            </p>

            <form method="post" action="/seed.php" autocomplete="off">
                <?= csrf_field() ?>
                <div class="form-group">
                    <label for="admin_name">Your name</label>
                    <input type="text" id="admin_name" name="admin_name" required value="<?= h((string) ($_POST['admin_name'] ?? 'Karan')) ?>">
                </div>
                <div class="form-group">
                    <label for="admin_email">Admin email (for login)</label>
                    <input type="email" id="admin_email" name="admin_email" required value="<?= h((string) ($_POST['admin_email'] ?? '')) ?>">
                </div>
                <div class="form-group">
                    <label for="admin_password">Temporary password (min 8 characters)</label>
                    <input type="password" id="admin_password" name="admin_password" required minlength="8" autocomplete="new-password">
                </div>
                <div class="form-group">
                    <label for="admin_password_confirm">Confirm password</label>
                    <input type="password" id="admin_password_confirm" name="admin_password_confirm" required minlength="8" autocomplete="new-password">
                </div>
                <button type="submit" class="btn">Run setup</button>
            </form>
        <?php endif; ?>
    </div>
</body>
</html>
