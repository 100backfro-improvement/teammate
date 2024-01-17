package com.api.backend.chat.data.dto;

import com.api.backend.chat.data.entity.ChatMessage;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
@ToString
public class ChatMessageDto {

  private String message;
  private Long writerId;
  private Long teamId;
  private LocalDateTime createdDt;

  public static ChatMessageDto from(ChatMessage chatMessage) {
    return ChatMessageDto.builder()
        .message(chatMessage.getMessage())
        .createdDt(chatMessage.getCreatedDt())
        .writerId(chatMessage.getWriterId())
        .teamId(chatMessage.getTeamId())
        .build();
  }
}
