import TicketService from "../src/pairtest/TicketService";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest";
import TicketPaymentService from "../src/thirdparty/paymentgateway/TicketPaymentService";
import SeatReservationService from "../src/thirdparty/seatbooking/SeatReservationService";

let accountId;
let test1;
let test2;
let test3;

// Spy mocks to observe interactions with third party providers

const ticketPaymentMock = jest.spyOn(
	TicketPaymentService.prototype,
	"makePayment"
);
const seatReservationMock = jest.spyOn(
	SeatReservationService.prototype,
	"reserveSeat"
);

// Requests that satisfy all conditions

const validRequest = {
	a: [new TicketTypeRequest("ADULT", 3)],
	b: [new TicketTypeRequest("CHILD", 3), new TicketTypeRequest("ADULT", 2)],
	c: [
		new TicketTypeRequest("INFANT", 2),
		new TicketTypeRequest("CHILD", 3),
		new TicketTypeRequest("ADULT", 5),
	],
};

// Requests that violate one condition

const invalidRequest = {
	invalidType: "",
	emptyArray: [],
	invalidArray: ["this", "isn't", "valid"],
	zeroTickets: [
		new TicketTypeRequest("INFANT", 0),
		new TicketTypeRequest("ADULT", 0),
	],
	zeroAdults: [
		new TicketTypeRequest("INFANT", 3),
		new TicketTypeRequest("ADULT", 0),
		new TicketTypeRequest("CHILD", 3),
	],
	maxTickets: [
		new TicketTypeRequest("INFANT", 3),
		new TicketTypeRequest("ADULT", 16),
		new TicketTypeRequest("CHILD", 3),
	],
	maxInfants: [
		new TicketTypeRequest("INFANT", 4),
		new TicketTypeRequest("ADULT", 3),
	],
};

beforeEach(() => {
	accountId = 4;
	test1 = new TicketService();
	test2 = new TicketService();
	test3 = new TicketService();
});

afterEach(() => {
	jest.clearAllMocks();
});

describe("TicketService", () => {
	describe("Functionality", () => {
		it("Calls TicketPaymentService.makePayment with correct subtotal", () => {
			test1.purchaseTickets(accountId, validRequest.a);
			test2.purchaseTickets(accountId, validRequest.b);
			test3.purchaseTickets(accountId, validRequest.c);
			expect(ticketPaymentMock).toHaveBeenCalledTimes(3);
			expect(ticketPaymentMock).toHaveBeenNthCalledWith(1, accountId, 60);
			expect(ticketPaymentMock).toHaveBeenNthCalledWith(2, accountId, 70);
			expect(ticketPaymentMock).toHaveBeenNthCalledWith(3, accountId, 130);
		});
		it("Calls SeatReservationService.reserveSeat with correct number of seats", () => {
			test1.purchaseTickets(accountId, validRequest.a);
			test2.purchaseTickets(accountId, validRequest.b);
			test3.purchaseTickets(accountId, validRequest.c);
			expect(seatReservationMock).toHaveBeenCalledTimes(3);
			expect(seatReservationMock).toHaveBeenNthCalledWith(1, accountId, 3);
			expect(seatReservationMock).toHaveBeenNthCalledWith(2, accountId, 5);
			expect(seatReservationMock).toHaveBeenNthCalledWith(3, accountId, 8);
		});
		it("Has only one public method: purchaseTickets", () => {
			const publicMethods = Object.getOwnPropertyNames(TicketService.prototype);
			expect(publicMethods).toStrictEqual(["constructor", "purchaseTickets"]);
		});
	});
	describe("Error handling", () => {
		it("Throws correct error when ticketTypeRequests is not an array of ticketTypeRequest objects", () => {
			expect(() => {
				test1.purchaseTickets(accountId, invalidRequest.invalidType);
			}).toThrow(
				"ticketTypeRequests must be an array of TicketTypeRequest objects"
			);
			expect(() => {
				test1.purchaseTickets(accountId, invalidRequest.emptyArray);
			}).toThrow(
				"ticketTypeRequests must be an array of TicketTypeRequest objects"
			);
			expect(() => {
				test1.purchaseTickets(accountId, invalidRequest.invalidArray);
			}).toThrow(
				"ticketTypeRequests must be an array of TicketTypeRequest objects"
			);
		});
		it("Throws correct error when accountId < 1", () => {
			accountId = -4;
			expect(() => {
				test1.purchaseTickets(accountId, validRequest.c);
			}).toThrow("accountId must be greater than 0");
		});
		it("Throws correct error when accountId is not an integer", () => {
			accountId = 4.7;
			expect(() => {
				test1.purchaseTickets(accountId, validRequest.c);
			}).toThrow("accountId must be an integer");
		});
		it("Throws correct error when 0 tickets are requested", () => {
			expect(() => {
				test1.purchaseTickets(accountId, invalidRequest.zeroTickets);
			}).toThrow("You must buy at least one ticket");
		});
		it("Throws correct error when children/infant tickets are requested without an adult ticket", () => {
			expect(() => {
				test1.purchaseTickets(accountId, invalidRequest.zeroAdults);
			}).toThrow(
				"Infants & children must be accompanied by at least one adult"
			);
		});
		it("Throws correct error when maximum number of tickets is exceeded", () => {
			expect(() => {
				test1.purchaseTickets(accountId, invalidRequest.maxTickets);
			}).toThrow("Maximum of 20 tickets per transaction");
		});
		it("Throws correct error when number of infant tickets exceeds adult tickets", () => {
			expect(() => {
				test1.purchaseTickets(accountId, invalidRequest.maxInfants);
			}).toThrow("Each infant must be accompanied by a separate adult");
		});
	});
});
