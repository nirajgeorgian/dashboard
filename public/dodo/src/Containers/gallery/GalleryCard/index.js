import React from 'react'
import { Icon } from 'semantic-ui-react'
import classes from './ImageCard.local.scss'
const GalleryCard = ({ image, heading, description, date }) => (
  <div className={classes.card}>
    <div className={classes.image}>
      <img src={image} />
      <div className={classes.blur} />
      <div className={classes.viewButton}>VIEW</div>
    </div>
    <div className={classes.texts}>
      <h3 className={classes.heading}>{heading}</h3>
      <p>{description}</p>
    </div>
    <div className={classes.date}>
      <Icon name={'calendar'} />
      <p>{date}</p>
    </div>
  </div>
)

export default GalleryCard
