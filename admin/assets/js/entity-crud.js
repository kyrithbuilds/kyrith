(function () {
    window.initEntityCrud = function (config) {
        if (!config || !config.records) return;

        const ui = window.KB_ui;
        const createForm = document.getElementById(config.createFormId);
        const editForm = document.getElementById(config.editFormId);
        const createError = document.getElementById(config.createErrorId);
        const editError = document.getElementById(config.editErrorId);
        const editModal = document.getElementById(config.editModalId);
        const editCloseBtn = document.getElementById(config.editCloseId);
        const addBtn = document.getElementById(config.addBtnId);
        const table = document.getElementById(config.tableId);
        const records = config.records;
        const toasts = config.toasts || {};

        let busy = false;

        function csrfToken() {
            const field = document.querySelector('#' + config.editFormId + ' [name="csrf_token"]')
                || document.querySelector('#' + config.createFormId + ' [name="csrf_token"]');
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

        function openCreateModal() {
            if (!editModal || !editForm) return;
            if (editError) editError.hidden = true;
            if (ui) ui.clearFieldErrors(editForm);
            if (typeof config.resetCreateForm === 'function') {
                config.resetCreateForm(editForm);
            } else {
                editForm.reset();
            }
            if (typeof config.onOpenCreate === 'function') {
                config.onOpenCreate(editForm);
            }
            document.getElementById(config.editIdField).value = '';
            const title = document.getElementById(config.editTitleId);
            if (title) title.textContent = config.createTitle || 'Add';
            editModal.hidden = false;
        }

        function openEditModal(record) {
            if (!editModal || !editForm || !record) return;
            if (editError) editError.hidden = true;
            if (ui) ui.clearFieldErrors(editForm);
            document.getElementById(config.editIdField).value = String(record.id);
            if (typeof config.populateEdit === 'function') {
                config.populateEdit(editForm, record);
            }
            const title = document.getElementById(config.editTitleId);
            if (title) title.textContent = config.editTitle || 'Edit';
            editModal.hidden = false;
        }

        function closeEditModal() {
            if (editModal) editModal.hidden = true;
        }

        if (addBtn) addBtn.addEventListener('click', openCreateModal);
        if (editCloseBtn) editCloseBtn.addEventListener('click', closeEditModal);
        if (editModal) {
            editModal.addEventListener('click', function (e) {
                if (e.target === editModal) closeEditModal();
            });
        }

        const singleFormMode = createForm && editForm && createForm === editForm;

        async function handleSubmit(e, errorEl, isEdit) {
            e.preventDefault();
            if (busy) return;
            if (errorEl) errorEl.hidden = true;
            if (ui) ui.clearFieldErrors(editForm || createForm);

            const activeForm = isEdit ? editForm : createForm;
            const payload = isEdit
                ? config.readEditPayload(editForm, csrfToken())
                : config.readCreatePayload(createForm, csrfToken());

            if (isEdit && !payload.id) {
                showError(errorEl, 'Missing record id. Please refresh and try again.');
                return;
            }

            if (typeof config.validate === 'function') {
                const fieldErrors = config.validate(payload, isEdit ? 'edit' : 'create');
                if (fieldErrors && typeof fieldErrors === 'object') {
                    let hasError = false;
                    Object.keys(fieldErrors).forEach(function (fieldId) {
                        if (ui) ui.setFieldError(fieldId, fieldErrors[fieldId]);
                        hasError = true;
                    });
                    if (hasError) return;
                }
            }

            const submitBtn = ui ? ui.getSubmitButton(activeForm) : null;
            if (ui && submitBtn) ui.setButtonLoading(submitBtn, isEdit ? 'Saving…' : 'Saving…');

            busy = true;
            try {
                await postJson(isEdit ? config.apis.update : config.apis.create, payload);
                const message = isEdit
                    ? (toasts.update || 'Changes saved')
                    : (toasts.create || 'Saved successfully');
                if (ui) {
                    ui.reloadWithToast(message, 'success');
                } else {
                    window.location.reload();
                }
            } catch (err) {
                busy = false;
                if (ui && submitBtn) ui.clearButtonLoading(submitBtn);
                showError(errorEl, err.message || 'Could not save.');
            }
        }

        if (singleFormMode && editForm) {
            editForm.addEventListener('submit', async function (e) {
                const id = document.getElementById(config.editIdField).value;
                await handleSubmit(e, editError, !!id);
            });
        } else {
            if (createForm) {
                createForm.addEventListener('submit', async function (e) {
                    await handleSubmit(e, createError, false);
                });
            }
            if (editForm) {
                editForm.addEventListener('submit', async function (e) {
                    await handleSubmit(e, editError, true);
                });
            }
        }

        if (table) {
            table.addEventListener('click', async function (e) {
                const editBtn = e.target.closest('.' + config.editBtnClass);
                const deleteBtn = e.target.closest('.' + config.deleteBtnClass);
                const row = e.target.closest('tr[' + config.rowDataAttr + ']');
                if (!row) return;

                const record = records[row.getAttribute(config.rowDataAttr)];
                if (!record) return;

                if (editBtn) {
                    e.preventDefault();
                    openEditModal(record);
                    return;
                }

                if (deleteBtn) {
                    e.preventDefault();
                    if (busy) return;

                    const actionsCell = deleteBtn.closest('.cell-actions');
                    if (!actionsCell || !ui) return;

                    ui.showInlineDelete(actionsCell, {
                        onConfirm: async function (cell) {
                            busy = true;
                            try {
                                await postJson(config.apis.delete, {
                                    csrf_token: csrfToken(),
                                    id: record.id,
                                });
                                ui.reloadWithToast(toasts.delete || 'Deleted successfully', 'success');
                            } catch (err) {
                                busy = false;
                                ui.restoreInlineDelete(cell);
                                ui.showToast(err.message || 'Could not delete.', 'error');
                            }
                        },
                        onCancel: function () {},
                    });
                }
            });
        }
    };
})();
