import React, { useState, useEffect } from 'react'

import { RiArrowRightDoubleLine } from "react-icons/ri";
import { numberConverter, dateConverter, truncate, numberConverterSticker, capitalizeFirstLetter } from '../../../utils/helper'
import SkeletonLoader from '../../../Components/SkeletonLoader';
import SkeletonLoaderMarket from '../../../Components/SkeletonLoader1';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SkelentonOne from '../../../Components/SkelentonOne';
import { useAuthContext } from '../../../Auth/context/AuthContext';
import { IoIosArrowBack } from 'react-icons/io';
import { TbGiftCard } from 'react-icons/tb';
import DashboardModal from '../../../Components/Modal';
import { MdOutlineAddAPhoto } from 'react-icons/md';
import ReactTextareaAutosize from 'react-textarea-autosize';
import CurrencyInput from 'react-currency-input-field';
import { FiPlus } from 'react-icons/fi';
import GiftLoader from '../../../Assets/images/gifta-loader.gif';
import ItemModal from './ItemModal';
import { BiSolidCategoryAlt } from 'react-icons/bi';


const customStyle = {
    maxWidth: '55rem',
    minHeight: 'auto',
    height: 'auto',
    zIndex: 3500
}


function GiftCatalogue() {
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingCat, setIsLoadingCat] = useState(false);
    // const [isSpinning, setIsSpinning] = useState(false);

    const [categories, setCategories] = useState([]);
    const [categoryDigitalGifts, setCategoryDigitalGifts] = useState([]);
    const [mess, setMess] = useState('');

    const [selectedItem, setSelectedItem] = useState({});
    const [showModal, setShowModal] = useState(false);

    const [helpReset, setHelpReset] = useState(false);
    const [tab, setTab] = useState('items')

    const { category } = useParams();
    const [currentCategory, setCurrentCategory] = useState(category);
    console.log(category, selectedItem)

    const { user, token } = useAuthContext();
    const navigate = useNavigate();


    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
        }
    };

    function handleSwitch(tab) {
        if(tab === 'purchased') {
            setTab(tab);
            setCategoryDigitalGifts([]);
            navigate(`/dashboard/purchased-gift/${currentCategory}`);
        }
        if (tab === 'gifted') {
            // navigate(`/dashboard/gifted-gift/${currentCategory}`);
            setCurrentCategory('stickers')
            setTab(tab);
            setCategoryDigitalGifts([]);
            navigate(`/dashboard/gifted-gift/stickers`);
        }
        if(tab === 'items') {
            setTab(tab);
            setCategoryDigitalGifts([]);
            navigate(`/dashboard/digital-gift/${currentCategory}`);
        }
    }

    // THIS IS TO SHOW THE MODAL
    function handleShowModal(item) {
        setShowModal(true)
        setSelectedItem(item);
    }

    // THIS IS TO CLOSE MODAL
    function handleCloseModal() {
        setShowModal(false)
        setSelectedItem(null);
    }

    // GET ALL CATEGORY FROM THE DB
    useEffect(function () {
        async function handleFetchCategories() {
            try {
                setIsLoading(true);
                setMess('');

                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/digital-giftings/all-category`, {
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
    }, []);

    // GET ALL THE Gift IN THAT CATEGORY
    useEffect(function () {
        async function handleFetch() {
            let url;
            if(category === 'stickers') {
                url = `${import.meta.env.VITE_SERVER_URL}/digital-stickers/get-stickers`
            } else {
                url = `${import.meta.env.VITE_SERVER_URL}/digital-giftings/digital-gifts/category/${currentCategory}`
            }
            try {
                setIsLoadingCat(true);
                setMess('')

                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error('Something went wrong!');
                }
                const data = await res.json();

                if (data.status !== 'success') {
                    throw new Error(data.message);
                }
                setCategoryDigitalGifts(category === 'stickers' ? data.data.stickers : data.data.digitalGifts)
                // setProducts(data.data.giftProducts)

            } catch (err) {
                setMess(err.message)
            } finally {
                setIsLoadingCat(false);
            }
        }
        handleFetch()
    }, [currentCategory]);

    console.log(categoryDigitalGifts, category, currentCategory)



    // async function handleUploadProduct(e, type) {
    //     let method, url;
    //     if (type === 'new') {
    //         method = 'POST';
    //         url = `${import.meta.env.VITE_SERVER_URL}/digital-giftings/create-digital-gift`;
    //         console.log(type)
    //     } 
    //     if(type === 'edit') {
    //         method = 'PATCH';
    //         url = `${import.meta.env.VITE_SERVER_URL}/digital-giftings/update-my-digital-gift/${selectedItem?._id}`;
    //         console.log(type)
    //     }
    //     try {
    //         e.preventDefault();
    //         handleReset();
    //         setHelpReset(false);
    //         setIsSpinning(true);

    //         // if(type === 'new' && !imageFile) throw new Error('Image field cannot be left empty');
    //         if(type === 'new' && (images?.length === 0)) throw new Error('Images cannot be left empty');

    //         const res = await fetch(url, {
    //             method,
    //             headers: {
    //                 "Content-Type": 'application/json',
    //                 Authorization: `Bearer ${token}`
    //             },
    //             body: JSON.stringify({ name, description, price, category: giftCategory, stockAvail: avail })
    //         });

    //         console.log(res);
    //         if (!res.ok) throw new Error('Something went wrong!');
    //         const data = await res.json();

    //         console.log(data);
    //         if (data.status !== "success") throw new Error(data.message);

    //         // UPLOAD IMAGE
    //         const formData = new FormData();
    //         const id = data.data.product._id
    //         if (imageFile) {
    //             handleUploadImgs(formData, id);
    //         }

    //         setIsSuccess(true);
    //         setMessage(data.message);
    //         setTimeout(function () {
    //             type === 'new' ? setShowOpenModal(false) : setShowEditModal(false);
    //             // type === 'edit' && setShowProductInfoModal(false)
    //             setIsSuccess(false);
    //             setMessage("");
    //             setHelpReset(true)
    //         }, 2000);

    //     } catch (err) {
    //         handleFailure(err.message)
    //     } finally {
    //         setIsSpinning(false)
    //     }
    // }


    // async function handleUploadImgs(formData, id) {
    //     try {
    //         setIsSpinning(true);

    //         formData.append('images', imageFile);
            
    //         await fetch(`${import.meta.env.VITE_SERVER_URL}/digital-giftings/digital-gift-img/${id}`, {
    //             method: 'POST',
    //             headers: {
    //                 "Content-Type": 'application/json',
    //                 Authorization: `Bearer ${token}`
    //             },
    //             body: formData,
    //             mode: "no-cors"
    //         });
    //     } catch (err) {
    //         console.log(err.message);
    //     } finally {
    //         setIsSpinning(false)
    //     }
    // }


    // useEffect(function() {
    //     if(selectedItem && showEditModal) {
    //         setPrice(selectedItem?.price);
    //         setDescription(selectedItem?.description);
    //         setAvail(selectedItem?.stockAvail);
    //         setGiftCategory(selectedItem?.category);
    //         setImagePreview(`${import.meta.env.VITE_SERVER_ASSET_URL}/products/${selectedItem?.image}`);
    //         setName(selectedItem?.name)
    //     } else {
    //         setPrice('');
    //         setDescription('');
    //         setAvail('');
    //         setGiftCategory('');
    //         setImagePreview('');
    //         setName('')

    //     }
    // }, [selectedItem, showEditModal]);



    return (
        <>
            <section className='category-page__section' style={(user?.role === 'vendor' && !user?.isKycVerified) ? { marginTop: '8rem'} : {}}>

                {/* {isSpinning && (
                    <div className='gifting--loader'>
                        <img src={GiftLoader} alt='loader' />
                    </div>
                )} */}

                {isLoading ? 
                    <div className="page--main">
                        <div className="category--spinner-destop">
                            <SkeletonLoader /> 
                        </div>
                    </div> :
                    <div className='category--page item--page'>
                        <div className='page--sidebar'>
                            <span className='tab--back' onClick={() => navigate('/')}><IoIosArrowBack /> Back</span>
                            <ul>
                                {categories.map((category) =>
                                    <Link to={`/dashboard/digital-gift/${category.categoryName}`}>
                                        <li className={`sidebar-items ${currentCategory === category.categoryName ? 'active-sidebar' : ''}`} key={category._id} onClick={() => setCurrentCategory(`${category.categoryName}`)}>
                                            {category.categoryName} {currentCategory === category.categoryName ? <RiArrowRightDoubleLine className='sidebar-icon' /> : ''}
                                        </li>
                                    </Link>
                                )}

                                <Link to={`/dashboard/digital-gift/stickers`}>
                                    <li className={`sidebar-items ${currentCategory === 'stickers' ? 'active-sidebar' : ''}`} key={category._id} onClick={() => setCurrentCategory(`stickers`)}>
                                        Stickers {currentCategory === 'stickers' ? <RiArrowRightDoubleLine className='sidebar-icon' /> : ''}
                                    </li>
                                </Link>

                                {/* SWITCH TO OWNED GIFT ITEMS PAGE */}
                                <Link to={`/dashboard/purchased-gift/${currentCategory}`}>
                                    <li className={`tab--back item--back`} style={{ margin: '0'}} key={category._id} onClick={() => setCurrentCategory(`stickers`)}>
                                        <BiSolidCategoryAlt className='sidebar-icon' /> Owned Item
                                    </li>
                                </Link>
                            </ul>
                        </div>


                        <>
                            <select className="wallet--tabs-mobile mobile--tabs" style={{ margin: '2rem 0 0 2rem', fontFamily: 'inherit', fontWeight: '600', color: '#555'}} value={tab} onChange={(e) => handleSwitch(e.target.value)}>
                                <option value="items">📇 Item Catalogue </option>
                                <option value="purchased">🛍️ Purchased Items </option>
                                <option value="gifted">🎁 Gifted Items</option>
                            </select>

                            <div className="page--tab-mobile item--tab">
                                <span className='tab-item tab--back' onClick={() => navigate('/')}><IoIosArrowBack /> Back</span>
                                {categories.map((category) =>
                                    <Link to={`/dashboard/digital-gift/${category.categoryName}`}>
                                        <p className={`tab-item ${currentCategory === category.categoryName ? 'active-tab-item' : ''}`} key={category._id} onClick={() => setCurrentCategory(`${category.categoryName}`)}>
                                            {category.categoryName}
                                        </p>
                                    </Link>
                                )}

                                <Link to={`/dashboard/digital-gift/stickers`}>
                                    <p className={`tab-item ${currentCategory === 'stickers' ? 'active-tab-item' : ''}`} onClick={() => setCurrentCategory('stickers')}s>
                                        Stickers
                                    </p>
                                </Link>
                            </div>
                        </>

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
                        <div style={{ overflow: 'auto' }}>

                            <span className='category--pg-head'>
                                <img src={currentCategory !== 'stickers' ? categories?.find(cat => currentCategory === cat?.categoryName)?.categoryImage : 'https://giftdev.ru/upload/iblock/6d2/4.jpg'} alt={currentCategory} />
                                
                                <div>
                                    <h3 style={{ color: '#fff' }}><TbGiftCard style={{ fontSize: '2rem' }} /> Digital Giftings</h3>
                                    <span>{currentCategory === 'stickers' ? 'Sticker Items' : `${currentCategory} Items`}</span>
                                </div>
                            </span>
                        
                            <p className='category--pg-heading heading--desktop'>Recent Items</p>
                            <p className='category--pg-heading heading--mobile'>{currentCategory === 'stickers' ? 'Sticker Items' : `${currentCategory} Items`}</p>

                            <div className={`page--main ${categoryDigitalGifts?.length > 0 ? 'page--grid' : ''}`}>
                                {categoryDigitalGifts?.length > 0 ? categoryDigitalGifts.map((item) =>
                                    <figure className='product--figure' key={item._id} onClick={() => handleShowModal(item)}>
                                        <img style={currentCategory === 'stickers' ? { objectFit: 'contain'} : {}} className='product--img' src={`${import.meta.env.VITE_SERVER_ASSET_URL}/${currentCategory === 'stickers' ? 'stickers' : 'others'}/${item?.image}`} alt={currentCategory === 'stickers' ? item?.type : item?.name} />

                                        <figcaption className='product--details'>
                                            <h4 className='product--heading'>{capitalizeFirstLetter(truncate(currentCategory === 'stickers' ? item?.type : item.name, 40))}</h4>
                                        
                                            <div className='product--infos'>
                                                <span className='product--price'>₦{currentCategory === 'stickers' ? numberConverterSticker(item.price) : numberConverter(item?.price)}</span>
                                            </div>
                                        </figcaption>
                                    </figure>
                                ) : (
                                    <div className='note--box'>
                                        <p>{mess || 'No Item in this category'}</p>
                                        <picture>
                                            <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f343/512.webp" type="image/webp" />
                                            <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f343/512.gif" alt="🍃" width="32" height="32" />
                                        </picture>
                                    </div>
                                )}
                            </div>
                        </div>}
                    </div>
                }
                    
            </section>

            {(selectedItem && showModal) && <ItemModal item={selectedItem} handleCloseModal={handleCloseModal} category={currentCategory} />}
        </>
    )
}

export default GiftCatalogue;
