import React from 'react';
import './DeleteModal.css';
export default function DeleteModal({header, open, close}: {header: string, open: boolean, close: Function}) {
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
                        <button className="close" onClick={() => close}>
                            close
                        </button>
                    </footer>
                </section>
            ) : null}
        </div>
    )
}