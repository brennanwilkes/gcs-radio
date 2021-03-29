import { Mail } from "./email";

const baseDomain = "gcs-radio.494913.xyz";

const welcomeEmail = (id?: string) => `
Welcome to <strong>GCS Radio</strong>
<br /><br />
A project built entirely by me, <a href="https://bw.codexwilkes.com/portfolio/">Brennan</a>!
${
	id
		? `<br /><br />
	To verify your email, please go to: <a href="https://${baseDomain}/auth/${id}">"https://${baseDomain}/auth/${id}</a>
	`
		: ""
}
<br /><br />
Then to get started, go to the <a href="https://${baseDomain}/">dashboard</a>.
<br /><br />
GCS Radio is entirely open-source, so if you want to deploy it yourself, contribute ideas, report bugs, or just check out the code, feel free to check out the <a href="https://gitlab.com/brennanwilkes/gcs-radio">GIT repo</a>.
<br /><br />
Thanks for checking GCS Radio out!
<br /><br />
Brennan
`;

export default function (email: string, verifyId?: string): Mail {
	return {
		email: email,
		subject: `Welcome to GCS Radio`,
		message: welcomeEmail(verifyId),
		htmlEnable: true
	};
}
