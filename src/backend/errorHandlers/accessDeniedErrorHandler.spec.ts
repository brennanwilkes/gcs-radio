import accessDeniedErrorHandler from "./accessDeniedErrorHandler";


const req = {
	originalUrl: "URL"
};

const res = {
	status: (status: number) => {
		expect(status).toBe(401);
		return {
			json: (json: any) => {
				expect(json).toMatchObject({
					errors: expect.any(Array)
				});
				expect(json.errors.length).toBe(1);
				return {
					end: () => {
						expect(true).toBeTruthy();
					}
				};
			}
		};
	}
}

test("Generates correct JSON response", () => {
	expect.assertions(4);
	accessDeniedErrorHandler(req as any, res as any)("ERROR");
});
