import React from 'react';

const Card = ({comic}) => {
    return (
        <div className={"border rounded-lg text-center border-none my-2 shadow"}>
            {/*<h5 className={"font-medium text-rose-800 text-lg"}>{comic.text}</h5>*/}
            <img src={comic.image} alt={comic.name} className={"rounded-lg"}/>
            {/*<p className={"text-gray-600"}>{new Date(comic.time).toLocaleString()}</p>*/}
        </div>
    );
};

export default Card;
