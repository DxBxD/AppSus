import { showSuccessMsg, showUserMsg } from '../../../services/event-bus.service.js'
import { mailService } from "../../../services/mail.service.js"

export default {
    template: `
        <div>
            <button class="compose-button" @click="composeMail"><span class="material-icons-outlined">edit</span>Compose</button>
            <form class="compose-form" :class="{ 'is-visible': showForm }" @submit.prevent="sendMail"  novalidate>
                <div class="compose-header">
                    New Message
                    <button type="button" class="close-button" @click="closeForm"><span class="material-icons-outlined">close</span></button>
                </div>
                <div class="field">
                    <label>To</label>
                    <input type="email" v-model="mail.to" @blur="updateMail" placeholder="To:" required/>
                </div>
                <div class="field">
                    <label>From</label>
                    <input type="text" value="mahatma@appsus.com" disabled/>
                </div>
                <div class="field">
                    <label>Subject</label>
                    <input type="text" v-model="mail.subject" @blur="updateMail" placeholder="Subject:" required/>
                </div>
                <div class="field">
                    <label>Body</label>
                    <textarea v-model="mail.body" @blur="updateMail" placeholder="Body:" required></textarea>
                </div>
                <button type="submit">Send</button>
            </form>
        </div>
    `,
    data() {
        return {
            mail: {},
            showForm: false
        }
    },
    methods: {
        composeMail() {
            if(this.showForm) {
                this.closeForm()
                return
            }
            const queryMailId = this.$route.query.mailId
            const paramsMailId = this.$route.params.mailId
            let mailId = paramsMailId || queryMailId
            if (mailId) {
                mailService.get(mailId)
                    .then(mail => {
                        if (mail.status === 'draft') {
                            this.mail = mail
                            this.showForm = true
                        } else {
                            this.createAndShowDraft()
                        }
                    })
            } else {
                this.createAndShowDraft()
            }
        },
        createAndShowDraft() {
            mailService.createDraft()
                .then(draft => {
                    this.mail = draft
                    this.showForm = true
                })
        },
        updateMail() {
            mailService.save(this.mail)
                .then(savedMail => {
                    this.mail = savedMail
                })
        },
        closeForm() {
            mailService.save(this.mail)
                .then(savedMail => {
                    this.mail = {}
                    this.showForm = false
                    this.$router.push({ query: {} })
                    showSuccessMsg('Mail saved as draft')
                })
        },
        sendMail() {
            this.mail.status = 'sent'
            this.mail.sentAt = Date.now()
            mailService.save(this.mail)
                .then(() => {
                    this.mail = {}
                    this.showForm = false
                    showSuccessMsg('Mail sent')
                })
        }
    },
    watch: {
        '$route.query.mailId': {
            immediate: true,
            handler: function (newMailId, oldMailId) {
                if (!newMailId) {
                    this.closeForm()
                } else if (newMailId !== oldMailId) {
                    this.composeMail()
                }
            }
        },
        '$route.params.mailId': {
            immediate: true,
            handler: function (newMailId, oldMailId) {
                if (!newMailId) {
                    this.closeForm()
                } else if (newMailId !== oldMailId) {
                    mailService.get(newMailId)
                    .then(mail => {
                        if (mail.status === 'draft') {
                            this.composeMail()
                        }
                    })
                }
            }
        }
    }
}