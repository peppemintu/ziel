package com.greendal.ziel.study.service;

import com.greendal.ziel.auth.model.User;
import com.greendal.ziel.auth.repository.UserRepository;
import com.greendal.ziel.study.dto.file.FileResponseDto;
import com.greendal.ziel.study.model.Element;
import com.greendal.ziel.study.model.File;
import com.greendal.ziel.study.repository.ElementRepository;
import com.greendal.ziel.study.repository.FileRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final ElementRepository elementRepository;
    private final Path uploadRoot = Paths.get("uploads");

    public FileResponseDto uploadFile(MultipartFile multipartFile, Long elementId, Long userId) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        Element element = elementRepository.findById(elementId)
                .orElseThrow(() -> new EntityNotFoundException("Element not found with ID: " + elementId));


        File fileEntity = File.builder()
                .path("PENDING") // placeholder
                .name("PENDING")
                .uploadedAt(LocalDateTime.now())
                .uploadedBy(user)
                .courseElement(element)
                .build();

        fileEntity = fileRepository.save(fileEntity); // get file ID

        // Step 2: Determine path and filename
        Path dirPath = uploadRoot.resolve(String.valueOf(elementId)).resolve(String.valueOf(userId));
        Files.createDirectories(dirPath);

        String storedFileName = fileEntity.getId() + "_" + multipartFile.getOriginalFilename();
        Path fullFilePath = dirPath.resolve(storedFileName);
        Files.copy(multipartFile.getInputStream(), fullFilePath, StandardCopyOption.REPLACE_EXISTING);

        // Step 3: Update entity with actual path and filename
        fileEntity.setPath(dirPath.toString());   // just the folder
        fileEntity.setName(storedFileName);       // just the filename
        return mapToDto(fileRepository.save(fileEntity));
    }

    public Resource downloadFile(Long fileId) throws IOException {
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new EntityNotFoundException("File not found with id: " + fileId));

        Path fullFilePath = Paths.get(file.getPath()).resolve(file.getName());
        if (!Files.exists(fullFilePath)) {
            throw new FileNotFoundException("File not found: " + fullFilePath);
        }

        return new UrlResource(fullFilePath.toUri());
    }

    public List<FileResponseDto> getFilesForElement(Long elementId) {
        return fileRepository.findByCourseElementId(elementId)
                .stream().map(this::mapToDto).toList();
    }

    public List<FileResponseDto> getFilesByUser(Long userId) {
        return fileRepository.findByUploadedBy_Id(userId)
                .stream().map(this::mapToDto).toList();
    }

    public List<FileResponseDto> getFilesForElementByGroup(Long elementId, Long groupId) {
        return fileRepository.findByElementIdAndGroupId(elementId, groupId)
                .stream().map(this::mapToDto).toList();
    }

    public File getFileMetadata(Long fileId) {
        return fileRepository.findById(fileId)
                .orElseThrow(() -> new EntityNotFoundException("File not found with ID: " + fileId));
    }

    public Resource loadFileAsResource(String fullPath) throws MalformedURLException {
        Path path = Paths.get(fullPath);
        if (!Files.exists(path)) {
            throw new MalformedURLException("File not found on disk: " + path);
        }
        return new UrlResource(path.toUri());
    }

    public void deleteFile(Long fileId) throws IOException {
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new EntityNotFoundException("File not found with id: " + fileId));

        Path fullFilePath = Paths.get(file.getPath()).resolve(file.getName());

        try {
            if (Files.exists(fullFilePath)) {
                Files.delete(fullFilePath); // 🗑️ remove physical file
            }
        } catch (IOException ex) {
            throw new IOException("Failed to delete file from disk: " + fullFilePath, ex);
        }

        fileRepository.deleteById(fileId); // 🧼 remove DB record
    }

    private FileResponseDto mapToDto(File file) {
        return FileResponseDto.builder()
                .id(file.getId())
                .path(file.getPath())
                .name(file.getName())
                .uploadedAt(file.getUploadedAt())
                .uploadedById(file.getUploadedBy().getId())
                .uploadedByEmail(file.getUploadedBy().getEmail())
                .uploadedByRole(file.getUploadedBy().getRole().toString())
                .courseElement(file.getCourseElement().getId())
                .build();
    }
}
