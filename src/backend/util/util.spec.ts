import { print, CONFIG } from "./util";

test("Print integrity", () => {
	console.log = jest.fn();
	CONFIG.verbose = true;
	print("TEST");
	expect(console.log).toHaveBeenCalledWith("TEST");

	console.log = jest.fn();
	CONFIG.verbose = false;
	print("TEST");
	expect(console.log).not.toHaveBeenCalledWith("TEST");
});

test("config integrity", () => {
	expect(CONFIG).toHaveProperty('port');
	expect(CONFIG).toHaveProperty('verbose');
});
