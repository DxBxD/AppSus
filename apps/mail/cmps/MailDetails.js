import { mailService } from '../../../services/mail.service.js'

const loggedinUserMail = "mahatma@appsus.com"

export default {
    template: `
        <section class="mail-details" v-if="mail">
            <h2 class="mail-subject">{{ mail.subject }}</h2>
            <div class="mail-meta">
                <div class="mail-from">From: {{ mail.from }}</div>
                <div class="mail-to">To: {{ mail.to }}</div>
                <div class="mail-date">{{ dateLabel }} {{ formattedDate }}</div>
            </div>
            <div class="mail-body">{{ mail.body }}</div>
        </section>
    `,
    data() {
        return {
            mail: null,
            dateLabel: '',
            formattedDate: null
        }
    },
    methods: {
        loadMail() {
            const { mailId } = this.$route.params
            mailService.get(mailId).then(mail => {
                this.mail = mail
                const date = new Date(this.mail.sentAt)
                if (this.mail.sentAt) {
                    if (this.mail.status === 'draft') {
                        this.dateLabel = 'Last Edit: '
                        this.formattedDate = date.toLocaleString()
                    } else {
                        this.mail.to === loggedinUserMail ? this.dateLabel = 'Received: ' : this.dateLabel = 'Sent: '
                        this.formattedDate = date.toDateString()
                    }
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