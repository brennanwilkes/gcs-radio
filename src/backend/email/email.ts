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
	if (process.env.SENDGRID_API_KEY) {
		sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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
		reject(new Error("SENDGRID_API_KEY not set!"));
	}
});
/* eslint-enable @typescript-eslint/ban-types */

export default MailServiceObj;

export function fireAndForgetMail (mail: Mail): void {
	MailServiceObj.then(({ send }) => {
		send(mail).catch(print);
	}).catch(print);
}
