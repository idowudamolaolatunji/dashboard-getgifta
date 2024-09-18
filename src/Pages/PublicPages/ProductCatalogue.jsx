import React, { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi';
import { useAuthContext } from '../../Auth/context/AuthContext';
import { dateConverter, numberConverter, truncate } from '../../utils/helper';
import DashboardModal from '../../Components/Modal';
import { MdDelete, MdOutlineAddAPhoto, MdOutlineEditNote } from 'react-icons/md';
import Header from './Components/Header';
import CurrencyInput from 'react-currency-input-field';
import ReactTextareaAutosize from 'react-textarea-autosize';
import MobileFullScreenModal from '../../Components/MobileFullScreenModal';
import { CiCalendar, CiEdit } from 'react-icons/ci';
import { IoCloseCircleOutline, IoCloseOutline, IoInformationCircle, IoLocationSharp, IoPricetagOutline, IoTrashBinOutline } from 'react-icons/io5';

import { useNavigate } from 'react-router-dom';
import SkelentonOne from '../../Components/SkelentonOne';
import SkeletonLoader from '../../Components/SkeletonLoader';
import Alert from '../../Components/Alert';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';

import GiftLoader from '../../Assets/images/gifta-loader.gif';
import { createPortal } from 'react-dom';

import ImageUploading from "react-images-uploading";


const customStyle = {
    maxWidth: '55rem',
    minHeight: 'auto',
    height: 'auto',
    zIndex: 3500
}

const customStyleModal = {
	minHeight: "auto",
	maxWidth: "44rem",
	width: "44rem",
    zIndex: 300000
};

function ProductCatalogue() {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true)
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('all')

    const [products, setProducts] = useState([]);
    const [showProductModal, setShowProductModal] = useState(false);
    
    const [selectedProduct, setSelectedProduct] = useState({});
    
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [avail, setAvail] = useState(null);
    const [category, setCategory] = useState('')
    // const [imagePreview, setImagePreview] = useState(null);
    // const [imageFile, setImageFile] = useState(null);

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [helpReset, setHelpReset] = useState(false);
    const [showProductInfoModal, setShowProductInfoModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [notVerified, setNotVerified] = useState(false);

    const { user, token } = useAuthContext();
    const navigate = useNavigate();

    // const filteredCatalogueCategory = activeTab === 'all' ? products : activeTab === `${categories.forEach(cat => cat.categoryName)}` && products?.filter(product => product.category === `${categories.forEach(cat => cat.categoryName)}`);

    const filteredCatalogueCategory = activeTab === 'all' ? products 
    : products?.filter(product => {
        return categories.some(cat => cat.categoryName === activeTab && product.category === cat.categoryName);
    });
    const [images, setImages] = useState([]);
    const maxNumber = 6;
    const onChange = (imageList, addUpdateIndex) => {
        // data for submit
        console.log(imageList, addUpdateIndex);
        setImages(imageList);
    };
    const imageArray = images.map(img => img.file);
    console.log(imageArray)

    // const handleImageChange = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         setImageFile(file);
    //         const imageUrl = URL.createObjectURL(file);
    //         setImagePreview(imageUrl);
    //     }
    // };


    function handleProduct(product) {
        setShowProductInfoModal(true);
        setSelectedProduct(product);
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

    // HANDLE FETCH STATE RESET
    function handleReset() {
        setIsError(false);
        setMessage('')
        setIsSuccess(false);
    }

    // function handleProductAction(type, id) {
    //     if(type === 'edit') {
    //         set
    //     }
    // }

    // GET ALL CATEGORY FROM THE DB
    useEffect(function () {
        async function handleFetchCategories() {
            try {

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
            }
        }
        handleFetchCategories()
    }, [])


    useEffect(function () {
        async function handleFetchMyProducts() {
            try {
                setIsFetching(true);

                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/gift-products/my-products`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!res.ok) {
                    throw new Error('Something went wrong. Check Internet connection!');
                }
                const data = await res.json();

                if (data.status !== 'success') {
                    throw new Error(data.message);
                }
                setProducts(data.data.giftProducts)
            } catch (err) {
                console.log(err)
            } finally {
                setIsFetching(false);
            }
        }
        handleFetchMyProducts()
    }, [helpReset]);


    async function handleDeleteProduct() {
        try {
            handleReset();
            setHelpReset(false)
            setIsLoading(true);

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/gift-products/delete-my-product/${selectedProduct?._id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });

            if(!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            if(data?.status !== "success") throw new Error(data.message);

            setIsSuccess(true);
            setMessage(data.message);
            setTimeout(function () {
                setShowDeleteModal(false);
                setShowProductInfoModal(false)
                setIsSuccess(false);
                setMessage("");
                setHelpReset(true);
            }, 2000);

        } catch(err) {
            handleFailure(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleUploadProduct(e, type) {
        let method, url;
        if (type === 'new') {
            method = 'POST';
            url = `${import.meta.env.VITE_SERVER_URL}/gift-products/create-product`;
            console.log(type)
        } 
        if(type === 'edit') {
            method = 'PATCH';
            url = `${import.meta.env.VITE_SERVER_URL}/gift-products/update-my-product/${selectedProduct?._id}`;
            console.log(type)
        }
        try {
            e.preventDefault();
            handleReset();
            setHelpReset(false);
            setIsLoading(true);

            // if(type === 'new' && !imageFile) throw new Error('Image field cannot be left empty');
            if(type === 'new' && (images?.length === 0)) throw new Error('Images cannot be left empty');

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name, description, price, category, stockAvail: avail })
            });

            console.log(res);
            if (!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();

            console.log(data);
            if (data.status !== "success") throw new Error(data.message);

            // UPLOAD IMAGE
            const formData = new FormData();
            const id = data.data.product._id
            if (images && images.length !== 0) {
                handleUploadImgs(formData, id);
            }

            setIsSuccess(true);
            setMessage(data.message);
            setTimeout(function () {
                type === 'new' ? setShowProductModal(false) : setShowEditModal(false);
                type === 'edit' && setShowProductInfoModal(false)
                setIsSuccess(false);
                setMessage("");
                setHelpReset(true)
            }, 2000);

        } catch (err) {
            handleFailure(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleUploadImgs(formData, id) {
        try {
            setIsLoading(true);

            for (let i = 0; i < images.length; i++) {
                formData.append('images', images[i].file);
            }
            
            await fetch(`${import.meta.env.VITE_SERVER_URL}/gift-products/product-img/${id}`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: formData,
                mode: "no-cors"
            });
        } catch (err) {
            console.log(err.message);
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(function() {
		document.title = 'Gifta | My Product Catalogue';

        window.scrollTo(0, 0)
	}, []);

    useEffect(function() {
        if(selectedProduct && showEditModal) {
            setPrice(selectedProduct?.price);
            setDescription(selectedProduct?.description);
            setAvail(selectedProduct?.stockAvail);
            setCategory(selectedProduct?.category);
            // setImagePreview(`${import.meta.env.VITE_SERVER_ASSET_URL}/products/${selectedProduct?.image}`);
            setName(selectedProduct?.name)
        } else {
            setPrice('');
            setDescription('');
            setAvail('');
            setCategory('');
            // setImagePreview('');
            setName('')

        }
    }, [selectedProduct, showEditModal]);

    
    function handleShowProductModal() {
        if(!user?.isKycVerified) {
            setNotVerified(true)

            setTimeout(() => {
                setNotVerified(false)
    
                navigate('/kyc-verification')
            }, 2000);
        } else {
            setShowProductModal(true)
        }
    }


    return (

        <>
            {isLoading && (
                <div className='gifting--loader'>
                    <img src={GiftLoader} alt='loader' />
                </div>
            )}

            <Header />

            <section className="product__section section">
                <div className="section__container">
                    <div className="section--head">
                        <span onClick={() => navigate(-1)} className='wishlist--back-btn'>Back</span>

                        <span className='section--flex-two' style={{ marginBottom: '2rem' }}>
                            <p className='section__heading' style={{ margin: '0', fontSize: '2.8rem', fontWeight: '500' }}>My Shop</p>
                            <div className="wallet--tabs">
                                <>
                                <span className={`wallet--tab ${activeTab === "all" && "tab--active"}`} onClick={() => { setActiveTab("all") }}>All</span>
                                {categories.map(category => (
                                    <span className={`wallet--tab ${activeTab === `${category?.categoryName}` && "tab--active"}`} onClick={() => { setActiveTab(`${category.categoryName}`) }}>{category.categoryName}</span>
                                ))}
                                </>
                            </div>

                            <select className="wallet--tabs-mobile" value={activeTab} onChange={(e) => { setActiveTab(e.target.value) }}>
                                    <option value="all">All</option>
                                    {categories.map(category => (
                                        <option value={category.categoryName}>{category.categoryName}</option>
                                    ))}
                                </select>
                        </span>
                    </div>


                    {(isFetching) && (
                        <>
                            <div className='category--spinner-destop'>
                                <SkeletonLoader />
                            </div>

                            <div className='category--spinner-mobile'>
                                <SkelentonOne height={'18rem'} />
                                <SkelentonOne height={'18rem'} />
                            </div>
                        </>
                    )}


                    {(products && filteredCatalogueCategory.length > 0) ? (
                        <div className='page--grid'>
                            {filteredCatalogueCategory.map((product) =>
                                <figure className='product--figure' style={{ position: 'relative' }} key={product._id} onClick={() => handleProduct(product)}>
                                    {console.log(product.images[0])}
                                    <img className='product--img' src={`${import.meta.env.VITE_SERVER_ASSET_URL}/products/${product.images[0]}`} alt={product.name} />
                                    <span className="package--category">{product.category}</span>
                                    <figcaption className='product--details'>
                                        <h4 className='product--heading'>{truncate(product.name, 30)}</h4>
                                        <div className='product--infos'>
                                            <span className='product--price'>₦{numberConverter(product.price)}</span>
                                            <span className='product--date'>{dateConverter(product.createdAt)}</span>
                                        </div>
                                    </figcaption>
                                </figure>
                            )}
                        </div>
                    ) : (
                        <div className='note--box' style={{ fontSize: '1.4rem', textAlign: 'center' }}>
                            <p>You don't have any {activeTab === 'all' ? '' : activeTab} product!</p>
                        </div>
                    )}


                    {/* {(!isFetching && products.length === 0) && (
                        <div className='note--box' style={{ maxWidth: '70rem' }}>
                            <p>{'You have no product'}</p>
                        </div>
                    )} */}
                </div>


                <div className="dashboard--add-btn" onClick={handleShowProductModal}><FiPlus /></div>
            </section>


            {(showProductModal || showEditModal) && (
                <DashboardModal customStyle={customStyle} overLayZIndex={true} title={'Upload a new product!'} setShowDashboardModal={showProductModal ? setShowProductModal : setShowEditModal}>
                    <span className='modal--info'>Note that for everything successfully purchased products we own 5% and you own 95% of the profit</span>

                    <form className='form product--upload-form' onSubmit={(e) => handleUploadProduct(e, showEditModal ? 'edit' : 'new')}>
                        <div className="form--item">
                            <label htmlFor="" className="form--label">Product Name</label>
                            <input type="text" required className="form--input" placeholder='Enter your product name' value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        {/* <div className='form--item form-image-card'>
                            {!imagePreview && <p className='image-text'>Upload Product Images (Max of 6)</p>}
                            <input type='file' id='form-image-input' multiple max="6" name='images' onChange={handleImageChange} accept="image/*" />
                            <label htmlFor='form-image-input' className={`${imagePreview ? 'hoverable' : ''}`} style={{ height: '15rem' }} id='form-image-label'>
                                <span>
                                    <MdOutlineAddAPhoto />
                                    <p>Add Image</p>
                                </span>
                                {imagePreview && <img id='form-image' src={imagePreview} alt='Wishlist Preview' />}
                            </label>
                        </div> */}

<ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
        acceptType={["jpg", "png"]}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
        }) => (
            <div className='multiple-image-container'>
                {imageList?.length > 0 ? (
                    <button type='button' className='main-btn' onClick={onImageRemoveAll}>Remove All Images <IoCloseOutline /></button> 
                ) : (
                    <button type='button' className='main-btn' onClick={onImageUpload}><MdOutlineAddAPhoto /> Add Multiple Images</button> 
                )}
                <div className='image-grid'>
                    {imageList?.map((image, index) => (
                        <div key={index} className="image-item">
                            <img src={image.data_url} />
                            <div className="image-item__btn-wrapper desktop-item">
                                <button onClick={() => onImageUpdate(index)}>Update</button>
                                <button onClick={() => onImageRemove(index)}>Remove</button>
                            </div>
                            <div className="image-item__btn-wrapper mobile-item">
                                <button onClick={() => onImageUpdate(index)}><CiEdit /></button>
                                <button onClick={() => onImageRemove(index)}><IoTrashBinOutline /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            )}
      </ImageUploading>

                        <div className="form--item">
                            <label htmlFor="description" className="form--label">Product Description (Up to 400 Characters)</label>
                            <ReactTextareaAutosize id='description' className='form__textarea' defaultValue="" value={description} onChange={e => setDescription(e.target.value)} required maxLength={'400'} placeholder='Enter a description' />
                        </div>

                        <div className="form--grid-prod">
                            <div className="form--item">
                                <label htmlFor="category" className="form--label">Product Category</label>
                                <select id="category" required value={category} onChange={e => setCategory(e.target.value)} className="form--input form--select">
                                    <option hidden selected>-- Select a category --</option>
                                    {categories.map(category => (
                                        <option value={category.categoryName}>{category.categoryName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form--grid-prod-2">
                                <div className="form--item">
                                    <label htmlFor="amount" className="form--label">Product Price</label>
                                    <CurrencyInput
                                        className="form--input"
                                        id="amount"
                                        placeholder='Price'
                                        value={price}
                                        defaultValue={price}
                                        onValueChange={(value, _) => setPrice(value)}
                                        required
                                        prefix="₦ "
                                    />
                                </div>
                                <div className="form--item">
                                    <label htmlFor="stockAvail" className="form--label">Stock Avail</label>
                                    <input type="number" placeholder='Avail.' id='stockAvail' className="form--input" value={avail} onChange={e => setAvail(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="form--item">
                            <button type="submit" style={{ marginLeft: 'auto' }}>{showEditModal ? 'Edit' : 'Create'} Product</button>
                        </div>
                    </form>
                </DashboardModal>
            )}

            {showProductInfoModal && (
                <MobileFullScreenModal title={truncate(selectedProduct?.name, 28)} setCloseModal={setShowProductInfoModal}>
                    <div className="gift--preview-top">
                        <img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/products/${selectedProduct?.images[0]}`} />
                        <div className="gift--preview-details">
                            <p className="gift--preview-name" style={{ textTransform: 'capitalize' }}>{selectedProduct?.category} product</p>
                            <p className="gift--preview-date">
                                <CiCalendar />
                                {dateConverter(selectedProduct?.createdAt)}
                            </p>
                        </div>
                    </div>

                    <div className="gift--preview-bottom">
                        <span className="gift--preview-title"> Product Info <IoInformationCircle style={{ color: '#bb0505' }} /></span>
                        <p style={{ fontSize: '1.4rem', lineHeight: '1.4' }}>{selectedProduct.description}</p>
                        <p style={{ fontSize: '1.4rem' }}><IoPricetagOutline style={{ color: '#bb0505', fontSize: '1.8rem' }} /> ₦{numberConverter(selectedProduct.price)}</p>

                        <span className="gift--preview-title"> Your Location <IoLocationSharp style={{ color: '#bb0505' }} /></span>
                        <p style={{ fontSize: '1.4rem' }}>{user.location}</p>


                        <div className="gift--preview-actions">
                            <button onClick={() => setShowEditModal(true)}>Edit Product <MdOutlineEditNote style={{ fontSize: '1.8rem' }} /></button>
                            <button onClick={() => setShowDeleteModal(true)}>Delete Product<MdDelete style={{ fontSize: '1.8rem' }} /></button>
                        </div>
                    </div>
                </MobileFullScreenModal>
            )}

            {showDeleteModal && (
                <DashboardModal customStyle={customStyleModal} title='Delete this Product' setShowDashboardModal={setShowDeleteModal} overLayZIndex={true} >
                    <p className='modal--text-2'>Are you sure you want to delete this Order?</p>
                    <span className='modal--info'>Note that everything relating data to this wish would also be deleted including transaction history!</span>
                    <div className="reminder--actions" style={{ marginTop: '1.4rem' }}>
                        <button type='button' className='cancel--btn' onClick={() => setShowDeleteModal(false)}>Cancel</button>
                        <button type='submit' className='set--btn' onClick={handleDeleteProduct}>Delete Product</button>
                    </div>
                </DashboardModal>
            )}


            {createPortal(
                (isError || isSuccess || notVerified) && (
                    <Alert alertType={`${isSuccess ? "success" : (isError || notVerified) ? "error" : ""}`}>
                        {isSuccess ? (
                            <AiFillCheckCircle className="alert--icon" />
                        ) : isError || notVerified && (
                            <AiFillExclamationCircle className="alert--icon" />
                        )}
                        <p>{message || 'Verify your account as a vendor'}</p>
                    </Alert>
            ), document.body )}
        </>
    )
}

export default ProductCatalogue
