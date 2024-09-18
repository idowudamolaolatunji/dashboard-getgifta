import React from 'react'

import { numberConverter } from '../../../utils/helper';
import { AiOutlineClose } from 'react-icons/ai';
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useState } from 'react';
import GiftingForm from './GiftingForm';

import giftaLogo from "../../../Assets/gifta-logo.png";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'


function Product({ product, handleCloseModal, type, currCategory }) {
    const [showGiftingForm, setShowGiftingForm] = useState('');
    // const [currImage, setCurrImage] = useState(``);
    const [quantity, setQuantity] = useState(1);
    const [currIndex, setCurrIndex] = useState(0);
    
    const navigate = useNavigate();


    console.log(quantity, product.price);
    const amount = Number(quantity * product.price);
    console.log(amount);
    
    const productInfo = {
        name: product.name,
        id: product._id,
        amount: product.price,
        purpose: product.category,
        quantity,
        totalPrice: amount,
    }
    console.log(productInfo)

    function handleShowForm() {
        setShowGiftingForm(true);
        Cookies.set('productInfo', JSON.stringify(productInfo));
    }
    function handleHideForm() {
        setShowGiftingForm(false);
    }
    function incQuantity() {
        if(quantity < 5) {
            setQuantity(prev => prev + 1);
        }
    }
    function decQuantity() {
        if(quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    }
    
  return (
    <>
    <div className="product__modal--overlay" onClick={type === 'marketplace' ? handleCloseModal : ''} />
        <aside className='product__modal' key={product._id}>

            <span className="product--close-icon" onClick={handleCloseModal}><AiOutlineClose className='close--icon' /></span>
            { showGiftingForm ? <GiftingForm handleHideForm={handleHideForm} handleCloseModal={handleCloseModal} /> : (
            <>
                <div className="product--container">
                    <span className='product--image-box'>
                        <Zoom>
                            <img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/products/${product.images[currIndex]}`} alt={product.name} className="product--img" />
                        </Zoom>
                        <span className='sub-images'>
                            {product?.images.length > 0 &&
                                product.images.map((img, index) => {
                                    return <img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/products/${img}`} className={currIndex === index ? 'active-sub' : ''} onClick={() => setCurrIndex(index)} alt={img} />
                                })
                            }
                        </span>
                    </span>

                    <div className="product--info">
                        <h4 className="product--title">{product.name}</h4>

                        <div className="product--vendor">
                            <div className="vendor--main">
                                <img className='' src={'https://res.cloudinary.com/dy3bwvkeb/image/upload/v1701957741/avatar_unr3vb-removebg-preview_rhocki.png'} alt={product.vendor.fullName} />
                                <div>
                                    <p>{product.vendor.fullName}</p>
                                    <p className='product-vendor--email'>{product.vendor.email}</p>
                                </div>
                            </div>

                            <p id='location' className='product--date' >{product.vendor.location || 'Lagos Nigeria'}</p>
                        </div>

                        <span className="product--actions">
                            <span className="product--total">
                                <span className="product--price">
                                    <span>Price:</span>
                                    <p>₦{numberConverter(amount)}</p>
                                </span>

                                <span className="product--quantity">
                                    <span onClick={decQuantity}><FaMinus /></span>
                                    <p>{quantity}</p>
                                    <span onClick={incQuantity}><FaPlus /></span>
                                </span>
                            </span>

                            <button className="product--btn" onClick={type === 'marketplace' ? () => navigate(`/dashboard/gifting/${currCategory}`) : () => handleShowForm()}>Gift now</button>
                        </span>
                    </div>
                </div>

                
                <p className="product--text" style={{ marginTop: '2rem'}}>{product.description}</p>
            </>)}
        </aside>
    </>
  )
}

export default Product;
