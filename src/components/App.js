import {useEffect, useState } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import Header from './Header';
import Main from './Main';
import Login from './Login';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import ConfirmDeliteCardPopup from './ConfirmDeliteCardPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import ProtectedRoute from './ProtectedRoute';
import {api} from '../utils/api'
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import Registration from './Registration';


function App() {
  const [selectedCard, setSelectedCard] = useState({});
  const [isEditProfilePopupOpen , setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmDeliteCardPopup, setConfirmDeliteCardPopup] = useState(false);
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [actualDeleteCard, setActualDeleteCard] = useState({});
  const [loggedIn, setloggedIn] = useState(false);

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

  return (
    <div className="page">
      <div className="page__container">
        <Switch>
          <CurrentUserContext.Provider value={currentUser}>
            <Header />
            <ProtectedRoute
              path="/"
              loggedIn={loggedIn}
              component={Main}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              onEditProfile={setIsEditProfilePopupOpen}
              onAddPlace={setIsAddPlacePopupOpen}
              onEditAvatar={setIsEditAvatarPopupOpen}
              onCardClick={setSelectedCard}
            />
            <Route path="/sign-in">
              <Login title={'Вход'} button={'Войти'}/>
            </Route>
            <Route path="/sign-up">
              <Registration title={'Регистрация'} button={'Зарегистрироваться'}/>
            </Route>
            <EditProfilePopup onUpdateUser={handleUpdateUser} isOpen={isEditProfilePopupOpen} onClose={closeAllPopups}/>
            <AddPlacePopup onAddPlace={handleAddPlaceSubmit} isOpen={isAddPlacePopupOpen} onClose={closeAllPopups}/>
            <EditAvatarPopup onUpdateAvatar={handleUpdateAvatar} isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} />
            <ConfirmDeliteCardPopup onCardDelete={openConfirmPopup} isOpen={isConfirmDeliteCardPopup} onClose={closeAllPopups}/>
            <ImagePopup
              onClose={closeAllPopups}
              card={selectedCard}
            />
          </CurrentUserContext.Provider>
        </Switch>
      </div>
    </div>
  );
}

export default App;
