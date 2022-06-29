import React, {useEffect} from 'react';

function PopupWithForm(props) {
    useEffect(() => {
      function closeOnDelite(evt) {
        if (evt.key === 'Escape') {
          props.onClose();
        }
      }
      document.addEventListener('keydown', (evt) => {
        closeOnDelite(evt);
      });

      document.addEventListener('mousedown', (evt) => {
        if(evt.target.classList.contains('popup')) {
          props.onClose();
        }
      });

      return () => {
        document.removeEventListener('keydown', (evt) => {
          closeOnDelite(evt);
        });
      };
  },[]);

  return(
    <section className={`popup popup-${props.name} ${props.isOpen ? 'popup_opened' : ''}`}>
      <div className={`popup-${props.name}__container`}>
        <button onClick={props.onClose} type="button" className="popup__close"></button>
        <h2 className={`popup-${props.name}__title`}>{props.title}</h2>
        <form onSubmit={props.onSubmit} className={`popup__form popup__form_${props.name}`} name={`popup-${props.name}`} form="" noValidate>
          {props.children}
          <button className="popup__button popup__button_valid" type="submit">{props.buttonText}</button>
        </form>
      </div>
    </section>
  )
}

export default PopupWithForm;
