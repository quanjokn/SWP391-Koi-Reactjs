import React, { useEffect, useState } from "react";
import styles from "./reasonNote.module.css";

const ReasonModal = ({ reason, setReason, setShowModal, handlePrepareOrder }) => {
    const [tempReason, setTempReason] = useState(reason);

    useEffect(() => {
        setTempReason(reason);
    }, [reason]);

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2>Nhập lý do từ chối</h2>
                <textarea
                    value={tempReason}
                    onChange={(e) => setTempReason(e.target.value)}
                    placeholder="Nhập lý do tại đây..."
                />
                <div className={styles.modalButtons}>
                    <button onClick={() => setShowModal(false)}>Hủy</button>
                    <button onClick={() => { handlePrepareOrder(tempReason); setShowModal(false); }}>Xác nhận</button>
                </div>
            </div>
        </div>
    );
};

export default ReasonModal;
