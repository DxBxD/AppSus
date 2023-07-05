import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const loggedinUser = { email: 'user@appsus.com', fullname: 'Mahatma Appsus' }
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
                from: 'user@appsus.com',
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
                to: 'user@appsus.com'
            },
            {
                id: utilService.makeId(), 
                subject: 'Draft Email', 
                body: 'This is a draft email.', 
                isRead: false,
                isStarred: false,
                sentAt: null, 
                removedAt: null,
                from: 'user@appsus.com',
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
                to: 'user@appsus.com'
            },
        ]
        utilService.saveToStorage(MAIL_KEY, mails)
    }
}