import React, { useEffect, useState } from 'react';

import { AiOutlineClose } from 'react-icons/ai';
import { CiUser } from "react-icons/ci";
import { MdAlternateEmail } from "react-icons/md";
import { TbListSearch } from 'react-icons/tb';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegSquareMinus } from "react-icons/fa6";
import GiftImg from '../Assets/images/casual-life-3d-pink-gift-box.png';


function SearchModal({ setShowSearchModal, message, isLoading, results, closeIcon }) {
    const [activeTab, setActiveTab] = useState('');
    const navigate = useNavigate();
    
    function handleCloseModal() {
        setShowSearchModal(false)
    }

    function handleActiveTab(tab) {
        setActiveTab(tab)
    }

    function handleGift(id) {
        navigate(`/${id}`);
        setShowSearchModal(false);
    }

    const {giftings, reminders, wishLists, products} = results;

    const tabsData = [
        { tab: "giftings", count: results?.giftings?.length || 0 },
        { tab: "reminder", count: results?.reminders?.length || 0 },
        { tab: "wishlist", count: results?.wishLists?.length || 0 },
        { tab: "product", count: results?.products?.length || 0 },
    ];
    tabsData.sort((a, b) => b.count - a.count);

    useEffect(() => {
        if (tabsData.length > 0) {
            setActiveTab(tabsData[0].tab);
        }
    }, [results]);

  return (
    <div className="search--modal" style={{ zIndex: 200000 }}>

        {!isLoading && <span className="search--head">
            <div className="search--head-top">
                <p className="search--heading">Search Result <TbListSearch style={{ fontSize: '2rem' }} /></p>
                {closeIcon && <AiOutlineClose className="search--icon" onClick={handleCloseModal} />}
            </div>
            <div className="search--tabs">
                {tabsData?.map(tabData => (
                    <span
                        key={tabData.tab}
                        className={`search--tab ${activeTab === tabData.tab && "tab--active"}`}
                        onClick={() => { handleActiveTab(tabData.tab) }}
                    >
                        {tabData.tab.charAt(0).toUpperCase() + tabData.tab.slice(1)}{' '}
                        ({tabData.count})
                    </span>
                ))}
            </div>

            <div className='search--tabs-box'>
                <div className="search--tabs search--tab-m">
                    {tabsData?.map(tabData => (
                        <span
                            key={tabData.tab}
                            className={`search--tab ${activeTab === tabData.tab && "tab--active"}`}
                            onClick={() => { handleActiveTab(tabData.tab) }}
                        >
                            {tabData.tab.charAt(0).toUpperCase() + tabData.tab.slice(1)}{' '}
                            ({tabData.count})
                        </span>
                    ))}
                </div>
            </div>
        </span>}

        <div className="search--content">
            {message && <p className='error--text'>{message}</p>}
            {isLoading && <p className='loading--text'>Loading...</p>}



            {(activeTab === 'product' && !isLoading) && (
                <>
                {results && products?.length === 0 ?
                    (<div>No search result for ({activeTab})</div>)
                    :
                    (<div className='search--flex'>
                        {products?.map(product =>
                            (
                            <Link to={`/dashboard/gifting/${product.category}`}>
                                <figure className='search--figure'>
                                    <img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/products/${product.images[0]}`} />
                                    <figcaption className='search--details'>
                                        <p className='search--name'>{product.name}</p>
                                    </figcaption>
                                </figure>
                            </Link>
                            )
                        )}
                    </div>) 
                }
                </>
            )}


            {(activeTab === 'giftings' && !isLoading) && (
                <>
                {results && giftings?.length === 0 ?
                    (<div>No search result for ({activeTab})</div>)
                    :
                    (<div className='search--flex'>
                        {giftings?.map(gifting =>
                            (
                            <figure className='search--figure' onClick={() => handleGift(gifting._id)}>
                                <img src={gifting?.image ? `${import.meta.env.VITE_SERVER_ASSET_URL}/others/${gifting?.image}` : GiftImg} />
                                <figcaption className='search--details'>
                                    <p className='search--name'>For {gifting?.celebrant}</p>
                                </figcaption>
                            </figure>
                            )
                        )}
                    </div>) 
                }
                </>
            )}


            {(activeTab === 'reminder' && !isLoading) && (
                <>
                {results && reminders?.length === 0 ?
                    (<div>No search result for ({activeTab})</div>)
                    :
                    (<div className='search--flex'>
                        {reminders?.map(reminder =>
                            (
                            <Link to={'/dashboard/reminders'} style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1.6rem 1rem', borderBottom: '1.2px solid #eee' }}>
                                <FaRegSquareMinus />
                                <p className='search--name'>{reminder.title}</p>
                                {/* <figure className='search--figure'> */}
                                    {/* <img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/others/${reminder?.image}`} /> */}
                                    {/* <figcaption className='search--details'></figcaption> */}
                                {/* </figure> */}
                            </Link>
                            )
                        )}
                    </div>) 
                }
                </>
            )}


            {(activeTab === 'wishlist' && !isLoading) && (
                <>
                {results && wishLists?.length === 0 ?
                    (<div>No search result for ({activeTab})</div>)
                    :
                    (<div className='search--flex'>
                        {wishLists?.map(wishlist =>
                            (
                            <Link to={`/dashboard/wishlists/${wishlist?.slug}`}>
                                <figure className='search--figure'>
                                    <img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/others/${wishlist?.image}`} alt={wishlist._id} />
                                    <figcaption className='search--details'>
                                        <p className='search--name'>{wishlist.name}</p>
                                        <div className="">

                                        </div>
                                    </figcaption>
                                </figure>
                            </Link>
                            )
                        )}
                    </div>) 
                }
                </>
            )}
           
        </div>
    </div>
  );
}

export default SearchModal
