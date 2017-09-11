import React, { Component } from 'react';
import firebase, { auth, provider } from './firebase';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      product: '',
      count: '',
      items: [],
      user: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value', (snapshot) => {
      const items = snapshot.val() || {};
      const newState = Object.entries(items).map(([idx, item]) => ({
        id: idx,
        product: item.product,
        count: item.count,
        user: item.user,
      }));
      this.setState({ items: newState });
    });

    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.product || !this.state.count) {
      alert('Заполните поля плес');
    } else {
      const itemsRef = firebase.database().ref('items');
      const item = {
        product: this.state.product,
        user: this.state.user.displayName || this.state.user.email,
        count: this.state.count,
      };
      itemsRef.push(item);
      this.setState({
        product: '',
        count: '',
      });
    }
  }

  removeItem(id) {
    const itemRef = firebase.database().ref(`/items/${id}`);
    itemRef.remove();
  }

  logout() {
    auth.signOut()
      .then(() => this.setState({ user: null }));
  }

  login() {
    auth.signInWithPopup(provider)
      .then(({ user }) => this.setState({ user }));
  }

  render() {
    return (
      <div className="App">
        <header className="header">
          <h1 className="title">Список покупок</h1>
          {this.state.user
            ? <button className="button" onClick={this.logout}>Выход</button>
            : <button className="button" onClick={this.login}>Вход</button>}
        </header>
        {this.state.user
          ? <main className='container'>
            <section className="display-item">
              <ul className="list">
                {this.state.items.length
                  ? this.state.items.map(item => (
                    <li className="card" key={item.id}>
                      <p>{item.product}: {item.count}</p>
                      <p>Заказал: {item.user}</p>
                      <button className="action-button" onClick={() => this.removeItem(item.id)}>Я купил</button>
                    </li>
                  ))
                  : <span>Список пуст</span>}
              </ul>
            </section>
            <section className='add-item'>
              <form className="form" onSubmit={this.handleSubmit}>
                <input className="input" type="text" name="product" placeholder="Что взять?" onChange={this.handleChange} value={this.state.product} />
                <input className="input" type="text" name="count" placeholder="Сколько?" onChange={this.handleChange} value={this.state.count} />
                <button className="action-button">Добавить</button>
              </form>
            </section>
          </main>
          : <main className='container'>
            <p>Залогиньтесь плес</p>
          </main>}
      </div>
    );
  }
}

export default App;
