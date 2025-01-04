import React from "react";

type RecordProps = {
    type: string,
    name: string,
    createdAt: string,
    updatedAt: string,
    onClick: () => void;
}

const Record: React.FC<RecordProps> = ({type, name, createdAt, updatedAt, onClick}) => {
    return (
        <div
            style={{display: "flex", justifyContent: "space-around", padding: "10px", margin: "10px", background: "rgb(200, 200, 200)"}}
            onClick={onClick}
        >
            <div>{type === "Folder" ? "📁" : "📄"}</div>
            <div>{name}</div>
            <div>Created At: {createdAt}</div>
            <div>Updated At: {updatedAt}</div>
        </div>
    )
}

export default Record;