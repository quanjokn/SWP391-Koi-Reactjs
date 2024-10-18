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

        if (status === "Rejected" && step === 1) {
            return "rejected";
        }

        return currentStep >= step
            ? "active"
            : currentStep < step
                ? "text-muted"
                : ""; // Trả về chuỗi rỗng nếu không thuộc trạng thái nào
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
                                        id="progressbarSell-2"
                                        className="d-flex justify-content-between mx-0 mt-0 mb-5 px-0 pt-0 pb-2"
                                    >
                                        <li
                                            className={`step0 ${getStatusClass(1)} text-center`}
                                            id="step1s"
                                        ></li>
                                        <li
                                            className={`step0 ${getStatusClass(2)} text-center`}
                                            id="step2s"
                                        ></li>
                                        <li
                                            className={`step0 ${getStatusClass(3)} text-center`}
                                            id="step3s"
                                        ></li>
                                        <li
                                            className={`step0 ${getStatusClass(4)} text-center`}
                                            id="step4s"
                                        ></li>
                                        <li
                                            className={`step0 ${getStatusClass(5)} text-end`}
                                            id="step5s"
                                        ></li>
                                    </ul>

                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex flex-column align-items-center">
                                            <MDBIcon fas icon="clipboard-list" size="3x" />
                                            <p
                                                className={`fw-bold text-center mb-0 ${status === "Rejected" ? "rejected-text" : ""
                                                    }`}
                                            >
                                                Đợi Xác Nhận
                                            </p>
                                        </div>
                                        <div className="d-flex flex-column align-items-center">
                                            <MDBIcon fas icon="clipboard-check" size="3x" />
                                            <p className="fw-bold text-center mb-0">Đang xác nhận</p>
                                        </div>
                                        <div className="d-flex flex-column align-items-center">
                                            <MDBIcon fas icon="reply" size="3x" />
                                            <p className="fw-bold text-center mb-0">Đã phản hồi </p>
                                        </div>
                                        <div className="d-flex flex-column align-items-center">
                                            <MDBIcon fas icon="circle-check" size="3x" />
                                            <p className="fw-bold text-center mb-0">Đã Hoàn Thành</p>
                                        </div>
                                        <div className="d-flex flex-column align-items-center">
                                            <MDBIcon fas icon="coins" size="3x" />
                                            <p className="fw-bold text-center mb-0">Đã thanh toán</p>
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
