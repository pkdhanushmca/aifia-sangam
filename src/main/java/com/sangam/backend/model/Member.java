package com.sangam.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Table(name = "members")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    private Integer age;

    @Column(nullable = false, length = 15)
    private String mobile;

    private String area;

    private String occupation;

    // events / finance / social / media / member
    private String interest;

    @Column(length = 1000)
    private String message;

    @Column(nullable = false)
    private Boolean agreedToPrinciples = Boolean.FALSE;

    @Column(nullable = false, updatable = false)
    private LocalDateTime submittedAt;

    @PrePersist
    protected void onCreate() {
        this.submittedAt = LocalDateTime.now();
    }
}
