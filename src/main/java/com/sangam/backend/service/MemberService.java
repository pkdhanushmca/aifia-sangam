package com.sangam.backend.service;

import com.sangam.backend.dto.MemberRequest;
import com.sangam.backend.model.Member;
import com.sangam.backend.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public Member register(MemberRequest request) {
        Member member = new Member();
        member.setFullName(request.getFullName());
        member.setAge(request.getAge());
        member.setMobile(request.getMobile());
        member.setArea(request.getArea());
        member.setOccupation(request.getOccupation());
        member.setInterest(request.getInterest());
        member.setMessage(request.getMessage());
        member.setAgreedToPrinciples(request.isAgreedToPrinciples());
        return memberRepository.save(member);
    }

    public List<Member> getAll() {
        return memberRepository.findAll();
    }
}
