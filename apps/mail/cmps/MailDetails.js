import { mailService } from '../../../services/mail.service.js'

const loggedinUserMail = "mahatma@appsus.com"

export default {
    template: `
        <section class="mail-details" v-if="mail">
            <h2 class="mail-subject">{{ mail.subject }}</h2>
            <div class="mail-meta">
                <div class="mail-from">From: {{ mail.from }}</div>
                <div class="mail-to">To: {{ mail.to }}</div>
                <div class="mail-date">{{ isSentOrReceived }} {{ formattedDate }}</div>
            </div>
            <div class="mail-body">{{ mail.body }}</div>
        </section>
    `,
    data() {
        return {
            mail: null,
            isSentOrReceived: '',
            formattedDate: null
        }
    },
    methods: {
        loadMail() {
            const { mailId } = this.$route.params
            mailService.get(mailId).then(mail => {
                this.mail = mail
                if (this.mail.sentAt) {
                    this.mail.to === loggedinUserMail ? this.isSentOrReceived = 'Received: ' : this.isSentOrReceived = 'Sent: '
                    const date = new Date(this.mail.sentAt)
                    this.formattedDate = date.toDateString()
                }
            })
        }
    },
    created() {
        this.loadMail()
    },
    watch: {
        '$route.params.mailId'() {
            if (this.$route.params.mailId) {
                loadMail()
            }
        }
    }
}