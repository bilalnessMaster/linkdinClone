import { mailtrapClient, sender } from "../lib/mailtrap.js"
import { createWelcomeEmailTemplate } from "./emailTemplate.js";



export const sendWelcomeEmail = async (email, name , profileUrl) =>{
    const recipients = [{email}]
    try {
    const response  = await mailtrapClient.send({
        from : sender , 
        to : recipients,
        subject : "Welcome to FakeLink", 
        html : createWelcomeEmailTemplate(name, profileUrl),
        category :"welcome"
    })
    } catch (error) {
        console.log('error happend while sending welcome email '+error);
        
    }
}