document.addEventListener('DOMContentLoaded', () => {
    const btnCalcular = document.getElementById('btnCalcular');
    const resultadoContainer = document.getElementById('resultado-container');

    btnCalcular.addEventListener('click', (evento) => {
        evento.preventDefault(); // Evita recarregar a página

        // 1. Capturar os valores digitados (o '|| 0' garante que não dê erro se estiver vazio)
        const tipoCrime = document.getElementById('tipoCrime').value;
        const statusApenado = document.getElementById('statusApenado').value;
        const dataInicioStr = document.getElementById('dataInicio').value;
        
        const anos = parseInt(document.getElementById('penaAnos').value) || 0;
        const meses = parseInt(document.getElementById('penaMeses').value) || 0;
        const dias = parseInt(document.getElementById('penaDias').value) || 0;
        const detracao = parseInt(document.getElementById('detracaoDias').value) || 0;

        // Validação básica de data
        if (!dataInicioStr) {
            alert("Por favor, insira a Data de Início da Pena.");
            return;
        }

        // 2. Transformar a pena inteira em DIAS (Base: ano comercial 365, mês 30)
        const totalDiasPena = (anos * 365) + (meses * 30) + dias;

        if (totalDiasPena === 0) {
            alert("A pena total não pode ser zero.");
            return;
        }

        // 3. Descobrir a porcentagem de progressão (Exemplo simplificado do Pacote Anticrime)
        let taxaProgressao = 0;

        if (tipoCrime === 'não hediondo') {
            taxaProgressao = (statusApenado === 'primario') ? 0.16 : 0.20; // 16% ou 20%
        } else if (tipoCrime === 'hediondo' || tipoCrime === 'equiparado') {
            taxaProgressao = (statusApenado === 'primario') ? 0.40 : 0.60; // 40% ou 60%
        }

        // 4. Calcular os dias necessários para progredir
        // Calcula a porcentagem em cima do total e subtrai os dias já cumpridos (detração)
        const diasParaProgredir = Math.floor(totalDiasPena * taxaProgressao) - detracao;

        // 5. Calcular a Data de Progressão exata
        const dataBase = new Date(dataInicioStr);
        // Corrige o fuso horário (pois o input date pega UTC)
        dataBase.setMinutes(dataBase.getMinutes() + dataBase.getTimezoneOffset());
        
        const dataProgressao = new Date(dataBase);
        dataProgressao.setDate(dataProgressao.getDate() + diasParaProgredir);

        const dataTermino = new Date(dataBase);
        dataTermino.setDate(dataTermino.getDate() + totalDiasPena - detracao);

        // Formatação das datas para o padrão Brasileiro (DD/MM/AAAA)
        const formatarData = (data) => data.toLocaleDateString('pt-BR');

        // 6. Exibir o Resultado na Tela (Injetando HTML via JS)
        resultadoContainer.style.display = 'block'; // Mostra a div que estava escondida
        
        if (diasParaProgredir <= 0) {
            resultadoContainer.innerHTML = `
                <div style="background: #e6f4ea; border-left: 4px solid #34a853; padding: 20px; border-radius: 8px;">
                    <h3 style="color: #1e8e3e; margin-bottom: 10px;">Progressão Alcançada!</h3>
                    <p>Com a detração informada de <strong>${detracao} dias</strong>, o apenado já cumpriu o tempo necessário para a progressão de regime.</p>
                </div>
            `;
        } else {
            resultadoContainer.innerHTML = `
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-top: 4px solid #d4af37; padding: 24px; border-radius: 8px; margin-top: 20px; text-align: left;">
                    
                    <h2 style="color: #1e293b; margin-bottom: 20px; font-size: 20px; text-align: center;">Resumo do Cálculo</h2>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                        <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center;">
                            <p style="font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase;">Total da Pena</p>
                            <p style="font-size: 18px; color: #0f172a; font-weight: 600; margin-top: 4px;">${totalDiasPena} dias</p>
                        </div>
                        <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center;">
                            <p style="font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase;">Fração Aplicada</p>
                            <p style="font-size: 18px; color: #0f172a; font-weight: 600; margin-top: 4px;">${(taxaProgressao * 100).toFixed(0)}%</p>
                        </div>
                    </div>

                    <h3 style="color: #1e293b; font-size: 16px; margin-bottom: 12px;">Datas Estimadas:</h3>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;">
                            <strong style="color: #475569; font-weight: 600;">Data da Progressão:</strong> 
                            <span style="color: #d4af37; font-weight: bold; font-size: 18px;">${formatarData(dataProgressao)}</span>
                        </li>
                        <li style="display: flex; justify-content: space-between; align-items: center;">
                            <strong style="color: #475569; font-weight: 600;">Término da Pena:</strong> 
                            <span style="color: #0f172a; font-weight: 600; font-size: 16px;">${formatarData(dataTermino)}</span>
                        </li>
                    </ul>
                    
                </div>
            `;
        }
    });
});
//teste