    import { MongoRecord } from "@/layerDataAccess/directory";
    import React, { useState, useEffect } from "react";
    import Record from "./record";

    const FolderView = () => {
        const [currentFolder, setCurrentFolder] = useState<MongoRecord | null>(null); // Current folder details
        const [contents, setContents] = useState([]); // Children of the folder
        const [loading, setLoading] = useState(true);

        // Function to fetch folder contents
        const fetchFolderContents = async (folderId: string) => {
            try {
                setLoading(true);
                const response = await fetch(`/api/folders/${folderId}`);
                const data = await response.json();
                setCurrentFolder(data.folder);
                setContents(data.children);
            } catch (error) {
                console.error("Failed to fetch folder contents", error);
            } finally {
                setLoading(false);
            }
        };

        // Fetch root folder on initial load
        useEffect(() => {
            const rootFolderId = "67720d672740d567fe9f843b"; // Replace with the actual root folder ID
            fetchFolderContents(rootFolderId);
        }, []);

        return (
            <div>
                {loading ?
                (
                    <p>Loading...</p>
                ) : (
                    <>
                        <h1>{currentFolder && currentFolder.name}</h1>
                        {
                            currentFolder && currentFolder.parentId &&
                            <button onClick={() => fetchFolderContents(currentFolder.parentId as string)}>🔙</button>
                        }
                        <div>
                            {contents.map((item: MongoRecord) => (
                                <Record
                                    type={item.type}
                                    name={item.name}
                                    createdAt={item.createdAt}
                                    updatedAt={item.updatedAt}
                                    key={item._id}
                                    onClick={() => item.type === "Folder" && fetchFolderContents(item._id)}
                                />
                            ))}
                        </div>
                        <button style={{padding: "10px", fontSize: "30px", position: "absolute", bottom: "50px", right: "50px"}}>+</button>
                    </>
                )}
            </div>
        );
    };

    export default FolderView;