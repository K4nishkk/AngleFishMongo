import React, { useState } from 'react';

const FileUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    }

    const handleSubmit = async(event: React.FormEvent) => {
        event.preventDefault();

        if (!file) {
            setMessage("No file selected");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        // send request
        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                setMessage(`File uploaded: ${result.message}`);
            }
            else {
                setMessage(`Error response: ${result.message}`);
            }
        }
        catch (error) {
            setMessage(`Error occured while uploading file: ${error}`);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}

export default FileUpload;