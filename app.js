document.getElementById('submit').addEventListener('click', async () => {
    const fileInput = document.getElementById('upload');
    const file = fileInput.files[0];

    if (!file) {
        alert('Por favor, selecione uma imagem.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', 'por'); // Definindo o idioma para Português

    const ocrUrl = 'https://api.ocr.space/parse/image';

    try {
        const response = await fetch(ocrUrl, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.OCRExitCode !== 1) {
            alert('Erro ao processar a imagem: ' + data.ErrorMessage);
            return;
        }

        const extractedText = data.ParsedResults[0].ParsedText;

        // Função para enviar os dados ao Google Sheets
        sendToGoogleSheets(extractedText);
    } catch (error) {
        alert('Erro ao processar a imagem: ' + error.message);
    }
});

async function sendToGoogleSheets(data) {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbwL7VvW51P_50iMCZTMEQFsWuteeWmgAXIzdcqn4CVzECQPSwtyL4ePQKx9eUwhd5_Eew/exec';
    
    const response = await fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify({ text: data }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        alert('Dados enviados com sucesso!');
    } else {
        alert('Erro ao enviar dados.');
    }
}
