class Api {
  constructor(config) {
    this._baseUrl = config.baseUrl;
    this._header = config.headers;
    this._authBaseUrl = config.authBaseUrl;
    this._authHeader = config.authHeader;
  }
  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  getInitialProfile() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._header
    }).then(this._checkResponse);
  }

  getInitialCard() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._header
    }).then(this._checkResponse);
  }

  patchProfile(data) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._header,
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
    }).then(this._checkResponse);
  }

  addNewCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._header,
      body: JSON.stringify({
        name: data.name,
        link: data.link
      })
    }).then(this._checkResponse);
  }

  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: 'DELETE',
      headers: this._header
    }).then(this._checkResponse);
  }

  changeLikeCardStatus(id, isLiked) {
    const method = isLiked ? 'PUT' : 'DELETE';
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: method,
      headers: this._header
    }).then(this._checkResponse);
  }

  patchAvatar(data) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._header,
      body: JSON.stringify({
        avatar: data
      })
    }).then(this._checkResponse);
  }

  authUser(data) {
    return fetch(`${this._authBaseUrl}/signin`, {
      method: 'POST',
      headers: this._authHeader,
      body: JSON.stringify({
        password: data.password,
        email: data.email
      })
    }).then(this._checkResponse);
  }

  registrationUser(data) {
    return fetch(`${this._authBaseUrl}/signup`, {
      method: 'POST',
      headers: this._authHeader,
      body: JSON.stringify({
        password: data.password,
        email: data.email
      })
    }).then(this._checkResponse);
  }

  checkedToken(jwt) {
    return fetch(`${this._authBaseUrl}/users/me`, {
      method: 'GET',
      headers: this._authHeader,
      "Authorization" : `Bearer ${jwt}`
    }).then(this._checkResponse);
  }
}

export const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-41',
  headers: {
    authorization: '535d3a03-0687-4a91-b587-5369f637f559',
    'Content-Type': 'application/json'
  },
  authBaseUrl: 'https://auth.nomoreparties.co',
  authHeader: {
    "Content-Type": "application/json"
  }
});
