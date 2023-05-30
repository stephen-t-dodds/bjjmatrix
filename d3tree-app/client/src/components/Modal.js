import React, { useEffect } from 'react';

const Modal = (props) => {
  const [addItem, setAddItem] = React.useState('');

  if (!props.show) {
    if (addItem != '') {
      setAddItem('');
    }
    return null;
  }

  const handleChange = (e) => {
    setAddItem(e.target.value);
  };

  return (
    <div className='modal' onClick={props.onClose}>
      <div className='modal-content' onClick={e => e.stopPropagation()}>
        <div className='modal-header'>
          <h4 className='modal-title'>Add item</h4>
        </div>
        <div className='modal-body'>
          <input
            id='add-node'
            name='add-node'
            value={addItem}
            onChange={handleChange}
            />
        </div>
        <div className='modal-footer'>
          <button onClick={()=>{
              props.setAddItem(addItem);
              props.onClose();
              props.addItem(addItem);
            }}
            className='button'>Add</button>
        </div>
      </div>
    </div>
  )
}

export default Modal;
