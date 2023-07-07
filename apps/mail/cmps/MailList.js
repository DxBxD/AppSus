import MailPreview from './MailPreview.js'

export default {
    props: ['mails'],
    template: `
        <section class="mail-list">
            <MailPreview v-for="mail in mails" :key="mail.id" :mail="mail" @opened="onMailOpened" @starred="onMailStarred" />
        </section>
    `,
    components: {
        MailPreview
    },
    methods: {
        onMailStarred(starredMail) {
            this.$emit('starred', starredMail)
        },
        onMailOpened(openedMail) {
            this.$emit('opened', openedMail)
        }
    },
    watch: {
        '$route': {
            handler: 'fetchMails',
            immediate: true
        }
    }
}