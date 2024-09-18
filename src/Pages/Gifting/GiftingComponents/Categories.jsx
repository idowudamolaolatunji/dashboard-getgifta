import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import SkelentonThree from '../../../Components/SkelentonThree';
import { CiStar } from 'react-icons/ci';
import SkelentonOne from '../../../Components/SkelentonOne';

function Categories() {
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    
    useEffect(function() {
        async function handleFetchCategories() {
            try {
                setIsLoading(true);

                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/gift-products/all-category`, {
                    method: 'GET',
                    headers: { 
                        "Content-Type": "application/json",
                    }
                });

                if(!res.ok) throw new Error('Something went wrong!');

                const data = await res.json();
                if(data.status !== 'success') {
                    throw new Error(data.message);
                }

                setCategories(data.data.categories);

            }catch(err) {
                console.log(err.message)
            } finally {
                setIsLoading(false)
            }
        }
        handleFetchCategories()
    }, [])
    
  return (
    <>
    {isLoading && (
        <>
            <div className='category--spinner-destop'>
                <SkelentonThree />
                <SkelentonThree />
            </div>

            <div className='category--spinner-mobile'>
                <SkelentonOne />
                <SkelentonOne />
            </div>
        </>
    )}
    <div className='gift__categories'>
        {categories &&
            categories.map(category => {
                return (
                    <>
                        <Link to={`/dashboard/gifting/${category.categoryName}`}>
                            <figure className='category--figure' key={category._id}>
                                <img className='category--image' src={category.categoryImage} alt={category.categoryName} />
                                <div className="category--title">{category.categoryName}</div>
                            </figure>
                        </Link>

                        <Link className='category--figure-m' to={`/dashboard/gifting/${category.categoryName}`}>
                            <figure className='category--figure category--figure-mobile' key={category._id}>
                                <img className='category--image' src={category.categoryImage} alt={category.categoryName} />
                                <figcaption>
                                    <p className="category--heading">{category.categoryName}</p>
                                    <span className="category--text">Get all your {categories.categoryName} present, for your loved ones!</span>
                                    <div className="category--rating">4.5 <CiStar style={{ color: '#bb0505' }} /></div>
                                </figcaption>
                            </figure>
                        </Link>
                    </>
                );
            }) 
        }
    </div>
    </>
  )
}

export default Categories
