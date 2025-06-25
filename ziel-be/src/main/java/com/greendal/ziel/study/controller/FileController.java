package com.greendal.ziel.study.controller;

import com.greendal.ziel.study.dto.file.FileResponseDto;
import com.greendal.ziel.study.model.File;
import com.greendal.ziel.study.service.FileService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/file")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<FileResponseDto> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("elementId") Long elementId,
            @RequestParam("userId") Long userId
    ) {
        try {
            FileResponseDto saved = fileService.uploadFile(file, elementId, userId);
            return ResponseEntity.ok(saved);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) {
        try {
            Resource fileResource = fileService.downloadFile(fileId);

            String filename = fileResource.getFilename();
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(fileResource);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/element/{elementId}")
    public ResponseEntity<List<FileResponseDto>> getFilesForElement(@PathVariable Long elementId) {
        return ResponseEntity.ok(fileService.getFilesForElement(elementId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FileResponseDto>> getFilesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(fileService.getFilesByUser(userId));
    }

    @GetMapping("/element/{elementId}/group/{groupId}")
    public ResponseEntity<List<FileResponseDto>> getFilesForElementByGroup(
            @PathVariable Long elementId,
            @PathVariable Long groupId) {
        return ResponseEntity.ok(fileService.getFilesForElementByGroup(elementId, groupId));
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long fileId) {
        try {
            fileService.deleteFile(fileId);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build(); // 404
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500
        }
    }

}


