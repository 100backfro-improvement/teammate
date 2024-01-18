package com.api.backend.chat.service;

import static com.api.backend.global.exception.type.ErrorCode.TEAM_PARTICIPANTS_NOT_FOUND_EXCEPTION;

import com.api.backend.chat.data.dto.ChatMessageDto;
import com.api.backend.chat.data.dto.CreateChatMessageRequest;
import com.api.backend.chat.data.entity.ChatMessage;
import com.api.backend.chat.data.repository.ChatMessageRepository;
import com.api.backend.global.exception.CustomException;
import com.api.backend.team.data.repository.TeamParticipantsRepository;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@RequiredArgsConstructor
@Service
public class ChatMessageService {

  private final ChatMessageRepository chatMessageRepository;
  private final TeamParticipantsRepository teamParticipantsRepository;

  public Flux<ChatMessageDto> findAllByTeamId(Long memberId, Long teamId) {

    if (!teamParticipantsRepository.existsByTeam_TeamIdAndMember_MemberId(teamId, memberId)) {
      throw new CustomException(TEAM_PARTICIPANTS_NOT_FOUND_EXCEPTION);
    }

    return chatMessageRepository.findAllByTeamId(teamId)
        .map(ChatMessageDto::from);
  }

  public void saveMessage(CreateChatMessageRequest createChatMessageRequest, Long teamId) {

    chatMessageRepository.save(
        ChatMessage.builder()
        .writerId(createChatMessageRequest.getWriterId())
        .message(createChatMessageRequest.getMessage())
        .teamId(teamId)
        .createdDt(LocalDateTime.now())
        .build()
        );
  }
}

