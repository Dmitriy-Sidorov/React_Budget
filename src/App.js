import React, { Component } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import Expanse from './Expanse';
import Incomes from './Incomes';
import './App.css';
import { Container, Row, Col, Button } from 'reactstrap';

const DateButton = styled.button`
  color: white;
  border: 1px solid white;
  border-radius: 100px;
  background-color: transparent;
  width: 32px;
  height: 32px;
  margin: 3px;
  cursor: pointer;
  text-align: center;
  margin-left: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  padding: 0;
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
  padding-bottom: 15px;
`;

const Table = styled.table`
  width: 100%;
  text-align: right;
  padding-top: 30px;
  margin: 15px auto 0;
`;

class App extends Component {
  constructor(props) {
    super(props);

    let storageState = localStorage.getItem('state');
    let initState;

    if (storageState != null) {
      storageState = JSON.parse(storageState);
      initState = { ...storageState, date: moment(storageState.date) };
    } else {
      initState = {
        date: moment(),
        navSelected: 'incomes',
        transactions: []
      };
    }

    this.state = initState;
  }

  handleSubtractDay = () => {
    this.setState({ date: this.state.date.subtract(1, 'day') });
  };

  handleAddDay = () => {
    this.setState({ date: this.state.date.add(1, 'day') });
  };

  handleSubmitTransaction = (sum, category) => {
    const { date: TodayDay, transactions } = this.state;

    const newTransaction = {
      date: TodayDay.format('DD.MM.YYYY'),
      category: category,
      sum: sum
    };

    const newTransactions = [...transactions, newTransaction];

    newTransactions.sort((a, b) => {
      const aDate = moment(a.date, 'DD.MM.YYYY');
      const bDate = moment(b.date, 'DD.MM.YYYY');
      return bDate.isAfter(aDate);
    });

    this.setState({ transactions: newTransactions });
  };

  handleNavClick = event => {
    this.setState({ navSelected: event.target.getAttribute('name') });
  };

  remainder = () => {
    const { transactions, date } = this.state;

    const currentMonthTransactions = transactions.filter(
      ({ date: transactionDate }) =>
        moment(transactionDate, 'DD.MM.YYYY').isBefore(date, 'date') ||
        moment(transactionDate, 'DD.MM.YYYY').isSame(date, 'date')
    );

    const remainderMoney = currentMonthTransactions.reduce(
      (acc, transaction) => transaction.sum + acc,
      0
    );

    return remainderMoney;
  };

  componentDidUpdate() {
    const { date } = this.state;
    localStorage.setItem(
      'state',
      JSON.stringify({ ...this.state, date: date.format() })
    );
  }

  onToday = () => {
    const { transactions, date } = this.state;

    const currentMonthTransactions = transactions.filter(
      ({ date: transactionDate }) =>
        moment(transactionDate, 'DD.MM.YYYY').isSame(date, 'month')
    );

    const dailyMoney =
      currentMonthTransactions.reduce(
        (acc, transaction) =>
          transaction.sum > 0 ? transaction.sum + acc : acc,
        0
      ) / moment(date).daysInMonth();

    const transactionsBeforeThisDayAndInThisDay = currentMonthTransactions.filter(
      ({ date: transactionDate }) =>
        moment(transactionDate, 'DD.MM.YYYY').isBefore(date, 'date') ||
        moment(transactionDate, 'DD.MM.YYYY').isSame(date, 'date')
    );

    const expanseBeforeToday = transactionsBeforeThisDayAndInThisDay.reduce(
      (acc, { sum }) => (sum < 0 ? acc + sum : acc),
      0
    );

    const incomeBeforeToday = date.date() * dailyMoney;

    const transactionsBeforeToday = currentMonthTransactions.filter(
      ({ date: transactionDate }) =>
        moment(transactionDate, 'DD.MM.YYYY').isBefore(date, 'date')
    );

    const pastExpenses = transactionsBeforeToday.reduce(
      (acc, { sum }) => (sum < 0 ? acc + sum : acc),
      0
    );

    const beforeDailyMoney = date.date() * dailyMoney + pastExpenses;

    //console.log({ dailyMoney, expanseBeforeToday, incomeBeforeToday, beforeDailyMoney });

    return (
      <div>
        <p>Средний бюджет на день: {parseInt(dailyMoney)} ₽</p>
        <p>На сегодня: {parseInt(beforeDailyMoney)} ₽</p>
        <p>
          Сальдо: {parseInt(incomeBeforeToday) + parseInt(expanseBeforeToday)} ₽
        </p>
        <p>
          На завтра:{' '}
          {parseInt(incomeBeforeToday) +
            parseInt(expanseBeforeToday) +
            parseInt(dailyMoney)}{' '}
          ₽
        </p>
      </div>
    );
  };

