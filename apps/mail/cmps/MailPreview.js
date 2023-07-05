export default {
    props: ['mail'],
    template: `
        <div class="mail-preview" @click.stop="onOpenMail">
            <span class="icons" @click.stop="onToggleStar">{{ mail.isStarred ? '★' : '☆' }}</span>
            <p class="title">{{ mail.subject }}</p>
            <p class="snippet">{{ mail.body }}</p>
            <p class="date">{{ formattedDate }}</p>
        </div>
    `,
    computed: {
        formattedDate() {
            const mailDate = this.mail.sentAt ? new Date(this.mail.sentAt) : null
            const currentDate = new Date()
            let formattedDate = ''
    
            if (mailDate && mailDate.getDate() === currentDate.getDate() && mailDate.getMonth() === currentDate.getMonth() && mailDate.getFullYear() === currentDate.getFullYear()) {
                formattedDate = mailDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            } else if (mailDate && mailDate.getFullYear() === currentDate.getFullYear()) {
                formattedDate = mailDate.toLocaleDateString([], { month: 'short', day: 'numeric' })
            } else if (mailDate) {
                formattedDate = mailDate.toLocaleDateString([], { year: 'numeric', month: 'numeric', day: 'numeric' })
            }
    
            return formattedDate
        }
    },
    methods: {
        onOpenMail() {
            this.$emit('clicked', this.mail)
        },
        onToggleStar() {
            this.mail.isStarred = !this.mail.isStarred
            this.$emit('starred', this.mail)
        }
    }
}
