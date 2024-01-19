package com.api.backend.chat.service;

import static com.api.backend.global.exception.type.ErrorCode.TEAM_PARTICIPANTS_NOT_FOUND_EXCEPTION;

import com.api.backend.chat.data.dto.ChatMessageDto;
import com.api.backend.chat.data.dto.CreateChatMessageRequest;
import com.api.backend.chat.data.entity.ChatMessage;
import com.api.backend.chat.data.repository.ChatMessageRepository;
import com.api.backend.global.exception.CustomException;
import com.api.backend.team.data.repository.TeamParticipantsRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RequiredArgsConstructor
@Service
@Slf4j
public class ChatMessageService {

  private final ChatMessageRepository chatMessageRepository;
  private final TeamParticipantsRepository teamParticipantsRepository;
  public Flux<ChatMessageDto> findAllByTeamId(Long memberId, Long teamId) {

    if (!teamParticipantsRepository.existsByTeam_TeamIdAndMember_MemberId(teamId, memberId)) {
      throw new CustomException(TEAM_PARTICIPANTS_NOT_FOUND_EXCEPTION);
    }
    LocalDateTime startDatetime = LocalDateTime.of(LocalDate.now(), LocalTime.of(0,0,0));
    LocalDateTime endDatetime = LocalDateTime.of(LocalDate.now(), LocalTime.of(23,59,59));
    return chatMessageRepository.findAllByTeamIdAndCreatedDtBetween(
        teamId, startDatetime, endDatetime
        )
        .map(ChatMessageDto::from);
  }

  public Mono<ChatMessage> saveMessage(CreateChatMessageRequest createChatMessageRequest, Long teamId) {

    Mono<ChatMessage> chatMessageMono = chatMessageRepository.save(
        ChatMessage.builder()
        .writerId(createChatMessageRequest.getWriterId())
        .message(createChatMessageRequest.getMessage())
        .teamId(teamId)
        .createdDt(LocalDateTime.now())
        .build()
        );
    return chatMessageMono;
  }

  public Flux<ChatMessageDto> getChatsByDateTime(Long memberId, Long teamId, LocalDate date) {

    checkParticipant(memberId, teamId);

    LocalDateTime startDatetime = getStartDatetime(date);
    LocalDateTime endDatetime = getEndDatetime(date);

    return chatMessageRepository.findMessageByDate(
            teamId, startDatetime, endDatetime
        )
        .map(ChatMessageDto::from);
  }

  private void checkParticipant(Long memberId, Long teamId) {
    if (!teamParticipantsRepository.existsByTeam_TeamIdAndMember_MemberId(teamId, memberId)) {
      throw new CustomException(TEAM_PARTICIPANTS_NOT_FOUND_EXCEPTION);
    }
  }

  private static LocalDateTime getEndDatetime(LocalDate date) {
    return LocalDateTime.of(date, LocalTime.of(23, 59, 59));
  }

  private static LocalDateTime getStartDatetime(LocalDate date) {
    return LocalDateTime.of(date, LocalTime.of(0, 0, 0));
  }
}

