import NotePreview from './NotePreview.js'

export default {
    props: ['notes'],
    template: `
        <section class="note-list">
                    <NotePreview  v-for="note in notes" :key="note.id" 
                        :note="note" 
                        @removeNote="onRemoveNote"
                        @click="openNote(note.id)"/>
        </section>
    `,
    methods: {
        onRemoveNote() {
            this.$emit('removeNote')
        },
        openNote(id) {
            this.$emit('openNote', id)
        }
    },
    components: {
        NotePreview,
    }
}