import MailPreview from './MailPreview.js'

export default {
    props: ['mails'],
    template: `
        <section class="mail-list">
            <MailPreview v-for="mail in mails" :key="mail.id" :mail="mail" @clicked="onMailClick" @starred="onMailStarred" />
        </section>
    `,
    components: {
        MailPreview
    },
    methods: {
        onMailClick(selectedMail) {
            ///////////////////////
        },
        onMailStarred(starredMail) {
            this.$emit('starred', starredMail)
        }
    }
}
