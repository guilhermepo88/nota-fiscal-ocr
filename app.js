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
        await sendToGoogleSheets(extractedText);
    } catch (error) {
        alert('Erro ao processar a imagem: ' + error.message);
    }
});

async function resizeImage(file, orientation) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 600;
                let width = img.width;
                let height = img.height;

                if (orientation === 'horizontal' && width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else if (orientation === 'vertical' && height > width) {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    const resizedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    resolve(resizedFile);
                }, 'image/jpeg', 0.7);
            };
            img.src = event.target.result;
        };

        reader.onerror = function(error) {
            reject("Erro ao ler o arquivo.");
        };

        reader.readAsDataURL(file);
    });
}

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
