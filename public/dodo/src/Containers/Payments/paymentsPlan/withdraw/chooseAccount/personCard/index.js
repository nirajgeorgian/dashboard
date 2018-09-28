import React from 'react'
import { Card, Icon, Container } from 'semantic-ui-react'

const PersonCard = props => {
  const { persons, changePerson, setCardCount } = props
  function onClickPerson(event, data) {
    const bankNumber = (data.children[1].props.children)[3]
    const [person] = persons.filter(person => person.accno == bankNumber)
    setCardCount(person.id)
    changePerson(person)
  }

  return (
    <Card.Group>
      { persons.map((person, i) => {
        return (
          <Card key = {i} onClick = {(event, data) => onClickPerson(event, data) }>
            <Card.Content>
              <Card.Header>
                { person.name }
                {
                  props.id === parseInt(person.id)
                  ? <Icon name='check circle' color='green' />
                  : null
                }                
              </Card.Header>
              <Card.Meta>{ person.acctype }</Card.Meta>
              <Card.Description textAlign='left'>
                <p>IFSC Code: { person.ifsc }</p>
                <p>Account Number: { person.accno }</p>
                <p>Branch: { person.bankname + ', ' + person.branchname }</p>
              </Card.Description>
            </Card.Content>
            <Card.Content extra textalign='left'>
              <Icon name='trash' />
              <Icon name='check circle' color='green' />
              <Icon name='university'/>
              { person.accno }
            </Card.Content>
          </Card>
        )
      })}
    </Card.Group>
  )
}

export default PersonCard
