import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../Auth/context/AuthContext';
import DataTable from 'react-data-table-component';
import { dateConverter, expectedDateFormatter, numberConverter } from '../../utils/helper';
import Header from './Components/Header';
import DashboardModal from '../../Components/Modal';
import MobileFullScreenModal from '../../Components/MobileFullScreenModal';
import { IoLocationSharp, IoPricetagOutline } from 'react-icons/io5';
import { TfiGift } from 'react-icons/tfi';
import { CiCalendar } from 'react-icons/ci';
import { MdArrowBackIos, MdOutlinePhoneEnabled } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { GiReceiveMoney } from 'react-icons/gi';
import Alert from '../../Components/Alert';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';
import OTPInput from 'react-otp-input';
import GiftLoader from '../../Assets/images/gifta-loader.gif';


const customStyles = {
    head: {
        style: {
            fontSize: "12px",
            fontWeight: "bold",
            color: "#777",
            minHeight: '100px',
        },
    },
    rows: {
        style: {
            minHeight: '100px',
            cursor: 'pointer'
        },
    },
};

const customStyleModal = {
	minHeight: "auto",
	maxWidth: "44rem",
	width: "44rem",
    zIndex: 300000
};

const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2.4rem'
}

const inputStyle = {
    width: '5.2rem',
    height: '5.2rem',
    fontSize: '2rem',
    border: '1.6px solid #ccc',
    borderRadius: '.4rem',
    color: '#444',
}


