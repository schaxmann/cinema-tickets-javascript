# Cinema Tickets

A JavaScript solution to the [DWP Cinema Tickets](https://github.com/dwp/cinema-tickets/) coding exercise.

## Getting Started

### Setup

Clone the repository with the following terminal command:

```
git clone https://github.com/schaxmann/cinema-tickets-javascript
```

Install all relevant dependencies with the following terminal command:

```
npm install
```

### Testing

Trigger the Jest testing suite with the following terminal command:

```
npm run test
```

- A small test suite provides unit testing to ensure the model meets all outlined rules, constraints & objectives.
- Husky provides some basic CI protections, running automated pre-commit testing to prevent changes that violate the specification, alongside Prettier & ESlint.

## Considerations

### Assumptions

- The `purchaseTickets` method should be called with an `accountId` and `ticketTypeRequests` array consisting of immutable `ticketTypeRequest` objects.
- The existing implementations of `TicketPaymentService` and `SeatReservationService` have no defects, and do not require testing outside of simple error handling.

### Approach

- Basic business rules are defined within a separate file which allows the ticket prices and maximum quantity of tickets per transaction to be altered without affecting the wider architecture.
- The testing suite should ensure that all business rules are met and provide some basic CI protections against changes that violate said rules.
- `TicketPaymentService` is designed with readability and reusability in mind, with clearly defined private methods which separate concerns and minimise the need for code comments.
- As a default position, all fields and methods should be private unless there is an explicit need for them to be accessed outside of the class.

### Improvements

- I think it would be interesting to implement a more robust business ruleset within the code, including the conditions which throw InvalidPurchaseExceptions to facilitate greater extensibility.
- For example, the model would not be able to accommodate a one-off, child-only screening under the current implementation.
- This could be coupled with a basic frontend control panel to allow all parameters to be adjusted by non-technical team members.

## Built With

- [Node](https://nodejs.org/en/docs/)
- [Jest](https://jestjs.io/docs/getting-started)
- [Babel](https://babeljs.io/docs/en/)
- [Prettier](https://prettier.io/docs/en/index.html)
- [ESLint](https://eslint.org/docs/latest/)
- [Husky](https://typicode.github.io/husky/#/)
