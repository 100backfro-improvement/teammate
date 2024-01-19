package com.api.backend.chat.data.entity;

import java.time.LocalDateTime;
import javax.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter
@Builder
@Document(collection = "chat_message")
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {

  @Id
  private String id;

  @Field(name = "message")
  private String message;

  @Field(name = "writer_id")
  private Long writerId;

  @Field(name = "team_id")
  private Long teamId;

  @CreatedDate
  @Field(name = "created_dt")
  private LocalDateTime createdDt;

}
