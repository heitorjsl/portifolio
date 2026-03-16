
document.addEventListener('DOMContentLoaded', () => {

    
    const btnCalcular = document.getElementById('btnCalcular');
    const resultadoContainer = document.getElementById('resultado-container');

    btnCalcular.addEventListener('click', async (event) => {
        
        event.preventDefault();

        resultadoContainer.innerHTML = '';
        resultadoContainer.className = ''; 

        try {
            
            const dadosParaEnviar = {
                tipoCrime: document.getElementById('tipoCrime').value,
                statusApenado: document.getElementById('statusApenado').value,
                dataInicio: document.getElementById('dataInicio').value,
                
                
                penaAnos: parseInt(document.getElementById('penaAnos').value, 10) || 0,
                penaMeses: parseInt(document.getElementById('penaMeses').value, 10) || 0,
                penaDias: parseInt(document.getElementById('penaDias').value, 10) || 0,
                detracaoDias: parseInt(document.getElementById('detracaoDias').value, 10) || 0
            };

            
            if (!dadosParaEnviar.dataInicio) {
                mostrarErro('Por favor, insira a data de início da pena.');
                return;
            }

            const response = await fetch('http://localhost:8080/calcular', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosParaEnviar) 
            });

            if (!response.ok) {
                throw new Error(`Erro do servidor: ${response.status} - ${response.statusText}`);
            }

            const resultados = await response.json();

            
            mostrarResultados(resultados);

        } catch (error) {
            console.error('Erro ao calcular:', error);
            mostrarErro('Não foi possível conectar ao servidor. Verifique se o backend (Kotlin) está em execução.');
        }
    });

    // --- Funções Auxiliares ---

    function mostrarResultados(data) {
        // 'data' é o objeto CalculoResponse que veio do Ktor
        resultadoContainer.className = 'sucesso'; // Adiciona uma classe para estilizar (opcional)
        resultadoContainer.innerHTML = `
            <h3>Datas Previstas:</h3>
            <p><strong>Regime Semiaberto:</strong> ${data.regimeSemiaberto}</p>
            <p><strong>Regime Aberto:</strong> ${data.regimeAberto}</p>
            <p><strong>Livramento Condicional:</strong> ${data.livramentoCondicional}</p>
        `;
    }

    function mostrarErro(mensagem) {
        resultadoContainer.className = 'erro'; // Adiciona uma classe para estilizar (opcional)
        resultadoContainer.innerHTML = `<p>${mensagem}</p>`;
    }

});