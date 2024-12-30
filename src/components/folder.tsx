import React from "react";

type RecordProps = {
    type: string,
    name: string,
    createdAt: Date,
    updatedAt: Date
}

const Record: React.FC<RecordProps> = ({type, name, createdAt, updatedAt}) => {
    return (
        <div style={{display: "flex", justifyContent: "space-around", border: "solid", padding: "10px"}}>
            <div>{type}</div>
            <div>{name}</div>
            <div>Created At: {createdAt.toString()}</div>
            <div>Updated At: {updatedAt.toString()}</div>
        </div>
    )
}

export default Record;