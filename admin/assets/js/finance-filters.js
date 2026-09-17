(function () {
    const rangeSelect = document.getElementById('range');
    const customFields = document.getElementById('custom-range-fields');

    if (rangeSelect && customFields) {
        rangeSelect.addEventListener('change', function () {
            customFields.classList.toggle('is-hidden', rangeSelect.value !== 'custom');
        });
    }
})();