  handlerClear = () => {
    localStorage.clear();
  };

  transactionMonth = () => {
    const { transactions, date } = this.state;

    const currentMonthTransactions = transactions.filter(
      ({ date: transactionDate }) =>
        moment(transactionDate, 'DD.MM.YYYY').isSame(date, 'month')
    );

    const daysInMonth = moment(date, 'MM.YYYY');

    let transactionArray = [];
    let expanseDay = 0;
    let incomeDay = 0;
    let dates = '';
    let datesArray = [];
    let arrayTransactionDay = [];

    for (let i = 0; i < currentMonthTransactions.length; i++) {
      let day = currentMonthTransactions[i].date;
      let expanseSum = 0;
      let incomeSum = 0;

      for (let i = 0; i < currentMonthTransactions.length; i++) {
        if (day === currentMonthTransactions[i].date) {
          if (currentMonthTransactions[i].sum < 0) {
            expanseSum = expanseSum + currentMonthTransactions[i].sum;
          } else {
            incomeSum = incomeSum + currentMonthTransactions[i].sum;
          }
        }
      }
      arrayTransactionDay[i] = { day, expanseSum, incomeSum };
    }

    for (let i = 0; i < daysInMonth.daysInMonth(); i++) {
      dates = daysInMonth
        .startOf('month')
        .add(i, 'day')
        .format('DD.MM.YYYY');
      datesArray[i] = dates;
      transactionArray[i] = { dates, expanseDay, incomeDay };
    }

    for (let i = 0; i < daysInMonth.daysInMonth(); i++) {
      let checkDate =
        arrayTransactionDay[i] !== undefined
          ? arrayTransactionDay[i].day
          : false;
      let k = datesArray.indexOf(checkDate);

      if (k !== -1) {
        expanseDay = arrayTransactionDay[i].expanseSum;
        incomeDay = arrayTransactionDay[i].incomeSum;
        dates = datesArray[k];
        transactionArray[k] = { dates, expanseDay, incomeDay };
      }
    }

    const table = transactionArray.map(
      ({ dates, expanseDay, incomeDay }, index) => (
        <tr key={index}>
          <td>{dates}</td>
          <td>{expanseDay} ₽</td>
          <td>{incomeDay} ₽</td>
        </tr>
      )
    );

    return table;
  };

  render() {
    const { date, navSelected, transactions } = this.state;

    return (
      <Container className="pt-3">
        <Row>
          <Col xs="12" className="d-flex align-items-center mb-3">
            <h1>React Budget</h1>
            <Button
              outline
              color="secondary"
              className="cleaning"
              onClick={this.handlerClear}
            >
              Cleaning
            </Button>
          </Col>
          <Col md="6">
            <p>
              Прогнозируемый остаток на {date.format('MMMM')}:{' '}
              {this.remainder()} ₽
            </p>
            <DateLine className="my-3">
              <p>{date.format('DD.MM.YYYY')}</p>
              <DateButton onClick={this.handleSubtractDay}>-</DateButton>
              <DateButton onClick={this.handleAddDay}>+</DateButton>
            </DateLine>
            {this.onToday()}

            <div className="expanse">
              <p>Транзакции за {date.format('MMMM')}</p>

              <Table className="expanse__table">
                <tbody>
                  <tr>
                    <td>Дата</td>
                    <td>Расходы</td>
                    <td>Доходы</td>
                  </tr>
                  {this.transactionMonth()}
                </tbody>
              </Table>
            </div>
          </Col>

          <Col md="6" className="d-flex flex-column align-items-end">
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

            {navSelected === 'expanse' ? (
              <Expanse onSubmit={this.handleSubmitTransaction} />
            ) : (
              <Incomes onSubmit={this.handleSubmitTransaction} />
            )}

            <div className="expanse">
              <p>Транзакции на указанную дату</p>

              <Table>
                <tbody>
                  {transactions
                    .filter(({ date: transactionDate }) =>
                      moment(transactionDate, 'DD.MM.YYYY').isSame(date, 'day')
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
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