const columns = [
    {
        name: "Order Details",
        selector: (row) => {
            return (
                <div className="table-flex table-product">
                    <img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/products/${row?.gift?.images?.at(0)}`} alt={row?.gift?.name} />
                    <span>
                        <p>{row?.gift?.name}</p>
                        <p>Quantity: {row?.quantity}</p>
                        <p>Purpose: {row?.purpose}</p>
                    </span>
                </div>
            );
        },
        width: '250px'
    },
    {
        name: "Delivery Status",
        selector: (row) => (
            <span className={`status status--${(!row.isDelivered && !row.isAcceptedOrder && !row.isRejectedOrder) ? "pending" : (!row.isDelivered && row.isAcceptedOrder) ? 'approved' : (!row.isDelivered && row.isRejectedOrder) ? 'rejected' : 'success' }`}>
                <p>{(!row.isDelivered && !row.isAcceptedOrder && !row.isRejectedOrder) ? "Pending" : (!row.isDelivered && row.isAcceptedOrder) ? 'Approved' : (!row.isDelivered && row.isRejectedOrder) ? 'Rejected' : 'Success' }</p>
            </span>
        ),
    },
    {
        name: "Delivery Date",
        selector: (row) => expectedDateFormatter(row.deliveryDate),
    },
    {
        name: "Gifter Email",
        selector: (row) => row.gifter?.email,
        width: '250px'
    },
    {
        name: "Amount",
        selector: (row) => `₦${numberConverter(row.amount)}`,
    },
    {
        name: "Delivery Location",
        selector: (row) => `${row.state}, ${row.country}`,
    },
    {
        name: "Order Date",
        selector: (row) => dateConverter(row.createdAt),
    },
];

const Spinner = () => <p style={{ padding: '2rem', fontSize: '1.8rem', fontWeight: '500' }}>Loading...</p>
function Message({ type }) {
    return (<p className="modal--info" style={{ margin: '2rem auto' }}>You have no {type === 'all' ? '' : type} order (0)</p>)
}


function Order() {
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState({});
    const [showOrderModal, setShowOrderModal] = useState(false);

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [helpRefetch, setHelpRefetch] = useState(false);

    const [seletedId, setSelectedId] = useState(null);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [activeTab, setActiveTab] = useState('all');

    const [deliveryCode, setDeliveryCode] = useState('');

    const { token, handleSetOrder } = useAuthContext();
    const navigate = useNavigate();

    const all = orders;
    const pendingOrders = all?.filter(order => !order?.isAcceptedOrder && !order?.isRejectedOrder && !order?.isDelivered);
    const approvedOrders = all?.filter(order => order?.isAcceptedOrder && !order?.isDelivered);
    const rejectedOrders = all?.filter(order => order?.isRejectedOrder && !order?.isDelivered);
    const deliveredOrders = all?.filter(order => order?.isAcceptedOrder && order?.isDelivered);

    // HANDLE FETCH STATE RESET
    function handleReset() {
        setIsError(false);
        setMessage('')
        setIsSuccess(false);
    }

    // HANDLE ON FETCH FAILURE
    function handleFailure(mess) {
        setIsError(true);
        setMessage(mess)
        setTimeout(() => {
            setIsError(false);
            setMessage('')
        }, 3000);
    }

    async function handleOrders() {
        try {
            setIsLoading(true)
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/orders`, {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(!res.ok) throw new Error('Something went wrong!');

            const data = await res.json();
            if(data?.status !== "success") {
                throw new Error(data.message);
            }
            setOrders(data?.data?.orders);
        } catch(err) {     
            console.log(err);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(function() {
        handleOrders()
    }, [helpRefetch]);

    useEffect(function() {
        if(showOrderModal === false) {
            setSelectedOrder({});
            setSelectedId(null);
            setDeliveryCode('');
        }
    }, [showOrderModal])

    function handleOrderActions(id, type) {
        setSelectedId(id);
        console.log(id, selectedOrder?._id)
        if(type === 'accept') {
            setShowAcceptModal(true);
        } else {
            setShowRejectModal(true)
        }
    }

    function handleOrderRow(order) {
        setShowOrderModal(true);
        setSelectedOrder(order);
    }


    useEffect(function () {
        document.title = 'Gifta | My Orders';

        window.scrollTo(0, 0)
    }, []);



    async function handleAcceptOrder() {
        try {
            handleReset();
            setIsLoading(true);

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/orders/accept-order/${seletedId}/${selectedOrder?.giftingPackageID}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            if (data.status !== "success") throw new Error(data.message);
            const count = data?.data?.orders?.filter(order => !order.isDelivered && !order.isRejectedOrder);

            setIsSuccess(true);
            setMessage(data.message);
            setTimeout(() => {
                setSelectedOrder(data?.data?.order);
                setIsSuccess(false);
                setMessage("");
                setShowAcceptModal(false);
                setHelpRefetch(true);
                handleSetOrder(data.data.orders, count.length);
            }, 2000);

        } catch (err) {
            handleFailure(err.message)
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRejectOrder() {
        try {
            handleReset();
            setIsLoading(true);

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/orders/reject-order/${seletedId}/${selectedOrder?.giftingPackageID}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            if (data.status !== "success") throw new Error(data.message);
            const count = data?.data?.orders?.filter(order => !order.isDelivered && !order.isRejectedOrder);

            setIsSuccess(true);
            setMessage(data.message);
            setTimeout(() => {
                setSelectedOrder(data?.data?.order);
                setIsSuccess(false);
                setMessage("");
                setHelpRefetch(true);
                setSelectedOrder({})
                setSelectedId(null)
                setShowRejectModal(false);
                handleSetOrder(data.data.orders, count.length);
            }, 2000);

        } catch (err) {
            handleFailure(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    // COMPLETE ORDER WITH THE DELIVERY CODE
    async function handleCompleteOrder() {
        try {
            handleReset();
            setIsLoading(true);

            {console.log(deliveryCode.length)}
            if(deliveryCode.length < 4) throw new Error('Delivery code must be exactly 4 numbers')

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/orders/complete-order/${selectedOrder?._id}/${selectedOrder?.giftingPackageID}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ deliveryCode })
            });

            if (!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            if (data.status !== "success") throw new Error(data.message);
            const count = data?.data?.orders?.filter(order => !order.isDelivered && !order.isRejectedOrder);

            setIsSuccess(true);
            setMessage(data.message);
            setTimeout(() => {
                setSelectedOrder(data?.data?.order);
                setIsSuccess(false);
                setMessage("");
                setHelpRefetch(true);
                setShowRejectModal(false);
                handleSetOrder(data.data.orders, count.length);
            }, 2000);

        } catch (err) {
            handleFailure(err.message);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <>

            {isLoading && (
                <div className='gifting--loader' style={{ zIndex: '350000'}}>
                    <img src={GiftLoader} alt='loader' />
                </div>
            )}

            <Header />

            <section className="product__section section">
                <div className="section__container">
                    <div className="section--head">
                        <span onClick={() => navigate(-1)} className='wishlist--back-btn'>Back</span>

                        <span className='section--flex-two' style={{ marginBottom: '2rem' }}>
                            <p className='section__heading' style={{ margin: '0', fontSize: '2.8rem', fontWeight: '500' }}>My Orders</p>
                            <div className="wallet--tabs">
                                <span className={`wallet--tab ${activeTab === "all" && "tab--active"}`} onClick={() => { setActiveTab("all") }}>All Orders({all.length})</span>
                                <span className={`wallet--tab ${activeTab === "pending" && "tab--active"}`} onClick={() => { setActiveTab("pending") }}>Pending ({pendingOrders.length})</span>

                                <span className={`wallet--tab ${activeTab === "approved" && "tab--active"}`} onClick={() => { setActiveTab("approved") }}>Approved ({approvedOrders.length})</span>
                                <span className={`wallet--tab ${activeTab === "rejected" && "tab--active"}`} onClick={() => { setActiveTab("rejected") }}>Rejected ({rejectedOrders.length})</span>

                                <span className={`wallet--tab ${activeTab === "delivered" && "tab--active"}`} onClick={() => { setActiveTab("delivered") }}>Delivered ({deliveredOrders.length})</span>
                            </div>

                            <select className="wallet--tabs-mobile" value={activeTab} onChange={(e) => { setActiveTab(e.target.value) }}>
                                <option value="all">All ({all.length})</option>
                                <option value="pending">Pending ({pendingOrders.length})</option>
                                <option value="approved">Approved ({approvedOrders.length})</option>
                                <option value="rejected">Rejected ({rejectedOrders.length})</option>
                                <option value="delivered">Delivered ({deliveredOrders.length})</option>
                            </select>
                        </span>
                    </div>


                    <div className="destop-data-table">
                        <DataTable
                            columns={columns}
                            data={ (activeTab === 'all') ? all : (activeTab === 'pending') ? pendingOrders : (activeTab === 'delivered') ? deliveredOrders : (activeTab === 'approved') ? approvedOrders : (activeTab === 'rejected') ? rejectedOrders : '' }
                            pagination
                            persistTableHead
                            highlightOnHover
                            progressPending={isLoading}
                            progressComponent={<Spinner />}
                            customStyles={customStyles}
                            onRowClicked={handleOrderRow}
                            noDataComponent={<Message type={activeTab} />}
                        />
                    </div>
                    <div className="mobile-data-table">
                        <DataTable
                            columns={columns}
                            data={ (activeTab === 'all') ? all : (activeTab === 'pending') ? pendingOrders : (activeTab === 'delivered') ? deliveredOrders : (activeTab === 'approved') ? approvedOrders : (activeTab === 'rejected') ? rejectedOrders : '' }
                            pagination
                            persistTableHead
                            highlightOnHover
                            progressPending={isLoading}
                            progressComponent={<Spinner />}
                            customStyles={customStyles}
                            onRowClicked={handleOrderRow}
                            onRowMouseEnter={handleOrderRow}
                            noDataComponent={<Message type={activeTab} />}
                        />
                    </div>
                </div>
            </section>

            {showOrderModal && (
                <MobileFullScreenModal isDifferent={selectedOrder?.isRejectedOrder} setSelected={setSelectedOrder}>
                    <div className="gift--preview-figure">

                        <div className="gift--preview-top">
                            <img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/products/${selectedOrder?.gift?.images?.at(0)}`} alt={selectedOrder?.celebrant} />
                            <div className="gift--preview-details">
                                <span onClick={() => setShowOrderModal(false)}><MdArrowBackIos /></span>
                                <p className="gift--preview-name">For {selectedOrder?.gift?.name}</p>
                                <p className="gift--preview-date">
                                    <CiCalendar />
                                    {expectedDateFormatter(selectedOrder?.deliveryDate)}
                                </p>
                            </div>
                        </div>

                        <div className="gift--preview-bottom">
                            <span className="gift--preview-title"> Purchased For <TfiGift style={{ color: '#bb0505' }} /></span>
                            <div className="gift--preview-flex">
                                <img src={selectedOrder?.celebrantImage ? `${import.meta.env.VITE_SERVER_ASSET_URL}/others/${selectedOrder?.celebrantImage}` : 'https://res.cloudinary.com/dy3bwvkeb/image/upload/v1701957741/avatar_unr3vb-removebg-preview_rhocki.png'} />
                                <div>
                                    <p>For {selectedOrder?.celebrant}</p>
                                    <span className="gift--preview-amount"><IoPricetagOutline /><p>Amount: <span>{`₦${numberConverter(selectedOrder?.amount)}`}</span></p></span>
                                    <span className="gift--preview-amount"><GiReceiveMoney /><p>Quantity: <span>{selectedOrder?.quantity}</span></p></span>
                                    <span className="gift--preview-amount"><MdOutlinePhoneEnabled /><p>Phone No: <span>{selectedOrder?.contact || '-'}</span></p></span>
                                </div>
                            </div>
                            <span className="gift--preview-title"> Delivery Location <IoLocationSharp style={{ color: '#bb0505' }} /></span>
                            <p style={{ fontSize: '1.4rem' }}>{selectedOrder?.address}</p>


                            {(!selectedOrder?.isAcceptedOrder && !selectedOrder?.isRejectedOrder) && (
                                <>
                                    <p className="modal--info" style={{ fontSize: '1.2rem' }}><strong>Note</strong>: That you have access to either approving or rejecting this order as you wish.</p>
                                    <div className="gift--preview-actions">
                                        <button type='button ' onClick={() => handleOrderActions(selectedOrder._id, 'accept')}>Accept Order </button>
                                        <button type='button btn--submit' onClick={() => handleOrderActions(selectedOrder._id, 'reject')}>Reject Order</button>
                                    </div>
                                </>
                            )}

                            {(selectedOrder?.isAcceptedOrder && !selectedOrder?.isDelivered) && (
                                <div className='order--code-box' style={{ gap: '2.4rem' }}>
                                    <span className='order-stat accepted-stat'>
                                        <AiFillCheckCircle className='order--icon' />
                                        You Approved This Order!
                                    </span>
                                    <p className="modal--info" style={{ fontSize: '1.2rem', padding: 0, }}><strong>Note</strong>: When Package is being delivered, Collect code from Buyer and paste here for comfirmation of delivery.</p>
                                    <OTPInput
                                        value={deliveryCode}
                                        onChange={setDeliveryCode}
                                        numInputs={4}
                                        inputStyle={inputStyle}
                                        containerStyle={containerStyle}
                                        renderInput={(props) => <input {...props} />}
                                        inputType='number'
                                    />
                                    <button type='button' className='order--code-btn' onClick={handleCompleteOrder}>Confirm</button>
                                </div>
                            )}

                            {selectedOrder?.isRejectedOrder && (
                                <div className='order--code-box'>
                                    <span className='order-stat rejected-stat'>
                                        <AiFillExclamationCircle className='order--icon' />
                                        You Rejected This Order!
                                    </span>
                                </div>
                            )}

                            {selectedOrder?.isDelivered && (
                                <div className='order--code-box'>
                                    <span className='order-stat delivered-stat'>
                                        <AiFillCheckCircle className='order--icon' />
                                        Order Delivered!
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </MobileFullScreenModal>
            )}


            {(showAcceptModal || showRejectModal) && (
                <DashboardModal customStyle={customStyleModal} overLayZIndex={true} title={`${showAcceptModal ? 'Accept' : 'Reject'} this order!`} setShowDashboardModal={showAcceptModal ? setShowAcceptModal : setShowRejectModal}>
                    <p className='modal--text-2'>Are you sure you want to {showAcceptModal ? 'accept' : 'reject'} this Order?</p>
                    <span className='modal--info'>Note that everything relating data to this wish would also be deleted including transaction history!</span>
                    <div className="reminder--actions" style={{ marginTop: '1.4rem' }}>
                        <button type='button' className='cancel--btn' onClick={() => showAcceptModal ? setShowAcceptModal(false) : setShowRejectModal(false)}>Cancel</button>
                        <button type='submit' className='set--btn' onClick={showAcceptModal ? handleAcceptOrder : handleRejectOrder}>{showAcceptModal ? 'Accept' : 'Reject'} Order</button>
                    </div>
                </DashboardModal>
            )}


            {(isError || isSuccess) && (
                <Alert alertType={`${isSuccess ? "success" : isError ? "error" : ""}`}>
                    {isSuccess ? (
                        <AiFillCheckCircle className="alert--icon" />
                    ) : isError && (
                        <AiFillExclamationCircle className="alert--icon" />
                    )}
                    <p>{message}</p>
                </Alert>
            )}

        </>
    )
}

export default Order
