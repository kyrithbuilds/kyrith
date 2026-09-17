(function () {
    const cfg = window.KB_FINANCE;
    if (!cfg) return;

    const ui = window.KB_ui;
    const modal = document.getElementById('finance-modal');
    const form = document.getElementById('finance-form');
    const title = document.getElementById('finance-modal-title');
    const addBtn = document.getElementById('finance-add-btn');
    const closeBtn = document.getElementById('finance-modal-close');
    const errorBox = document.getElementById('finance-form-error');
    const table = document.getElementById('finance-table');
    const entityName = cfg.type === 'income' ? 'Income' : 'Expense';
    let busy = false;

    function openModal(mode, row) {
        if (!modal || !form) return;
        if (errorBox) errorBox.hidden = true;
        if (ui) ui.clearFieldErrors(form);

        if (mode === 'create') {
            title.textContent = cfg.type === 'income' ? 'Add income' : 'Add expense';
            form.reset();
            document.getElementById('finance-id').value = '';
            document.getElementById('finance-date').value = new Date().toISOString().slice(0, 10);
        } else if (row) {
            title.textContent = cfg.type === 'income' ? 'Edit income' : 'Edit expense';
            document.getElementById('finance-id').value = row.dataset.id || '';
            document.getElementById('finance-name').value = row.dataset.name || '';
            document.getElementById('finance-description').value = row.dataset.description || '';
            document.getElementById('finance-date').value = row.dataset.date || '';
            document.getElementById('finance-amount').value = row.dataset.amount || '';
            document.getElementById('finance-category').value = row.dataset.categoryId || '';
            document.getElementById('finance-partner').value = row.dataset.partnerId || '';
        }

        modal.hidden = false;
    }

    function closeModal() {
        if (modal) modal.hidden = true;
    }

    function validateForm() {
        const errors = {};
        if (!document.getElementById('finance-name').value.trim()) {
            errors['finance-name'] = 'Enter a name.';
        }
        const amount = parseFloat(document.getElementById('finance-amount').value);
        if (!document.getElementById('finance-amount').value || isNaN(amount) || amount <= 0) {
            errors['finance-amount'] = 'Enter an amount greater than 0.';
        }
        if (!document.getElementById('finance-date').value) {
            errors['finance-date'] = 'Select a date.';
        }
        if (!document.getElementById('finance-category').value) {
            errors['finance-category'] = 'Select a category.';
        }
        if (!document.getElementById('finance-partner').value) {
            errors['finance-partner'] = 'Select a partner.';
        }
        return errors;
    }

    if (addBtn) addBtn.addEventListener('click', function () { openModal('create'); });
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });
    }

    if (table) {
        table.addEventListener('click', function (e) {
            const editBtn = e.target.closest('.finance-edit-btn');
            const deleteBtn = e.target.closest('.finance-delete-btn');
            const row = e.target.closest('tr[data-id]');
            if (!row) return;

            if (editBtn) {
                openModal('edit', row);
                return;
            }

            if (deleteBtn && ui) {
                const actionsCell = deleteBtn.closest('.cell-actions');
                if (!actionsCell || busy) return;

                ui.showInlineDelete(actionsCell, {
                    onConfirm: async function (cell) {
                        busy = true;
                        try {
                            const res = await fetch(cfg.deleteUrl, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'same-origin',
                                body: JSON.stringify({
                                    csrf_token: form.csrf_token.value,
                                    id: row.dataset.id,
                                }),
                            });
                            const data = await res.json();
                            if (!res.ok || !data.ok) {
                                throw new Error(data.error || 'Delete failed.');
                            }
                            ui.reloadWithToast(entityName + ' deleted', 'success');
                        } catch (err) {
                            busy = false;
                            ui.restoreInlineDelete(cell);
                            ui.showToast(err.message || 'Could not delete.', 'error');
                        }
                    },
                });
            }
        });
    }

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            if (busy) return;
            if (errorBox) errorBox.hidden = true;
            if (ui) ui.clearFieldErrors(form);

            const fieldErrors = validateForm();
            if (Object.keys(fieldErrors).length > 0) {
                Object.keys(fieldErrors).forEach(function (id) {
                    ui.setFieldError(id, fieldErrors[id]);
                });
                return;
            }

            const id = document.getElementById('finance-id').value;
            const payload = {
                csrf_token: form.csrf_token.value,
                name: form.name.value,
                description: form.description.value,
                amount: form.amount.value,
                category_id: form.category_id.value,
            };
            payload[cfg.dateField] = document.getElementById('finance-date').value;
            payload[cfg.partnerField] = document.getElementById('finance-partner').value;

            const url = id ? cfg.updateUrl : cfg.createUrl;
            if (id) payload.id = id;

            const submitBtn = ui.getSubmitButton(form);
            if (ui) ui.setButtonLoading(submitBtn, 'Saving…');
            busy = true;

            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                if (!res.ok || !data.ok) {
                    throw new Error(data.error || 'Save failed.');
                }
                const message = id ? (entityName + ' updated') : (entityName + ' saved');
                ui.reloadWithToast(message, 'success');
            } catch (err) {
                busy = false;
                if (ui) ui.clearButtonLoading(submitBtn);
                if (errorBox) {
                    errorBox.textContent = err.message || 'Could not save.';
                    errorBox.hidden = false;
                }
                ui.showToast(err.message || 'Could not save.', 'error');
            }
        });
    }
})();
