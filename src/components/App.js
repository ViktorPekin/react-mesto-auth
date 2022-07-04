import {useEffect, useState } from 'react';
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Main from './Main';
import Login from './Login';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import ConfirmDeliteCardPopup from './ConfirmDeliteCardPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import Register from './Register';
import InfoTooltip from './InfoTooltip';
import ProtectedRoute from './ProtectedRoute';
import {api} from '../utils/api';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

function App() {
  const [selectedCard, setSelectedCard] = useState({});
  const [isEditProfilePopupOpen , setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmDeliteCardPopup, setConfirmDeliteCardPopup] = useState(false);
  const [isInfoTooltipPopup, setisInfoTooltipPopup] = useState(false);
  const [isInfoTooltiCondition, setIsInfoTooltiCondition] = useState(true);
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [actualDeleteCard, setActualDeleteCard] = useState({});
  const [loggedIn, setloggedIn] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getInitialCard().then((res) => {
      setCards(res);
    }).catch((err) => {
      console.log(err);
    });
    api.getInitialProfile().then((res) => {
      setCurrentUser(res);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    }).catch((err) => {
      console.log(err);
    });
  }

  function openConfirmPopup() {
    api.deleteCard(actualDeleteCard._id).then(() => {
      setCards((state) => state.filter((c) => c._id !== actualDeleteCard._id));
      closeAllPopups();
    }).catch((err) => {
      console.log(err);
    });
  }

  function handleCardDelete(card) {
    setActualDeleteCard(card)
    setConfirmDeliteCardPopup(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setConfirmDeliteCardPopup(false);
    setSelectedCard({});
    setisInfoTooltipPopup(false);
  }

  function handleUpdateUser(value) {
    api.patchProfile(value).then((res) => {
      setCurrentUser(res);
      closeAllPopups();
    }).catch((err) => {
      console.log(err);
    });
  }

  function handleUpdateAvatar(value) {
    api.patchAvatar(value.avatar).then((res) => {
      setCurrentUser(res);
      closeAllPopups();
    }).catch((err) => {
      console.log(err);
    });
  }

  function handleAddPlaceSubmit(value) {
    api.addNewCard(value).then((res) => {
      setCards([res, ...cards]);
      closeAllPopups();
    }).catch((err) => {
      console.log(err);
    });
  }

  function handleRegistrationUser(value) {
    api.registrationUser(value).then((res) => {
      if (res) {
        navigate('/sign-in');
        setIsInfoTooltiCondition(true);
        setisInfoTooltipPopup(true);
      } else {
        setIsInfoTooltiCondition(false);
        setisInfoTooltipPopup(true);
      }
    }).catch((err) => {
      console.log(err);
      setIsInfoTooltiCondition(false);
      setisInfoTooltipPopup(true);
    });
  }

  return (
    <div className="page">
      <div className="page__container">
        <CurrentUserContext.Provider value={currentUser}>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute
                exact path="/"
                loggedIn={loggedIn}
              >
                <Main
                loggedIn={loggedIn}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                onEditProfile={setIsEditProfilePopupOpen}
                onAddPlace={setIsAddPlacePopupOpen}
                onEditAvatar={setIsEditAvatarPopupOpen}
                onCardClick={setSelectedCard}/>
              </ProtectedRoute>
            }/>
            <Route path="/sign-in" element={
              <Login title={'Вход'} button={'Войти'}/>
            }/>
            <Route path="/sign-up" element={
              <Register title={'Регистрация'} button={'Зарегистрироваться'} onRegistration={handleRegistrationUser}/>
            }/>
            <Route path="*" element={
              loggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />
            }/>
          </Routes>
          <EditProfilePopup onUpdateUser={handleUpdateUser} isOpen={isEditProfilePopupOpen} onClose={closeAllPopups}/>
          <AddPlacePopup onAddPlace={handleAddPlaceSubmit} isOpen={isAddPlacePopupOpen} onClose={closeAllPopups}/>
          <EditAvatarPopup onUpdateAvatar={handleUpdateAvatar} isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} />
          <ConfirmDeliteCardPopup onCardDelete={openConfirmPopup} isOpen={isConfirmDeliteCardPopup} onClose={closeAllPopups}/>
          <InfoTooltip onCondition={isInfoTooltiCondition} isOpen={isInfoTooltipPopup} onClose={closeAllPopups}/>
          <ImagePopup
            onClose={closeAllPopups}
            card={selectedCard}
          />
        </CurrentUserContext.Provider>
      </div>
    </div>
  );
}

export default App;
