import streamFromMongo from "./streamFromMongo";

var toErr = false;

const downloadStream: any = {
	on: jest.fn((event: string, callback: any) => {
		if(event === "error" && toErr){
			callback("ERROR");
		}
		else if(event === "data"){
			callback(new Buffer([1]));
		}
		else if(event === "end" && !toErr){
			callback();
		}
		return downloadStream;
	}),
	id: "ID"
};

jest.mock('./connection', () => ({
	__esModule: true,
	mongoose: {
		connection: {
			db: "DATABASE"
		},
		Types: {
			ObjectId: jest.fn((id: string) => {
				expect(id).toBe("ID");
				return id;
			})
		},
		mongo: {
			GridFSBucket: jest.fn((db: any, options: any) => {
				expect(db).toBe("DATABASE");
				expect(options).toMatchObject({
					bucketName: "audio",
					chunkSizeBytes: Math.pow(2, 20) * 8
				});
				return {
					openDownloadStream: jest.fn((id: string) => {
						expect(id).toBe("ID");
						return downloadStream;
					})
				};
			})
		}
	}
}));

test("Calls correct mongoose internals and resolves to an id", done => {
	expect.assertions(7);
	streamFromMongo("ID", {
		write: (data: string, mode: string) => {
			expect(data).toMatchObject(new Buffer([1]));
			expect(mode).toBe("binary");
		}
	} as any).then(() => {
		expect(true).toBeTruthy();
		done();
	});
});

test("Rejects on error", done => {
	expect.assertions(5);
	toErr = true;
	streamFromMongo("ID", {
		write: (data: string, mode: string) => {
			expect(data).toMatchObject(new Buffer([1]));
			expect(mode).toBe("binary");
		}
	} as any).catch((err: any) => {
		expect(err).toBe("ERROR");
		done();
	});
});
