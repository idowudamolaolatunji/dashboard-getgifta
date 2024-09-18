import React, { useEffect } from 'react'
import Header from './Components/Header'
import { useNavigate } from 'react-router-dom'

function ProductStats() {

    const navigate = useNavigate();

    useEffect(function () {
        document.title = 'Gifta | My Product Stats';

        window.scrollTo(0, 0)
    }, []);


    return (
        <>

            <Header />

            <section className="product__section section">
                <div className="section__container">
                    <div className="section--head">
                        <span onClick={() => navigate(-1)} className='wishlist--back-btn'>Back</span>

                        <p className='section__heading' style={{ fontSize: '2.8rem', fontWeight: '500' }}>Product Stats</p>

                        <p className='modal--info'>Coming soon...</p>
                    </div>
                </div>
            </section>


        </>
    )
}

export default ProductStats
