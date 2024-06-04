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

                console.log("Original Width:", width);
                console.log("Original Height:", height);

                // Redimensionar a imagem com base na orientação
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
                } else {
                    console.error("Erro: A orientação da imagem não corresponde à seleção.");
                    reject("Erro: A orientação da imagem não corresponde à seleção.");
                    return;
                }

                console.log("Novo Width:", width);
                console.log("Novo Height:", height);

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
            console.error("Erro ao ler o arquivo:", error);
            reject("Erro ao ler o arquivo.");
        };

        reader.readAsDataURL(file);
    });
}
