import NotePreview from './NotePreview.js'

export default {
    props: ['notes'],
    template: `
        <section class="note-list">
            <ul>
                <li v-for="note in notes" :key="note.id">
                    <NotePreview :note="note" />
                </li>
            </ul>
        </section>
    `,
    components: {
        NotePreview,
    }
}