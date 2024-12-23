import React, { useState } from "react";

const FileUpdate = () => {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setFile(files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!file) {
            setMessage("Please select a file");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/update", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const result = await response.json();
                setMessage(`Error: ${result.error}`);
                return;
            }

            setMessage("File updated successfully");
        } catch (error) {
            setMessage(`Error while updating file: ${error}`);
        }
    };

    return (
        <div>
            <h1>Update File</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Update</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FileUpdate;