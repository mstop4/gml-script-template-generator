import React from 'react'
import LocalVarField from './LocalVarField'
import { SortableContainer } from 'react-sortable-hoc'

const LocalVarList = SortableContainer( ({ items, onChange, onRemove }) => {
  return (
    <div className='argument-list'>
      <ul>
        {items.map((localVar, index) => (
          <LocalVarField 
            key={index}
            index={index}
            id={index}
            name={localVar.name}
            description={localVar.description}
            onChange={onChange}
            onRemove={onRemove}/>
        ))}
      </ul>
    </div>
  )
})

const LocalVarSortable = ({ items, onSortEnd, onChange, onRemove }) => {
  return (
    <LocalVarList 
      index={0}
      items={items}
      transitionDuration={0}
      onSortEnd={onSortEnd}
      onChange={onChange}
      onRemove={onRemove}
      useDragHandle={true}
    />
  )
}

export default LocalVarSortable