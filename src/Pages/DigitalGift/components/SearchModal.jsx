import React, { useState } from 'react'
import { getInitials } from '../../../utils/helper'
import { useAuthContext } from '../../../Auth/context/AuthContext';


function Loading() {
    return <p style={{ fontSize: '1.2rem' }}>Loading...</p>
}


function SearchModal({ results, setResult, errMessage, setErrMessage, isLoading, setSelectedUser, setShowSearchModal, setQuerySomeOne }) {
    const { user } = useAuthContext();

    function handleSelectUser(userData) {
        if(userData?.username === user?.username) {
            setResult([]);
            setErrMessage('You cannot gift yourself');
            return;
        }
        setSelectedUser(userData);
        setShowSearchModal(false);
        setQuerySomeOne(userData?.username)
    }
  return (
    <div className='item-user-search-modal'>
        {errMessage && (
            <p style={{ fontSize: '1.3rem', fontWeight: '500', color: '#bb0505' }}>{errMessage}</p>
        )}

        {isLoading && (
            <Loading />
        )}

        {(results && !isLoading) && (
            results.map(result => {
                return (
                    <div className='item-user-result' onClick={() => handleSelectUser(result)}>
                        {result?.image ? (
                            <img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/users/${result?.image}`} alt="" />
                        ) : (
                            <span className="item-user-result-initials">
                                {getInitials(result?.fullName || result?.username)}
                            </span>
                        )}
                        <span>
                            <p>{result?.fullName}</p>
                            <p>@{result?.username}</p>
                        </span>
                    </div>
                )
            })
        )}
    </div>
  )
}

export default SearchModal
