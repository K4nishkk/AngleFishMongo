import React, { useEffect, useState } from "react"

const FolderView = () => {
    const [data, setData] = useState("");

    const fetchFolderContents = async (folderId: string) => {
        try {
            const response = await fetch(`/api/folders/${folderId}`);
            const data = await response.json();
            console.log(data)
            setData(JSON.stringify(data));
        }
        catch (err) {
            console.log("Failed to fetch folder contents", err);
        }
    }

    useEffect(() => {
        const rootFolderId = "67720d672740d567fe9f843b";
        fetchFolderContents(rootFolderId);
    }, [])

    return (
        <div>{data}</div>
    )
}

export default FolderView