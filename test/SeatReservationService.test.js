import SeatReservationService from "../src/thirdparty/seatbooking/SeatReservationService";

describe("SeatReservationService", () => {
	describe("Error handling", () => {
		it("Throws correct error when accountId is not an integer", () => {
			const accountId = 4.7;
			const totalSeatsToAllocate = 5;
			expect(() => {
				new SeatReservationService().reserveSeat(
					accountId,
					totalSeatsToAllocate
				);
			}).toThrow("accountId must be an integer");
		});
		it("Throws correct error when subtotal is not an integer", () => {
			const accountId = 4;
			const totalSeatsToAllocate = 4.5;
			expect(() => {
				new SeatReservationService().reserveSeat(
					accountId,
					totalSeatsToAllocate
				);
			}).toThrow("totalSeatsToAllocate must be an integer");
		});
	});
});
