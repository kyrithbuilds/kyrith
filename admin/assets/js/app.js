(function () {
    const toggle = document.getElementById('nav-toggle');
    const sidebar = document.getElementById('admin-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');

    if (toggle && sidebar && backdrop) {
        toggle.addEventListener('click', function () {
            sidebar.classList.toggle('is-open');
            backdrop.hidden = !sidebar.classList.contains('is-open');
        });

        backdrop.addEventListener('click', function () {
            sidebar.classList.remove('is-open');
            backdrop.hidden = true;
        });
    }

    const openBtn = document.getElementById('open-settlement-modal');
    const closeBtn = document.getElementById('close-settlement-modal');
    const modal = document.getElementById('settlement-modal');
    const form = document.getElementById('dashboard-settlement-form');
    const errorBox = document.getElementById('dashboard-settlement-form-error');
    const ui = window.KB_ui;

    if (!form) return;

    function openModal() {
        if (!modal) return;
        modal.hidden = false;
        if (errorBox) errorBox.hidden = true;
        if (ui) ui.clearFieldErrors(form);
    }

    function closeModal() {
        if (!modal) return;
        modal.hidden = true;
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });
    }

    let submitting = false;

    function validateDashboardSettlement() {
        const errors = {};
        if (!form.from_partner_id.value) errors.from_partner_id = 'Select who paid.';
        if (!form.to_partner_id.value) errors.to_partner_id = 'Select who received.';
        if (form.from_partner_id.value && form.to_partner_id.value
            && form.from_partner_id.value === form.to_partner_id.value) {
            return { _form: 'From and To must be different partners.' };
        }
        const amount = parseFloat(form.amount.value);
        if (!form.amount.value || isNaN(amount) || amount <= 0) {
            errors.amount = 'Enter an amount greater than 0.';
        }
        if (!form.settlement_date.value) {
            errors.settlement_date = 'Select a date.';
        }
        if (ui) {
            ui.clearFieldErrors(form);
            const fieldMap = {
                from_partner_id: 'from_partner_id',
                to_partner_id: 'to_partner_id',
                amount: 'amount',
                settlement_date: 'settlement_date',
            };
            Object.keys(errors).forEach(function (name) {
                ui.setFieldError(fieldMap[name], errors[name]);
            });
        }
        return Object.keys(errors).length ? errors : null;
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (submitting) return;
        if (errorBox) errorBox.hidden = true;

        const errors = validateDashboardSettlement();
        if (errors) {
            if (errors._form && errorBox) {
                errorBox.textContent = errors._form;
                errorBox.hidden = false;
            }
            return;
        }

        const submitBtn = ui ? ui.getSubmitButton(form) : null;
        if (ui && submitBtn) ui.setButtonLoading(submitBtn, 'Saving…');
        submitting = true;

        const payload = {
            csrf_token: form.csrf_token.value,
            from_partner_id: form.from_partner_id.value,
            to_partner_id: form.to_partner_id.value,
            amount: form.amount.value,
            settlement_date: form.settlement_date.value,
            note: form.note.value,
        };

        try {
            const res = await fetch('/api/settlements-create.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'same-origin',
            });
            let data = null;
            try {
                data = await res.json();
            } catch (err) {
                throw new Error('Server error. Please refresh and try again.');
            }
            if (!res.ok || !data.ok) {
                throw new Error(data.error || 'Could not save settlement.');
            }
            if (ui) {
                ui.reloadWithToast('Settlement logged', 'success');
            } else {
                window.location.reload();
            }
        } catch (err) {
            submitting = false;
            if (ui && submitBtn) ui.clearButtonLoading(submitBtn);
            if (errorBox) {
                errorBox.textContent = err.message || 'Could not save settlement.';
                errorBox.hidden = false;
            }
            if (ui) ui.showToast(err.message || 'Could not save settlement.', 'error');
        }
    });
})();
