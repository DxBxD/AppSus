import MailPreview from './MailPreview.js'

export default {
    props: ['mails'],
    template: `
        <section class="mail-list">
        <MailPreview v-for="mail in mails" 
                    :key="mail.id" 
                    :mail="mail" 
                    @opened="onMailOpened" 
                    @starred="onMailStarred"
                    @deleted="onMailDeleted"
                    @toggleRead="onMailToggleRead"
                    @toggleArchive="onMailToggleArchive"
                    @openLabelModal="onOpenLabelModal" />
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
        },
        onMailDeleted(deletedMail) {
            this.$emit('deleted', deletedMail)
        },
        onMailToggleRead(toggledMail) {
            this.$emit('toggleRead', toggledMail)
        },
        onMailToggleArchive(archivedMail) {
            this.$emit('toggleArchive', archivedMail)
        },
        onOpenLabelModal(labeledMail) {
            this.$emit('openLabelModal', labeledMail)
        }
    }
}