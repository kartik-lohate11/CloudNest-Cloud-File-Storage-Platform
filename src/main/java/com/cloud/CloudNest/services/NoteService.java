package com.cloud.CloudNest.services;

import com.cloud.CloudNest.dto.NoteDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NoteService {
    NoteDto saveNote(NoteDto noteDto, String userName);
    NoteDto updateNote(Long id, NoteDto noteDto, String userName);
    Page<NoteDto> getUserNotesPaginated(String userName, String category, Pageable pageable);
    void deleteNote(Long id);
}
