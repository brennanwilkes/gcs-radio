import sgMail from "@sendgrid/mail";
import { ClientResponse } from "@sendgrid/client/src/response";
import { CONFIG, print } from "../util/util";

export interface Mail{
	email: string,
	subject: string,
	message: string,
	htmlEnable?: boolean
}
/* eslint-disable @typescript-eslint/ban-types */
export interface MailService{
	send: (mail: Mail) => Promise<[ClientResponse, {}]>;
	fromEmail: string;
}

const MailServiceObj = new Promise<MailService>((resolve, reject) => {
	if (CONFIG.emailApiKey) {
		sgMail.setApiKey(CONFIG.emailApiKey);
		resolve({
			fromEmail: CONFIG.fromEmail,
			send: ({ email, subject, message, htmlEnable = false }) => {
				return new Promise<[ClientResponse, {}]>((resolve, reject) => {
					const msg = {
						to: email,
						from: CONFIG.fromEmail,
						subject: subject,
						text: htmlEnable ? " " : message,
						html: htmlEnable ? message : " "
					};
					sgMail.send(msg).then(resolve).catch(reject);
				});
			}
		});
	} else {
		reject(new Error("SENDGRID API KEY not set!"));
	}
});
/* eslint-enable @typescript-eslint/ban-types */

export default MailServiceObj;

export function fireAndForgetMail (mail: Mail): void {
	MailServiceObj.then(({ send }) => {
		send(mail).then(() => {
			print(`${mail.subject} sent to ${mail.email}`);
		}).catch(print);
	}).catch(print);
}
