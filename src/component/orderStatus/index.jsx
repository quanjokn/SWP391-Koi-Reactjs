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
import "./orderStatus.css";

export default function OrderStatus({ orderId, date, status }) {
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
            Preparing: 2,
            Shipping: 3,
            Completed: 4,
        };

        const currentStep = statusMap[status] || 0;
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
                                        <div className="text-end justify-content-between align-items-center mb-0">
                                            Order Date <span>{date}</span>
                                        </div>
                                    </div>
                                    <ul
                                        id="progressbar-2"
                                        className="d-flex justify-content-between mx-0 mt-0 mb-5 px-0 pt-0 pb-2"
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
                                            className={`step0 ${getStatusClass(4)} text-end`}
                                            id="step4"
                                        ></li>
                                    </ul>

                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex flex-column align-items-center">
                                            <MDBIcon fas icon="clipboard-list" size="3x" />
                                            <p className="fw-bold text-center mb-0">
                                                Đợi Xác Nhận
                                            </p>
                                        </div>
                                        <div className="d-flex flex-column align-items-center">
                                            <MDBIcon fas icon="box-open" size="3x" />
                                            <p className="fw-bold text-center mb-0">Đang Chuẩn Bị</p>
                                        </div>
                                        <div className="d-flex flex-column align-items-center">
                                            <MDBIcon fas icon="shipping-fast" size="3x" />
                                            <p className="fw-bold text-center mb-0">
                                                Đang Vận Chuyển
                                            </p>
                                        </div>
                                        <div className="d-flex flex-column align-items-center">
                                            <MDBIcon fas icon="home" size="3x" />
                                            <p className="fw-bold text-center mb-0">Đã Hoàn Thành</p>
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
