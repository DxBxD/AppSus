import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const loggedinUser = { email: 'mahatma@appsus.com', fullname: 'Mahatma Appsus' }
const MAIL_KEY = 'mailDB'
let gFilterBy = { txt: '', status: 'inbox' }
let gSortBy = { type: 'sentAt', order: true }


_createMails()

export const mailService = {
    query,
    get,
    remove,
    save,
    getNextMailId,
    getFilterBy,
    setFilterBy,
    setSortBy,
    createDraft,
    getUnreadCounts,
    getCurrFilter,
    createNoteDraft
}

window.mailService = mailService


function query() {
    return storageService.query(MAIL_KEY)
        .then(mails => {
            if (gFilterBy.txt) {
                const regex = new RegExp(gFilterBy.txt, 'i')
                mails = mails.filter(mail => regex.test(mail.subject) || regex.test(mail.body))
            }
            if (gFilterBy.status) {
                switch (gFilterBy.status) {
                    case 'inbox':
                        mails = mails.filter(mail => mail.to === loggedinUser.email && mail.isArchived === false && mail.removedAt === null)
                        break
                    case 'starred':
                        mails = mails.filter(mail => mail.isStarred === true && mail.isArchived === false && mail.removedAt === null)
                        break
                    case 'archived':
                        mails = mails.filter(mail => mail.isArchived === true && mail.removedAt === null)
                        break
                    case 'sent':
                        mails = mails.filter(mail => mail.from === loggedinUser.email && mail.sentAt  && mail.isArchived === false && mail.removedAt === null && mail.status !== 'draft')
                        break
                    case 'trash':
                        mails = mails.filter(mail => mail.removedAt !== null)
                        break
                    case 'draft':
                        mails = mails.filter(mail => mail.status === 'draft' && mail.from === loggedinUser.email && mail.isArchived === false && mail.removedAt === null)
                        break
                    case 'label-work':
                        mails = mails.filter(mail => mail.labels && mail.labels.some(label => label.toLowerCase() === 'work') && mail.isArchived === false && mail.removedAt === null)
                        break
                    case 'label-personal':
                        mails = mails.filter(mail => mail.labels && mail.labels.some(label => label.toLowerCase() === 'personal') && mail.isArchived === false && mail.removedAt === null)
                        break
                    case 'label-friends':
                        mails = mails.filter(mail => mail.labels && mail.labels.some(label => label.toLowerCase() === 'friends') && mail.isArchived === false && mail.removedAt === null)
                        break 
                    case 'label-important':
                        mails = mails.filter(mail => mail.labels && mail.labels.some(label => label.toLowerCase() === 'important') && mail.isArchived === false && mail.removedAt === null)
                        break
                    case 'label-spam':
                        mails = mails.filter(mail => mail.labels && mail.labels.some(label => label.toLowerCase() === 'spam') && mail.isArchived === false && mail.removedAt === null)
                        break         
                }
            }
            mails.sort((a, b) => {
                if (gSortBy.type === 'sentAt') {
                    if (a[gSortBy.type] < b[gSortBy.type]) return gSortBy.order ? 1 : -1
                    if (a[gSortBy.type] > b[gSortBy.type]) return gSortBy.order ? -1 : 1
                } else {
                    if (a[gSortBy.type] < b[gSortBy.type]) return gSortBy.order ? -1 : 1
                    if (a[gSortBy.type] > b[gSortBy.type]) return gSortBy.order ? 1 : -1
                }
                return 0
            })
            return mails
        })
}


function get(mailId) {
    return storageService.get(MAIL_KEY, mailId)
}


function remove(mailId) {
    return storageService.remove(MAIL_KEY, mailId)
}


function save(mail) {
    if (mail.id) {
        return storageService.put(MAIL_KEY, mail)
    } else {
        return storageService.post(MAIL_KEY, mail)
    }
}


function getNextMailId(mailId) {
    return storageService.query(MAIL_KEY)
        .then(mails => {
            var idx = mails.findIndex(mail => mail.id === mailId)
            if (idx === mails.length - 1) idx = -1
            return mails[idx + 1].id
        })
}


function getFilterBy() {
    return { ...gFilterBy }
}


function setFilterBy(filterBy = {}) {
    if (filterBy.txt !== undefined) gFilterBy.txt = filterBy.txt
    if (filterBy.status !== undefined) gFilterBy.status = filterBy.status
    return gFilterBy
}


function setSortBy({ type, order }) {
    gSortBy = { type, order }
}


function getUnreadCounts() {
    return storageService.query(MAIL_KEY)
        .then(mails => {
            const unreadCounts = {
                inbox: mails.filter(mail => mail.to === loggedinUser.email && !mail.isRead && mail.isArchived === false && mail.removedAt === null).length,
                starred: mails.filter(mail => mail.isStarred === true && !mail.isRead && mail.isArchived === false && mail.removedAt === null).length,
                sent: mails.filter(mail => mail.from === loggedinUser.email && !mail.isRead && mail.isArchived === false && mail.removedAt === null && mail.status !== 'draft').length,
                draft: mails.filter(mail => mail.status === 'draft' && !mail.isRead && mail.from === loggedinUser.email && mail.isArchived === false && mail.removedAt === null).length
            }
            return unreadCounts
        })
}


function getCurrFilter() {
    return gFilterBy.status
}


