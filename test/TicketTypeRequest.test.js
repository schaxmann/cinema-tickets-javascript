import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest";

let noOfTickets;

beforeEach(() => {
	noOfTickets = 4;
});

describe("TicketTypeRequest", () => {
	describe("Functionality", () => {
		it("Is an immutable object.", () => {
			const type = "ADULT";
			const test1 = new TicketTypeRequest(type, noOfTickets);
			expect(Object.isFrozen(test1)).toBe(true);
		});
	});
	describe("Error handling", () => {
		it("Throws correct error when type is an invalid string", () => {
			const type = "BANANA";
			expect(() => {
				// eslint-disable-next-line no-new
				new TicketTypeRequest(type, noOfTickets);
			}).toThrow("type must be ADULT, CHILD, or INFANT");
		});
		it("Throws correct error when type is not a string", () => {
			const type = 55;
			expect(() => {
				// eslint-disable-next-line no-new
				new TicketTypeRequest(type, noOfTickets);
			}).toThrow("type must be ADULT, CHILD, or INFANT");
		});
		it("Throws correct error when noOfTickets is not an integer", () => {
			const type = "ADULT";
			noOfTickets = 4.5;
			expect(() => {
				// eslint-disable-next-line no-new
				new TicketTypeRequest(type, noOfTickets);
			}).toThrow("noOfTickets must be an integer");
		});
	});
});
