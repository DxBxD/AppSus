export default {
    props: ['mail'],
    template: `
        <div class="mail-preview" @click.stop="onOpenMail">
            <span class="icons" @click.stop="onToggleStar">
                <span class="material-icons">{{ mail.isStarred ? 'star' : 'star_border' }}</span>
            </span>
            <span class="title">{{ mail.subject }}</span>
            <span class="snippet">{{ mail.body }}</span>
            <span class="date">{{ formattedDate }}</span>
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
            this.$router.push(`/mail/${this.mail.id}`)
        },
        onToggleStar() {
            this.mail.isStarred = !this.mail.isStarred
            this.$emit('starred', this.mail)
        }
    }
}
