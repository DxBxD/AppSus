export default {
    props: ['mail'],
    template: `
        <div class="mail-preview" @click="onOpenMail">
            <p>{{ mail.subject }}</p>
            <p>{{ mail.body }}</p>
            <p>{{ new Date(mail.sentAt).toLocaleString() }}</p>
        </div>
    `,
    methods: {
        onOpenMail() {
            this.$emit('clicked', this.mail)
        }
    }
}
