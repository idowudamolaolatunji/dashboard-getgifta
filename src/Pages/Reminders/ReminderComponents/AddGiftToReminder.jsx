import React from 'react'
import Header from '../../Marketplace/MarketComponent/Header'
import MarketProducts from '../../Marketplace/MarketComponent/MarketProducts'

function AddGiftToReminder() {
  return (
    <>
        <Header />
        <MarketProducts type={'reminder'} />
    </>
  )
}

export default AddGiftToReminder;