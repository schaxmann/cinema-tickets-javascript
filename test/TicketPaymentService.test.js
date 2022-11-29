import TicketPaymentService from "../src/thirdparty/paymentgateway/TicketPaymentService";

describe("TicketPaymentService", () => {
	describe("Error handling", () => {
		it("Throws correct error when accountId is not an integer", () => {
			const accountId = 4.7;
			const totalAmountToPay = 20;
			expect(() => {
				new TicketPaymentService().makePayment(accountId, totalAmountToPay);
			}).toThrow("accountId must be an integer");
		});
		it("Throws correct error when subtotal is not an integer", () => {
			const accountId = 4;
			const totalAmountToPay = 4.5;
			expect(() => {
				new TicketPaymentService().makePayment(accountId, totalAmountToPay);
			}).toThrow("totalAmountToPay must be an integer");
		});
	});
});
