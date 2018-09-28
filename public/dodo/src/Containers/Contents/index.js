import React from 'react';
import classes from './Contents.local.scss'
import { Menu } from 'semantic-ui-react'

//Components
import AboutUs from './AboutUs/index'
import TermsAndConditions from './TermsAndConditions/index'
import Faq from './Faq/index'

class Contents extends React.Component {

    state = {
        activeItem: 'about_us'
    }

    handleItemClick = (e, { name }) => {
        this.setState({
            activeItem: name
        })
    }
    render() {
        const { activeItem } = this.state
        return (
            <section className={classes.contentsbox}>
                <Menu secondary pointing>
                    <Menu.Item
                        name="about_us"
                        active={activeItem === 'about_us'}
                        className={
                            activeItem === 'about_us'
                            ? classes.itemColor2
                            : classes.itemColor
                        }
                        onClick={this.handleItemClick}
                    > About Us
                    </Menu.Item>  
                    <Menu.Item
                        name="terms_cond"
                        active={activeItem === 'terms_cond'}
                        className={
                            activeItem === 'terms_cond'
                            ? classes.itemColor2
                            : classes.itemColor
                        }
                        onClick={this.handleItemClick}
                    > Terms & Conditions
                    </Menu.Item>  
                    <Menu.Item
                        name="faq"
                        className={
                            activeItem === 'faq'
                            ? classes.itemColor2
                            : classes.itemColor
                        }
                        active={activeItem === 'faq'}
                        onClick={this.handleItemClick}
                    > Frequently Asked Questions
                    </Menu.Item>    
                </Menu>
                {
                    this.state.activeItem === 'about_us' ? 
                    <AboutUs />
                    : null
                }
                {
                    this.state.activeItem === 'terms_cond' ? 
                    <TermsAndConditions />
                    : null
                }
                {
                    this.state.activeItem === 'faq' ? 
                    <Faq />
                    : null
                }
            </section>
        )
    }
    
}

export default Contents;