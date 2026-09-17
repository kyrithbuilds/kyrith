(function () {
    const cfg = window.KB_INVOICES_CONFIG;
    if (!cfg) return;

    const clientSelect = document.getElementById('invoice_client_id');
    const projectSelect = document.getElementById('invoice_project_id');
    const subtotalInput = document.getElementById('invoice_subtotal');
    const taxInput = document.getElementById('invoice_tax');
    const totalInput = document.getElementById('invoice_total');

    function syncProjectOptions(clientId, selectedProjectId) {
        if (!projectSelect) return;
        projectSelect.innerHTML = '<option value="">No project</option>';
        const projects = (cfg.projectsByClient && cfg.projectsByClient[String(clientId)]) || [];
        projects.forEach(function (project) {
            const opt = document.createElement('option');
            opt.value = String(project.id);
            opt.textContent = project.name;
            if (selectedProjectId && String(selectedProjectId) === String(project.id)) {
                opt.selected = true;
            }
            projectSelect.appendChild(opt);
        });
    }

    function updateTotalFromParts() {
        if (!subtotalInput || !taxInput || !totalInput) return;
        const sub = parseFloat(subtotalInput.value) || 0;
        const tax = parseFloat(taxInput.value) || 0;
        totalInput.value = (sub + tax).toFixed(2);
    }

    if (clientSelect) {
        clientSelect.addEventListener('change', function () {
            syncProjectOptions(clientSelect.value, '');
        });
    }

    if (subtotalInput) subtotalInput.addEventListener('input', updateTotalFromParts);
    if (taxInput) taxInput.addEventListener('input', updateTotalFromParts);

    function readPayload(form, csrfToken) {
        return {
            csrf_token: csrfToken,
            client_id: document.getElementById('invoice_client_id').value,
            project_id: document.getElementById('invoice_project_id').value,
            invoice_number: document.getElementById('invoice_number').value,
            status: document.getElementById('invoice_status').value,
            issue_date: document.getElementById('invoice_issue_date').value,
            due_date: document.getElementById('invoice_due_date').value,
            subtotal_amount: document.getElementById('invoice_subtotal').value,
            tax_amount: document.getElementById('invoice_tax').value,
            total_amount: document.getElementById('invoice_total').value,
            notes: document.getElementById('invoice_notes').value,
        };
    }

    function populateEdit(form, record) {
        document.getElementById('invoice_number').value = record.invoice_number || '';
        document.getElementById('invoice_status').value = record.status || 'draft';
        document.getElementById('invoice_client_id').value = String(record.client_id || '');
        syncProjectOptions(record.client_id, record.project_id);
        document.getElementById('invoice_issue_date').value = record.issue_date || '';
        document.getElementById('invoice_due_date').value = record.due_date || '';
        document.getElementById('invoice_subtotal').value = record.subtotal_amount || '0';
        document.getElementById('invoice_tax').value = record.tax_amount || '0';
        document.getElementById('invoice_total').value = record.total_amount || '0';
        document.getElementById('invoice_notes').value = record.notes || '';
    }

    function validate(payload) {
        const errors = {};
        if (!payload.client_id) errors.invoice_client_id = 'Select a client.';
        if (!payload.invoice_number || !payload.invoice_number.trim()) {
            errors.invoice_number = 'Enter an invoice number.';
        }
        if (!payload.issue_date) errors.invoice_issue_date = 'Select an issue date.';
        if (!payload.due_date) errors.invoice_due_date = 'Select a due date.';
        const subtotal = parseFloat(payload.subtotal_amount);
        if (payload.subtotal_amount === '' || isNaN(subtotal) || subtotal < 0) {
            errors.invoice_subtotal = 'Enter a valid subtotal.';
        }
        const total = parseFloat(payload.total_amount);
        if (!payload.total_amount || isNaN(total) || total <= 0) {
            errors.invoice_total = 'Enter a total greater than 0.';
        }
        return Object.keys(errors).length ? errors : null;
    }

    window.initEntityCrud({
        records: cfg.records,
        apis: cfg.apis,
        toasts: {
            create: 'Invoice saved',
            update: 'Invoice updated',
            delete: 'Invoice deleted',
        },
        createFormId: 'invoices-edit-form',
        editFormId: 'invoices-edit-form',
        createErrorId: 'invoices-edit-form-error',
        editErrorId: 'invoices-edit-form-error',
        editModalId: 'invoices-edit-modal',
        editCloseId: 'invoices-edit-close',
        addBtnId: 'invoices-add-btn',
        tableId: 'invoices-table',
        editIdField: 'invoices-edit-id',
        editTitleId: 'invoices-edit-title',
        createTitle: 'Add invoice',
        editTitle: 'Edit invoice',
        editBtnClass: 'invoice-edit-btn',
        deleteBtnClass: 'invoice-delete-btn',
        rowDataAttr: 'data-invoice-id',
        onOpenCreate: function () {
            document.getElementById('invoice_number').value = cfg.suggestedInvoiceNumber || '';
            document.getElementById('invoice_status').value = cfg.defaultStatus || 'draft';
            document.getElementById('invoice_issue_date').value = cfg.today || '';
            document.getElementById('invoice_due_date').value = cfg.today || '';
            document.getElementById('invoice_subtotal').value = '';
            document.getElementById('invoice_tax').value = '0';
            document.getElementById('invoice_total').value = '';
            syncProjectOptions(document.getElementById('invoice_client_id').value, '');
        },
        readCreatePayload: function (form, token) {
            return readPayload(form, token);
        },
        readEditPayload: function (form, token) {
            const payload = readPayload(form, token);
            payload.id = document.getElementById('invoices-edit-id').value;
            return payload;
        },
        populateEdit: populateEdit,
        validate: validate,
    });
})();
