import React, { useState, useEffect } from 'react'

import { RiArrowRightDoubleLine } from "react-icons/ri";
import { numberConverter, dateConverter, truncate } from '../../../utils/helper'
import SkeletonLoader from '../../../Components/SkeletonLoader';
import SkeletonLoaderMarket from '../../../Components/SkeletonLoader1';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SkelentonOne from '../../../Components/SkelentonOne';
import { useAuthContext } from '../../../Auth/context/AuthContext';
import { IoIosArrowBack } from 'react-icons/io';
import { HiOutlineLightBulb } from 'react-icons/hi2';

function IdeaCatalogue() {
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingCat, setIsLoadingCat] = useState(false)
    const [categories, setCategories] = useState([]);
    const [categoryIdeaBox, setCategoryIdeaBox] = useState([]);
    const [mess, setMess] = useState('');

    const { category } = useParams();
    const [currentCategory, setCurrentCategory] = useState(category);
    console.log(category)

    const { user, token } = useAuthContext();
    const navigate = useNavigate();


    // GET ALL CATEGORY FROM THE DB
    useEffect(function () {
        async function handleFetchCategories() {
            try {
                setIsLoading(true);
                setMess('');

                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/idea-box/all-category`, {
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


    // GET ALL THE Gift IN THAT CATEGORY
    useEffect(function () {
        async function handleFetch() {
            
            try {
                setIsLoadingCat(true);
                setMess('')

                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/idea-box/ideas/category/${currentCategory}`, {
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
                setCategoryIdeaBox(data.data.ideas)
            } catch (err) {
                setMess(err.message)
            } finally {
                setIsLoadingCat(false);
            }
        }
        handleFetch()
    }, [currentCategory]);


    return (
        <section className='category-page__section' style={(user?.role === 'vendor' && !user?.isKycVerified) ? { marginTop: '8rem'} : {}}>

            {isLoading ? 
                <div className="page--main">
                    <div className="category--spinner-destop">
                        <SkeletonLoader /> 
                    </div>
                </div> :
                <div className='category--page'>
                    <div className='page--sidebar'>
                        <span className='tab--back' onClick={() => navigate('/dashboard/gifting')}><IoIosArrowBack /> Back</span>
                        <ul>
                            {categories.map((category) =>
                                <Link to={`/dashboard/idea-box/${category.categoryName}`}>
                                    <li className={`sidebar-items ${currentCategory === category.categoryName ? 'active-sidebar' : ''}`} key={category._id} onClick={() => setCurrentCategory(`${category.categoryName}`)}>
                                        For {category.categoryName} {currentCategory === category.categoryName ? <RiArrowRightDoubleLine className='sidebar-icon' /> : ''}
                                    </li>
                                </Link>
                            )}
                        </ul>
                    </div>

                    <div className="page--tab-mobile">
                        <span className='tab-item tab--back' onClick={() => navigate('/dashboard/gifting')}><IoIosArrowBack /> Back</span>
                        {categories.map((category) =>
                            <Link to={`/dashboard/idea-box/${category.categoryName}`}>
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
                    <div style={{ overflow: 'auto' }}>

                        <span className='category--pg-head'>
                            <img src={categories?.find(cat => currentCategory === cat?.categoryName)?.categoryImage} alt={currentCategory} />
                            <div>
                                <h3><HiOutlineLightBulb /> Idea Box</h3>
                                <span>For {currentCategory}</span>
                            </div>
                        </span>
                    
                        <p className='category--pg-heading heading--desktop'>Recent Ideas</p>
                        <p className='category--pg-heading heading--mobile'>For {currentCategory}</p>

                        <div className={`page--main ${categoryIdeaBox?.length > 0 ? 'page--grid' : ''}`}>
                            {categoryIdeaBox?.length > 0 ? categoryIdeaBox.map((idea) =>

                                <figure className='product--figure' key={idea._id} onClick={() => handleShowModal(idea)}>
                                    <img className='product--img' src={`${import.meta.env.VITE_SERVER_ASSET_URL}/others/${idea.image}`} alt={idea.name} />
                                    <figcaption className='product--details'>
                                        <h4 className='product--heading'>{truncate(idea.name, 40)}</h4>
                                    </figcaption>
                                </figure>
                            ) : (
                                <div className='note--box'>
                                    <p>{mess || 'No Ideas in this category'}</p>
                                    <picture>
                                        <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f343/512.webp" type="image/webp" />
                                        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f343/512.gif" alt="🍃" width="32" height="32" />
                                    </picture>
                                </div>
                            )}
                        </div>
                    </div>}
                </div>}
        </section>
    )
}

export default IdeaCatalogue;
