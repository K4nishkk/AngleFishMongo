import React, { useState } from 'react';

const FileDownload = () => {
    const [fileName, setFileName] = useState<string>("");
    const [message, setMessage] = useState<string | null>(null);

    const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFileName(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!fileName) {
            setMessage("Please enter a file name");
            return;
        }

        try {
            const response = await fetch(`/api/download?fileName=${fileName}`);
            if (!response.ok) {
                const result = await response.json();
                setMessage(`Error: ${result.error}`);
                return;
            }

            // Convert response to blob
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Create an anchor element to trigger download
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName; // Suggests the file name for download
            document.body.appendChild(link);
            link.click();
            link.remove();

            setMessage("File downloaded successfully");
        } catch (error) {
            setMessage(`Error while downloading file: ${error}`);
        }
    };

    return (
        <div>
            <h1>Download File</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={fileName}
                    onChange={handleFileNameChange}
                    placeholder="Enter file name"
                />
                <button type="submit">Download</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FileDownload;