import React, { useState, useEffect } from 'react'

import { RiArrowRightDoubleLine } from "react-icons/ri";
import { numberConverter, dateConverter, truncate } from '../../../utils/helper'
import SkeletonLoader from '../../../Components/SkeletonLoader';
import SkeletonLoaderMarket from '../../../Components/SkeletonLoader1';
import SkeletonLoaderMini from '../../../Components/SkelentonLoaderMini';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Product from './Product';
import SkelentonOne from '../../../Components/SkelentonOne';
import { useAuthContext } from '../../../Auth/context/AuthContext';
import { IoClose } from 'react-icons/io5';
import { IoIosArrowBack } from 'react-icons/io';
import SubAlert from '../../../Components/SubAlert';
import { TfiGift } from 'react-icons/tfi';

function CategoryPage({ type }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingCat, setIsLoadingCat] = useState(false)
    const [categories, setCategories] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [mess, setMess] = useState('');
    const [stay, setStay] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const { category } = useParams();
    const [currentCategory, setCurrentCategory] = useState(category);

    // const [products, setProducts] = useState([]);
    // const [currTab, setCurrTab] = useState('birthday');


    const { user, token, activeReminder } = useAuthContext();
    const navigate = useNavigate();

    // THIS IS TO SHOW THE MODAL
    function handleShowModal(product) {
        setShowModal(true)
        setSelectedProduct(product);
    }

    // THIS IS TO CLOSE MODAL
    function handleCloseModal() {
        setShowModal(false)
        setSelectedProduct(null);
    }

    // GET ALL CATEGORY FROM THE DB
    useEffect(function () {
        async function handleFetchCategories() {
            try {
                setIsLoading(true);
                setMess('')

                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/gift-products/all-category`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (!res.ok) throw new Error('Something went wrong!');

                const data = await res.json();
                if (data.status !== 'success') {
                    throw new Error(data.message);
                }

                setCategories(data.data.categories);

            } catch (err) {
                console.log(err.message)
            } finally {
                setIsLoading(false)
            }
        }
        handleFetchCategories()
    }, [])


    // GET ALL THE PRODUCT IN THAT CATEGORY
    useEffect(function () {
        async function handleFetch() {
            let url, headers;
            if(type === 'marketplace') {
                url = `${import.meta.env.VITE_SERVER_URL}/gift-products/all/products/category`
                headers = {
                    "Content-Type": "application/json",
                }
            } else {
                url = `${import.meta.env.VITE_SERVER_URL}/gift-products/products/category`
                headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                setIsLoadingCat(true);
                setMess('')

                const res = await fetch(`${url}/${currentCategory}`, {
                    method: 'GET',
                    headers
                });

                if (!res.ok) {
                    throw new Error('Something went wrong. Check Internet connection!');
                }
                const data = await res.json();

                if (data.status !== 'success') {
                    throw new Error(data.message);
                }
                setCategoryProducts(data.data.giftProducts)
                // setProducts(data.data.giftProducts)

            } catch (err) {
                setMess(err.message)
            } finally {
                setIsLoadingCat(false);
            }
        }
        handleFetch()
    }, [currentCategory]);


    // useEffect(function () {
    //     function controlNavbar() {
    //         if (window.scrollY > 200) {
    //             setStay(true)
    //         } else {
    //             setStay(false)
    //         }
    //     }
    //     window.addEventListener('scroll', controlNavbar)
    //     controlNavbar()
    //     return () => {
    //         window.removeEventListener('scroll', controlNavbar)
    //     }
    // }, [])


    return (
        <section className='category-page__section' style={(user?.role === 'vendor' && !user?.isKycVerified) ? { marginTop: '8rem'} : {}}>

            {(type === 'reminder' && activeReminder) && (
                <SubAlert />
            )}

            {isLoading ? 
                <div className="page--main">
                    <div className="category--spinner-destop">
                        <SkeletonLoader /> 
                    </div>
                </div> :
                <div className='category--page'>
                    {/* <div className='page--sidebar' style={stay ? { borderRight: 'none' } : {}}> */}
                    <div className='page--sidebar'>
                        <span className='tab--back' onClick={() => type === 'marketplace' ? navigate('/') : type === 'reminder' ? navigate('/dashboard/reminders') : navigate('/dashboard/gifting')}><IoIosArrowBack /> Back</span>
                        <ul>
                            {categories.map((category) =>
                                <Link to={`${type === 'marketplace' ? '/marketplace/' : type === 'reminder' ? '/dashboard/reminders/add-gift/' : '/dashboard/gifting/'}${category.categoryName}`}>
                                    <li className={`sidebar-items ${currentCategory === category.categoryName ? 'active-sidebar' : ''}`} key={category._id} onClick={() => setCurrentCategory(`${category.categoryName}`)}>
                                        {category.categoryName} {currentCategory === category.categoryName ? <RiArrowRightDoubleLine className='sidebar-icon' /> : ''}
                                    </li>
                                </Link>
                            )}
                        </ul>
                    </div>

                    <div className="page--tab-mobile" style={(type === 'reminder' && activeReminder) ? { marginTop: '4rem' } : {}}>
                        <span className='tab-item tab--back' onClick={() => type === 'marketplace' ? navigate('/') : type === 'reminder' ? navigate('/dashboard/reminders') : navigate('/dashboard/gifting')}><IoIosArrowBack /> Back</span>
                        {categories.map((category) =>
                            <Link to={`${type === 'marketplace' ? '/marketplace/' : type === 'reminder' ? '/dashboard/reminders/add-gift/' : '/dashboard/gifting/'}${category.categoryName}`}>
                                <p className={`tab-item ${currentCategory === category.categoryName ? 'active-tab-item' : ''}`} key={category._id} onClick={() => setCurrentCategory(`${category.categoryName}`)}>
                                    {category.categoryName}
                                </p>
                            </Link>
                        )}
                    </div>

                    {isLoadingCat ? 
                        <div className="page--main" style={{ paddingTop: '0rem'}}>
                            <div className='category--spinner-destop'>
                                <SkeletonLoaderMarket />
                            </div>

                            <div className='category--spinner-mobile'>
                                <SkelentonOne height={'18rem'} />
                                <SkelentonOne height={'18rem'} />
                            </div>
                        </div> :
                    // {isLoadingCat ? <SkeletonLoaderMini /> :
                    <div style={{ overflow: 'auto' }}>

                        <span className='category--pg-head'>
                            <img src={categories?.find(cat => currentCategory === cat?.categoryName)?.categoryImage} alt={currentCategory} />
                            <div>
                                <h3 style={{ color: '#fff' }}><TfiGift /> Gift Products</h3>
                                <span>{currentCategory} Category</span>
                            </div>
                        </span>
                    
                        <p className='category--pg-heading heading--desktop'>Recent Product</p>
                        <p className='category--pg-heading heading--mobile'>{currentCategory} Category</p>
                        <div className={`page--main ${categoryProducts.length > 0 ? 'page--grid' : ''}`}>
                            {categoryProducts.length > 0 ? categoryProducts.map((product) =>
                                // < to={`/dashboard/gifting/${currentCategory}/${product.slug}`}>

                                <figure className='product--figure' key={product._id} onClick={() => handleShowModal(product)}>
                                    <img className='product--img' src={`${import.meta.env.VITE_SERVER_ASSET_URL}/products/${product.images[0]}`} alt={product.name} />
                                    <figcaption className='product--details'>
                                        <h4 className='product--heading'>{truncate(product.name, 40)}</h4>
                                       
                                        <div className='product--infos'>
                                            <span className='product--price'>₦{numberConverter(product.price)}</span>
                                            <span className='product--date'>{product.vendor.location || 'Lagos, Nigeria'}</span>
                                        </div>
                                    </figcaption>
                                </figure>
                            ) : (
                                <div className='note--box'>
                                    <p>{mess || 'No product in this category'}</p>
                                    <picture>
                                        <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f343/512.webp" type="image/webp" />
                                        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f343/512.gif" alt="🍃" width="32" height="32" />
                                    </picture>
                                </div>
                            )}
                        </div>
                    </div>}
                </div>}

            {(selectedProduct && showModal && type === 'marketplace') && <Product product={selectedProduct} type={'marketplace'} handleCloseModal={handleCloseModal} currCategory={currentCategory} />}
            {(selectedProduct && showModal && type === 'gifting') && <Product product={selectedProduct} type={'gifting'} handleCloseModal={handleCloseModal} />}
            {(selectedProduct && showModal && type === 'reminder') && <Product product={selectedProduct} type={'reminder'} handleCloseModal={handleCloseModal} />}
        </section>
    )
}

export default CategoryPage;
