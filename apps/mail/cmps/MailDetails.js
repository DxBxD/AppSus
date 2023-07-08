import { showSuccessMsg } from '../../../services/event-bus.service.js'
import { mailService } from '../../../services/mail.service.js'

const loggedinUserMail = "mahatma@appsus.com"

export default {
    template: `
        <section class="mail-details" v-if="mail">
            <div class="mail-header">
            <div class="subject-date-container">
                <h2 class="mail-subject">{{ mail.subject }}</h2>
                <div class="mail-date">{{ dateLabel }} {{ formattedDate }}</div>
            </div>
            <div class="mail-icons">
                <button @click="onLabelMail"><span class="material-icons-outlined">label</span></button>
                <button @click="onMailToggleArchive"><span class="material-icons-outlined">{{ mail.isArchived ? 'unarchive' : 'archive' }}</span></button>
                <button @click="onMailDeleted"><span class="material-icons-outlined" :class="{ 'delete-permanent': mail.removedAt }">delete</span></button>
                <button @click="onMailStarred"><span class="material-icons-outlined">{{ this.mail.isStarred ? 'star' : 'star_border' }}</span></button>
                <button @click="onSaveAsNote"><span class="material-icons-outlined">note_add</span></button>
            </div>
            </div>
            <div class="mail-meta">
                <div class="mail-from">From: {{ mail.from }}</div>
                <div class="mail-to">To: {{ mail.to }}</div>
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
        onMailLabeled() {
            // Todfo: Implement label functionality
        },
        onMailDeleted() {
            this.$emit('deleted', this.mail)
            showSuccessMsg('Mail deleted')
        },
        onMailToggleArchive() {
            this.$emit('toggleArchive', this.mail)
            this.mail.isArchived ? showSuccessMsg('Mail archived') : showSuccessMsg('Mail unarchived')
        },
        onMailStarred() {
            this.mail.isStarred = !this.mail.isStarred
            this.$emit('starred', this.mail)
        },
        onSaveAsNote() {
            this.$emit('saveAsNote', this.mail)
            showSuccessMsg('Mail saved as note')
        },
        formatDate(timestamp) {
            const date = new Date(timestamp)
            const options = {
                weekday: 'short',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }

            return new Intl.DateTimeFormat('en-US', options).format(date)
        },
        loadMail() {
            const { mailId } = this.$route.params
            mailService.get(mailId).then(mail => {
                this.mail = mail
                if (this.mail.sentAt) {
                    this.formattedDate = this.formatDate(this.mail.sentAt)
                    if (this.mail.status === 'draft') {
                        this.dateLabel = 'Last Edit: '
                    } else {
                        this.mail.to === loggedinUserMail ? this.dateLabel = 'Received: ' : this.dateLabel = 'Sent: '
                    }
                }
                if (this.mail.isStarred) console.log('starred')
                else console.log ('unstarred')
            })
        }
    },
    created() {
        this.loadMail()
    },
    watch: {
        '$route.params.mailId'() {
            if (this.$route.params.mailId) {
                this.loadMail()
            }
        }
    }
}