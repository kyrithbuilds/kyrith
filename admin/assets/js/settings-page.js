(function () {
    const cfg = window.KB_SETTINGS_CONFIG;
    if (!cfg) return;

    const ui = window.KB_ui;
    const modal = document.getElementById('settings-option-modal');
    const form = document.getElementById('settings-option-form');
    const title = document.getElementById('settings-option-modal-title');
    const closeBtn = document.getElementById('settings-option-close');
    const errorBox = document.getElementById('settings-option-form-error');
    const activeField = document.getElementById('settings-active-field');
    let busy = false;

    function csrfToken() {
        const field = form ? form.querySelector('[name="csrf_token"]') : null;
        return field ? field.value : '';
    }

    function showError(message) {
        if (errorBox) {
            errorBox.textContent = message;
            errorBox.hidden = false;
        }
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
            throw new Error('Server error. Please refresh and try again.');
        }
        if (!res.ok || !data || !data.ok) {
            throw new Error((data && data.error) || 'Request failed.');
        }
        return data;
    }

    function openModal(mode, meta) {
        if (!modal || !form) return;
        if (errorBox) errorBox.hidden = true;
        if (ui) ui.clearFieldErrors(form);

        document.getElementById('settings-option-id').value = mode === 'edit' ? String(meta.id) : '';
        document.getElementById('settings-option-kind').value = meta.kind;
        document.getElementById('settings-option-group-key').value = meta.groupKey || '';
        document.getElementById('settings-option-category-kind').value = meta.categoryKind || '';
        document.getElementById('settings-option-label').value = mode === 'edit' ? (meta.label || '') : '';
        document.getElementById('settings-option-active').checked = mode !== 'edit' || meta.active === '1';

        if (activeField) activeField.hidden = mode !== 'edit';
        if (title) title.textContent = mode === 'edit' ? 'Edit option' : 'Add option';
        modal.hidden = false;
    }

    function closeModal() {
        if (modal) modal.hidden = true;
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });
    }

    document.querySelectorAll('.settings-add-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (btn.dataset.groupKey) {
                openModal('create', { kind: 'lookup', groupKey: btn.dataset.groupKey });
                return;
            }
            if (btn.dataset.categoryKind) {
                openModal('create', { kind: 'category', categoryKind: btn.dataset.categoryKind });
            }
        });
    });

    document.addEventListener('click', function (e) {
        const editBtn = e.target.closest('.settings-edit-btn');
        const deleteBtn = e.target.closest('.settings-delete-btn');
        const card = e.target.closest('.settings-card');

        if (editBtn && card) {
            const kind = card.dataset.settingsKind;
            openModal('edit', {
                kind: kind,
                id: editBtn.dataset.settingsId,
                label: editBtn.dataset.settingsLabel,
                active: editBtn.dataset.settingsActive,
                groupKey: card.dataset.groupKey || '',
                categoryKind: card.dataset.categoryKind || '',
            });
            return;
        }

        if (deleteBtn && card && ui) {
            if (busy) return;
            const actionsCell = deleteBtn.closest('.cell-actions');
            if (!actionsCell) return;

            ui.showInlineDelete(actionsCell, {
                onConfirm: async function (cell) {
                    busy = true;
                    const kind = card.dataset.settingsKind;
                    const payload = { csrf_token: csrfToken(), id: deleteBtn.dataset.settingsId };
                    const url = kind === 'lookup' ? cfg.apis.lookupDelete
                        : (card.dataset.categoryKind === 'income' ? cfg.apis.incomeDelete : cfg.apis.expenseDelete);

                    try {
                        await postJson(url, payload);
                        ui.reloadWithToast('Option deleted', 'success');
                    } catch (err) {
                        busy = false;
                        ui.restoreInlineDelete(cell);
                        ui.showToast(err.message || 'Could not delete.', 'error');
                    }
                },
            });
        }
    });

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            if (busy) return;
            if (errorBox) errorBox.hidden = true;
            if (ui) ui.clearFieldErrors(form);

            const kind = document.getElementById('settings-option-kind').value;
            const id = document.getElementById('settings-option-id').value;
            const label = document.getElementById('settings-option-label').value.trim();
            const isActive = document.getElementById('settings-option-active').checked;

            if (!label) {
                if (ui) ui.setFieldError('settings-option-label', 'Please enter a name.');
                return;
            }

            const submitBtn = ui ? ui.getSubmitButton(form) : null;
            if (ui && submitBtn) ui.setButtonLoading(submitBtn, 'Saving…');
            busy = true;

            try {
                if (kind === 'lookup') {
                    const groupKey = document.getElementById('settings-option-group-key').value;
                    if (id) {
                        await postJson(cfg.apis.lookupUpdate, {
                            csrf_token: csrfToken(),
                            id: id,
                            label: label,
                            is_active: isActive ? 1 : 0,
                        });
                    } else {
                        await postJson(cfg.apis.lookupCreate, {
                            csrf_token: csrfToken(),
                            group_key: groupKey,
                            label: label,
                        });
                    }
                } else {
                    const categoryKind = document.getElementById('settings-option-category-kind').value;
                    const apis = categoryKind === 'income'
                        ? { create: cfg.apis.incomeCreate, update: cfg.apis.incomeUpdate }
                        : { create: cfg.apis.expenseCreate, update: cfg.apis.expenseUpdate };

                    if (id) {
                        await postJson(apis.update, {
                            csrf_token: csrfToken(),
                            id: id,
                            name: label,
                            is_active: isActive ? 1 : 0,
                        });
                    } else {
                        await postJson(apis.create, {
                            csrf_token: csrfToken(),
                            name: label,
                        });
                    }
                }
                const message = id ? 'Option updated' : 'Option saved';
                ui.reloadWithToast(message, 'success');
            } catch (err) {
                busy = false;
                if (ui && submitBtn) ui.clearButtonLoading(submitBtn);
                showError(err.message || 'Could not save.');
            }
        });
    }
})();
