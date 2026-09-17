(function () {
    const TOAST_KEY = 'kb_toast';

    function ensureToastHost() {
        let host = document.getElementById('toast-host');
        if (!host) {
            host = document.createElement('div');
            host.id = 'toast-host';
            host.className = 'toast-host';
            host.setAttribute('aria-live', 'polite');
            document.body.appendChild(host);
        }
        return host;
    }

    function toastIcon(type) {
        if (type === 'success') {
            return '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
        }
        if (type === 'warning') {
            return '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>';
        }
        return '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>';
    }

    function showToast(message, type) {
        const host = ensureToastHost();
        const toastType = type || 'success';
        const toast = document.createElement('div');
        toast.className = 'toast toast-' + toastType;
        toast.innerHTML =
            toastIcon(toastType) +
            '<span class="toast-message">' + escapeHtml(message) + '</span>' +
            '<button type="button" class="toast-close" aria-label="Dismiss">&times;</button>';

        const remove = function () {
            toast.classList.add('is-leaving');
            setTimeout(function () { toast.remove(); }, 200);
        };

        toast.querySelector('.toast-close').addEventListener('click', remove);
        host.appendChild(toast);
        const timer = setTimeout(remove, 4000);
        toast.addEventListener('mouseenter', function () { clearTimeout(timer); });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function queueToast(message, type) {
        sessionStorage.setItem(TOAST_KEY, JSON.stringify({ message: message, type: type || 'success' }));
    }

    function reloadWithToast(message, type) {
        queueToast(message, type);
        window.location.reload();
    }

    function flushQueuedToast() {
        const raw = sessionStorage.getItem(TOAST_KEY);
        if (!raw) return;
        sessionStorage.removeItem(TOAST_KEY);
        try {
            const data = JSON.parse(raw);
            if (data && data.message) {
                showToast(data.message, data.type || 'success');
            }
        } catch (err) {
            // ignore
        }
    }

    function setButtonLoading(button, loadingLabel) {
        if (!button || button.dataset.loading === '1') return;
        button.dataset.loading = '1';
        button.dataset.originalHtml = button.innerHTML;
        button.disabled = true;
        button.classList.add('is-loading');
        button.innerHTML =
            '<span class="btn-spinner" aria-hidden="true"></span>' +
            '<span>' + escapeHtml(loadingLabel || 'Saving…') + '</span>';
    }

    function clearButtonLoading(button) {
        if (!button) return;
        button.disabled = false;
        button.classList.remove('is-loading');
        button.dataset.loading = '0';
        if (button.dataset.originalHtml) {
            button.innerHTML = button.dataset.originalHtml;
        }
    }

    function getSubmitButton(form) {
        if (!form) return null;
        return form.querySelector('button[type="submit"]:not([disabled])')
            || form.querySelector('button[type="submit"]');
    }

    function clearFieldErrors(form) {
        if (!form) return;
        form.querySelectorAll('.field-error').forEach(function (el) {
            el.textContent = '';
            el.hidden = true;
        });
        form.querySelectorAll('.is-invalid').forEach(function (el) {
            el.classList.remove('is-invalid');
        });
    }

    function setFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        field.classList.add('is-invalid');
        let errorEl = field.parentElement.querySelector('.field-error');
        if (!errorEl) {
            errorEl = document.createElement('p');
            errorEl.className = 'field-error';
            errorEl.hidden = true;
            field.parentElement.appendChild(errorEl);
        }
        errorEl.textContent = message;
        errorEl.hidden = false;
    }

    function showInlineDelete(actionsCell, options) {
        if (!actionsCell || actionsCell.dataset.confirming === '1') return;
        actionsCell.dataset.confirming = '1';
        actionsCell.dataset.originalHtml = actionsCell.innerHTML;

        const wrap = document.createElement('div');
        wrap.className = 'delete-confirm-inline';
        wrap.innerHTML =
            '<span class="delete-confirm-text">Delete?</span>' +
            '<button type="button" class="link-btn link-danger delete-confirm-yes">Yes, delete</button>' +
            '<button type="button" class="link-btn delete-confirm-no">Cancel</button>';

        actionsCell.innerHTML = '';
        actionsCell.appendChild(wrap);

        wrap.querySelector('.delete-confirm-no').addEventListener('click', function () {
            actionsCell.innerHTML = actionsCell.dataset.originalHtml || '';
            actionsCell.dataset.confirming = '0';
            if (typeof options.onCancel === 'function') options.onCancel();
        });

        wrap.querySelector('.delete-confirm-yes').addEventListener('click', function () {
            actionsCell.dataset.confirming = '0';
            if (typeof options.onConfirm === 'function') options.onConfirm(actionsCell);
        });
    }

    function restoreInlineDelete(actionsCell) {
        if (!actionsCell) return;
        if (actionsCell.dataset.originalHtml) {
            actionsCell.innerHTML = actionsCell.dataset.originalHtml;
        }
        actionsCell.dataset.confirming = '0';
    }

    window.KB_ui = {
        showToast: showToast,
        queueToast: queueToast,
        reloadWithToast: reloadWithToast,
        flushQueuedToast: flushQueuedToast,
        setButtonLoading: setButtonLoading,
        clearButtonLoading: clearButtonLoading,
        getSubmitButton: getSubmitButton,
        clearFieldErrors: clearFieldErrors,
        setFieldError: setFieldError,
        showInlineDelete: showInlineDelete,
        restoreInlineDelete: restoreInlineDelete,
    };

    document.addEventListener('DOMContentLoaded', function () {
        flushQueuedToast();

        document.querySelectorAll('.empty-state-action[data-trigger-for]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const target = document.getElementById(btn.dataset.triggerFor);
                if (target) target.click();
            });
        });
    });
})();
