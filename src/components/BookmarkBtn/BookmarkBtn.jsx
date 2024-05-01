import React from 'react'
import './BookmarkBtn.css'
import BookmarkIcon from '../../assets/icons/bookmark-icon.jpg'
import { Link } from 'react-router-dom'

const BookmarkBtn = () => {
  return (
    <div>
      <Link to='/bookmark' style={{ textDecoration: 'none' }}>
        <button className='bookmarkMain'>
          <img style={{ width: '1rem' }} src={BookmarkIcon} alt="Bookmark" />
          <h3 className='dmsans-medium'>Bookmarks</h3>
        </button>
      </Link>
    </div>
  )
}

export default BookmarkBtn