function createDraft() {
    const draft = {
        id: utilService.makeId(),
        subject: '',
        body: '',
        isRead: false,
        isStarred: false,
        isArchived: false,
        sentAt: Date.now(),
        status: 'draft',
        removedAt: null,
        from: loggedinUser.email,
        to: '',
        labels: []
    }
    return storageService.postWithId(MAIL_KEY, draft)
}


function createNoteDraft(title, txt) {
    const noteDraft = {
        id: utilService.makeId(),
        subject: title,
        body: txt,
        isRead: false,
        isStarred: false,
        isArchived: false,
        sentAt: Date.now(),
        status: 'draft',
        removedAt: null,
        from: loggedinUser.email,
        to: '',
        labels: []
    }
    return storageService.postWithId(MAIL_KEY, noteDraft)
}


function _createMails() {
    let mails = utilService.loadFromStorage(MAIL_KEY)
    if (!mails || !mails.length) {
        mails = [
            {
                id: utilService.makeId(),
                subject: 'Lunch Invitation',
                body: 'Dear Mahatma, I would like to invite you to a lunch meeting tomorrow. Please let me know if you are available. Best regards, John',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: Date.now(),
                status: 'sent',
                removedAt: null,
                from: 'john@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Personal', 'Friends']
            },
            {
                id: utilService.makeId(),
                subject: 'Important Announcement',
                body: 'Hi there, We have an important announcement to make regarding upcoming changes in our company. Please check your email for further details. Regards, Marketing Team',
                isRead: false,
                isStarred: true,
                isArchived: false,
                sentAt: 1688475453161,
                status: 'sent',
                removedAt: null,
                from: 'marketing@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Important', 'Work']
            },
            {
                id: utilService.makeId(),
                subject: 'Meeting Reminder',
                body: 'Dear Mahatma, This is a reminder for our meeting scheduled for next week. Please make sure to be prepared. Regards, Sarah',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'sarah@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Important', 'Work']
            },
            {
                id: utilService.makeId(),
                subject: 'Job Opportunity',
                body: 'Hi Mahatma, We have a job opening that might interest you. Please check the attached job description and let us know if you are interested. Best regards, HR Department',
                isRead: true,
                isStarred: true,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'hr@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Important', 'Work']
            },
            {
                id: utilService.makeId(),
                subject: 'Vacation Package Offers',
                body: 'Dear Mahatma, Plan your dream vacation with our exclusive offers. Check out the attached brochure for more details. Happy travels! Regards, Travel Agency',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: Date.now() - 30000,
                status: 'sent',
                removedAt: null,
                from: 'travel@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Spam']
            },
            {
                id: utilService.makeId(),
                subject: 'Product Update',
                body: 'Hi there, We have released a new version of our product with exciting features and improvements. Please update your application to enjoy the latest enhancements. Regards, Product Team',
                isRead: true,
                isStarred: true,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'product@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Spam']
            },
            {
                id: utilService.makeId(),
                subject: 'Payment Confirmation',
                body: 'Dear Mahatma, Your payment has been successfully processed. Thank you for your purchase. For any inquiries, please contact our support team. Best regards, Finance Department',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'finance@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Spam']
            },
            {
                id: utilService.makeId(),
                subject: 'Congratulations on Your Achievement!',
                body: 'Dear John, I wanted to congratulate you on your recent achievement. It is well deserved, and I am proud to have you as a colleague. Keep up the great work! Best regards, Mahatma',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'john@example.com',
                labels: ['Friends']
              },
              {
                id: utilService.makeId(),
                subject: 'Meeting Request',
                body: 'Dear Sarah, I would like to request a meeting with you to discuss the upcoming project. Please let me know your availability for next week. Best regards, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'sarah@example.com',
                labels: ['Work']
              },
              {
                id: utilService.makeId(),
                subject: 'Thank You for Your Support',
                body: 'Dear Alex, I wanted to express my gratitude for your continuous support and collaboration. Your contributions have made a significant impact on our team. Thank you! Best regards, Mahatma',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'alex@example.com',
                labels: ['Work']
              },
              {
                id: utilService.makeId(),
                subject: 'Invitation to Company Event',
                body: 'Dear Jessica, You are cordially invited to our company event taking place next month. We would be delighted to have you join us. Please RSVP at your earliest convenience. Best regards, Mahatma',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'jessica@example.com',
                labels: ['Work']
              },
              {
                id: utilService.makeId(),
                subject: 'Project Update',
                body: 'Dear Michael, I wanted to provide you with an update on the progress of our project. We are making great strides and are on track to meet our deadlines. Keep up the excellent work! Best regards, Mahatma',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'michael@example.com',
                labels: ['Work']
              },
              {
                id: utilService.makeId(),
                subject: 'Happy Birthday!',
                body: 'Dear Emily, Wishing you a very happy birthday filled with joy, laughter, and wonderful memories. May this year bring you success and happiness. Best regards, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'emily@example.com',
                labels: ['Friends', 'Personal']
              },
              {
                id: utilService.makeId(),
                subject: 'Request for Feedback',
                body: 'Dear Mark, I hope this email finds you well. I would greatly appreciate it if you could provide feedback on the recent project we collaborated on. Your insights are valuable to me. Thank you in advance! Best regards, Mahatma',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'mark@example.com',
                labels: ['Work', 'Friends']
              },
              {
                id: utilService.makeId(),
                subject: 'Congratulations on Your New Role',
                body: 'Dear Emma, I heard the exciting news about your promotion. Congratulations on your new role! You have worked hard for this opportunity, and I am confident you will excel. Best wishes, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'emma@example.com',
                labels: ['Work', 'Friends']
              },
              {
                id: utilService.makeId(),
                subject: 'Happy Anniversary!',
                body: 'Dear Robert, Today marks another year of your valuable contribution to our organization. Thank you for your dedication and commitment. Happy work anniversary! Best regards, Mahatma',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'robert@example.com',
                labels: ['Work', 'Friends']
              },
              {
                id: utilService.makeId(),
                subject: 'Team Building Event',
                body: 'Dear Jennifer, I am pleased to announce that we will be organizing a team-building event next month. It will be an excellent opportunity for our team to bond and engage in fun activities. Stay tuned for more details! Best regards, Mahatma',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'jennifer@example.com',
                labels: ['Work', 'Friends', 'Important']
              },
              {
                id: utilService.makeId(),
                subject: 'Urgent: Important Meeting',
                body: 'Dear Mahatma, There is an urgent meeting scheduled for tomorrow at 10 AM. Please make sure to attend and come prepared. Best regards, Manager',
                isRead: true,
                isStarred: true,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'manager@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Important', 'Work']
              },
              {
                id: utilService.makeId(),
                subject: 'Congratulations!',
                body: 'Hi Mahatma, Congratulations on your recent achievement! Your hard work and dedication have paid off. Keep up the great work! Regards, Team',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'team@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Friends', 'Personal']
              },
              {
                id: utilService.makeId(),
                subject: 'Holiday Greetings',
                body: 'Dear Mahatma, Wishing you a joyful holiday season filled with love and happiness. Have a wonderful time with your loved ones. Happy holidays! Regards, Friends',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'friends@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Personal', 'Friends']
              },
              {
                id: utilService.makeId(),
                subject: 'Job Interview Invitation',
                body: 'Hello Mahatma, We would like to invite you for an interview for the position you applied for. Please reply to this email with your availability. Regards, HR Department',
                isRead: true,
                isStarred: true,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'hr@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Important', 'Work']
              },
              {
                id: utilService.makeId(),
                subject: 'Important Update: Policy Changes',
                body: 'Dear Mahatma, We have made some important updates to our company policies. Please review the attached document and let us know if you have any questions. Regards, Compliance Team',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'compliance@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Important', 'Work']
              },
              {
                id: utilService.makeId(),
                subject: 'Weekly Newsletter',
                body: 'Hi there, Here is our weekly newsletter with the latest news, updates, and special offers. Enjoy reading! Regards, Newsletter Team',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'newsletter@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Spam']
              },
              {
                id: utilService.makeId(),
                subject: 'New Job Opening',
                body: 'Dear Mahatma, We have a new job opening that matches your skills and experience. Please check the attached job description and apply if you are interested. Best regards, Recruitment Team',
                isRead: true,
                isStarred: true,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'recruitment@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Important', 'Work']
              },
              {
                id: utilService.makeId(),
                subject: 'Birthday Surprise',
                body: 'Happy Birthday, Mahatma! We have a special surprise waiting for you. Visit our store and show this email to claim your birthday gift. Best wishes, Store Team',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'store@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Spam']
              },
              {
                id: utilService.makeId(),
                subject: 'New Feature Announcement',
                body: 'Hi Mahatma, We are excited to announce a new feature that has been added to our app. Upgrade to the latest version to enjoy the enhanced functionality. Regards, Development Team',
                isRead: true,
                isStarred: true,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'development@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Spam']
              },
              {
                id: utilService.makeId(),
                subject: 'Important Reminder: Tax Filing',
                body: 'Dear Mahatma, This is a friendly reminder that the deadline for filing your taxes is approaching. Make sure to submit your tax return by the due date. Regards, Finance Department',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'finance@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Spam']
              },
              {
                id: utilService.makeId(),
                subject: 'Funny Cat Video',
                body: 'Hey there, I stumbled upon this hilarious cat video and thought you might enjoy it. Check it out!',
                isRead: true,
                isStarred: true,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'catlover@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Friends']
              },
              {
                id: utilService.makeId(),
                subject: 'Discount Coupon',
                body: 'Dear Mahatma, We have a special offer for you! Use the coupon code "SAVEMONEY" to get a 50% discount on your next purchase.',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'marketing@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Spam']
              },
              {
                id: utilService.makeId(),
                subject: 'Discount Coupon',
                body: 'Dear Mahatma, We have a special offer for you! Use the coupon code "SAVEMONEY" to get a 50% discount on your next purchase.',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'marketing@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Spam']
              },
              {
                id: utilService.makeId(),
                subject: 'Win a Free Vacation',
                body: 'Congratulations! You have been selected as a lucky winner of our grand prize. Click here to claim your free vacation package.',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'lottery@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Spam']
              },
              {
                id: utilService.makeId(),
                subject: 'Unbelievable Investment Opportunity',
                body: 'Hello, I have a once-in-a-lifetime investment opportunity that guarantees massive returns. Don\'t miss out on this chance to become a millionaire!',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'investment@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Spam']
              },
              {
                id: utilService.makeId(),
                subject: 'Enlarge Your... You Know',
                body: 'Hey there, Are you looking for a way to enhance your... you know what? We have the solution you\'ve been waiting for. Click here for more details.',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'enlargement@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Spam']
              },
              {
                id: utilService.makeId(),
                subject: 'Make Money Fast!',
                body: 'Hi, Discover the secret to making money fast and easy. Join our exclusive program and start earning thousands of dollars within days.',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'makemoney@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Spam']
              },
              {
                id: utilService.makeId(),
                subject: 'Get Rid of Debt',
                body: 'Dear Mahatma, Struggling with debt? Our proven method will help you eliminate debt quickly and effortlessly. Take control of your finances today!',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'debtfree@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Spam']
              },
              {
                id: utilService.makeId(),
                subject: 'You\'ve Won a Prize',
                body: 'Congratulations, Mahatma! You have won a fabulous prize. Claim your reward now by clicking the link below. Don\'t miss out on this amazing opportunity!',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'prizewinner@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Spam']
              },
              {
                id: utilService.makeId(),
                subject: 'Exclusive Limited-Time Offer',
                body: 'Hello, We are offering an exclusive limited-time deal that you can\'t resist. Don\'t waste any more time and take advantage of this incredible offer now!',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'exclusiveoffer@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Spam']
              },
              {
                id: utilService.makeId(),
                subject: 'Secret Recipe',
                body: 'Hi there, I heard you are a food enthusiast. I am sharing my secret recipe for a delicious chocolate cake. Enjoy!',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'baker@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Friends', 'Personal']
              },
              {
                id: utilService.makeId(),
                subject: 'Weekend Plans',
                body: 'Hey Mahatma, I hope you\'re doing well. Let\'s plan something exciting for the upcoming weekend. I have a few ideas in mind. Let me know your thoughts.',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'martha@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Friends', 'Personal']
              },
              {
                id: utilService.makeId(),
                subject: 'Recipe Exchange',
                body: 'Hi Mahatma, I recently discovered a delicious recipe for homemade pizza. I thought you might be interested in trying it out. Let me know if you want me to share the details with you!',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'foodie@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Friends', 'Personal']
              },
              {
                id: utilService.makeId(),
                subject: 'Weekend Getaway',
                body: 'Hey Mahatma, How about planning a weekend getaway to the beach? We can relax, enjoy the sun, and have some quality time together. Let me know your thoughts!',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'emma@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Friends', 'Personal']
              },
              {
                id: utilService.makeId(),
                subject: 'Book Recommendation',
                body: 'Hi Mahatma, I just finished reading an incredible book that I think you would love. It has a gripping storyline and unforgettable characters. Let me know if you want me to lend it to you!',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'booklover@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Friends', 'Personal']
              },
              {
                id: utilService.makeId(),
                subject: 'Music Playlist',
                body: 'Hey there, I created a new playlist with some amazing songs. It includes a mix of different genres. Let me know if you want me to share it with you!',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'musiclover@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Friends', 'Personal']
              },
              {
                id: utilService.makeId(),
                subject: 'Movie Night',
                body: 'Hi Mahatma, I thought it would be fun to have a movie night this weekend. We can pick a few movies, grab some snacks, and enjoy a cozy evening. Let me know if you\'re interested!',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'movielover@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Friends', 'Personal']
              },
              {
                id: utilService.makeId(),
                subject: 'Fitness Challenge',
                body: 'Hey Mahatma, I\'m starting a fitness challenge and thought you might want to join. We can motivate each other and work towards our fitness goals. Let me know if you\'re up for it!',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'fitnessenthusiast@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Friends', 'Personal']
              },
              {
                id: utilService.makeId(),
                subject: 'Art Exhibition',
                body: 'Hi Mahatma, There\'s an art exhibition happening in town, and I think you would appreciate the artwork. Let me know if you\'d like to go together and explore the creative world!',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'artlover@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Friends', 'Personal']
              },
              {
                id: utilService.makeId(),
                subject: 'Travel Tips',
                body: 'Hey there, I recently went on a fantastic trip and gathered some useful travel tips. If you\'re planning any upcoming trips, I\'d be happy to share my insights with you!',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'travelenthusiast@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Friends', 'Personal']
              },
              {
                id: utilService.makeId(),
                subject: 'Upcoming Party',
                body: 'Dear Mahatma, You are invited to an amazing party next week. Get ready for a night of fun, music, and good company. Don\'t miss out!',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'bob@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Friends', 'Personal']
              },
              {
                id: utilService.makeId(),
                subject: 'Interesting Article',
                body: 'Hi Mahatma, I came across an interesting article that I think you will find valuable. It\'s about the latest trends in technology. Check it out!',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'jerry@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Friends', 'Personal']
              },
              {
                id: utilService.makeId(),
                subject: 'Movie Recommendation',
                body: 'Hey there, I just watched an amazing movie that I think you would enjoy. It has great reviews and a captivating storyline. Let me know if you want more details.',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'alice@example.com',
                to: 'mahatma@appsus.com',
                labels: ['Friends', 'Personal']
              },
              {
                id: utilService.makeId(),
                subject: 'Important Announcement - Urgent!',
                body: 'Dear Team, I have an important announcement that requires immediate attention. Please read the attached document and take necessary actions accordingly. This is time-sensitive. Best regards, Mahatma',
                isRead: false,
                isStarred: true,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: ['Work', 'Important']
              },
              {
                id: utilService.makeId(),
                subject: 'Request for Assistance',
                body: 'Dear Colleagues, I am seeking your assistance in resolving a critical issue that has arisen. Your expertise in this matter would be greatly appreciated. Please let me know if you can provide support. Thank you in advance. Best regards, Mahatma',
                isRead: true,
                isStarred: true,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'colleagues@example.com',
                labels: ['Work', 'Important']
              },
              {
                id: utilService.makeId(),
                subject: 'Upcoming Deadline',
                body: 'Dear Team, I would like to remind everyone about the upcoming deadline for the project. Please ensure that all tasks are completed and submitted on time. Let\'s work together to deliver a successful outcome. Best regards, Mahatma',
                isRead: false,
                isStarred: true,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: ['Work', 'Important']
              },
              {
                id: utilService.makeId(),
                subject: 'Training Session Announcement',
                body: 'Dear Team, I am excited to announce a training session scheduled for next week. This session will provide valuable insights and enhance our skills. Please make sure to mark your calendars and come prepared. Best regards, Mahatma',
                isRead: false,
                isStarred: true,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: ['Work', 'Important']
              },
              {
                id: utilService.makeId(),
                subject: 'Customer Feedback Appreciation',
                body: 'Dear Team, I want to express my appreciation for the positive customer feedback we have received lately. Your dedication and commitment to delivering exceptional service have not gone unnoticed. Keep up the fantastic work! Best regards, Mahatma',
                isRead: true,
                isStarred: true,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: ['Work', 'Important']
              },
              {
                id: utilService.makeId(),
                subject: 'Team Recognition',
                body: 'Dear Team, I would like to recognize the outstanding achievements of our team. Each member\'s contributions have been remarkable, and I am grateful to have such talented individuals on board. Thank you for your hard work and dedication. Best regards, Mahatma',
                isRead: false,
                isStarred: true,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: ['Work']
              },
              {
                id: utilService.makeId(),
                subject: 'Conference Invitation',
                body: 'Dear Team, I am pleased to invite you to attend an upcoming industry conference. This event will provide valuable insights and networking opportunities. Please let me know if you are interested in attending. Best regards, Mahatma',
                isRead: true,
                isStarred: true,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: ['Work']
              },
              {
                id: utilService.makeId(),
                subject: 'Project Milestone Achievement',
                body: 'Dear Team, Congratulations on reaching a significant milestone in the project. This achievement demonstrates our collective efforts and dedication. Let\'s continue to strive for excellence as we move forward. Best regards, Mahatma',
                isRead: true,
                isStarred: true,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: ['Work']
              },
              {
                id: utilService.makeId(),
                subject: 'Company-wide Town Hall Meeting',
                body: 'Dear All, I would like to invite each and every one of you to a company-wide town hall meeting. This will be an opportunity to share important updates and address any questions or concerns. Your presence is highly encouraged. Best regards, Mahatma',
                isRead: false,
                isStarred: true,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'all@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Appreciation for Team Collaboration',
                body: 'Dear Team, I wanted to express my heartfelt appreciation for the exceptional collaboration displayed during the recent project. The collective effort and teamwork were instrumental in achieving our goals. Thank you for your dedication and professionalism. Best regards, Mahatma',
                isRead: true,
                isStarred: true,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Reminder: Team Building Activity',
                body: 'Dear Team, Just a friendly reminder about the team building activity scheduled for this weekend. It\'s going to be a fun and exciting event, so make sure to join us. Looking forward to seeing everyone there! Best regards, Mahatma',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: 1688475453161,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Holiday Schedule Announcement',
                body: 'Dear Team, I would like to inform you about the upcoming holiday schedule. Please refer to the attached document for details regarding office closures and working hours. If you have any questions, feel free to reach out. Best regards, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: 1628575453161,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'New Employee Onboarding',
                body: 'Dear Team, We have a new employee joining our team next week. I kindly request your assistance in providing a warm welcome and helping them settle in. Let\'s make sure they feel part of our family. Best regards, Mahatma',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: 1628575453161,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Important System Maintenance',
                body: 'Dear Team, We will be performing a critical system maintenance next week. As a result, there might be temporary disruptions in service. Please plan your tasks accordingly and ensure minimal impact to our clients. Best regards, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: 1628575453161,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Company Event: Save the Date!',
                body: 'Dear Team, We are excited to announce a company-wide event scheduled for next month. Please save the date and stay tuned for more information. It\'s going to be an amazing gathering, and we look forward to celebrating together. Best regards, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: 1628575453161,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Training Program Enrollment',
                body: 'Dear Team, Our organization is offering a comprehensive training program to enhance our skills and knowledge. I encourage each of you to enroll in the courses that align with your development goals. Let\'s continue to grow together. Best regards, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: 1628575453161,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Project Update: Milestone Achieved',
                body: 'Dear Team, I am thrilled to share that we have achieved a significant milestone in our project. This progress reflects our collective efforts and dedication. Let\'s maintain the momentum as we work towards the next milestones. Best regards, Mahatma',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: 1628575453161,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Performance Evaluation Reminder',
                body: 'Dear Team, This is a gentle reminder to complete your performance self-evaluations by the specified deadline. Your feedback is crucial in assessing our progress and identifying areas for growth. Thank you for your cooperation. Best regards, Mahatma',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: 1628575453161,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Team Outing: RSVP Required',
                body: 'Dear Team, We have organized a team outing to celebrate our recent achievements. Kindly RSVP by the provided deadline so we can finalize the arrangements. It\'s going to be an enjoyable day of bonding and relaxation. Best regards, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: Date.now() - 150000,
                status: 'sent',
                removedAt: 1628575453161,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'New Company Policies',
                body: 'Dear Team, I would like to inform you about the new company policies that have been implemented. Please review the attached document and familiarize yourselves with the updated guidelines. Should you have any questions, don\'t hesitate to reach out. Best regards, Mahatma',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: 1628575453161,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Job Application Confirmation',
                body: 'Dear Mahatma, Thank you for submitting your job application. We have received your documents and will review them shortly. If you are shortlisted, we will contact you for further steps in the hiring process. Best regards, HR Department',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: 1688475453161,
                from: 'hr@example.com',
                to: 'mahatma@appsus.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Product Feedback',
                body: 'Dear Mahatma, We appreciate your valuable feedback on our product. Your input plays a crucial role in shaping our future developments. Thank you for taking the time to share your thoughts with us. Best regards, Product Team',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: 1628575453161,
                from: 'product@example.com',
                to: 'mahatma@appsus.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Conference Invitation',
                body: 'Dear Mahatma, We would like to invite you as a guest speaker at our upcoming conference. Your expertise and insights would greatly benefit the audience. Please let us know if you are available and interested in participating. Best regards, Event Organizer',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: 1628575453161,
                from: 'event@example.com',
                to: 'mahatma@appsus.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Project Deadline Extension',
                body: 'Dear Mahatma, Due to unforeseen circumstances, we need to extend the deadline for our project. This will provide us with additional time to deliver a high-quality outcome. Please adjust your schedule accordingly. Best regards, Project Manager',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: 1628575453161,
                from: 'pm@example.com',
                to: 'mahatma@appsus.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Collaboration Request',
                body: 'Dear Mahatma, I have been following your work closely and would like to propose a collaboration opportunity. I believe our combined efforts can result in something remarkable. If you are interested, let\'s schedule a meeting to discuss further details. Best regards, Fellow Professional',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: 1628575453161,
                from: 'collaborator@example.com',
                to: 'mahatma@appsus.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Training Workshop Enrollment',
                body: 'Dear Mahatma, We are pleased to inform you that your application for the training workshop has been approved. Please find the attached schedule and materials for the sessions. We look forward to your active participation. Best regards, Training Department',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: 1628575453161,
                from: 'training@example.com',
                to: 'mahatma@appsus.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Project Collaboration Proposal',
                body: 'Dear Mahatma, We have an exciting project proposal that we believe aligns with your expertise. Your involvement would greatly contribute to its success. We would love to discuss the details further. Let us know your availability for a meeting. Best regards, Project Team',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: 1628575453161,
                from: 'projectteam@example.com',
                to: 'mahatma@appsus.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Request for Information',
                body: 'Dear Mahatma, I am conducting research on a topic that aligns with your area of expertise. Would you be available for a brief interview or to provide some information regarding the subject? Your insights would be valuable for my study. Best regards, Researcher',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: 1628575453161,
                from: 'researcher@example.com',
                to: 'mahatma@appsus.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Invitation to Webinar',
                body: 'Dear Mahatma, We invite you to attend our upcoming webinar on the latest industry trends. It promises to be an informative session with renowned speakers. Register now to secure your spot. Best regards, Webinar Organizer',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: 1628575453161,
                from: 'webinar@example.com',
                to: 'mahatma@appsus.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Thank You for Speaking at the Event',
                body: 'Dear Mahatma, On behalf of the organizing committee, we would like to express our heartfelt gratitude for your captivating speech at our recent event. Your insights left a lasting impact on the audience. We hope to collaborate again in the future. Best regards, Event Organizer',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: 1628575453161,
                from: 'event@example.com',
                to: 'mahatma@appsus.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Project Update',
                body: 'Dear Mahatma, I wanted to provide you with an update on the project we are working on. We have made significant progress and are on track to meet the deadline. If you have any questions or require further information, please let me know. Best regards, Project Manager',
                isRead: true,
                isStarred: false,
                isArchived: true,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'pm@example.com',
                to: 'mahatma@appsus.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Important Announcement',
                body: 'Hi Mahatma, We have an important announcement to make regarding the upcoming company-wide meeting. Please refer to the attached document for further details. Regards, HR Department',
                isRead: false,
                isStarred: false,
                isArchived: true,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'hr@example.com',
                to: 'mahatma@appsus.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Collaboration Proposal',
                body: 'Dear Mahatma, I have been following your work and believe that our collaboration can lead to great results. I have attached a proposal outlining the potential project and its benefits. I look forward to hearing your thoughts on this. Best regards, Fellow Professional',
                isRead: true,
                isStarred: true,
                isArchived: true,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'collaborator@example.com',
                to: 'mahatma@appsus.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Vacation Request Approval',
                body: 'Dear Mahatma, Your vacation request has been approved. Enjoy your time off and make the most of it. If there are any urgent matters that require your attention, please let me know in advance. Best regards, Manager',
                isRead: true,
                isStarred: false,
                isArchived: true,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'manager@example.com',
                to: 'mahatma@appsus.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Invitation to Webinar',
                body: 'Dear Mahatma, We invite you to attend our upcoming webinar on the latest industry trends. It promises to be an informative session with renowned speakers. Register now to secure your spot. Best regards, Webinar Organizer',
                isRead: true,
                isStarred: false,
                isArchived: true,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'webinar@example.com',
                to: 'mahatma@appsus.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Meeting Rescheduled',
                body: 'Dear Mahatma, Due to unforeseen circumstances, we need to reschedule the meeting that was planned for tomorrow. The new date and time are mentioned in the attached calendar invitation. Apologies for any inconvenience caused. Best regards, Organizer',
                isRead: false,
                isStarred: false,
                isArchived: true,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'organizer@example.com',
                to: 'mahatma@appsus.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Feedback Request',
                body: 'Dear Mahatma, Your feedback is highly valuable to us. We would appreciate it if you could take a few moments to complete the attached survey. Your inputs will help us improve our products and services. Thank you in advance. Best regards, Customer Support',
                isRead: false,
                isStarred: false,
                isArchived: true,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'support@example.com',
                to: 'mahatma@appsus.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'New Job Opening',
                body: 'Hi Mahatma, We have a new job opening in our organization that matches your skillset. I encourage you to apply and explore this exciting opportunity. Attached is the job description for your reference. Best regards, HR Department',
                isRead: false,
                isStarred: true,
                isArchived: true,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'hr@example.com',
                to: 'mahatma@appsus.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Workshop Registration Confirmation',
                body: 'Dear Mahatma, Your registration for the upcoming workshop has been confirmed. We look forward to your participation and contribution to the event. If you have any questions or require additional information, please let us know. Best regards, Workshop Organizer',
                isRead: true,
                isStarred: true,
                isArchived: true,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'workshop@example.com',
                to: 'mahatma@appsus.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Project Proposal Review',
                body: 'Dear Mahatma, I have reviewed the project proposal you submitted and I must say it is impressive. Let\'s schedule a meeting to discuss it further and address any questions or concerns. Well done on putting together such a comprehensive plan. Best regards, Project Manager',
                isRead: false,
                isStarred: true,
                isArchived: true,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'pm@example.com',
                to: 'mahatma@appsus.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Newsletter Subscription Confirmation',
                body: 'Dear Mahatma, Thank you for subscribing to our newsletter. We will keep you informed about the latest updates, offers, and news in your field of interest. If you wish to unsubscribe at any time, please let us know. Best regards, Newsletter Team',
                isRead: true,
                isStarred: false,
                isArchived: true,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'newsletter@example.com',
                to: 'mahatma@appsus.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Thank You Note',
                body: 'Dear Team, I wanted to express my gratitude for the outstanding work everyone has put into the recent project. Your dedication and commitment have been exceptional. Keep up the great work! Best regards, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: true,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Meeting Follow-up',
                body: 'Hi Team, I just wanted to follow up on the important points discussed in our meeting yesterday. Attached is a summary of the key decisions and action items. Let me know if you have any questions. Regards, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: true,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Holiday Greetings',
                body: 'Dear Team, As the holiday season approaches, I would like to take a moment to extend my warmest wishes to each and every one of you. May this festive season bring joy, happiness, and success in all your endeavors. Happy holidays! Best regards, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: true,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Appreciation Note',
                body: 'Dear Team, I wanted to express my sincere appreciation for the remarkable effort and dedication you have shown in completing the recent project. Your hard work and commitment have not gone unnoticed. Thank you for your outstanding contributions. Best regards, Mahatma',
                isRead: false,
                isStarred: true,
                isArchived: true,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: ['Important']
              },
              {
                id: utilService.makeId(),
                subject: 'Important Announcement',
                body: 'Dear Team, I have an important announcement to make regarding the upcoming company event. Please read the attached document carefully for all the details. If you have any questions or concerns, feel free to reach out to me. Best regards, Mahatma',
                isRead: true,
                isStarred: true,
                isArchived: true,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: ['Important']
              },
              {
                id: utilService.makeId(),
                subject: 'Project Milestone Achieved',
                body: 'Hi Team, I am thrilled to announce that we have successfully achieved a major milestone in the project. This accomplishment is a testament to our teamwork and dedication. Let\'s keep up the momentum and continue delivering excellent results. Congratulations to everyone! Best regards, Mahatma',
                isRead: true,
                isStarred: true,
                isArchived: true,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: ['Important']
              },
              {
                id: utilService.makeId(),
                subject: 'Training Workshop Invitation',
                body: 'Dear Team, I would like to invite you to a training workshop that will enhance your skills and knowledge in our field. It is a valuable opportunity to grow professionally. Please find the workshop details in the attached invitation. Regards, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: true,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: ['Important']
              },
              {
                id: utilService.makeId(),
                subject: 'New Employee Introduction',
                body: 'Dear Team, I am delighted to introduce our newest team member, John Doe. John brings a wealth of experience and expertise to our team. Please join me in welcoming John and making him feel part of our team. Best regards, Mahatma',
                isRead: false,
                isStarred: true,
                isArchived: true,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: ['Important']
              },
              {
                id: utilService.makeId(),
                subject: 'Team Building Event',
                body: 'Hi Team, In order to foster team spirit and enhance collaboration, we will be organizing a team-building event next week. Details regarding the event and the activities planned are provided in the attached document. Let\'s have a great time together! Best regards, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: true,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: ['Important']
              },
              {
                id: utilService.makeId(),
                subject: 'Employee Recognition',
                body: 'Dear Team, I would like to take a moment to recognize and appreciate the exceptional work done by each member of our team. Your dedication and passion for excellence are truly commendable. Thank you for your valuable contributions. Best regards, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: true,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'sent',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: ['Important']
              },
              {
                id: utilService.makeId(),
                subject: 'Project Proposal',
                body: 'Dear Team, I am working on a project proposal that outlines our plan for the upcoming quarter. I would appreciate your feedback and suggestions. Once finalized, we can proceed with the implementation. Best regards, Mahatma',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'draft',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: ['Important']
              },
              {
                id: utilService.makeId(),
                subject: 'Client Meeting Agenda',
                body: 'Hi Team, I am preparing the agenda for our upcoming client meeting. If you have any topics or updates to be included, please let me know as soon as possible. Thank you. Regards, Mahatma',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'draft',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: ['Important']
              },
              {
                id: utilService.makeId(),
                subject: 'Website Redesign Proposal',
                body: 'Dear Team, I have been working on a proposal for redesigning our company website. I would like your input on the design and functionality aspects. Let\'s schedule a meeting to discuss it further. Best regards, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'draft',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Team Training Plan',
                body: 'Hi Team, I have been working on a training plan to enhance our team\'s skills and knowledge. I would like to review it with you all before finalizing it. Your input and suggestions are valuable. Regards, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'draft',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Marketing Campaign Ideas',
                body: 'Dear Team, I have been brainstorming some creative marketing campaign ideas. Let\'s collaborate and come up with an impactful campaign strategy. Feel free to share your thoughts and suggestions. Best regards, Mahatma',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'draft',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'New Product Proposal',
                body: 'Hi Team, I am working on a proposal for a new product that could potentially expand our market reach. Please review the attached document and provide your insights. Let\'s discuss it in our next meeting. Regards, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'draft',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Conference Speaker Invitation',
                body: 'Dear Speaker, I am delighted to invite you as a keynote speaker for our upcoming conference. I believe your expertise and insights will greatly benefit our attendees. Please review the attached invitation and let me know your availability. Best regards, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'draft',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'speaker@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Project Timeline Adjustment',
                body: 'Hi Team, I have made some adjustments to the project timeline based on recent discussions and feedback. Please review the updated timeline and provide your input. Let\'s ensure we are aligned on the project schedule. Regards, Mahatma',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'draft',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Quarterly Sales Report',
                body: 'Dear Team, I am compiling the quarterly sales report to analyze our performance and identify areas for improvement. Your input and sales data are crucial for an accurate report. Please submit your data by the end of the week. Regards, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'draft',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Project Collaboration',
                body: 'Dear Team, I have a new project idea that requires collaboration from multiple departments. I would appreciate your input and suggestions on this initiative. Let\'s schedule a meeting to discuss further. Regards, Mahatma',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'draft',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Marketing Campaign Evaluation',
                body: 'Hi Team, I need your help in evaluating the success of our latest marketing campaign. Please review the campaign data and share your analysis. Let\'s meet next week to discuss the findings. Regards, Mahatma',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'draft',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Training Workshop Registration',
                body: 'Dear Team, I have found an upcoming training workshop that aligns with our team\'s skill development goals. Please review the attached brochure and let me know if you are interested in attending. Regards, Mahatma',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'draft',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Project Milestone Update',
                body: 'Hi Team, I would like to provide an update on the project milestones. There have been some adjustments based on recent progress. Please review the updated milestones and let me know if you have any concerns. Regards, Mahatma',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'draft',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Client Meeting Follow-Up',
                body: 'Dear Team, Thank you for your participation in the client meeting. I have compiled the meeting minutes and action items. Please review them and let me know if anything needs to be adjusted before sharing them with the client. Regards, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'draft',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Team Building Event',
                body: 'Hi Team, I am organizing a team-building event to foster collaboration and strengthen our bonds. Please provide your availability and suggestions for the event. Let\'s make it an enjoyable experience for everyone. Regards, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'draft',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Marketing Material Review',
                body: 'Dear Team, I have created some marketing materials for an upcoming campaign. I would appreciate your feedback and suggestions before finalizing them. Please review the attached documents and share your thoughts. Regards, Mahatma',
                isRead: false,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'draft',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Product Enhancement Proposal',
                body: 'Hi Team, I have identified some areas where our product can be enhanced to meet customer demands. Please review the proposal and provide your suggestions. Let\'s make our product even better. Regards, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: utilService.generateRandomTimestamp(),
                status: 'draft',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Quarterly Budget Allocation',
                body: 'Dear Team, I am in the process of allocating the budget for the upcoming quarter. Please review the budget proposal and let me know if you have any adjustments or additional requirements. Regards, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: Date.now() - 8000000,
                status: 'draft',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'team@example.com',
                labels: []
              },
              {
                id: utilService.makeId(),
                subject: 'Conference Participation Confirmation',
                body: 'Dear Conference Organizer, I would like to confirm my participation as a speaker at the upcoming conference. Please let me know if there are any additional details or requirements. Looking forward to the event. Regards, Mahatma',
                isRead: true,
                isStarred: false,
                isArchived: false,
                sentAt: Date.now() - 14000000,
                status: 'draft',
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'organizer@example.com',
                labels: []
              },

        ]
        utilService.saveToStorage(MAIL_KEY, mails)
    }
}