import React from 'react'

function ProductPage() {
    return (
        <div className="product--container">
            <span className='product--image-box'>
                <img src={currImage} alt={currImage} className="product--img" />
                <span className='sub-images'>
                    <img src={currImage} alt={currImage} />
                    <img src={currImage} alt={currImage} />
                    <img src={currImage} alt={currImage} />
                    <img src={currImage} alt={currImage} />
                </span>
            </span>

            <div className="product--info">
                <h4 className="product--title">{product.name}</h4>

                <p className="product--text">{product.description}</p>

                <div className="product--vendor">
                    <div className="vendor--main">
                        <img className='' src={product.vendor?.image === "" ? 'https://res.cloudinary.com/dy3bwvkeb/image/upload/v1701957741/avatar_unr3vb-removebg-preview_rhocki.png' : `${import.meta.env.VITE_SERVER_ASSET_URL}/users/${product.vendor?.image}`} alt={product.vendor.fullName} />
                        {/* <img src={product.vendor.image} alt={product.vendor.fullName} /> */}
                        <div>
                            <p>{product.vendor.fullName}</p>
                            <p className='product-vendor--email'>{product.vendor.email}</p>
                        </div>
                    </div>

                    <p id='location'>{product.vendor.location || 'Lagos Nigeria'}</p>
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

                    <button className="product--btn" onClick={type === 'marketplace' ? () => navigate('/dashboard/gifting/birthday') : () => handleShowForm()}>Gift now</button>
                </span>
            </div>
        </div>
    )
}

export default ProductPage
