import React from 'react';
import Avatar from "./avatar";
import Priority from "./icons/priority";
import Status from "./icons/status";
import Tag from "./tag";

const Card = ({ticket, showAvatar = true, showStatus = true, showPriority = true}) => {
    const {id, title, priority, userId, status, tag} = ticket;

    return (
        <div className="border rounded-xl p-6 bg-white shadow mb-2">
            <div className={"flex flex-row items-center mb-1"}>
                <div className={"flex-1 text-gray-700 text-sm font-medium"}>{id}</div>
                {showAvatar ? <Avatar userID={userId}/> : null}
            </div>
            <div className={"flex flex-row"}>
                {showStatus ? <Status status={status} className={"mr-2 mt-0.5"}/> : null}
                <h3 className={"font-medium flex-1 my-0"}>{title}</h3>
            </div>
            <div className={"mt-2"}>
                {showPriority ? <Tag tag={<Priority priority={priority}/>} showIcon={false} className={"mr-1"}/> : null}
                {tag.map((t) => (
                    <Tag key={t} tag={t}/>
                ))}
            </div>
        </div>
    );
};

export default Card;
