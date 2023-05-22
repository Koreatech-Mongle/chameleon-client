import React from 'react';
import './DeleteModal.css';
//TODO : add open, close, onSubmit to normalization
export default function DeleteModal({header, close, submit}: {header: string, close: Function, submit: Function}) {
    const onClose = () => {
        close()
    };

    const onSubmit = () => {
        submit();
    }
    return (
        <div className={'modal'}>
            <section>
                <header>
                    {header}
                    <button className="close" onClick={onClose}>
                        &times;
                    </button>
                </header>
                <footer>
                    <button className="submit" onClick={onSubmit}>
                        delete
                    </button>
                    <button className="close" onClick={onClose}>
                        close
                    </button>
                </footer>
            </section>
        </div>
    )
}