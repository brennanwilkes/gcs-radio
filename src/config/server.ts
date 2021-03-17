export default {
	port: parseInt(process.env.PORT ?? "8080"),
	verbose: !!(process.env.VERBOSE ?? false)
};
