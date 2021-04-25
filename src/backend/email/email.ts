import sgMail from "@sendgrid/mail";
import { CONFIG, print } from "../util/util";
import logger from "../logging/logger";

export interface Mail{
	email: string,
	subject: string,
	message: string,
	htmlEnable?: boolean
}
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface MailService{
	send: (mail: Mail) => Promise<[any, {}]>;
	fromEmail: string;
}

// Abstracted, easy to use mail service
const MailServiceObj = new Promise<MailService>((resolve, reject) => {
	if (CONFIG.emailApiKey) {
		sgMail.setApiKey(CONFIG.emailApiKey);
		resolve({
			fromEmail: CONFIG.fromEmail,
			send: ({ email, subject, message, htmlEnable = false }) => {
				return new Promise<[any, {}]>((resolve, reject) => {
					const msg = {
						to: email,
						from: CONFIG.fromEmail,
						subject: subject,
						text: htmlEnable ? " " : message,
						html: htmlEnable ? message : " "
					};
					logger.logEmail(subject, email);
					sgMail.send(msg).then(resolve).catch(reject);
				});
			}
		});
	} else {
		reject(new Error("SENDGRID API KEY not set!"));
	}
});
/* eslint-enable @typescript-eslint/ban-types */
/* eslint-enable @typescript-eslint/no-explicit-any */

export default MailServiceObj;

// Obsorbs exceptions to avoid warnings
export function fireAndForgetMail (mail: Mail): void {
	MailServiceObj.then(({ send }) => {
		send(mail).then(() => {
			print(`${mail.subject} sent to ${mail.email}`);
		}).catch(print);
	}).catch(print);
}
