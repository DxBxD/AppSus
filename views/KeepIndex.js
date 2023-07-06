import NavBar from '../apps/keep/cmps/NavBar.js';
import KeepMenu from '../apps/keep/cmps/KeepMenu.js';
import { noteService } from "../services/note.service.js"
import NoteList from "../apps/keep/cmps/NoteList.js"

export default {
    template: `
        <section class="keep-options-bar">
            <NavBar />
            <KeepMenu />    
        </section>
        <section class="keep-index">
            <NoteList 
                v-if="notes"
                :notes="notes"/>
        </section>
    `,
    data() {
        return {
            notes: [],
        }
    },
    created() {
        noteService.query()
            .then(notes => this.notes = notes)
    },
    components: {
        NoteList,
        NavBar,
        KeepMenu
    }
}


