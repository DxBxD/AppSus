export default {
    props: ['mail'],
    template: `
        <div class="mail-preview" :class="readClass" @click.stop="onOpenMail" @mouseenter="showMenu = true" @mouseleave="showMenu = false">
            <span class="icons">
                <div class="hover-effect"  v-if="!mail.isArchived" @click.stop="onToggleStar"><span class="material-icons-outlined" :title="starTitle">{{ mail.isStarred ? 'star' : 'star_border' }}</span></div>
                <div class="hover-effect"  v-if="!mail.isArchived" @click.stop="onAddLabel"><span class="material-icons-outlined" title="Label mail">label</span></div>
            </span>
            <span class="contact">{{ this.mail.from === 'mahatma@appsus.com' ? 'To: ' + this.mail.to : this.mail.from}}</span>
            <span class="title">{{ mail.subject }}</span>
            <span class="snippet">{{ mail.body }}</span>
            <span class="date">{{ formattedDate }}</span>
            <div class="mail-preview-hover-menu" v-if="showMenu" @click.stop>
                <div class="hover-effect"><span class="material-icons-outlined" @click="onToggleArchive" :title="archiveTitle">{{ mail.isArchived ? 'unarchive' : 'archive' }}</span></div>
                <div class="hover-effect"><span class="material-icons-outlined" @click="onDelete" :class="{ 'delete-permanent': mail.removedAt }" :title="removeTitle">{{ mail.removedAt ? 'delete_forever' : 'delete' }}</span></div>
                <div class="hover-effect"><span class="material-icons-outlined" @click="onToggleRead" :title="readTitle">{{mail.isRead ? 'drafts' : 'email'}}</span></div>
            </div>
        </div>
    `,
    data() {
        return {
            showMenu: false
        }
    },
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
        },
        readClass() {
            if (this.mail.isRead) {
                return 'read'
            } else {
                return ''
            }
        },
        starTitle() {
            return this.mail.isStarred ? 'Unstar' : 'Star'
        },
        archiveTitle() {
            return this.mail.isArchived ? 'Unarchive' : 'Archive'
        },
        readTitle() {
            return this.mail.isRead ? 'Mark as Unread' : 'Mark as Read'
        },
        removeTitle() {
            return this.mail.removedAt ? 'Delete Forever' : 'Move to Trash'
        }
    },
    methods: {
        onOpenMail() {
            this.mail.isRead = true
            this.$emit('opened', this.mail)
            this.$router.push(`/mail/${this.mail.id}`)
        },
        onToggleStar() {
            this.mail.isStarred = !this.mail.isStarred
            this.$emit('starred', this.mail)
        },
        onToggleRead() {
            this.$emit('toggleRead', this.mail)
        },
        onToggleArchive() {
            this.$emit('toggleArchive', this.mail)
        },
        onDelete() {
            this.$emit('deleted', this.mail)
        },
        onAddLabel() {
            this.$emit('openLabelModal', this.mail)
        }
    }
}