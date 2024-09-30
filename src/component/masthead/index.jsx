import React from 'react';
import styles from './masthead.module.css'; // Giả sử CSS module nằm ở đây

const Masthead = ({ title }) => {
    return (
        <div className={`${styles.masthead}`} style={{ backgroundImage: "url('/imagines/background/KoiFish.jpg')" }}>
            <div className="container position-relative px-4 px-lg-5">
                <div className="row gx-4 gx-lg-5 justify-content-center">
                    <div className="col-md-10 col-lg-8 col-xl-7">
                        <div className={`${styles.siteHeading}`}>
                            <h1>{title}</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Masthead;