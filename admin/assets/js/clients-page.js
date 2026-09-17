(function () {
    const cfg = window.KB_CLIENTS_CONFIG;
    if (!cfg) return;

    function readPayload(form, csrfToken) {
        return {
            csrf_token: csrfToken,
            company_name: document.getElementById('client_company_name').value,
            contact_name: document.getElementById('client_contact_name').value,
            contact_email: document.getElementById('client_contact_email').value,
            contact_phone: document.getElementById('client_contact_phone').value,
            billing_address: document.getElementById('client_billing_address').value,
            status: document.getElementById('client_status').value,
            notes: document.getElementById('client_notes').value,
        };
    }

    function populateEdit(form, record) {
        document.getElementById('client_company_name').value = record.company_name || '';
        document.getElementById('client_contact_name').value = record.contact_name || '';
        document.getElementById('client_contact_email').value = record.contact_email || '';
        document.getElementById('client_contact_phone').value = record.contact_phone || '';
        document.getElementById('client_billing_address').value = record.billing_address || '';
        document.getElementById('client_status').value = record.status || 'lead';
        document.getElementById('client_notes').value = record.notes || '';
    }

    function validate(payload) {
        const errors = {};
        if (!payload.company_name || !payload.company_name.trim()) {
            errors.client_company_name = 'Enter a company name.';
        }
        if (payload.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.contact_email.trim())) {
            errors.client_contact_email = 'Enter a valid email address.';
        }
        return Object.keys(errors).length ? errors : null;
    }

    window.initEntityCrud({
        records: cfg.records,
        apis: cfg.apis,
        toasts: {
            create: 'Client saved',
            update: 'Client updated',
            delete: 'Client deleted',
        },
        createFormId: 'clients-edit-form',
        editFormId: 'clients-edit-form',
        createErrorId: 'clients-edit-form-error',
        editErrorId: 'clients-edit-form-error',
        editModalId: 'clients-edit-modal',
        editCloseId: 'clients-edit-close',
        addBtnId: 'clients-add-btn',
        tableId: 'clients-table',
        editIdField: 'clients-edit-id',
        editTitleId: 'clients-edit-title',
        createTitle: 'Add client',
        editTitle: 'Edit client',
        editBtnClass: 'client-edit-btn',
        deleteBtnClass: 'client-delete-btn',
        rowDataAttr: 'data-client-id',
        onOpenCreate: function () {
            const statusEl = document.getElementById('client_status');
            if (statusEl && statusEl.options.length > 0) {
                statusEl.selectedIndex = 0;
            }
        },
        readCreatePayload: function (form, token) {
            return readPayload(form, token);
        },
        readEditPayload: function (form, token) {
            const payload = readPayload(form, token);
            payload.id = document.getElementById('clients-edit-id').value;
            return payload;
        },
        populateEdit: populateEdit,
        validate: validate,
    });
})();
