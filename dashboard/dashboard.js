
document.addEventListener('DOMContentLoaded', () => {

    const btnNovaTransacao = document.querySelector('.btn-primary'); 
    const modal = document.getElementById('transactionModal'); 
    const btnFecharModal = document.querySelector('.close-modal'); 


    if (btnNovaTransacao) {
        btnNovaTransacao.addEventListener('click', () => {
            modal.classList.add('active');
        });
    }


    if (btnFecharModal) {
        btnFecharModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }


    if (modal) {
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.remove('active');
            }
        });
    }


    const btnMenu = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');

    if (btnMenu && sidebar) {
        btnMenu.addEventListener('click', () => {
            
            sidebar.classList.toggle('show'); 
        });
    }
});

    const barCtx = document.getElementById('barChart');
    if (barCtx) {
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [
                    {
                        label: 'Receitas',
                        data: [4500, 5200, 4800, 6100, 5900, 7500],
                        backgroundColor: '#10b981', 
                        borderRadius: 4
                    },
                    {
                        label: 'Despesas',
                        data: [2100, 1800, 2400, 2000, 2200, 1900],
                        backgroundColor: '#ef4444', 
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }


    const doughnutCtx = document.getElementById('doughnutChart');
    if (doughnutCtx) {
        new Chart(doughnutCtx, {
            type: 'doughnut',
            data: {
                labels: ['Moradia', 'Alimentação', 'Transporte', 'Assinaturas'],
                datasets: [{
                    data: [40, 25, 20, 15],
                    backgroundColor: [
                        '#4f46e5', 
                        '#f59e0b', 
                        '#db2777',
                        '#64748b'  
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                },
                cutout: '70%' 
            }
        });
    }