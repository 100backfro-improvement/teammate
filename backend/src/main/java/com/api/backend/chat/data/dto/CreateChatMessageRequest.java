package com.api.backend.chat.data.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import javax.validation.constraints.NotNull;
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
public class CreateChatMessageRequest {

  @NotNull(message = "채팅 메시지가 비어있습니다.")
  @Schema(description = "chat message", example = "안녕하세요!")
  private String message;

  @NotNull(message = "작성자 ID가 비어있습니다.")
  @Schema(description = "writer ID", example = "1L")
  private Long writerId;
}
