document.addEventListener('DOMContentLoaded', function () {
    const data = window.KB_CHART_DATA;
    if (!data || typeof Chart === 'undefined') return;

    const navy = '#021D41';
    const blue = '#4172F4';
    const muted = '#94a3b8';

    const monthlyCanvas = document.getElementById('chart-monthly');
    if (monthlyCanvas && data.monthly) {
        new Chart(monthlyCanvas, {
            type: 'line',
            data: {
                labels: data.monthly.map(function (r) { return r.month; }),
                datasets: [
                    {
                        label: 'Income',
                        data: data.monthly.map(function (r) { return r.income; }),
                        borderColor: blue,
                        backgroundColor: 'rgba(65, 114, 244, 0.15)',
                        fill: true,
                        tension: 0.3,
                    },
                    {
                        label: 'Expenses',
                        data: data.monthly.map(function (r) { return r.expenses; }),
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: true,
                        tension: 0.3,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
                scales: {
                    y: {
                        ticks: {
                            callback: function (v) { return '₹' + Number(v).toLocaleString('en-IN'); },
                        },
                    },
                },
            },
        });
    }

    const catCanvas = document.getElementById('chart-categories');
    if (catCanvas && data.categories) {
        const colors = [blue, navy, '#6366f1', '#0ea5e9', '#14b8a6', '#f59e0b', muted];
        new Chart(catCanvas, {
            type: 'doughnut',
            data: {
                labels: data.categories.map(function (r) { return r.category; }),
                datasets: [{
                    data: data.categories.map(function (r) { return r.amount; }),
                    backgroundColor: colors,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
            },
        });
    }
});
