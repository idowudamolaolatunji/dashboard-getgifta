import React from 'react'
import CategoryPage from '../Marketplace/MarketComponent/MarketProducts'
import Header from '../Marketplace/MarketComponent/Header'

function PublicMarketPlace() {
  return (
    <>

      <Header />

      <CategoryPage type={'marketplace'} />

    </>
  )
}

export default PublicMarketPlace
