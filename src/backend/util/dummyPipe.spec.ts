import dummyPipe from "./dummyPipe";
import Stream from "stream";

const str = "ping!";

test("Pipe integrity", done => {
	expect.assertions(1);

	const dummy = dummyPipe();
	const stdout = new Stream.Writable({
		write (data) {
			expect(data.reduce((str: any, int: any) => str + String.fromCharCode(int), "")).toBe(str);
			stdout.destroy();
			dummy.destroy();
			process.stdin.destroy();
			done();
		}
	});

	dummy.pipe(stdout);
	process.stdin.pipe(dummy);
	process.stdin.push(str);
});
