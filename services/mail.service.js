import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const MAIL_KEY = 'mailDB'
var gFilterBy = { txt: '' }

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
    return gFilterBy
}

function _createMails() {
    let mails = utilService.loadFromStorage(MAIL_KEY)
    if (!mails || !mails.length) {
        mails = [
            { id: utilService.makeId(), subject: 'Welcome!', body: 'Welcome to our new mail app!', sentAt: Date.now() },
            { id: utilService.makeId(), subject: 'Hello!', body: 'Hello world!', sentAt: Date.now() },
        ]
        utilService.saveToStorage(MAIL_KEY, mails)
    }
}
