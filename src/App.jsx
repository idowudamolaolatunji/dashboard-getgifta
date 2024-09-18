import React from 'react'
import ProtectedRoute from './utils/PrivateRoutes'
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import DashBoard from './Pages/DashBoard';

import Gifting from './Pages/Gifting';
import DigitalGift from './Pages/DigitalGift';
import IdeaBox from './Pages/IdeaBox';
import Marketplace from './Pages/Marketplace';
import Wishlists from './Pages/Wishlists';
import Reminders from './Pages/Reminders';

import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom'
import CategoryPage from './Pages/Marketplace/MarketComponent/MarketProducts';
import WishListUi from './Pages/Wishlists/WishlistsComponents/WishListUi';

import SharedWishlist from './Pages/PublicPages/SharedWishlist';
import Wallet from './Pages/PublicPages/Wallet';
import Settings from './Pages/PublicPages/Settings';
import Orders from './Pages/PublicPages/Orders';


import './index.css'
import './Pages/DashBoard/main.css';
import './query.css';
import AccountProfile from './Pages/PublicPages/AccountProfile';
import TermsOfUse from './Pages/PublicPages/TermsOfUse';
import PrivacyPolicy from './Pages/PublicPages/PrivacyPolicy';
import SubscriptionPlan from './Pages/PublicPages/SubscriptionPlan';
import VendorReg from './Pages/PublicPages/VendorReg';
import ProductCatalogue from './Pages/PublicPages/ProductCatalogue';
import KycVer from './Pages/PublicPages/KycVer';
import ProductStats from './Pages/PublicPages/ProductStats';
import PublicMarketPlace from './Pages/PublicPages/PublicMarketPlace';
import AddGiftToReminder from './Pages/Reminders/ReminderComponents/AddGiftToReminder';
import PurchasedCatalogue from './Pages/DigitalGift/components/PurchasedCatalogue';



function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashBoard />}></Route>
                    <Route path="/" element={<DashBoard />}></Route>
                    <Route path="/:id" element={<DashBoard />}></Route>

                    <Route path="/dashboard/gifting" element={<Gifting />}></Route>
                    <Route path="/dashboard/gifting/:category" element={<Marketplace />}></Route>

                    <Route path="/dashboard/digital-gift/:category" element={<DigitalGift />}></Route>
                    <Route path="/dashboard/purchased-gift/:category" element={<PurchasedCatalogue />}></Route>
                    <Route path="/dashboard/gifted-gift/:category" element={<PurchasedCatalogue />}></Route>
                    <Route path="/dashboard/idea-box/:category" element={<IdeaBox />}></Route>

                    <Route path="/dashboard/wishlists" element={<Wishlists />}></Route>
                    <Route path="/dashboard/wishlists/:wishListSlug" element={<WishListUi />}></Route>
                    <Route path="/dashboard/wishlists/:wishListSlug/wish" element={<WishListUi />}></Route>
                    <Route path="/dashboard/wishlists/:wishListSlug/wish/edit" element={<WishListUi />}></Route>
                    <Route path="/dashboard/wishlists/:wishListSlug/wish/delete" element={<WishListUi />}></Route>


                    <Route path="/dashboard/reminders" element={<Reminders />}></Route>
                    <Route path="/dashboard/reminders/add-gift/:category" element={<AddGiftToReminder />}></Route>


                    <Route path="/wallet" element={<Wallet />}></Route>
                    <Route path="/settings" element={<Settings />}></Route>
                    <Route path="/account-profile" element={<AccountProfile />}></Route>
                    <Route path="/kyc-verification" element={<KycVer />}></Route>
                    
                    <Route path="/vendor" element={<VendorReg />}></Route>
                    <Route path="/product-catalogue" element={<ProductCatalogue />}></Route>
                    <Route path="/orders" element={<Orders />}></Route>
                    <Route path="/product-stats" element={<ProductStats />}></Route>
                    <Route path="/plans" element={<SubscriptionPlan />}></Route>
                </Route>
                

                <Route path="/login" element={<Login />}></Route>
                <Route path="/signup" element={<Signup />}></Route>
                <Route path="/signup/:verificationType" element={<Signup />}></Route>
                <Route path="/invite/:inviteCode" element={<Signup />}></Route>                
                <Route path="/shared/:shareableUrl" element={<SharedWishlist />}></Route>
                <Route path="/terms-of-use" element={<TermsOfUse />}></Route>
                <Route path="/privacy-policy" element={<PrivacyPolicy />}></Route>
                {/* <Route path="/marketplace/:category/:productSlug" element={<PublicMarketPlace />}></Route> */}
                <Route path="/marketplace/:category" element={<PublicMarketPlace />}></Route>
                
            </Routes>
        </BrowserRouter>
    )
}


export default App