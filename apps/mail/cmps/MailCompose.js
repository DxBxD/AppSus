export default {
    template: `
        <div>
            <button class="compose-button" @click="showForm = !showForm"><span class="material-icons">edit</span>Compose</button>
            <form class="compose-form" :class="{ 'is-visible': showForm }" @submit.prevent="submitForm" novalidate>
                <div class="compose-header">
                    New Message
                    <button class="close-button" @click="closeForm"><span class="material-icons">close</span></button>
                </div>
                <div class="field">
                    <label>To</label>
                    <input type="email" v-model="to" placeholder="To:" required/>
                </div>
                <div class="field">
                    <label>From</label>
                    <input type="text" value="mahatma@appsus.com" disabled/>
                </div>
                <div class="field">
                    <label>Subject</label>
                    <input type="text" v-model="subject" placeholder="Subject:" required/>
                </div>
                <div class="field">
                    <label>Body</label>
                    <textarea v-model="body" placeholder="Body:" required></textarea>
                </div>
                <button type="submit">Send</button>
            </form>
        </div>
    `,
    data() {
        return {
            to: '',
            subject: '',
            body: '',
            showForm: false
        }
    },
    methods: {
        submitForm() {
            this.$emit('send', {
                to: this.to,
                from: 'mahatma@appsus.com',
                subject: this.subject,
                body: this.body,
                sentAt: Date.now(),
                isStarred: false,
                removedAt: null
            })
            this.to = ''
            this.subject = ''
            this.body = ''
            this.showForm = false
            this.status = 'sent'
        },
        closeForm() {
            this.showForm = false
            this.to = ''
            this.subject = ''
            this.body = ''
        }
    }
}
