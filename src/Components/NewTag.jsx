import React from 'react'

function NewTag({ title='New', addNoStyle }) {
  return (
    <span className='new--tag' style={ addNoStyle ? { animation: 'none' } : {} }>{title}</span>
  )
}

export default NewTag
