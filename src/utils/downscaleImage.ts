export const downscaleImage = (
    file: File,
    maxDimension = 1920
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let { width, height } = img;

                // Calculate scale
                if (width > height && width > maxDimension) {
                    height = (height * maxDimension) / width;
                    width = maxDimension;
                } else if (height > width && height > maxDimension) {
                    width = (width * maxDimension) / height;
                    height = maxDimension;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Could not get canvas context"));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                // Export as data URL
                resolve(canvas.toDataURL("image/jpeg", 0.9)); // compress to 90%
            };

            if (e.target?.result) {
                img.src = e.target.result as string;
            }
        };

        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
};
