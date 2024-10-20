import React, { useEffect } from "react";
import {
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBRow,
    MDBTypography,
} from "mdb-react-ui-kit";
import "./consignSellStatus.css";

export default function ConsignSellStatus({ orderId, Date, status }) {
    // Nhận thêm status từ API
    useEffect(() => {
        const colElement = document.querySelector(".col-12");
        if (colElement) {
            colElement.style.paddingLeft = "0";
            colElement.style.paddingRight = "0";
        }
        return () => {
            if (colElement) {
                colElement.style.paddingLeft = "";
                colElement.style.paddingRight = "";
            }
        };
    }, []);

    const getStatusClass = (step) => {
        const statusMap = {
            Pending_confirmation: 1,
            Receiving: 2,
            Responded: 3,
            Done: 4,
            Shared: 5,
            Rejected: 0,
        };

        const currentStep = statusMap[status] || 0;

        if (status === "Rejected") {
            return "rejected";
        }

        return currentStep >= step
            ? "active"
            : currentStep < step
                ? "text-muted"
                : ""; // Trả về chuỗi rỗng nếu không thuộc trạng thái nào
    };
    const getTextColorClass = (step) => {
        const statusMap = {
            Pending_confirmation: 1,
            Receiving: 2,
            Responded: 3,
            Done: 4,
            Shared: 5,
            Rejected: 0,
        };

        const currentStep = statusMap[status] || 0;

        if (status === "Rejected") {
            return "text-danger"; // Màu đỏ cho chữ
        }

        return currentStep >= step ? "text-success" : "text-muted"; // Xanh lá cho chữ đã hoàn thành, màu nhạt cho chưa hoàn thành
    };

    return (
        <>
            <section className="vh-10">
                <MDBContainer className="py-5 h-100">
                    <MDBRow className="justify-content-center align-items-center h-100">
                        <MDBCol size="12">
                            <MDBCard
                                className={`card-stepper text-black`}
                                style={{ borderRadius: "5px" }}
                            >
                                <MDBCardBody className="p-5">
                                    <div className="d-flex justify-content-between align-items-center mb-5">
                                        <div>
                                            <MDBTypography tag="h5" className="mb-0">
                                                ORDER ID{" "}
                                                <span className="text-primary font-weight-bold">
                                                    #{orderId}
                                                </span>
                                            </MDBTypography>
                                        </div>
                                    </div>
                                    <ul
                                        id="progressbar-sell"
                                        className={`d-flex justify-content-between mx-0 mt-0 mb-5 px-0 pt-0 pb-2 ${status === 'Rejected' ? 'rejected' : ''}`}
                                    >
                                        <li
                                            className={`step0 ${getStatusClass(1)} text-center`}
                                            id="step1"
                                        ></li>
                                        <li
                                            className={`step0 ${getStatusClass(2)} text-center`}
                                            id="step2"
                                        ></li>
                                        <li
                                            className={`step0 ${getStatusClass(3)} text-center`}
                                            id="step3"
                                        ></li>
                                        <li
                                            className={`step0 ${getStatusClass(4)} text-center`}
                                            id="step4"
                                        ></li>
                                        <li
                                            className={`step0 ${getStatusClass(5)} text-end`}
                                            id="step5"
                                        ></li>
                                    </ul>

                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex flex-column align-items-center">
                                            <MDBIcon fas icon="clipboard-list" size="3x" />
                                            <p className={`fw-bold text-center mb-0 ${getTextColorClass(1)}`}>
                                                Đợi Xác Nhận
                                            </p>
                                        </div>
                                        <div className="d-flex flex-column align-items-center">
                                            <MDBIcon fas icon="clipboard-check" size="3x" />
                                            <p className={`fw-bold text-center mb-0 ${getTextColorClass(2)}`}>
                                                Đang xác nhận
                                            </p>
                                        </div>
                                        <div className="d-flex flex-column align-items-center">
                                            <MDBIcon fas icon="reply" size="3x" />
                                            <p className={`fw-bold text-center mb-0 ${getTextColorClass(3)}`}>
                                                Đã phản hồi
                                            </p>
                                        </div>
                                        <div className="d-flex flex-column align-items-center">
                                            <MDBIcon fas icon="circle-check" size="3x" />
                                            <p className={`fw-bold text-center mb-0 ${getTextColorClass(4)}`}>
                                                Đã Hoàn Thành
                                            </p>
                                        </div>
                                        <div className="d-flex flex-column align-items-center">
                                            <MDBIcon fas icon="coins" size="3x" />
                                            <p className={`fw-bold text-center mb-0 ${getTextColorClass(5)}`}>
                                                Đã Thanh toán
                                            </p>
                                        </div>
                                    </div>

                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </section>
        </>
    );
}