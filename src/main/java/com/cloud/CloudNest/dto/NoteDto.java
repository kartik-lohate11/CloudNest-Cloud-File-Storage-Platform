package com.cloud.CloudNest.dto;

import com.cloud.CloudNest.entities.UserNote;
import lombok.*;

import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoteDto {
    private Long id;
    private String title;
    private String content;
    private String category;
    private List<String> tags;
    private String date;

    public static NoteDto toDto(UserNote note) {
        if (note == null) return null;
        String formattedDate = note.getUpdatedAt() != null ?
                note.getUpdatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy")) : "";

        List<String> tagsList = Collections.emptyList();
        if (note.getTags() != null && !note.getTags().trim().isEmpty()) {
            tagsList = Arrays.stream(note.getTags().split(","))
                    .map(String::trim)
                    .filter(t -> !t.isEmpty())
                    .toList();
        }

        return NoteDto.builder()
                .id(note.getId())
                .title(note.getTitle())
                .content(note.getContent())
                .category(note.getCategory() != null ? note.getCategory() : "Workspace")
                .tags(tagsList)
                .date(formattedDate)
                .build();
    }
}
