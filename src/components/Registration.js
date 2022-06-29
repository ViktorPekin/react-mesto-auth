function Registration(props) {
  return(
    <div className="login-registration">
      <h2 className="login-registration__title">{props.title}</h2>
      <form className="login-registration__form">
        <input className="login-registration__email" placeholder="Email"></input>
        <input className="login-registration__password" placeholder="Пароль"></input>
        <button className="login-registration__button">{props.button}</button>
      </form>
    </div>
  )
}

export default Registration;

