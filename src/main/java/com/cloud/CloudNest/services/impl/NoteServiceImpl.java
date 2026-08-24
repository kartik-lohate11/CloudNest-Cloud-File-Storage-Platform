package com.cloud.CloudNest.services.impl;

import com.cloud.CloudNest.dto.NoteDto;
import com.cloud.CloudNest.dto.UserDto;
import com.cloud.CloudNest.entities.UserData;
import com.cloud.CloudNest.entities.UserNote;
import com.cloud.CloudNest.exception.FileNotFoundException;
import com.cloud.CloudNest.repository.UserNoteRepository;
import com.cloud.CloudNest.services.NoteService;
import com.cloud.CloudNest.services.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NoteServiceImpl implements NoteService {

    private final UserNoteRepository userNoteRepository;
    private final UserService userService;

    public NoteServiceImpl(UserNoteRepository userNoteRepository, UserService userService) {
        this.userNoteRepository = userNoteRepository;
        this.userService = userService;
    }

    @Override
    @Transactional
    public NoteDto saveNote(NoteDto noteDto, String userName) {
        UserDto user = userService.getByUserName(userName);

        String tagsStr = noteDto.getTags() != null ? String.join(",", noteDto.getTags()) : "";

        UserNote note = UserNote.builder()
                .title(noteDto.getTitle() != null ? noteDto.getTitle() : "Untitled Note")
                .content(noteDto.getContent() != null ? noteDto.getContent() : "")
                .category(noteDto.getCategory() != null ? noteDto.getCategory() : "Workspace")
                .tags(tagsStr)
                .uploadedBy(user.toEntity())
                .build();

        return NoteDto.toDto(userNoteRepository.save(note));
    }

    @Override
    @Transactional
    public NoteDto updateNote(Long id, NoteDto noteDto, String userName) {
        UserNote note = userNoteRepository.findById(id)
                .orElseThrow(() -> new FileNotFoundException("Note with ID " + id + " not found"));

        if (noteDto.getTitle() != null) note.setTitle(noteDto.getTitle());
        if (noteDto.getContent() != null) note.setContent(noteDto.getContent());
        if (noteDto.getCategory() != null) note.setCategory(noteDto.getCategory());
        if (noteDto.getTags() != null) note.setTags(String.join(",", noteDto.getTags()));

        return NoteDto.toDto(userNoteRepository.save(note));
    }

    @Override
    public Page<NoteDto> getUserNotesPaginated(String userName, String category, Pageable pageable) {
        Page<UserNote> page;
        if (category == null || category.trim().isEmpty() || "all".equalsIgnoreCase(category)) {
            page = userNoteRepository.findByUploadedUser(userName, pageable);
        } else {
            page = userNoteRepository.findByUploadedUserAndCategory(userName, category, pageable);
        }
        return page.map(NoteDto::toDto);
    }

    @Override
    @Transactional
    public void deleteNote(Long id) {
        if (userNoteRepository.existsById(id)) {
            userNoteRepository.deleteById(id);
        }
    }
}
