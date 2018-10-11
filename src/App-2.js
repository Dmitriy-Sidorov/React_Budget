import React, { Component } from 'react';
import './App.css';
import moment from 'moment';
import styled from 'styled-components';
import Expanse from './Expanse';
import Incomes from './Incomes';

const DateButton = styled.button`
  color: white;
  border: 1px solid white;
  border-radius: 50%;
  background-color: transparent;
  width: 32px;
  height: 32px;
  margin: 3px;
  cursor: pointer;
  text-align: center;
  margin-left: 7px;
`;

const DateLine = styled.div`
  display: flex;
  align-items: center;
`;

const Link = styled.span`
  font-family: 'Marmelad';
  cursor: ${({ selected }) => (selected ? 'auto' : 'pointer')};
  color: white;
  margin: 0 8px;
  border-bottom: ${({ selected }) => (selected ? 'none' : '2px solid white')};
`;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  font-size: 25px;
  padding: 40px 0 15px;
`;

const Table = styled.table`
  width: 450px;
  text-align: right;
  padding-top: 30px;
  margin: 0 auto;
`;

const components = {
  date: moment(),
  navSelected: 'incomes',
  transactions: []
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = components;
  }

  render() {
    const { date, navSelected, transactions } = this.state;

    return (
      <div>
        <Header />
        <Main />
      </div>
    );
  }
}

class Header extends Component {
  state = components;

  handleSubtractDay = () => {
    this.setState({ date: this.state.date.subtract(1, 'day') });
  };

  handleAddDay = () => {
    this.setState({ date: this.state.date.add(1, 'day') });
  };

  remainder = () => {};

  onToday = () => {};

  render() {
    const { date } = this.state;

    return (
      <section>
        <h1>React Budget</h1>
        <p>
          Прогнозируемый остаток на {date.format('MMMM')}: {this.remainder()} р.
        </p>
        <DateLine>
          <p>{date.format('DD.MM.YYYY')}</p>
          <DateButton onClick={this.handleSubtractDay}>-</DateButton>
          <DateButton onClick={this.handleAddDay}>+</DateButton>
        </DateLine>
        <p>На сегодня: {this.onToday()} рублей</p>
      </section>
    );
  }
}

class Main extends Component {
  handleSubmitTransaction = () => {};

  render() {
    const { navSelected } = this.state;

    return (
      <section>
        <Navigator />

        {navSelected === 'expanse' ? (
          <Expanse onSubmit={this.handleSubmitTransaction} />
        ) : (
          <Incomes onSubmit={this.handleSubmitTransaction} />
        )}

        <Info />
      </section>
    );
  }
}

class Navigator extends Component {
  state = components;

  handleNavClick = event => {
    this.setState({ navSelected: event.target.getAttribute('name') });
  };

  render() {
    const { navSelected } = this.state;

    return (
      <Nav>
        <Link
          name="expanse"
          onClick={this.handleNavClick}
          selected={navSelected === 'expanse'}
        >
          Расходы сегодня
        </Link>

        <Link
          name="incomes"
          onClick={this.handleNavClick}
          selected={navSelected === 'incomes'}
        >
          Доходы
        </Link>
      </Nav>
    );
  }
}

export class Info extends Component {
  state = components;

  render() {
    const { date, transactions } = this.state;

    return (
      <Table>
        <tbody>
          {transactions
            .filter(({ date: transactionDate }) =>
              moment(transactionDate, 'DD.MM.YYYY').isSame(date, 'month')
            )
            .map(({ date, sum, category }, index) => (
              <tr key={index}>
                <td>{date}</td>
                <td>{category}</td>
                <td>{sum} ₽</td>
              </tr>
            ))}
        </tbody>
      </Table>
    );
  }
}

export default App;
