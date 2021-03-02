import dummyPipe from "../backend/util/dummyPipe";
import streamToMongo from "./streamToMongo";

var toErr = false;

const uploadStream = {
	on: jest.fn((event: string, callback: any) => {
		if(event === "error" && toErr){
			callback("ERROR");
		}
		else if(event === "finish" && !toErr){
			callback();
		}
	}),
	id: "ID"
};

jest.mock('./connection', () => ({
	__esModule: true,
	mongoose: {
		connection: {
			db: "DATABASE"
		},
		mongo: {
			GridFSBucket: jest.fn((db: any, options: any) => {
				expect(db).toBe("DATABASE");
				expect(options).toMatchObject({
					bucketName: "audio",
					chunkSizeBytes: Math.pow(2, 20) * 8
				});
				return {
					openUploadStream: jest.fn((name: string) => {
						expect(name).toBe("NAME");
						return uploadStream;
					})
				};
			})
		}
	}
}));

test("Calls correct mongoose internals and resolves to an id", done => {
	expect.assertions(5);
	streamToMongo("NAME", {
		pipe: (pipeTo: any) => expect(pipeTo).toMatchObject(uploadStream)
	} as any).then(res => {
		expect(res).toBe("ID");
		done();
	});
});

test("Rejects Promise on error event", done => {
	toErr = true;
	expect.assertions(5);
	streamToMongo("NAME", {
		pipe: (pipeTo: any) => expect(pipeTo).toMatchObject(uploadStream)
	} as any).catch(err => {
		expect(err).toBe("ERROR");
		done();
	});
});
