import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const loggedinUser = { email: 'mahatma@appsus.com', fullname: 'Mahatma Appsus' }
const MAIL_KEY = 'mailDB'
var gFilterBy = { txt: '', status: 'inbox' }

_createMails()

export const mailService = {
    query,
    get,
    remove,
    save,
    getNextMailId,
    getFilterBy,
    setFilterBy,
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
          switch(gFilterBy.status) {
            case 'inbox':
                mails = mails.filter(mail => mail.to === loggedinUser.email && mail.removedAt === null)
                break
            case 'starred':
                mails = mails.filter(mail => mail.isStarred === true)
                break
            case 'sent':
                mails = mails.filter(mail => mail.from === loggedinUser.email && mail.sentAt)
                break
            case 'trash':
                mails = mails.filter(mail => mail.removedAt !== null)
                break
            case 'draft':
                mails = mails.filter(mail => mail.from === loggedinUser.email && mail.sentAt === null)
                break
          }
        }
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

  function _createMails() {
    let mails = utilService.loadFromStorage(MAIL_KEY)
    if (!mails || !mails.length) {
        mails = [
            { 
                id: utilService.makeId(), 
                subject: 'Welcome!', 
                body: 'Welcome to our new mail app!', 
                isRead: false,
                isStarred: true,
                sentAt: Date.now(), 
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'test@test.com'
            },
            { 
                id: utilService.makeId(), 
                subject: 'Hello!', 
                body: 'Hello world!', 
                isRead: false,
                isStarred: false,
                sentAt: 1688475453161, 
                removedAt: null,
                from: 'test@test.com',
                to: 'mahatma@appsus.com'
            },
            {
                id: utilService.makeId(), 
                subject: 'Draft Email', 
                body: 'This is a draft email.', 
                isRead: false,
                isStarred: false,
                sentAt: null, 
                removedAt: null,
                from: 'mahatma@appsus.com',
                to: 'test@test.com'
            },
            {
                id: utilService.makeId(), 
                subject: 'Trashed Email', 
                body: 'This is a trashed email.', 
                isRead: false,
                isStarred: false,
                sentAt: 1628575453161, 
                removedAt: 1628575453161,
                from: 'test@test.com',
                to: 'mahatma@appsus.com'
            },
            {
                id: utilService.makeId(),
                subject: 'Lunch Invitation',
                body: 'Dear Mahatma, I would like to invite you to a lunch meeting tomorrow. Please let me know if you are available. Best regards, John',
                isRead: false,
                isStarred: false,
                sentAt: utilService.generateRandomTimestamp(),
                removedAt: null,
                from: 'john@example.com',
                to: 'mahatma@appsus.com',
              },
              {
                id: utilService.makeId(),
                subject: 'Important Announcement',
                body: 'Hi there, We have an important announcement to make regarding upcoming changes in our company. Please check your email for further details. Regards, Marketing Team',
                isRead: false,
                isStarred: true,
                sentAt: utilService.generateRandomTimestamp(),
                removedAt: null,
                from: 'marketing@example.com',
                to: 'mahatma@appsus.com',
              },
              {
                id: utilService.makeId(),
                subject: 'Meeting Reminder',
                body: 'Dear Mahatma, This is a reminder for our meeting scheduled for next week. Please make sure to be prepared. Regards, Sarah',
                isRead: false,
                isStarred: false,
                sentAt: utilService.generateRandomTimestamp(),
                removedAt: null,
                from: 'sarah@example.com',
                to: 'mahatma@appsus.com',
              },
              {
                id: utilService.makeId(),
                subject: 'Job Opportunity',
                body: 'Hi Mahatma, We have a job opening that might interest you. Please check the attached job description and let us know if you are interested. Best regards, HR Department',
                isRead: false,
                isStarred: true,
                sentAt: utilService.generateRandomTimestamp(),
                removedAt: null,
                from: 'hr@example.com',
                to: 'mahatma@appsus.com',
              },
              {
                id: utilService.makeId(),
                subject: 'Vacation Package Offers',
                body: 'Dear Mahatma, Plan your dream vacation with our exclusive offers. Check out the attached brochure for more details. Happy travels! Regards, Travel Agency',
                isRead: false,
                isStarred: false,
                sentAt: utilService.generateRandomTimestamp(),
                removedAt: null,
                from: 'travel@example.com',
                to: 'mahatma@appsus.com',
              },
              {
                id: utilService.makeId(),
                subject: 'Product Update',
                body: 'Hi there, We have released a new version of our product with exciting features and improvements. Please update your application to enjoy the latest enhancements. Regards, Product Team',
                isRead: false,
                isStarred: true,
                sentAt: utilService.generateRandomTimestamp(),
                removedAt: null,
                from: 'product@example.com',
                to: 'mahatma@appsus.com',
              },
              {
                id: utilService.makeId(),
                subject: 'Payment Confirmation',
                body: 'Dear Mahatma, Your payment has been successfully processed. Thank you for your purchase. For any inquiries, please contact our support team. Best regards, Finance Department',
                isRead: false,
                isStarred: false,
                sentAt: utilService.generateRandomTimestamp(),
                removedAt: null,
                from: 'finance@example.com',
                to: 'mahatma@appsus.com',
              },
        ]
        utilService.saveToStorage(MAIL_KEY, mails)
    }
}