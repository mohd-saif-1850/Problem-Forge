import sendEmail from "saifstack-email";

interface SendMailOptions {
    email: string;
    subject: string;
    layout: string;
}

export const sendMail = async ({
    email,
    subject,
    layout,
}: SendMailOptions): Promise<void> => {
    await sendEmail({
        api: process.env.MAIL_API_KEY || "",
        domainName: process.env.DOMAIN_NAME || "",
        email,
        subject,
        layout,
    });
};