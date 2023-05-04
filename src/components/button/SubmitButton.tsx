import React from 'react';
import {SubmitButtonData} from '../../types/chameleon-client';

export default function SubmitButton({style, className, text, onClick, event, disabled}: SubmitButtonData) {
    return (
        <button
            type="button"
            onClick={onClick}
            style={style}
            disabled={disabled}
            className={`hover:drop-shadow-xl whitespace-nowrap p-2 ${className}`}
        >{text}{event}</button>
    );
};