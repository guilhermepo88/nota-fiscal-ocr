document.getElementById('submit').addEventListener('click', async () => {
    const fileInput = document.getElementById('upload');
    const file = fileInput.files[0];

    if (!file) {
        alert('Por favor, selecione uma imagem.');
        return;
    }

    const orientation = document.getElementById('orientation').value;

    // Redimensionar a imagem de acordo com a orientação selecionada
    const resizedFile = await resizeImage(file, orientation);

    const formData = new FormData();
    formData.append('file', resizedFile);
    formData.append('language', 'por'); // Definindo o idioma para Português

    // Sua chave da API do OCR.space
    const apiKey = 'K86451387588957';

    const ocrUrl = `https://api.ocr.space/parse/image?apikey=${apiKey}`;

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

async function resizeImage(file, orientation) {
    // Implemente a função de redimensionamento da imagem aqui (como fornecido anteriormente)
}

async function sendToGoogleSheets(data) {
    // Implemente a função de envio para o Google Sheets aqui (como fornecido anteriormente)
}
