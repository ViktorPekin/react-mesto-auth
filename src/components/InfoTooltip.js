import RegistrationTrue from '../images/RegistrationTrue.svg';
import RegistrationFalse from '../images/RegistrationFalse.svg';

function InfoTooltip(props) {
  return (
    <section className={`popup popup-info ${props.isOpen ? 'popup_opened' :  ''}`}>
      <div className="popup-info__container">
        <button onClick={props.onClose} type="button" className="popup__close"></button>
        <img className="popup-info__image" alt="Иконка подтверждения" src={props.onCondition ? RegistrationTrue : RegistrationFalse}/>
        <p className="popup-info__text">{props.onCondition ? 'Вы успешно зарегистрировались!'
        : 'Что-то пошло не так! Попробуйте ещё раз.'}</p>
      </div>
    </section>
  )
}

export default InfoTooltip;
