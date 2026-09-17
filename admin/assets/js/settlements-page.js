(function () {
    const createForm = document.getElementById('settlements-page-form');
    const editForm = document.getElementById('settlements-edit-form');
    const createError = document.getElementById('settlements-page-form-error');
    const editError = document.getElementById('settlements-edit-form-error');
    const editModal = document.getElementById('settlements-edit-modal');
    const editCloseBtn = document.getElementById('settlements-edit-close');
    const table = document.getElementById('settlements-table');
    const records = window.KB_SETTLEMENTS || {};
    const ui = window.KB_ui;

    let busy = false;

    function csrfToken() {
        const field = document.querySelector('#settlements-edit-form [name="csrf_token"]')
            || document.querySelector('#settlements-page-form [name="csrf_token"]');
        return field ? field.value : '';
    }

    function showError(el, message) {
        if (!el) return;
        el.textContent = message;
        el.hidden = false;
        if (ui) ui.showToast(message, 'error');
    }

    async function postJson(url, payload) {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify(payload),
        });

        let data = null;
        try {
            data = await res.json();
        } catch (err) {
            throw new Error('Server error. Please refresh the page and try again.');
        }

        if (!res.ok || !data || !data.ok) {
            throw new Error((data && data.error) || 'Request failed.');
        }

        return data;
    }

    function readCreateForm() {
        return {
            csrf_token: csrfToken(),
            from_partner_id: createForm.from_partner_id.value,
            to_partner_id: createForm.to_partner_id.value,
            amount: createForm.amount.value,
            settlement_date: createForm.settlement_date.value,
            note: createForm.note.value,
        };
    }

    function readEditForm() {
        return {
            csrf_token: csrfToken(),
            id: document.getElementById('settlements-edit-id').value,
            from_partner_id: document.getElementById('edit_from_partner_id').value,
            to_partner_id: document.getElementById('edit_to_partner_id').value,
            amount: document.getElementById('edit_amount').value,
            settlement_date: document.getElementById('edit_settlement_date').value,
            note: document.getElementById('edit_note').value,
        };
    }

    function validateSettlement(payload, form) {
        const errors = {};
        if (!payload.from_partner_id) errors.from_partner_id = 'Select who paid.';
        if (!payload.to_partner_id) errors.to_partner_id = 'Select who received.';
        if (payload.from_partner_id && payload.to_partner_id && payload.from_partner_id === payload.to_partner_id) {
            return { _form: 'From and To must be different partners.' };
        }
        const amount = parseFloat(payload.amount);
        if (!payload.amount || isNaN(amount) || amount <= 0) {
            errors.amount = 'Enter an amount greater than 0.';
        }
        if (!payload.settlement_date) {
            errors.settlement_date = 'Select a date.';
        }
        if (form && ui) {
            ui.clearFieldErrors(form);
            form.querySelectorAll('[name]').forEach(function (el) {
                if (el.name && errors[el.name] && el.id) {
                    ui.setFieldError(el.id, errors[el.name]);
                }
            });
        }
        return Object.keys(errors).length ? errors : null;
    }

    if (createForm) {
        createForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            if (busy) return;
            if (createError) createError.hidden = true;

            const payload = readCreateForm();
            const errors = validateSettlement(payload, createForm);
            if (errors) {
                if (errors._form) {
                    showError(createError, errors._form);
                }
                return;
            }

            const submitBtn = ui ? ui.getSubmitButton(createForm) : null;
            if (ui && submitBtn) ui.setButtonLoading(submitBtn, 'Saving…');
            busy = true;

            try {
                await postJson('/api/settlements-create.php', payload);
                ui.reloadWithToast('Settlement logged', 'success');
            } catch (err) {
                busy = false;
                if (ui && submitBtn) ui.clearButtonLoading(submitBtn);
                showError(createError, err.message || 'Could not save settlement.');
            }
        });
    }

    if (editForm) {
        editForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            if (busy) return;
            if (editError) editError.hidden = true;

            const payload = readEditForm();
            if (!payload.id) {
                showError(editError, 'Missing settlement id. Please refresh and try again.');
                return;
            }
            const errors = validateSettlement(payload, editForm);
            if (errors) {
                if (errors._form) showError(editError, errors._form);
                return;
            }

            const submitBtn = ui ? ui.getSubmitButton(editForm) : null;
            if (ui && submitBtn) ui.setButtonLoading(submitBtn, 'Saving…');
            busy = true;

            try {
                await postJson('/api/settlements-update.php', payload);
                ui.reloadWithToast('Settlement updated', 'success');
            } catch (err) {
                busy = false;
                if (ui && submitBtn) ui.clearButtonLoading(submitBtn);
                showError(editError, err.message || 'Could not update settlement.');
            }
        });
    }

    function openEditModal(record) {
        if (!editModal || !editForm || !record) return;
        if (editError) editError.hidden = true;
        if (ui) ui.clearFieldErrors(editForm);

        document.getElementById('settlements-edit-id').value = String(record.id);
        document.getElementById('edit_from_partner_id').value = String(record.from_partner_id);
        document.getElementById('edit_to_partner_id').value = String(record.to_partner_id);
        document.getElementById('edit_amount').value = String(record.amount);
        document.getElementById('edit_settlement_date').value = record.settlement_date;
        document.getElementById('edit_note').value = record.note || '';
        editModal.hidden = false;
    }

    function closeEditModal() {
        if (editModal) editModal.hidden = true;
    }

    if (editCloseBtn) editCloseBtn.addEventListener('click', closeEditModal);
    if (editModal) {
        editModal.addEventListener('click', function (e) {
            if (e.target === editModal) closeEditModal();
        });
    }

    if (table) {
        table.addEventListener('click', async function (e) {
            const editBtn = e.target.closest('.settlement-edit-btn');
            const deleteBtn = e.target.closest('.settlement-delete-btn');
            const row = e.target.closest('tr[data-settlement-id]');
            if (!row) return;

            const record = records[row.dataset.settlementId];
            if (!record) return;

            if (editBtn) {
                e.preventDefault();
                openEditModal(record);
                return;
            }

            if (deleteBtn && ui) {
                e.preventDefault();
                if (busy) return;
                const actionsCell = deleteBtn.closest('.cell-actions');
                if (!actionsCell) return;

                ui.showInlineDelete(actionsCell, {
                    onConfirm: async function (cell) {
                        busy = true;
                        try {
                            await postJson('/api/settlements-delete.php', {
                                csrf_token: csrfToken(),
                                id: record.id,
                            });
                            ui.reloadWithToast('Settlement deleted', 'success');
                        } catch (err) {
                            busy = false;
                            ui.restoreInlineDelete(cell);
                            ui.showToast(err.message || 'Could not delete settlement.', 'error');
                        }
                    },
                });
            }
        });
    }
})();
