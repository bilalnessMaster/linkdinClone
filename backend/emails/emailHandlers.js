import { mailtrapClient, sender } from "../lib/mailtrap.js";
import { createConnectionAcceptedEmailTemplate, createWelcomeEmailTemplate } from "./emailTemplate.js";

export const sendWelcomeEmail = async (email, name, profileUrl) => {
  const recipients = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Welcome to FakeLink",
      html: createWelcomeEmailTemplate(name, profileUrl),
      category: "welcome",
    });
  } catch (error) {
    console.log("error happend while sending welcome email " + error);
  }
};

export const CommentNotificationHanlder = async (
  email,
  recipientName,
  commenterName,
  postUrl,
  content
) => {
  try {
    const recipient = [{ email }];
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "someone commented in your post",
      html: createCommentNotificationEmailTemplate(
        recipientName,
        commenterName,
        postUrl,
        content
      ),
      category: "comments notification",
    });
  } catch (error) {
    console.log("error happend while sending comment notify email " + error);
  }
};

export const sendConnectionAcceptedEmail = async (
  senderEmail,
  senderName,
  recipientName,
  profileUrl
) => {
  try {
    const recipient = [{ email: senderEmail}];
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: `${recipientName} accepted your connection `,
      html: createConnectionAcceptedEmailTemplate(senderName , recipientName , profileUrl) ,
      category: "connection_accepted",
    });
  } catch (error) {
    console.log("error happend while sending comment notify email " + error);
  }
};
