import React, { useEffect, useState } from 'react';

const SavedLayout = () => {
    const [savedWidgets, setSavedWidgets] = useState([]);

    useEffect(() => {
        const savedLayout = localStorage.getItem('savedLayout');
        if (savedLayout) {
            setSavedWidgets(JSON.parse(savedLayout));
        }
    }, []);
    console.log(savedWidgets);

    return (
        <div className="absolute mx-auto flex-1 h-screen bg-black">
            {savedWidgets.map(({ widget, x, y, width, height, id }) => (
                <div
                    key={id}
                    className="absolute"
                    style={{
                        left: x,
                        top: y,
                        width,
                        height,
                        border: '2px solid #4CAF50'
                    }}
                >
                    <h1>{widget.attributes.text}</h1>
                </div>
            ))}
        </div>
    );
};

export default SavedLayout;