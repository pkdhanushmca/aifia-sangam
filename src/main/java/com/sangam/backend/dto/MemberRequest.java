package com.sangam.backend.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class MemberRequest {

    @NotBlank(message = "பெயர் அவசியம்")
    private String fullName;
    
//    @Pattern(regexp = "^[a-zA-Z ]+$", message = "பெயரில் எழுத்துக்கள் மட்டும் இருக்க வேண்டும்")

    private Integer age;

    @NotBlank(message = "கைபேசி எண் அவசியம்")
    @Pattern(regexp = "^[0-9]{10}$", message = "10 இலக்க கைபேசி எண் தேவை")
    private String mobile;

    private String area;

    private String occupation;

    private String interest;

    private String message;

    @AssertTrue(message = "கொள்கைகளை ஏற்க வேண்டும்")
    private boolean agreedToPrinciples;
}
