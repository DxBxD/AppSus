import NotePreview from './NotePreview.js'

export default {
    props: ['notes'],
    template: `
        <section class="note-list">
            <ul>
                <li v-for="note in notes" :key="note.id">
                    <NotePreview 
                        :note="note" 
                        @removeNote="onRemoveNote"
                        @click="openNote(note.id)"/>
                </li>
            </ul>
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