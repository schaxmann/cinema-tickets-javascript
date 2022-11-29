import TicketTypeRequest from "./lib/TicketTypeRequest.js";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";
import { BusinessRules } from "./BusinessRules";

export default class TicketService {
	purchaseTickets(accountId, ...ticketTypeRequests) {
		const { maxQuantity, prices } = BusinessRules; // Sets ticket prices & maximum ticket quantity
		const ticketRequest = this.#requestHandler(...ticketTypeRequests); // Creates ticketRequest object

		this.#requestValidator(ticketRequest, accountId, maxQuantity); // Checks ticketRequest object against purchase exception rules
		this.#paymentHandler(ticketRequest, accountId, prices); // Calculates & submits order subtotal to TicketPaymentService
		this.#reservationHandler(ticketRequest, accountId); // Calculates & submits number of tickets to SeatReservationService
	}

	#requestHandler(ticketTypeRequests) {
		const ticketRequest = { ADULT: 0, CHILD: 0, INFANT: 0 };
		const isValid = (request) => request instanceof TicketTypeRequest;

		if (!Array.isArray(ticketTypeRequests)) return false; // Checks ticketTypeRequests is an array
		if (!ticketTypeRequests.length || !ticketTypeRequests.every(isValid)) return false; // Checks contains only TicketTypeRequest objects
		ticketTypeRequests.forEach((ticketTypeRequest) => {
			ticketRequest[ticketTypeRequest.getTicketType()] += ticketTypeRequest.getNoOfTickets();
		});
		return ticketRequest;
	}

	#requestValidator(ticketRequest, accountID, maxQuantity) {
		const { ADULT, CHILD, INFANT } = ticketRequest;
		const ticketQuantity = ADULT + CHILD + INFANT;

		// Purchase Exception Rules
		if (!ticketRequest)
			throw new InvalidPurchaseException(
				"ticketTypeRequests must be an array of TicketTypeRequest objects"
			);
		if (accountID < 1) throw new InvalidPurchaseException("accountId must be greater than 0");
		if (ticketQuantity < 1) throw new InvalidPurchaseException("You must buy at least one ticket");
		if (!ADULT)
			throw new InvalidPurchaseException(
				"Infants & children must be accompanied by at least one adult"
			);
		if (ticketQuantity > maxQuantity)
			throw new InvalidPurchaseException(`Maximum of ${maxQuantity} tickets per transaction`);
		if (INFANT > ADULT)
			throw new InvalidPurchaseException("Each infant must be accompanied by a separate adult");
	}

	#paymentHandler(ticketRequest, accountID, prices) {
		const { ADULT, CHILD, INFANT } = ticketRequest;
		const subtotal = ADULT * prices.ADULT + CHILD * prices.CHILD + INFANT * prices.INFANT; // Infants included in case of future price change
		new TicketPaymentService().makePayment(accountID, subtotal);
	}

	#reservationHandler(ticketRequest, accountID) {
		const { ADULT, CHILD } = ticketRequest;
		const noOfSeats = ADULT + CHILD; // Only adult and child tickets require separate seats
		new SeatReservationService().reserveSeat(accountID, noOfSeats);
	}
}
