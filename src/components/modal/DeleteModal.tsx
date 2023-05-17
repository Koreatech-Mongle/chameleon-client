import React from 'react';
import './DeleteModal.css';
//TODO : add open, close, onSubmit to normalization
export default function DeleteModal({header, open, close, submit}: {header: string, open: boolean, close: Function, submit: Function}) {
    return (
        <div className={open ? 'openModal modal' : 'modal'}>
            {open ? (
                <section>
                    <header>
                        {header}
                        <button className="close" onClick={() => close}>
                            &times;
                        </button>
                    </header>
                    <footer>

                        <button className="submit" onClick={() => submit}>
                            delete
                        </button>
                        <button className="close" onClick={() => close}>
                            close
                        </button>
                    </footer>
                </section>
            ) : null}
        </div>
    )
}