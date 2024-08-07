package com.drug_management.controller;

import com.drug_management.modal.Note;
import com.drug_management.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping
public class NoteController {

    @Autowired
    NoteRepository noteRepository;

    @GetMapping("/getAllNotes")
    public List<Note> getAllNotes() {
        return noteRepository.getNotesByIsDeleted(false);
    }

    @PostMapping("/createOrUpdateNote")
    public Boolean createOrUpdateNote(@RequestBody Map<String, Object> body) {
        Note note = new Note();
        if (body.containsKey("id"))
            note = noteRepository.findById(Long.valueOf(body.get("id").toString())).orElse(null);
        if (note != null) {
            note.setNote(body.get("note").toString());
            noteRepository.save(note);
        }
        return true;
    }

    @PostMapping("/deleteNote")
    public Boolean deleteNotes(@RequestBody Map<String, Object> body) {
        List<Object> ids = (List<Object>) body.get("ids");
        for (Object id : ids) {
            Note note = noteRepository.findById(Long.valueOf(id.toString())).orElse(null);
            assert note != null;
            note.setIsDeleted(true);
            noteRepository.save(note);
        }
        return true;
    }
}
