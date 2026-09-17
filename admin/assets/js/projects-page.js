(function () {
    const cfg = window.KB_PROJECTS_CONFIG;
    if (!cfg) return;

    function readPayload(form, csrfToken) {
        return {
            csrf_token: csrfToken,
            client_id: document.getElementById('project_client_id').value,
            name: document.getElementById('project_name').value,
            description: document.getElementById('project_description').value,
            project_type: document.getElementById('project_type').value,
            status: document.getElementById('project_status').value,
            start_date: document.getElementById('project_start_date').value,
            budget_amount: document.getElementById('project_budget_amount').value,
        };
    }

    function populateEdit(form, record) {
        document.getElementById('project_client_id').value = String(record.client_id || '');
        document.getElementById('project_name').value = record.name || '';
        document.getElementById('project_description').value = record.description || '';
        document.getElementById('project_type').value = record.project_type || '';
        document.getElementById('project_status').value = record.status || cfg.defaultStatus || '';
        document.getElementById('project_start_date').value = record.start_date || '';
        document.getElementById('project_budget_amount').value = record.budget_amount || '';
    }

    function validate(payload) {
        const errors = {};
        if (!payload.client_id) errors.project_client_id = 'Select a client.';
        if (!payload.name || !payload.name.trim()) errors.project_name = 'Enter a project name.';
        if (!payload.project_type) errors.project_type = 'Select a project type.';
        if (!payload.status) errors.project_status = 'Select a status.';
        if (payload.budget_amount) {
            const budget = parseFloat(payload.budget_amount);
            if (isNaN(budget) || budget < 0) {
                errors.project_budget_amount = 'Budget must be zero or greater.';
            }
        }
        return Object.keys(errors).length ? errors : null;
    }

    window.initEntityCrud({
        records: cfg.records,
        apis: cfg.apis,
        toasts: {
            create: 'Project saved',
            update: 'Project updated',
            delete: 'Project deleted',
        },
        createFormId: 'projects-edit-form',
        editFormId: 'projects-edit-form',
        createErrorId: 'projects-edit-form-error',
        editErrorId: 'projects-edit-form-error',
        editModalId: 'projects-edit-modal',
        editCloseId: 'projects-edit-close',
        addBtnId: 'projects-add-btn',
        tableId: 'projects-table',
        editIdField: 'projects-edit-id',
        editTitleId: 'projects-edit-title',
        createTitle: 'Add project',
        editTitle: 'Edit project',
        editBtnClass: 'project-edit-btn',
        deleteBtnClass: 'project-delete-btn',
        rowDataAttr: 'data-project-id',
        onOpenCreate: function () {
            document.getElementById('project_status').value = cfg.defaultStatus || '';
            document.getElementById('project_type').value = '';
        },
        readCreatePayload: function (form, token) {
            return readPayload(form, token);
        },
        readEditPayload: function (form, token) {
            const payload = readPayload(form, token);
            payload.id = document.getElementById('projects-edit-id').value;
            return payload;
        },
        populateEdit: populateEdit,
        validate: validate,
    });
})();
