import { Mail } from "./email";

const welcomeEmail = `
Welcome to <strong>GCS Radio</strong>
<br /><br />
A project built entirely by me, <a href="https://bw.codexwilkes.com/portfolio/">Brennan</a>!
<br /><br />
To get started, go to the <a href="https://gcs-radio.494913.xyz/">dashboard</a>.
<br /><br />
GCS Radio is entirely open-source, so if you want to deploy it yourself, contribute ideas, report bugs, or just check out the code, feel free to check out the <a href="https://gitlab.com/brennanwilkes/gcs-radio">GIT repo</a>.
<br /><br />
Thanks for checking GCS Radio out!
<br /><br />
Brennan
`;

export default function (email: string): Mail {
	return {
		email: email,
		subject: `Welcome to GCS Radio`,
		message: welcomeEmail,
		htmlEnable: true
	};
}
