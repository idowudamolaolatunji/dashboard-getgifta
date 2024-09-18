import React, { useState } from 'react';

import { CiHome, CiLogout, CiSaveUp2, CiShop, CiShoppingBasket, CiUser, CiViewList } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../Auth/context/AuthContext';
import { IoIosQrScanner } from "react-icons/io";
import { PiFolderSimpleUserLight, PiIdentificationCardLight, PiUserListLight } from 'react-icons/pi';
import NewTag from './NewTag';

import { GiChart } from "react-icons/gi";


function Dropdown({ addHomeLink, setShowLoader }) {
    const { user, logout, ordersCount } = useAuthContext();
    const navigate = useNavigate()

    function handleLogout() {
        logout();

        setTimeout(() => {
            window.location.reload();
            // navigate('/login')
            // window.location.href = '/login'
            // window.location.assign('/login')
        }, 350)
    }

    return (
        <div className='dropdown--figure'>
            <ul>
                {addHomeLink && (
                    <li onClick={() => navigate('/dashboard')}>
                        <CiHome />
                        <p>Home</p>
                    </li>
                )}
                <li onClick={() => navigate('/account-profile')}>
                    <CiUser />
                    <p>Account</p>
                </li>
                <li onClick={() => navigate('/plans')}>
                    <CiSaveUp2 />
                    <p>Plan</p>
                </li>
                <li onClick={() => navigate('/kyc-verification')}>
                    <PiIdentificationCardLight />
                    <p>Kyc Verification</p>
                    {!user?.isKycVerified && <NewTag />}
                </li>
                {user.role !== 'vendor' && (
                    <li onClick={() => navigate('/vendor')}>
                        <PiFolderSimpleUserLight />
                        <p>Become a Vendor</p>
                    </li>
                )}
                {user.role === 'vendor' && (
                    <>
                        <li onClick={() => navigate('/product-catalogue')}>
                            <CiShop />
                            <p>My Shop</p>
                        </li>

                        <li onClick={() => navigate('/orders')}>
                            <CiShoppingBasket />
                            {ordersCount > 0 ? (
                                <>
                                    <p>Orders</p>
                                    <NewTag title={`${ordersCount} pending..`} addNoStyle={true} />
                                </>
                            ) : (
                                <p>Orders</p>
                            )}
                        </li>

                        <li onClick={() => navigate('/product-stats')}>
                            <GiChart />
                            <p>Product Stat</p>
                        </li>
                    </>
                )}
                <li onClick={() => navigate('/privacy-policy')}>
                    <CiViewList />
                    <p>Privacy Policy</p>
                </li>
                <li onClick={() => navigate('/terms-of-use')}>
                    <IoIosQrScanner />
                    <p>Terms of Use</p>
                </li>
                
                <li onClick={() => handleLogout()}>
                    <CiLogout />
                    <p>Logout</p>
                </li>
            </ul>
        </div>
    )
}

export default Dropdown
