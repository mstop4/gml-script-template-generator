import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import ArgumentSortable from './ArgumentSortable'
import AddArgumentButton from './AddArgumentButton'
import WarningBadge from '../WarningBadge';

const ArgumentContainer = ({ items, argumentWarning, onClick, onChange, onRemove, onSortEnd }) => {

  return (
    <Container className='argument-container'> 
      <Row noGutters>
        <Col lg="9">
          <h2 className='inline-heading'>Arguments </h2>
          {argumentWarning &&
            <WarningBadge/>}
          </Col>
        <Col lg="3">
            <AddArgumentButton
              onClick={onClick}
            />
        </Col>
      </Row>
      <Row noGutters>
        <Col lg="12">
            <ArgumentSortable 
              items={items}
              onChange={onChange}
              onSortEnd={onSortEnd}
              onRemove={onRemove}
            />
        </Col>  
      </Row>
    </Container>
  )
}

export default ArgumentContainer