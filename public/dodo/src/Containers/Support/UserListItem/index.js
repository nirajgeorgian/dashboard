import React from 'react'
import { Image } from 'semantic-ui-react'
import classes from './UserListItem.local.scss'

const UserListItem = ({ onUserClick, image, name, active, userId }) => {
  return (
    <div
      onClick={() => onUserClick(userId)}
      className={active ? classes.container_active : classes.container}
    >
      <Image src={image} className={classes.avatar} avatar />
      <a>{name}</a>
    </div>
  )
}

export default UserListItem
