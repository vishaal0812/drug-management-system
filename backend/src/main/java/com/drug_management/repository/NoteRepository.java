package com.drug_management.repository;

import com.drug_management.modal.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> getNotesByIsDeleted(Boolean isDeleted);
}
